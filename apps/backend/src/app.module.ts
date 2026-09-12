import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './features/users/users.module.js';
import { AuthModule } from './shared/auth/auth.module.js';
import { ClerkAuthGuard } from './shared/auth/clerk-auth.guard.js';
import { DbModule } from './shared/db/db.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    // Global: every route requires a valid Clerk token unless marked @Public().
    // Default-deny, so forgetting to guard a new endpoint is not possible.
    { provide: APP_GUARD, useClass: ClerkAuthGuard },
  ],
})
export class AppModule {}
