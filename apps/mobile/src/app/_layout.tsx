import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { IdentityProvider } from '@/features/identity';

export default function RootLayout() {
  return (
    <IdentityProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </IdentityProvider>
  );
}
