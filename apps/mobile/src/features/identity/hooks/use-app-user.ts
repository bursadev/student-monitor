import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';

import { apiRequest } from '@/shared/lib/api';

/** Mirrors the backend's AppUserDTO (apps/backend/src/features/users/dto). */
export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  role: 'COACH' | 'STUDENT' | 'PARENT' | null;
  onboardedAt: string | null;
}

interface LoadState {
  user: AppUser | null;
  error: string | null;
  settled: boolean;
}

const IDLE: LoadState = { user: null, error: null, settled: false };

/**
 * The caller's own row, loaded once per mount.
 *
 * A plain hook rather than SWR: `@sm/api` and its cache do not exist yet
 * ([[Frontend Architecture]]), so there is nothing to share a cache with. When
 * that package lands this becomes a one-line `useSWR(meKeys.current())`.
 *
 * POST rather than GET because the backend ensures the mirror row on first use
 * (ADR-0012) — a route guard is exactly where a brand-new user first arrives.
 *
 * Everything about the signed-out case is *derived* rather than stored. Writing
 * it into state from the effect body would be a cascading render, and the React
 * Compiler lint rightly rejects it.
 */
export function useAppUser() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [state, setState] = useState<LoadState>(IDLE);

  const load = useCallback(async () => {
    const token = await getToken();
    return apiRequest<AppUser>('/api/me', { method: 'POST', token });
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;
    load()
      .then((user) => {
        if (!cancelled) setState({ user, error: null, settled: true });
      })
      .catch((err: unknown) => {
        // The user stays null, which keeps the guard closed. An unreachable API
        // must not read as "already onboarded".
        const message = err instanceof Error ? err.message : 'Bilgiler alınamadı.';
        if (!cancelled) setState({ user: null, error: message, settled: true });
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, load]);

  const signedIn = isLoaded && Boolean(isSignedIn);

  return {
    user: signedIn ? state.user : null,
    error: signedIn ? state.error : null,
    isLoading: !isLoaded || (signedIn && !state.settled),
    hasOnboarded: signedIn && Boolean(state.user?.onboardedAt),
  };
}
