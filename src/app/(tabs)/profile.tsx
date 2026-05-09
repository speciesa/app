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