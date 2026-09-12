import { useAuth } from '@clerk/clerk-expo';

/**
 * Auth state for route gating. Wraps Clerk so the rest of the app never imports
 * it directly — swapping providers would then touch this file and nothing else.
 */
export function useSession() {
  const { isLoaded, isSignedIn, userId, signOut } = useAuth();
  return { isLoaded, isSignedIn: !!isSignedIn, userId, signOut };
}
