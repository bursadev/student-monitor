import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';

import { CurrentUser } from '../../shared/auth/current-user.decorator.js';
import type { AppUserDTO } from './dto/app-user.dto.js';
import { UsersService } from './users.service.js';

/**
 * Mounted at /api/me. Guarded by the global ClerkAuthGuard — there is no
 * @Public() here, so an unauthenticated request gets 401.
 */
@Controller('me')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /** The current user, creating the mirror row on first call. */
  @Get()
  get(@CurrentUser() clerkUserId: string): Promise<AppUserDTO> {
    return this.users.ensureAndGet(clerkUserId);
  }

  /** Same thing, for clients that prefer an explicit bootstrap call. 200, not
   *  Nest's default 201 — nothing is created from the caller's point of view. */
  @Post()
  @HttpCode(200)
  ensure(@CurrentUser() clerkUserId: string): Promise<AppUserDTO> {
    return this.users.ensureAndGet(clerkUserId);
  }

  /**
   * Erase the caller's own account (FR-01.8): the Clerk identity is deleted for
   * real, our row is anonymised and kept (ADR-0013, BR-025).
   *
   * The subject is always @CurrentUser() — there is no id in the path, so this
   * route cannot be aimed at somebody else's account no matter what is sent.
   * Irreversible, and deliberately not rate-limited yet; see the task note.
   */
  @Delete()
  @HttpCode(204)
  delete(@CurrentUser() clerkUserId: string): Promise<void> {
    return this.users.deleteAccount(clerkUserId);
  }

  /**
   * Finish onboarding (FR-01.9): choose a role and a display name.
   *
   * Its own route rather than a PATCH on the profile, because this is a one-way
   * transition — the role it writes can never be changed afterwards (ADR-0014),
   * and 409 on a second call says that far more clearly than a silently ignored
   * field would. Editing the display name later belongs to a future PATCH /me.
   *
   * 200 rather than 201: nothing is created, an existing row is completed.
   *
   * The body is passed through unvalidated on purpose — there is no global
   * ValidationPipe yet, so the service validates. See dto/onboarding.input.ts.
   */
  @Post('onboarding')
  @HttpCode(200)
  onboard(@CurrentUser() clerkUserId: string, @Body() body: unknown): Promise<AppUserDTO> {
    return this.users.completeOnboarding(clerkUserId, body);
  }
}
