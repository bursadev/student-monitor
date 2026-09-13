import { redirect } from 'next/navigation';

import { fetchCurrentUser, hasOnboarded } from '@/features/identity';
import { requireUserOrRedirect } from '@/shared/lib/auth/permissions';

export const dynamic = 'force-dynamic';

/**
 * Signed in, but not yet onboarded.
 *
 * Its own route group so the gate in (app) can redirect *here* without
 * redirecting into itself. The inverse check below is what stops someone who
 * has already finished from reopening the form.
 */
export default async function OnboardingLayout({ children }: LayoutProps<'/'>) {
  await requireUserOrRedirect();

  if (hasOnboarded(await fetchCurrentUser())) redirect('/panel');

  return <>{children}</>;
}
