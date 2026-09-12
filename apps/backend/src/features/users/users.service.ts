import { Injectable } from '@nestjs/common';

import { IdentityService } from '../../shared/auth/identity.service.js';
import { type AppUserDTO, toAppUserDTO } from './dto/app-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly identity: IdentityService) {}

  async ensureAndGet(clerkUserId: string): Promise<AppUserDTO> {
    const user = await this.identity.ensureAppUser(clerkUserId);
    return toAppUserDTO(user);
  }
}
