import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { IdentityService } from '../../shared/auth/identity.service.js';
import { PrismaService } from '../../shared/db/prisma.service.js';
import { type AppUserDTO, toAppUserDTO } from './dto/app-user.dto.js';
import { parseOnboardingInput } from './dto/onboarding.input.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly identity: IdentityService,
    private readonly prisma: PrismaService,
  ) {}

  async ensureAndGet(clerkUserId: string): Promise<AppUserDTO> {
    const user = await this.identity.ensureAppUser(clerkUserId);
    return toAppUserDTO(user);
  }

  /** FR-01.8 — the user erases their own account. See ADR-0013. */
  deleteAccount(clerkUserId: string): Promise<void> {
    return this.identity.deleteAccount(clerkUserId);
  }

  /**
   * FR-01.9 — pick a role and a display name, once.
   *
   * A role is fixed for the life of the account (ADR-0014), so this is the only
   * thing that ever writes it. `onboardedAt` doubles as the "already done" flag,
   * which is why the write is conditional on it still being null: two submits
   * racing each other must not both succeed and leave the second one's role
   * silently winning.
   */
  async completeOnboarding(clerkUserId: string, body: unknown): Promise<AppUserDTO> {
    const { role, displayName } = parseOnboardingInput(body);

    // Also refuses a deleted account, and creates the mirror row if this is
    // somehow the user's first authenticated call.
    const user = await this.identity.ensureAppUser(clerkUserId);

    const { count } = await this.prisma.appUser.updateMany({
      where: { id: user.id, onboardedAt: null },
      data: { role, displayName, onboardedAt: new Date() },
    });

    if (count === 0) {
      throw new ConflictException('Hesap kurulumu zaten tamamlanmış.');
    }

    const updated = await this.prisma.appUser.findUnique({ where: { id: user.id } });
    if (!updated) throw new NotFoundException('Kayıt bulunamadı.');

    return toAppUserDTO(updated);
  }
}
