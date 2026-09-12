import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useSession } from '@/features/identity';

/** Entry point: decide where a launch lands once Clerk has restored the session. */
export default function Index() {
  const { isLoaded, isSignedIn } = useSession();

  // A spinner rather than a blank screen while the keychain token is read.
  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? '/home' : '/sign-in'} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
