import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAppUser, useSession } from '@/features/identity';

/**
 * The authenticated shell. Gating happens here rather than in a global guard so
 * the signed-out case can render a real screen instead of a flash.
 *
 * Two gates now: signed in, and onboarded. The second one waits for our own
 * database rather than reading anything off the Clerk token — role lives in our
 * schema precisely because the JWT lags a change by up to a minute (ADR-0012),
 * which would bounce a user straight back into the form they just submitted.
 */
export default function AppLayout() {
  const { isLoaded, isSignedIn } = useSession();
  const { isLoading, hasOnboarded } = useAppUser();

  if (!isLoaded || (isSignedIn && isLoading)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isSignedIn) return <Redirect href="/sign-in" />;

  // Closed by default: if the API could not be reached, `hasOnboarded` is false
  // and the user lands on the form, which shows the real error. Better than
  // letting an unreachable backend read as "already done".
  if (!hasOnboarded) return <Redirect href="/onboarding" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
