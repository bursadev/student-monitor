import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useSession } from '@/features/identity';

/**
 * The authenticated shell. Gating happens here rather than in a global guard so
 * the signed-out case can render a real screen instead of a flash.
 */
export default function AppLayout() {
  const { isLoaded, isSignedIn } = useSession();

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
