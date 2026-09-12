import { Controller, Get, HttpCode, Post } from '@nestjs/common';

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
}
