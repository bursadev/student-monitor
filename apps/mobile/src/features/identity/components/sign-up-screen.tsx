import { useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen, ErrorText, Field, LinkRow, PrimaryButton } from '@/shared/ui/auth-form';

import { clerkErrorMessage, incompleteMessage } from '../lib/clerk-error';

/**
 * Two phases, because Clerk verifies email addresses with a 6-digit code before
 * a sign-up can complete: collect credentials, then confirm the code.
 */
type Phase = 'form' | 'verify';

export function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [phase, setPhase] = useState<Phase>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!isLoaded || loading) return;
    setError(null);
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email.trim(), password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPhase('verify');
    } catch (err) {
      setError(clerkErrorMessage(err, 'Hesap oluşturulamadı.'));
    } finally {
      setLoading(false);
    }
  }

  async function onVerify() {
    if (!isLoaded || loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
      } else {
        setError(incompleteMessage(result.status));
      }
    } catch (err) {
      setError(clerkErrorMessage(err, 'Kod doğrulanamadı.'));
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'verify') {
    return (
      <AuthScreen>
        <View style={styles.header}>
          <Text style={styles.title}>E-postanı doğrula</Text>
          <Text style={styles.subtitle}>
            {email.trim()} adresine gönderdiğimiz 6 haneli kodu gir.
          </Text>
        </View>

        <Field
          label="Doğrulama kodu"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          maxLength={6}
        />

        <PrimaryButton
          label="Doğrula"
          onPress={() => void onVerify()}
          loading={loading}
          disabled={!isLoaded || code.trim().length === 0}
        />
        {error ? <ErrorText>{error}</ErrorText> : null}

        <LinkRow text="Yanlış adres mi?" action="Geri dön" onPress={() => setPhase('form')} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <View style={styles.header}>
        <Text style={styles.title}>Hesap oluştur</Text>
        <Text style={styles.subtitle}>Çalışmaya başlamak için kayıt ol.</Text>
      </View>

      <Field
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
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        placeholder="En az 8 karakter"
        secureTextEntry
        autoComplete="password-new"
        textContentType="newPassword"
      />

      <PrimaryButton
        label="Hesap oluştur"
        onPress={() => void onSubmit()}
        loading={loading}
        disabled={!isLoaded}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}

      <LinkRow
        text="Zaten hesabın var mı?"
        action="Giriş yap"
        onPress={() => router.replace('/sign-in')}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 15, opacity: 0.6 },
});
