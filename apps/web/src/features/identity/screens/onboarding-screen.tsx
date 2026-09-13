import { OnboardingForm } from '../components/onboarding-form';
import { fetchCurrentUser } from '../lib/app-user';

/**
 * First screen after signing up: choose a role and confirm a name.
 *
 * The name is prefilled from whatever Clerk gave us, which is often nothing —
 * with Apple's "Hide My Email" or an SSO signup there may be no name at all,
 * and IdentityService deliberately refuses to fall back to the e-mail address.
 */
export async function OnboardingScreen() {
  const user = await fetchCurrentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <header className="flex max-w-md flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold">Hoş geldin</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Başlamadan önce iki soru: bu platformda kimsin, ve sana nasıl hitap edelim?
        </p>
      </header>

      <OnboardingForm defaultName={user?.displayName ?? undefined} />
    </div>
  );
}
