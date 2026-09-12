import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import type { ReactNode } from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Clerk for the mobile app. `tokenCache` persists the session in the device
 * keychain via expo-secure-store — the only place a token belongs on a device.
 */
export function IdentityProvider({ children }: { children: ReactNode }) {
  if (!publishableKey) {
    throw new Error(
      'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY eksik — apps/mobile/.env dosyasına ekleyin (bkz. .env.example).',
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {children}
    </ClerkProvider>
  );
}
