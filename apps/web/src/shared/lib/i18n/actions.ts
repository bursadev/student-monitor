'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, resolveLocale } from './settings';

/** Persist the viewer's language choice and re-render with it. */
export async function setLocale(formData: FormData) {
  const locale = resolveLocale(formData.get('locale')?.toString());
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  });
  revalidatePath('/', 'layout');
}
