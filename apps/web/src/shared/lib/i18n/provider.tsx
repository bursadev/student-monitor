'use client';

import { defaultLocale, defaultNS, type Locale, resources } from '@sm/i18n';
import { createInstance } from 'i18next';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

/**
 * Client-side counterpart to `server.ts`. The locale is resolved on the server
 * and handed down, so the first client render matches the server's markup and
 * there is no hydration flash.
 *
 * Catalogues are bundled rather than fetched: there are two of them and they
 * are small, which is cheaper than a loading state on every screen.
 */
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [instance] = useState(() => {
    const i18n = createInstance();
    void i18n.use(initReactI18next).init({
      lng: locale,
      fallbackLng: defaultLocale,
      defaultNS,
      resources,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    return i18n;
  });

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
