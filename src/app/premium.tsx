import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const FEATURES = [
  { icon: '📥', title: 'Весь каталог офлайн', sub: 'Скачайте один раз — работает без сети' },
  { icon: '🚫', title: 'Без рекламы навсегда', sub: 'Никаких баннеров и прерываний' },
  { icon: '📖', title: 'Расширенные описания', sub: 'Полные статьи, ареалы, классификация' },
  { icon: '⭐', title: 'Коллекции и заметки', sub: 'Сохраняйте виды в личные списки' },
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
          <Text style={s.heroTitle}>Биоатлас Premium</Text>
          <Text style={s.heroSub}>Весь атлас в кармане — без рекламы, без интернета</Text>
        </View>

        <View style={s.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={s.featureRow}>
              <View style={s.featureIcon}>
                <Text style={s.featureIconText}>{f.icon}</Text>
              </View>
              <View style={s.featureBody}>
                <Text style={s.featureTitle}>{f.title}</Text>
                <Text style={s.featureSub}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.ctaBtn}>
          <Text style={s.ctaBtnText}>Оформить за 2.99 € / мес</Text>
        </TouchableOpacity>
        <Text style={s.trialNote}>Первые 7 дней бесплатно · Отменить можно в любой момент</Text>

        <TouchableOpacity style={s.freeBtn} onPress={() => router.back()}>
          <Text style={s.freeBtnText}>Продолжить бесплатно</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  close: { position: 'absolute', top: 56, right: 16, zIndex: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1EFE8', justifyContent: 'center', alignItems: 'center' },
  closeText: { fontSize: 14, color: '#5F5E5A' },
  scroll: { padding: 20, paddingTop: 60 },
  hero: { alignItems: 'center', backgroundColor: '#E1F5EE', borderRadius: 20, padding: 24, marginBottom: 20 },
  heroIcon: { fontSize: 40, marginBottom: 10 },
  heroTitle: { fontSize: 22, fontWeight: '500', color: '#085041' },
  heroSub: { fontSize: 13, color: '#0F6E56', textAlign: 'center', marginTop: 6, lineHeight: 20 },
  features: { marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#E8E6DE' },
  featureIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E1F5EE', justifyContent: 'center', alignItems: 'center' },
  featureIconText: { fontSize: 16 },
  featureBody: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  featureSub: { fontSize: 12, color: '#888780', marginTop: 2 },
  ctaBtn: { backgroundColor: '#1D9E75', borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 10 },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  trialNote: { textAlign: 'center', fontSize: 11, color: '#888780', marginBottom: 12 },
  freeBtn: { padding: 12, borderRadius: 12, borderWidth: 0.5, borderColor: '#C5C3BB', alignItems: 'center' },
  freeBtnText: { fontSize: 14, color: '#5F5E5A' },
});
