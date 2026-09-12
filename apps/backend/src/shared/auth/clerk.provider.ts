import { createClerkClient } from '@clerk/backend';
import type { Provider } from '@nestjs/common';

export const CLERK_CLIENT = 'CLERK_CLIENT';

/** Singleton Clerk Backend API client, used by IdentityService for lookups. */
export const clerkClientProvider: Provider = {
  provide: CLERK_CLIENT,
  useFactory: () => createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }),
};
