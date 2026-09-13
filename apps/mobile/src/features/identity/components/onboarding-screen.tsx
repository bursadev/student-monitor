import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ApiError, apiRequest } from '@/shared/lib/api';

import { useAppUser } from '../hooks/use-app-user';

type Role = 'COACH' | 'STUDENT' | 'PARENT';

const ROLES: { value: Role; label: string; hint: string }[] = [
  { value: 'STUDENT', label: 'Öğrenci', hint: 'Koçumla çalışırım, görevlerimi takip ederim.' },
  { value: 'COACH', label: 'Koç', hint: 'Öğrenci takip ederim, görev ve ödev veririm.' },
  { value: 'PARENT', label: 'Veli', hint: 'Çocuğumun gelişimini takip ederim.' },
];

/**
 * Choose a role and a name, once.
 *
 * Student is the default because this app is theirs — coaches get quick actions
 * here but live on the web panel, and parents are web-only in practice. All
 * three are offered anyway: stranding someone who installed the wrong app is a
 * worse failure than an extra option.
 */
export function OnboardingScreen() {
  const { getToken } = useAuth();
  const { user, isLoading } = useAppUser();

  const [role, setRole] = useState<Role>('STUDENT');
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from Clerk until the user types; `null` means "untouched".
  const name = displayName ?? user?.displayName ?? '';

  async function submit(): Promise<void> {
    setIsSaving(true);
    setError(null);

    try {
      const token = await getToken();
      await apiRequest('/api/me/onboarding', {
        method: 'POST',
        token,
        body: { role, displayName: name },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Kayıt tamamlanamadı.');
      setIsSaving(false);
      return;
    }

    router.replace('/home');
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hoş geldin</Text>
      <Text style={styles.subtitle}>
        Başlamadan önce iki soru: bu platformda kimsin, ve sana nasıl hitap edelim?
      </Text>

      <View style={styles.roles}>
        {ROLES.map((option) => {
          const selected = option.value === role;
          return (
            <Pressable
              key={option.value}
              onPress={() => setRole(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[styles.role, selected && styles.roleSelected]}
            >
              <Text style={styles.roleLabel}>{option.label}</Text>
              <Text style={styles.roleHint}>{option.hint}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Ad soyad</Text>
        <TextInput
          value={name}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          autoComplete="name"
          maxLength={80}
          style={styles.input}
        />
      </View>

      <Text style={styles.note}>Rolünü daha sonra değiştiremezsin.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={() => void submit()}
        disabled={isSaving}
        style={[styles.submit, isSaving && styles.submitBusy]}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitLabel}>Devam et</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flexGrow: 1, justifyContent: 'center', gap: 12, padding: 24 },
  title: { fontSize: 24, fontWeight: '600' },
  subtitle: { fontSize: 14, opacity: 0.6, marginBottom: 8 },
  roles: { gap: 10 },
  role: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, gap: 2 },
  roleSelected: { borderColor: '#111827', backgroundColor: 'rgba(17,24,39,0.04)' },
  roleLabel: { fontSize: 16, fontWeight: '500' },
  roleHint: { fontSize: 13, opacity: 0.6 },
  field: { gap: 6, marginTop: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  note: { fontSize: 13, opacity: 0.5 },
  error: { fontSize: 13, color: '#b91c1c' },
  submit: {
    marginTop: 8,
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBusy: { opacity: 0.7 },
  submitLabel: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
