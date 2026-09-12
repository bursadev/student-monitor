/**
 * Clerk throws structured errors; surface the first one in Turkish rather than
 * a raw English string from the API.
 */
export function clerkErrorMessage(err: unknown, fallback: string): string {
  const errors = (err as { errors?: { longMessage?: string; message?: string }[] })?.errors;
  const first = errors?.[0];
  return first?.longMessage ?? first?.message ?? fallback;
}

/**
 * A sign-in or sign-up that returned something other than `complete` — usually
 * a second factor or an unverified email. Surfaced so the user is not left
 * staring at a form that appeared to succeed.
 */
export function incompleteMessage(status: string | null | undefined): string {
  return `Giriş tamamlanamadı (durum: ${status ?? 'bilinmiyor'}).`;
}
