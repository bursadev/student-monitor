import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

/** The Clerk user id placed on the request by ClerkAuthGuard. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ userId?: string }>();
    return req.userId as string;
  },
);
