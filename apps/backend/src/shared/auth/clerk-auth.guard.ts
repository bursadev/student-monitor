import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';

import { IS_PUBLIC_KEY } from './public.decorator.js';

/**
 * Verifies the Clerk bearer JWT sent by web and mobile and puts the Clerk user
 * id on the request. Wired globally via APP_GUARD, so every route is protected
 * unless it is marked @Public().
 */
@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  /**
   * Which origins may present a token here. Without it, a JWT minted for a
   * *different* Clerk application could be replayed against our API and would
   * still verify — the signature and issuer are both valid, only the audience
   * differs. Comma-separated, e.g. "http://localhost:3000,https://app.x.com".
   *
   * Off by default, and that is deliberate. The check reads the token's `azp`
   * claim, and **not every Clerk token has one**: tokens minted through the
   * Backend API carry no `azp` and are rejected outright when this is set. Before
   * enabling it in any environment, verify what real web *and* Expo clients
   * actually send — a native app is the likely surprise.
   */
  private readonly authorizedParties = (process.env.CLERK_AUTHORIZED_PARTIES ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request & { userId?: string }>();
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new UnauthorizedException('Oturum açılmamış.');

    try {
      const claims = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        ...(this.authorizedParties.length > 0
          ? { authorizedParties: this.authorizedParties }
          : {}),
      });
      req.userId = claims.sub;
      return true;
    } catch (err) {
      // A bad token (expired, malformed, wrong signature) is the normal case and
      // should stay quiet. Clerk throws a TokenVerificationError carrying a
      // `reason` property but does NOT set `.name`, so that is how we tell the
      // two apart. Anything without a `reason` is infrastructure — a JWKS fetch
      // failure or a misconfigured secret — and we need to see it in the logs.
      const isTokenError = err instanceof Error && 'reason' in err;
      if (!isTokenError) {
        const cause = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        this.logger.error(`verifyToken failed unexpectedly: ${cause}`);
      }
      throw new UnauthorizedException('Oturum açılmamış.');
    }
  }
}
