import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMe } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

import { t } from '@/i18n';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthStore();
  const { data: me } = useMe(isAuthenticated);

  const subscriptionLabel =
    me?.subscription?.status === 'active'
      ? t('profile.subscription_active')
      : me?.subscription?.status === 'trial'
      ? t('profile.subscription_trial')
      : t('profile.subscription_free');

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <Text style={s.title}>{t('profile.title')}</Text>

      {/* USER CARD */}
      {me ? (
        <View style={s.card}>
          <Text style={s.email}>{me.email}</Text>
          <Text style={s.sub}>{subscriptionLabel}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={s.btn}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={s.btnText}>
            {t('profile.login')}
          </Text>
        </TouchableOpacity>
      )}

      {/* PREMIUM */}
      <TouchableOpacity
        style={s.premBtn}
        onPress={() => router.push('/premium')}
      >
        <Text style={s.premBtnText}>
          ⭐ {t('profile.premium_cta')}
        </Text>
      </TouchableOpacity>

      {/* LANGUAGE SECTION */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>
          {t('profile.language')}
        </Text>
        <LanguageToggle />
      </View>

      {/* LOGOUT */}
      {isAuthenticated && (
        <TouchableOpacity
          style={s.logoutBtn}
          onPress={logout}
        >
          <Text style={s.logoutText}>
            {t('profile.logout')}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8', padding: 16 },
  title: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', marginBottom: 20 },
  card: { backgroundColor: '#F1EFE8', borderRadius: 14, padding: 14, marginBottom: 12 },
  email: { fontSize: 15, color: '#2C2C2A', fontWeight: '500' },
  sub: { fontSize: 13, color: '#1D9E75', marginTop: 4 },
  btn: { backgroundColor: '#1D9E75', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  premBtn: { backgroundColor: '#E1F5EE', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12, borderWidth: 0.5, borderColor: '#9FE1CB' },
  premBtnText: { color: '#085041', fontSize: 15, fontWeight: '500' },
  logoutBtn: { padding: 14, alignItems: 'center' },
  logoutText: { color: '#888780', fontSize: 14 },
});