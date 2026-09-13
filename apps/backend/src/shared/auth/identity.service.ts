import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

  private readonly logger = new Logger(IdentityService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CLERK_CLIENT) private readonly clerk: ClerkClient,
  ) {}

  async ensureAppUser(clerkUserId: string): Promise<AppUser> {
    const cachedUntil = this.hydratedUntil.get(clerkUserId);
    if (cachedUntil && cachedUntil > Date.now()) {
      const cached = await this.prisma.appUser.findUnique({ where: { clerkUserId } });
      // Fall through to a full hydration only if the row has vanished since.
      if (cached) return IdentityService.assertNotDeleted(cached);
    }

    // Read the row *before* calling Clerk. A deleted account must be refused
    // without a Backend API round-trip, and — more importantly — before the
    // hydration below would write the name and e-mail we just anonymised back
    // onto the row.
    const existing = await this.prisma.appUser.findUnique({ where: { clerkUserId } });
    if (existing) IdentityService.assertNotDeleted(existing);

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

  /**
   * Erase the account: anonymise our row, then delete the Clerk identity.
   *
   * The order is deliberate. Anonymising first means the erasure request is
   * honoured on our side even if Clerk is unreachable, and the account is
   * already locked out by `assertNotDeleted`. Deleting in Clerk first and then
   * failing the write would leave personal data in our database with no
   * authenticated route left for the user to retry.
   *
   * Safe to call twice: the timestamp is stamped once, but the Clerk deletion
   * is always re-attempted, because that is the half that can fail on its own.
   */
  async deleteAccount(clerkUserId: string): Promise<void> {
    const existing = await this.prisma.appUser.findUnique({ where: { clerkUserId } });

    if (existing && !existing.deletedAt) {
      // Null the personal columns, keep id, role and createdAt: the person is
      // anonymised, the aggregate record survives for reporting (BR-025).
      await this.prisma.appUser.update({
        where: { clerkUserId },
        data: { deletedAt: new Date(), email: null, displayName: null },
      });
    }

    try {
      await this.clerk.users.deleteUser(clerkUserId);
    } catch (err) {
      // Already gone in Clerk — an interrupted earlier attempt, or a user
      // deleted from the Clerk dashboard. The end state is the one we wanted.
      if (IdentityService.isClerkNotFound(err)) return;

      // Anything else leaves a live Clerk identity behind an anonymised row.
      // The caller sees a failure and can retry; this log is how we find the
      // ones nobody retried. No e-mail or name here — they are gone by now, and
      // logs must stay free of personal data either way.
      const cause = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      this.logger.error(`Clerk deleteUser failed for an anonymised account: ${cause}`);
      throw err;
    }
  }

  /** Clerk's Backend API errors carry `clerkError` and an HTTP `status`. */
  private static isClerkNotFound(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      (err as { clerkError?: boolean }).clerkError === true &&
      (err as { status?: number }).status === 404
    );
  }

  /**
   * A deleted account keeps its row (BR-025) but must behave as if it were gone.
   * Clerk verifies tokens offline, so a JWT minted just before deletion stays
   * cryptographically valid for up to a minute; this is what stops it being
   * usable. Every feature goes through ensureAppUser to reach AppUser.id, so
   * refusing here refuses everywhere.
   */
  private static assertNotDeleted(user: AppUser): AppUser {
    if (user.deletedAt) throw new UnauthorizedException('Bu hesap silinmiş.');
    return user;
  }
}
