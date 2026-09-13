import { useUser } from '@clerk/clerk-expo';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DeleteAccountButton, useSession } from '@/features/identity';

export default function Home() {
  const { user } = useUser();
  const { signOut } = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hoş geldin{user?.firstName ? `, ${user.firstName}` : ''}
      </Text>
      <Text style={styles.subtitle}>{user?.primaryEmailAddress?.emailAddress}</Text>
      <Text style={styles.note}>
        Giriş yaptın. Rol seçimi ve günlük ekran sonraki adımda gelecek.
      </Text>

      <Pressable onPress={() => void signOut()} style={styles.signOut}>
        <Text style={styles.signOutLabel}>Çıkış yap</Text>
      </Pressable>

      <DeleteAccountButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { fontSize: 14, opacity: 0.6 },
  note: { fontSize: 13, opacity: 0.5, textAlign: 'center', marginTop: 8 },
  signOut: { marginTop: 24, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10 },
  signOutLabel: { fontSize: 15, fontWeight: '500' },
});
