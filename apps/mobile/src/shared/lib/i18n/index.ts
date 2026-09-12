import { defaultLocale, defaultNS, type Locale, resolveLocale, resources } from '@sm/i18n';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * First supported language in the device's ordered preference list, else
 * Turkish. `getLocales()` is synchronous, so the first render already has the
 * right language and there is no flash of the fallback.
 */
export function resolveDeviceLocale(): Locale {
  for (const { languageTag } of getLocales()) {
    const candidate = resolveLocale(languageTag);
    if (candidate !== defaultLocale || languageTag.startsWith(defaultLocale)) {
      return candidate;
    }
  }
  return defaultLocale;
}

/**
 * A module-level singleton is fine here, unlike on the web server: a mobile app
 * is one user in one process.
 *
 * No persisted override yet — the storage adapter lands with react-native-mmkv,
 * which needs a development build and would take the app out of Expo Go.
 */
export function initI18n() {
  if (i18n.isInitialized) return i18n;

  void i18n.use(initReactI18next).init({
    lng: resolveDeviceLocale(),
    fallbackLng: defaultLocale,
    defaultNS,
    resources,
    interpolation: { escapeValue: false },
  });

  return i18n;
}

export { i18n };
