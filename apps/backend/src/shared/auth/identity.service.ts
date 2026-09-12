import { Inject, Injectable } from '@nestjs/common';
import type { ClerkClient } from '@clerk/backend';

import type { AppUser } from '../../generated/prisma/client.js';
import { PrismaService } from '../db/prisma.service.js';
import { CLERK_CLIENT } from './clerk.provider.js';

/**
 * Keeps an AppUser row mirroring each Clerk identity, created just-in-time on
 * the user's first authenticated request.
 *
 * Deliberately not webhook-driven: a webhook can arrive late or be lost, and
 * the user would then hit an API that has no row for them. A Clerk webhook is
 * the right tool for side effects, not for the row the request itself needs.
 */
@Injectable()
export class IdentityService {
  /**
   * Clerk's Backend API is rate-limited, and this runs on nearly every
   * authenticated request — rapid navigation would otherwise stampede it into
   * 429s. Hydrate from Clerk at most once per user per window and serve the DB
   * row in between. The DB stays the source of truth, so a name changed here
   * still shows immediately.
   */
  private static readonly HYDRATION_TTL_MS = 60_000;
  private readonly hydratedUntil = new Map<string, number>();

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CLERK_CLIENT) private readonly clerk: ClerkClient,
  ) {}

  async ensureAppUser(clerkUserId: string): Promise<AppUser> {
    const cachedUntil = this.hydratedUntil.get(clerkUserId);
    if (cachedUntil && cachedUntil > Date.now()) {
      const cached = await this.prisma.appUser.findUnique({ where: { clerkUserId } });
      // Fall through to a full hydration only if the row has vanished since.
      if (cached) return cached;
    }

    const clerkUser = await this.clerk.users.getUser(clerkUserId);

    const email =
      clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
        ?.emailAddress ?? null;

    // A real name only — never the email address. With Apple's "Hide My Email",
    // or any SSO sign-up where Clerk has no name, using the email would seed a
    // relay address as the display name and then prefill it into onboarding.
    const nameFromClerk =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      clerkUser.username ||
      null;

    const existing = await this.prisma.appUser.findUnique({ where: { clerkUserId } });

    // Refresh email every time, but treat displayName as user-owned: only
    // backfill it while still empty, so a name the user set in onboarding or
    // settings is never clobbered by this method running on every request.
    const appUser = existing
      ? await this.prisma.appUser.update({
          where: { clerkUserId },
          data: {
            email,
            ...(existing.displayName ? {} : { displayName: nameFromClerk }),
          },
        })
      : await this.prisma.appUser.create({
          data: { clerkUserId, email, displayName: nameFromClerk },
        });

    this.hydratedUntil.set(clerkUserId, Date.now() + IdentityService.HYDRATION_TTL_MS);
    return appUser;
  }
}
