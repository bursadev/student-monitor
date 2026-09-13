import { ConflictException, UnauthorizedException } from '@nestjs/common';

import { asPrismaService, makeAppUser, makePrisma } from '../../../test/prisma.fake.js';
import type { IdentityService } from '../../shared/auth/identity.service.js';
import { UsersService } from './users.service.js';

/**
 * IdentityService is stubbed rather than faked: its own behaviour — the mirror,
 * the hydration cache, the deleted-account refusal — has its own suite. What
 * matters here is that UsersService goes through it.
 */
function makeIdentity(prisma: ReturnType<typeof makePrisma>) {
  return {
    ensureAppUser: vi.fn(async (clerkUserId: string) => {
      const row = prisma.rows.find((r) => r.clerkUserId === clerkUserId);
      if (!row) throw new Error('no such user');
      if (row.deletedAt) throw new UnauthorizedException('Bu hesap silinmiş.');
      return row;
    }),
  };
}

function makeService(prisma: ReturnType<typeof makePrisma>, identity = makeIdentity(prisma)) {
  return {
    service: new UsersService(identity as unknown as IdentityService, asPrismaService(prisma)),
    identity,
  };
}

describe('UsersService.completeOnboarding', () => {
  it('stamps the role, the name and the completion time', async () => {
    const prisma = makePrisma([makeAppUser()]);
    const { service } = makeService(prisma);

    const dto = await service.completeOnboarding('user_ada', {
      role: 'STUDENT',
      displayName: 'Ada Yılmaz',
    });

    expect(prisma.rows[0].role).toBe('STUDENT');
    expect(prisma.rows[0].displayName).toBe('Ada Yılmaz');
    expect(prisma.rows[0].onboardedAt).toBeInstanceOf(Date);
    expect(dto.role).toBe('STUDENT');
    expect(dto.onboardedAt).toEqual(prisma.rows[0].onboardedAt?.toISOString());
  });

  it('overwrites a display name Clerk had guessed', async () => {
    const prisma = makePrisma([makeAppUser({ displayName: 'ada' })]);
    const { service } = makeService(prisma);

    await service.completeOnboarding('user_ada', { role: 'COACH', displayName: 'Ada Yılmaz' });

    expect(prisma.rows[0].displayName).toBe('Ada Yılmaz');
  });

  it('refuses a second attempt', async () => {
    // Role is fixed for the life of the account (ADR-0014), so this is the
    // guard that makes "fixed" true rather than merely intended.
    const prisma = makePrisma([makeAppUser()]);
    const { service } = makeService(prisma);

    await service.completeOnboarding('user_ada', { role: 'STUDENT', displayName: 'Ada' });

    await expect(
      service.completeOnboarding('user_ada', { role: 'COACH', displayName: 'Ada' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.rows[0].role).toBe('STUDENT');
  });

  it('lets only one of two concurrent submits win', async () => {
    const prisma = makePrisma([makeAppUser()]);
    const { service } = makeService(prisma);

    const results = await Promise.allSettled([
      service.completeOnboarding('user_ada', { role: 'STUDENT', displayName: 'Ada' }),
      service.completeOnboarding('user_ada', { role: 'COACH', displayName: 'Ada' }),
    ]);

    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((r) => r.status === 'rejected')).toHaveLength(1);
  });

  it('refuses a deleted account', async () => {
    const prisma = makePrisma([makeAppUser({ deletedAt: new Date() })]);
    const { service } = makeService(prisma);

    await expect(
      service.completeOnboarding('user_ada', { role: 'STUDENT', displayName: 'Ada' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.rows[0].role).toBeNull();
  });

  it('validates before touching the row', async () => {
    const prisma = makePrisma([makeAppUser()]);
    const { service } = makeService(prisma);

    await expect(
      service.completeOnboarding('user_ada', { role: 'ADMIN', displayName: 'Ada' }),
    ).rejects.toThrow();
    expect(prisma.rows[0].onboardedAt).toBeNull();
  });
});
