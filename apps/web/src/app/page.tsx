import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function Home() {
  // Clerk Core 3 removed the <SignedIn>/<SignedOut> components. Reading the
  // session on the server is the replacement, and it suits a server component
  // better anyway: no client bundle, no flash of the wrong state.
  const { isAuthenticated } = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Student Monitor</h1>
      <p className="text-sm text-black/60 dark:text-white/60">Öğrenci koçluğu platformu</p>

      {isAuthenticated ? (
        <Link
          href="/panel"
          className="rounded bg-black px-3 py-1.5 text-sm text-white dark:bg-white dark:text-black"
        >
          Panele git
        </Link>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/sign-in"
            className="rounded border border-black/20 px-3 py-1.5 text-sm dark:border-white/30"
          >
            Giriş yap
          </Link>
          <Link
            href="/sign-up"
            className="rounded bg-black px-3 py-1.5 text-sm text-white dark:bg-white dark:text-black"
          >
            Hesap oluştur
          </Link>
        </div>
      )}
    </main>
  );
}
