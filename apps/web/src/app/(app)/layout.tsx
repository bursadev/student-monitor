import { UserButton } from '@clerk/nextjs';

import { requireUserOrRedirect } from '@/shared/lib/auth/permissions';

// Everything under here is per-user and behind auth. Prerendering would need
// Clerk keys at build time and would still render an empty shell.
export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: LayoutProps<'/'>) {
  // The proxy already redirects anonymous visitors; this is the second gate, so
  // a matcher mistake cannot silently expose a page.
  await requireUserOrRedirect();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-black/10 px-6 py-3 dark:border-white/15">
        <span className="font-semibold">Student Monitor</span>
        <UserButton />
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
