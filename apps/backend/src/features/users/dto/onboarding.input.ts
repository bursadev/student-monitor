import { BadRequestException } from '@nestjs/common';

import type { UserRole } from '../../../generated/prisma/enums.js';

export interface OnboardingInput {
  role: UserRole;
  displayName: string;
}

const ROLES: readonly UserRole[] = ['COACH', 'STUDENT', 'PARENT'];

/** Matches the column; long enough for a real Turkish name, short enough to render. */
const NAME_MIN = 2;
const NAME_MAX = 80;

/**
 * Validate an onboarding submission.
 *
 * Hand-rolled on purpose. The project's direction is Zod schemas in `@sm/core`
 * behind a global ValidationPipe ([[T-002]]), and half of that pattern — a Zod
 * schema with no pipe, living in one feature — would be worse than none. Two
 * fields do not justify pulling the stack forward; this function is what gets
 * replaced when the real thing lands.
 */
export function parseOnboardingInput(raw: unknown): OnboardingInput {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new BadRequestException('Geçersiz istek.');
  }

  const { role, displayName } = raw as { role?: unknown; displayName?: unknown };

  if (typeof role !== 'string' || !ROLES.includes(role as UserRole)) {
    throw new BadRequestException('Geçerli bir rol seçin.');
  }

  const name = typeof displayName === 'string' ? displayName.trim() : '';
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    throw new BadRequestException(
      `Ad soyad ${NAME_MIN} ile ${NAME_MAX} karakter arasında olmalı.`,
    );
  }

  return { role: role as UserRole, displayName: name };
}
