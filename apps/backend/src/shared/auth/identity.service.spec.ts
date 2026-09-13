import { UnauthorizedException } from '@nestjs/common';
import type { ClerkClient } from '@clerk/backend';

import type { AppUser } from '../../generated/prisma/client.js';
import type { PrismaService } from '../db/prisma.service.js';
import { IdentityService } from './identity.service.js';

/**
 * A hand-rolled stand-in for the `appUser` delegate rather than a mock library:
 * these tests care what the row looks like afterwards, not which Prisma methods
 * were called. Only the three operations IdentityService actually uses exist.
 */
function makePrisma(rows: AppUser[] = []) {
  const findUnique = async ({ where }: { where: { clerkUserId?: string; id?: string } }) =>
    rows.find(
      (r) =>
        (where.clerkUserId !== undefined && r.clerkUserId === where.clerkUserId) ||
        (where.id !== undefined && r.id === where.id),
    ) ?? null;

  return {
    rows,
    appUser: {
      findUnique,
      update: async ({
        where,
        data,
      }: {
        where: { clerkUserId?: string; id?: string };
        data: Partial<AppUser>;
      }) => {
        const row = await findUnique({ where });
        if (!row) throw new Error('row not found');
        Object.assign(row, data, { updatedAt: new Date() });
        return row;
      },
      create: async ({ data }: { data: Partial<AppUser> }) => {
        const row: AppUser = {
          id: `app_${rows.length + 1}`,
          clerkUserId: '',
          email: null,
          displayName: null,
          role: null,
          onboardedAt: null,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        rows.push(row);
        return row;
      },
    },
  };
}

function makeClerk(user?: Partial<Record<string, unknown>>) {
  return {
    users: {
      getUser: vi.fn(async (id: string) => ({
        id,
        firstName: 'Ada',
        lastName: 'Yılmaz',
        username: null,
        primaryEmailAddressId: 'email_1',
        emailAddresses: [{ id: 'email_1', emailAddress: 'ada@example.com' }],
        ...user,
      })),
      deleteUser: vi.fn(async (_id: string) => ({})),
    },
  };
}

function makeUser(overrides: Partial<AppUser> = {}): AppUser {
  return {
    id: 'app_1',
    clerkUserId: 'user_ada',
    email: 'ada@example.com',
    displayName: 'Ada Yılmaz',
    role: 'STUDENT',
    onboardedAt: new Date('2026-01-01T00:00:00Z'),
    deletedAt: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

function makeService(prisma: ReturnType<typeof makePrisma>, clerk: ReturnType<typeof makeClerk>) {
  return new IdentityService(
    prisma as unknown as PrismaService,
    clerk as unknown as ClerkClient,
  );
}

describe('IdentityService', () => {
  describe('ensureAppUser', () => {
    // Clerk tokens verify offline, so a user whose account was just deleted can
    // still present a cryptographically valid JWT for up to a minute. This is
    // the check that closes that window — every feature reaches AppUser.id
    // through here, so refusing once here refuses everywhere.
    it('refuses a soft-deleted account', async () => {
      const prisma = makePrisma([
        makeUser({ deletedAt: new Date('2026-02-01T00:00:00Z'), email: null, displayName: null }),
      ]);
      const clerk = makeClerk();
      const identity = makeService(prisma, clerk);

      await expect(identity.ensureAppUser('user_ada')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      // It must not quietly recreate the account it just refused.
      expect(prisma.rows).toHaveLength(1);
    });
  });

  describe('deleteAccount', () => {
    it('nulls the personal columns but keeps the row', async () => {
      const prisma = makePrisma([makeUser()]);
      const identity = makeService(prisma, makeClerk());

      await identity.deleteAccount('user_ada');

      const [row] = prisma.rows;
      expect(row.email).toBeNull();
      expect(row.displayName).toBeNull();
      expect(row.deletedAt).toBeInstanceOf(Date);
      // BR-025: the aggregate record survives so reports and history still add
      // up. Only the person is anonymised.
      expect(row.id).toBe('app_1');
      expect(row.role).toBe('STUDENT');
      expect(row.createdAt).toEqual(new Date('2026-01-01T00:00:00Z'));
    });

    it('deletes the Clerk identity so the user cannot sign in again', async () => {
      const prisma = makePrisma([makeUser()]);
      const clerk = makeClerk();
      const identity = makeService(prisma, clerk);

      await identity.deleteAccount('user_ada');

      expect(clerk.users.deleteUser).toHaveBeenCalledWith('user_ada');
    });

    it('does not move the deletion timestamp on a second call', async () => {
      const prisma = makePrisma([makeUser()]);
      const clerk = makeClerk();
      const identity = makeService(prisma, clerk);

      await identity.deleteAccount('user_ada');
      const deletedAt = prisma.rows[0].deletedAt;
      await identity.deleteAccount('user_ada');

      // When erasure happened is the KVKK evidence — a retry must not move it.
      expect(prisma.rows[0].deletedAt).toEqual(deletedAt);
      expect(prisma.rows[0].email).toBeNull();
    });

    it('retries the Clerk deletion after an earlier failure', async () => {
      const prisma = makePrisma([makeUser()]);
      const clerk = makeClerk();
      clerk.users.deleteUser = vi
        .fn()
        .mockRejectedValueOnce(new Error('clerk is down'))
        .mockResolvedValueOnce({});
      const identity = makeService(prisma, clerk);

      await expect(identity.deleteAccount('user_ada')).rejects.toThrow();
      // The row is already anonymised, so the only thing left undone is the
      // Clerk side. Skipping it here would strand a live identity behind a
      // deleted account forever.
      await expect(identity.deleteAccount('user_ada')).resolves.toBeUndefined();
      expect(clerk.users.deleteUser).toHaveBeenCalledTimes(2);
    });

    it('succeeds when Clerk has already lost the user', async () => {
      const prisma = makePrisma([makeUser()]);
      const clerk = makeClerk();
      clerk.users.deleteUser = vi.fn(async () => {
        throw Object.assign(new Error('Not Found'), { clerkError: true, status: 404 });
      });
      const identity = makeService(prisma, clerk);

      await expect(identity.deleteAccount('user_ada')).resolves.toBeUndefined();
      expect(prisma.rows[0].deletedAt).toBeInstanceOf(Date);
    });

    it('keeps the row anonymised when Clerk fails, and reports the failure', async () => {
      const prisma = makePrisma([makeUser()]);
      const clerk = makeClerk();
      clerk.users.deleteUser = vi.fn(async () => {
        throw new Error('clerk is down');
      });
      const identity = makeService(prisma, clerk);

      await expect(identity.deleteAccount('user_ada')).rejects.toThrow();
      // Anonymising first is the deliberate order: the erasure request is
      // honoured on our side even when Clerk is unreachable, and the caller can
      // retry to finish the job.
      expect(prisma.rows[0].email).toBeNull();
      expect(prisma.rows[0].deletedAt).toBeInstanceOf(Date);
    });

    it('still clears the Clerk identity when we never had a row', async () => {
      const prisma = makePrisma([]);
      const clerk = makeClerk();
      const identity = makeService(prisma, clerk);

      await identity.deleteAccount('user_ghost');

      expect(clerk.users.deleteUser).toHaveBeenCalledWith('user_ghost');
      expect(prisma.rows).toHaveLength(0);
    });
  });
});
