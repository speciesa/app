import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRegister } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { t } from '@/i18n';

export default function RegisterScreen() {
  const router = useRouter();
  const { mutateAsync: register, isPending } = useRegister();
  const { setTokens, setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (password.length < 8) {
      Alert.alert(
        t('errors.generic'),
        t('auth.password_min_length')
      );
      return;
    }

    try {
      const data = await register({
        email,
        password,
        locale: 'en',
      });

      setTokens(data.access_token, data.refresh_token);
      setUser(data.user);

      router.back();
    } catch {
      Alert.alert(
        t('errors.generic'),
        t('auth.register_failed')
      );
    }
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <TouchableOpacity style={s.close} onPress={() => router.back()}>
        <Text style={s.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={s.title}>{t('auth.register_title')}</Text>
      <Text style={s.sub}>{t('auth.register_sub')}</Text>

      <TextInput
        style={s.input}
        placeholder={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={s.input}
        placeholder={t('auth.password_hint')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={s.btn}
        onPress={handleRegister}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.btnText}>
            {t('auth.register')}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/auth/login')}>
        <Text style={s.link}>
          {t('auth.have_account')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    padding: 20,
  },

  close: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1EFE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  closeText: {
    color: '#5F5E5A',
    fontSize: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 6,
  },

  sub: {
    fontSize: 13,
    color: '#1D9E75',
    marginBottom: 24,
  },

  input: {
    backgroundColor: '#F1EFE8',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#2C2C2A',
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E8E6DE',
  },

  btn: {
    backgroundColor: '#1D9E75',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  link: {
    textAlign: 'center',
    color: '#1D9E75',
    fontSize: 14,
  },
});