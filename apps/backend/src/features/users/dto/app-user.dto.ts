import type { AppUser } from '../../../generated/prisma/client.js';

/**
 * What the clients see. Explicitly mapped rather than returning the row, so a
 * column added later is not published by accident — the same discipline that
 * keeps money off student-facing responses (BR-022).
 */
export interface AppUserDTO {
  id: string;
  email: string | null;
  displayName: string | null;
  role: AppUser['role'];
  onboardedAt: string | null;
}

export function toAppUserDTO(user: AppUser): AppUserDTO {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    onboardedAt: user.onboardedAt?.toISOString() ?? null,
  };
}
