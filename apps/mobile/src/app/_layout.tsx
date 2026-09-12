import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { initI18n } from '@/shared/lib/i18n';

initI18n();

export default function RootLayout() {
  return (
    <>
      <Stack />
      <StatusBar style="auto" />
    </>
  );
}
