// Required for the `declare module 'i18next'` augmentation at the bottom of this
// file to bind. Without it TypeScript reports TS2664 and the augmentation is
// silently not applied. Do not "clean up" this import.
import 'i18next';
import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import trAuth from './locales/tr/auth.json';
import trCommon from './locales/tr/common.json';

/**
 * Turkish is the source language (ADR-0007). `en` exists so the setup is
 * genuinely multi-locale rather than a single-language stub; the product ships
 * Turkish.
 */
export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'tr';

/** One namespace per feature. Features add their own; `common` is shared. */
export const namespaces = ['common', 'auth'] as const;
export type Namespace = (typeof namespaces)[number];

export const defaultNS = 'common' satisfies Namespace;

export const resources = {
  tr: { common: trCommon, auth: trAuth },
  en: { common: enCommon, auth: enAuth },
} as const;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Resolve a BCP-47 tag (`tr-TR`, `en-GB`) or bare language code to a supported
 * locale, falling back to Turkish.
 */
export function resolveLocale(value: string | null | undefined): Locale {
  if (!value) return defaultLocale;
  if (isLocale(value)) return value;
  const language = value.split('-')[0]?.toLowerCase();
  return isLocale(language) ? language : defaultLocale;
}

/**
 * Makes `t('actions.save')` autocomplete and turns a typo into a type error in
 * every consuming app. Keyed off the Turkish catalogue, so a key added to `en`
 * alone is not considered valid.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['tr'];
  }
}
