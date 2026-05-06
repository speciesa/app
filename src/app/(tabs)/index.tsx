import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaxaByRank } from '@/hooks/useApi';

const SECTIONS = [
  { rank: 'kingdom' as const, emoji: '🌿', label: 'Растения', bg: '#EAF3DE' },
  { rank: 'kingdom' as const, emoji: '🐾', label: 'Животные', bg: '#E6F1FB' },
  { rank: 'kingdom' as const, emoji: '🍄', label: 'Грибы', bg: '#FAEEDA' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { data } = useTaxaByRank('kingdom', 'ru');
  const kingdoms = data?.data ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>БиоАтлас</Text>
          <Text style={styles.subtitle}>Каталог живой природы</Text>
        </View>

        <View style={styles.grid}>
          {kingdoms.map((k) => (
            <TouchableOpacity
              key={k.id}
              style={styles.card}
              onPress={() => router.push({
                pathname: '/(tabs)/catalog',
                params: { taxon_id: k.id, rank: k.rank, breadcrumb: JSON.stringify([k]) },
              })}
              activeOpacity={0.75}
            >
              <Text style={styles.cardEmoji}>🌿</Text>
              <Text style={styles.cardName}>{k.common_name ?? k.scientific_name}</Text>
              <Text style={styles.cardCount}>{k.species_count.toLocaleString()} видов</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  scroll: { padding: 16 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '500', color: '#085041' },
  subtitle: { fontSize: 14, color: '#888780', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', backgroundColor: '#F1EFE8', borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: '#E8E6DE' },
  cardEmoji: { fontSize: 28, marginBottom: 8 },
  cardName: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  cardCount: { fontSize: 11, color: '#888780', marginTop: 3 },
});
