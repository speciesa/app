import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '@/i18n';

const FEATURES = [
  {
    icon: '📥',
    titleKey: 'premium.feature_offline',
    subKey: 'premium.feature_offline_sub',
  },
  {
    icon: '🚫',
    titleKey: 'premium.feature_no_ads',
    subKey: undefined,
  },
  {
    icon: '📖',
    titleKey: 'premium.feature_extended',
    subKey: 'premium.feature_extended_sub',
  },
  {
    icon: '⭐',
    titleKey: 'premium.feature_collections',
    subKey: 'premium.feature_collections_sub',
  },
];

export default function PremiumScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <TouchableOpacity style={s.close} onPress={() => router.back()}>
        <Text style={s.closeText}>✕</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Text style={s.heroIcon}>⭐</Text>
          <Text style={s.heroTitle}>{t('premium.title')}</Text>
          <Text style={s.heroSub}>{t('premium.subtitle')}</Text>
        </View>

        <View style={s.features}>
          {FEATURES.map((f) => (
            <View key={f.titleKey} style={s.featureRow}>
              <View style={s.featureIcon}>
                <Text style={s.featureIconText}>{f.icon}</Text>
              </View>

              <View style={s.featureBody}>
                <Text style={s.featureTitle}>{t(f.titleKey)}</Text>
                {f.subKey && (
                  <Text style={s.featureSub}>{t(f.subKey)}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.ctaBtn}>
          <Text style={s.ctaBtnText}>{t('premium.cta')}</Text>
        </TouchableOpacity>

        <Text style={s.trialNote}>{t('premium.trial_note')}</Text>

        <TouchableOpacity style={s.freeBtn} onPress={() => router.back()}>
          <Text style={s.freeBtnText}>{t('premium.continue_free')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },

  close: {
    position: 'absolute',
    top: 56,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1EFE8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: { fontSize: 14, color: '#5F5E5A' },

  scroll: { padding: 20, paddingTop: 60 },

  hero: {
    alignItems: 'center',
    backgroundColor: '#E1F5EE',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },

  heroIcon: { fontSize: 40, marginBottom: 10 },

  heroTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#085041',
  },

  heroSub: {
    fontSize: 13,
    color: '#0F6E56',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },

  features: { marginBottom: 24 },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8E6DE',
  },

  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1F5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  featureIconText: { fontSize: 16 },

  featureBody: { flex: 1 },

  featureTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2A',
  },

  featureSub: {
    fontSize: 12,
    color: '#888780',
    marginTop: 2,
  },

  ctaBtn: {
    backgroundColor: '#1D9E75',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

  ctaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  trialNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#888780',
    marginBottom: 12,
  },

  freeBtn: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#C5C3BB',
    alignItems: 'center',
  },

  freeBtnText: {
    fontSize: 14,
    color: '#5F5E5A',
  },
});