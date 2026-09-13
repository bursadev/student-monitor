'use server';

import { redirect } from 'next/navigation';

import { ApiError, apiRequest } from '@/shared/lib/api';

export interface OnboardingState {
  error: string | null;
}

/**
 * Submit onboarding on the user's behalf.
 *
 * A server action rather than a fetch from the browser: the Clerk token and the
 * API base URL both stay on the server, and the form keeps working without
 * client-side JavaScript.
 */
export async function submitOnboarding(
  _previous: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const role = formData.get('role');
  const displayName = formData.get('displayName');

  // A first pass so the obvious cases answer instantly. The backend validates
  // properly and owns the rules — this is not the authority (BR-024: never
  // trust the client), just the fast path.
  if (typeof role !== 'string' || role.length === 0) {
    return { error: 'Lütfen bir rol seçin.' };
  }

  try {
    await apiRequest('/api/me/onboarding', {
      method: 'POST',
      body: { role, displayName: typeof displayName === 'string' ? displayName : '' },
    });
  } catch (err) {
    // The backend's messages are Turkish and already safe to show.
    return { error: err instanceof ApiError ? err.message : 'Kayıt tamamlanamadı.' };
  }

  // Outside the try: redirect() signals by throwing, so catching it here would
  // swallow the navigation and look like a silent failure.
  redirect('/panel');
}
