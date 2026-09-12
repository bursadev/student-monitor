import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('appName')}</Text>
      <Text style={styles.subtitle}>{t('appDescription')}</Text>

      {/* Plurals differ by language: Turkish does not pluralise after a number. */}
      <Text style={styles.subtitle}>
        {t('taskCount', { count: 1 })} · {t('taskCount', { count: 5 })}
      </Text>

      <Text style={styles.locale}>{i18n.language}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { fontSize: 14, opacity: 0.6 },
  locale: { fontSize: 12, opacity: 0.4, marginTop: 8 },
});
