import 'server-only';

import { defaultLocale, defaultNS, type Locale, type Namespace, resources } from '@sm/i18n';
import { createInstance } from 'i18next';
import { cookies, headers } from 'next/headers';

import { LOCALE_COOKIE, resolveLocale } from './settings';

/**
 * Cookie first (an explicit choice), then the browser's Accept-Language, then
 * Turkish.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (fromCookie) return resolveLocale(fromCookie);

  const acceptLanguage = (await headers()).get('accept-language');
  const preferred = acceptLanguage?.split(',')[0]?.trim();
  return resolveLocale(preferred);
}

/**
 * A fresh instance per call. i18next instances carry mutable language state, so
 * a module-level singleton would leak one request's locale into another's
 * render on a warm server.
 *
 * Deliberately no `initReactI18next` here: it registers a React context, and
 * `createContext` does not exist in the server component runtime — wiring it up
 * fails the build with "createContext is not a function". Server components
 * only need `t`, which a plain i18next instance provides.
 */
async function createI18nInstance(locale: Locale) {
  const instance = createInstance();
  await instance.init({
    lng: locale,
    fallbackLng: defaultLocale,
    defaultNS,
    resources,
    interpolation: { escapeValue: false },
  });
  return instance;
}

/** Translate inside a server component. */
export async function getTranslation(ns: Namespace = defaultNS) {
  const locale = await getLocale();
  const instance = await createI18nInstance(locale);
  return { t: instance.getFixedT(locale, ns), i18n: instance, locale };
}
