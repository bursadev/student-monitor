import 'server-only';

import { apiRequest } from '@/shared/lib/api';

/** Mirrors the backend's AppUserDTO (apps/backend/src/features/users/dto). */
export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  role: 'COACH' | 'STUDENT' | 'PARENT' | null;
  onboardedAt: string | null;
}

/**
 * The caller's own row, creating it on first use.
 *
 * POST rather than GET because the backend treats this as "ensure and return" —
 * the mirror row is made just-in-time on a user's first authenticated call
 * (ADR-0012), and a layout is exactly where that first call happens.
 */
export async function fetchCurrentUser(): Promise<AppUser | null> {
  return apiRequest<AppUser>('/api/me', { method: 'POST' });
}

export function hasOnboarded(user: AppUser | null): boolean {
  return Boolean(user?.onboardedAt);
}
