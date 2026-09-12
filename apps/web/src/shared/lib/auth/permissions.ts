import 'server-only';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/** For server actions: throws rather than redirecting. */
export async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized: not authenticated');
  return { userId };
}

/** For pages and layouts: sends the visitor to sign-in. */
export async function requireUserOrRedirect(to = '/sign-in') {
  const { userId } = await auth();
  if (!userId) redirect(to);
  return { userId };
}

/**
 * The signed-in Clerk user, or null — including the "stale JWT" case where the
 * browser still holds a valid session token for a user that has since been
 * deleted. `auth()` accepts that token without a network call, but
 * `currentUser()` hits the Backend API and 404s; mapping that to null lets
 * callers redirect to sign-in instead of crashing the render.
 */
export async function getClerkUser() {
  try {
    return await currentUser();
  } catch (err) {
    if (isClerkNotFound(err)) return null;
    throw err;
  }
}

function isClerkNotFound(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { clerkError?: boolean }).clerkError === true &&
    (err as { status?: number }).status === 404
  );
}
