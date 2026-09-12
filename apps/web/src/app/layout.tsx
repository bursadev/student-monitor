import { ClerkProvider } from '@clerk/nextjs';
import { trTR } from '@clerk/localizations';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Student Monitor',
  description: 'Öğrenci koçluğu platformu',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  // Clerk ships Turkish strings for its prebuilt components, so the hosted
  // sign-in flow matches the rest of the product without an i18n layer of ours.
  return (
    <ClerkProvider localization={trTR}>
      <html lang="tr">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
