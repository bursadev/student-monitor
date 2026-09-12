export { defaultLocale, isLocale, locales, resolveLocale } from '@sm/i18n';
export type { Locale, Namespace } from '@sm/i18n';

/**
 * Locale is stored in a cookie rather than a URL segment — see ADR-0011.
 * `NEXT_LOCALE` is the name Next.js itself uses, so it stays recognisable.
 */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

/** One year. The choice is a preference, not a session. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
