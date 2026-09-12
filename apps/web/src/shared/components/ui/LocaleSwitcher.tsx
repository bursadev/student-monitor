'use client';

import { locales } from '@sm/i18n';
import { useTranslation } from 'react-i18next';

import { setLocale } from '@/shared/lib/i18n/actions';

/** Client component: reads from the i18next instance supplied by I18nProvider. */
export function LocaleSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <form action={setLocale} className="flex items-center gap-2">
      <span className="text-sm text-black/60 dark:text-white/60">{t('language.label')}</span>
      {locales.map((candidate) => {
        const isActive = candidate === i18n.language;
        return (
          <button
            key={candidate}
            type="submit"
            name="locale"
            value={candidate}
            aria-current={isActive ? 'true' : undefined}
            className={
              isActive
                ? 'rounded border border-black/20 px-2 py-1 text-sm font-medium dark:border-white/30'
                : 'rounded border border-transparent px-2 py-1 text-sm text-black/60 hover:border-black/10 dark:text-white/60 dark:hover:border-white/20'
            }
          >
            {t(`language.${candidate}`)}
          </button>
        );
      })}
    </form>
  );
}
