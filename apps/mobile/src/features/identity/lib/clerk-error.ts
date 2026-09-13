import { trTR } from '@clerk/localizations';

/**
 * Turkish copy for the Clerk error codes `trTR` does not carry. Everything else
 * is looked up in Clerk's own table rather than retyped here, so their wording
 * and ours cannot drift apart as the package is updated.
 */
const OWN_MESSAGES: Record<string, string> = {
  form_identifier_exists: 'Bu e-posta adresiyle bir hesap zaten var.',
  verification_expired: 'Doğrulama kodunun süresi doldu. Yeni bir kod isteyin.',
  verification_failed: 'Doğrulama tamamlanamadı. Lütfen tekrar deneyin.',
};

/** Clerk's own Turkish strings, keyed by the same error codes the API returns. */
const CLERK_MESSAGES = trTR.unstable__errors as Record<string, unknown> | undefined;

interface ClerkApiError {
  code?: string;
  longMessage?: string;
  message?: string;
}

/**
 * Turn a thrown Clerk error into something a Turkish user can act on.
 *
 * `localization={trTR}` on the provider does **not** cover this: it themes
 * Clerk's own rendered components, while our screens are hand-rolled and get
 * raw `ClerkAPIError` objects whose `message` and `longMessage` come back from
 * the API in English. The translation has to happen here, keyed by error code.
 *
 * Order: our copy for the codes Clerk has not translated, then Clerk's Turkish
 * table, then whatever the API said, then the caller's fallback.
 */
export function clerkErrorMessage(err: unknown, fallback: string): string {
  const errors = (err as { errors?: ClerkApiError[] })?.errors;
  const first = errors?.[0];
  if (!first) return fallback;

  const { code } = first;
  if (code) {
    const own = OWN_MESSAGES[code];
    if (own) return own;

    const translated = CLERK_MESSAGES?.[code];
    if (typeof translated === 'string' && translated.length > 0) return translated;
  }

  // An untranslated code still beats the generic fallback: an English sentence
  // naming the actual problem is more use than "Giriş yapılamadı."
  return first.longMessage ?? first.message ?? fallback;
}

/**
 * A sign-in or sign-up that returned something other than `complete` — usually
 * a second factor or an unverified e-mail. Surfaced so the user is not left
 * staring at a form that appeared to succeed.
 */
const INCOMPLETE_MESSAGES: Record<string, string> = {
  needs_identifier: 'E-posta adresinizi girin.',
  needs_first_factor: 'Giriş doğrulaması tamamlanmadı. Lütfen tekrar deneyin.',
  needs_second_factor: 'İki adımlı doğrulama gerekiyor.',
  needs_new_password: 'Devam etmek için yeni bir şifre belirlemeniz gerekiyor.',
  missing_requirements: 'Kayıt için gereken bilgiler eksik.',
  abandoned: 'Oturum zaman aşımına uğradı. Lütfen baştan başlayın.',
};

export function incompleteMessage(status: string | null | undefined): string {
  // Never print the raw status at the user: "durum: needs_second_factor" is a
  // protocol detail, not a sentence.
  return (
    (status ? INCOMPLETE_MESSAGES[status] : undefined) ??
    'İşlem tamamlanamadı. Lütfen tekrar deneyin.'
  );
}
