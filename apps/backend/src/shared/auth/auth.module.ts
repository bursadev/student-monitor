import { Module } from '@nestjs/common';

import { clerkClientProvider } from './clerk.provider.js';
import { IdentityService } from './identity.service.js';

/**
 * Clerk client + identity bootstrap. ClerkAuthGuard is not declared here: it is
 * wired globally in AppModule via APP_GUARD and only needs Reflector.
 */
@Module({
  providers: [clerkClientProvider, IdentityService],
  exports: [clerkClientProvider, IdentityService],
})
export class AuthModule {}
