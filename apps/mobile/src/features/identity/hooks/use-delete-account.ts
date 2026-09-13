import { useAuth } from '@clerk/clerk-expo';
import { useState } from 'react';

import { ApiError, apiRequest } from '@/shared/lib/api';

/**
 * Erase the signed-in account (FR-01.8).
 *
 * On success the Clerk identity no longer exists, so the local session is torn
 * down immediately — the route guard then sends the user back to sign-in rather
 * than letting the app retry with a token whose user is gone.
 */
export function useDeleteAccount() {
  const { getToken, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteAccount(): Promise<void> {
    setIsDeleting(true);
    setError(null);

    try {
      const token = await getToken();
      await apiRequest('/api/me', { method: 'DELETE', token });
    } catch (err) {
      // The backend's messages are already Turkish and user-safe.
      setError(err instanceof ApiError ? err.message : 'Hesap silinemedi.');
      setIsDeleting(false);
      return;
    }

    // No setState after this point: signing out unmounts the screen.
    await signOut();
  }

  return { deleteAccount, isDeleting, error };
}
