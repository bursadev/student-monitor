import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useDeleteAccount } from '../hooks/use-delete-account';

/**
 * Deleting is irreversible and there is no grace period (ADR-0013), so the
 * confirmation is not optional — it is the only thing standing between a tap
 * and a destroyed account.
 */
export function DeleteAccountButton() {
  const { deleteAccount, isDeleting, error } = useDeleteAccount();

  function confirm(): void {
    Alert.alert(
      'Hesabını sil',
      'Bu işlem geri alınamaz. Giriş bilgilerin ve kişisel verilerin silinir.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Hesabı sil', style: 'destructive', onPress: () => void deleteAccount() },
      ],
    );
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={confirm}
        disabled={isDeleting}
        accessibilityRole="button"
        style={[styles.button, isDeleting && styles.buttonBusy]}
      >
        {isDeleting ? (
          <ActivityIndicator color="#b91c1c" />
        ) : (
          <Text style={styles.label}>Hesabı sil</Text>
        )}
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 8, marginTop: 12 },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 10,
    minWidth: 132,
    alignItems: 'center',
  },
  buttonBusy: { opacity: 0.6 },
  label: { fontSize: 15, fontWeight: '500', color: '#b91c1c' },
  error: { fontSize: 13, color: '#b91c1c', textAlign: 'center', maxWidth: 260 },
});
