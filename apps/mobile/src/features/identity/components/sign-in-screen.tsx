import { useSignIn } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen, ErrorText, Field, LinkRow, PrimaryButton } from '@/shared/ui/auth-form';

import { clerkErrorMessage, incompleteMessage } from '../lib/clerk-error';

/**
 * Hand-rolled sign-in. The students who live in this app get our own UI rather
 * than Clerk's prebuilt component, which is only used on web.
 */
export function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!isLoaded || loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email.trim(), password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // Land on the root; the (app) gate decides where to go from there.
        router.replace('/');
      } else {
        // A second factor or an unverified email — never silently "succeed".
        setError(incompleteMessage(result.status));
      }
    } catch (err) {
      setError(clerkErrorMessage(err, 'Giriş yapılamadı.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen>
      <View style={styles.header}>
        <Text style={styles.title}>Giriş yap</Text>
        <Text style={styles.subtitle}>Student Monitor hesabınla devam et.</Text>
      </View>

      <Field
        testID="auth-email-input"
        label="E-posta"
        value={email}
        onChangeText={setEmail}
        placeholder="ornek@eposta.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <Field
        testID="auth-password-input"
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />

      <PrimaryButton
        testID="auth-submit"
        label="Giriş yap"
        onPress={() => void onSubmit()}
        loading={loading}
        disabled={!isLoaded}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}

      <LinkRow
        text="Hesabın yok mu?"
        action="Hesap oluştur"
        onPress={() => router.replace('/sign-up')}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 15, opacity: 0.6 },
});
