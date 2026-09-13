import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { trTR } from '@clerk/localizations';
import type { ReactNode } from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Clerk for the mobile app. `tokenCache` persists the session in the device
 * keychain via expo-secure-store — the only place a token belongs on a device.
 *
 * `trTR` localises anything Clerk renders itself, matching what web has done
 * since the start (apps/web/src/app/layout.tsx). It does **not** reach the
 * errors our hand-rolled screens catch — those arrive as raw ClerkAPIError
 * objects with English text — so translating them is `clerk-error.ts`'s job,
 * using the same trTR table by error code.
 */
export function IdentityProvider({ children }: { children: ReactNode }) {
  if (!publishableKey) {
    throw new Error(
      'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY eksik — apps/mobile/.env dosyasına ekleyin (bkz. .env.example).',
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache} localization={trTR}>
      {children}
    </ClerkProvider>
  );
}
