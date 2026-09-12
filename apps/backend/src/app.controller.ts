import { Controller, Get } from '@nestjs/common';

import { Public } from './shared/auth/public.decorator.js';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** Liveness probe — deliberately unauthenticated. */
  @Public()
  @Get('health')
  health(): { status: string } {
    return { status: this.appService.getHello() };
  }
}
