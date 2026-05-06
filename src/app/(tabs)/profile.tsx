import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMe } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthStore();
  const { data: me } = useMe(isAuthenticated);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <Text style={s.title}>Профиль</Text>

      {me ? (
        <View style={s.card}>
          <Text style={s.email}>{me.email}</Text>
          <Text style={s.sub}>
            {me.subscription?.status === 'active' ? '⭐ Premium' :
             me.subscription?.status === 'trial' ? '🆓 Пробный период' : 'Бесплатный'}
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={s.btn} onPress={() => router.push('/auth/login')}>
          <Text style={s.btnText}>Войти в аккаунт</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={s.premBtn} onPress={() => router.push('/premium')}>
        <Text style={s.premBtnText}>⭐ Получить Premium</Text>
      </TouchableOpacity>

      {isAuthenticated && (
        <TouchableOpacity style={s.logoutBtn} onPress={logout}>
          <Text style={s.logoutText}>Выйти</Text>
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
