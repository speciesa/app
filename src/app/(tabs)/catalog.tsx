import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useTaxaByRank, useTaxonChildren } from '@/hooks/useApi';
import type { TaxonListItem, TaxonRank } from '@/types';
import { RANK_LABELS_RU, RANK_ORDER } from '@/types';
import { t } from '@/i18n';

const RANK_BG: Record<string, string> = {
  kingdom: '#E1F5EE', phylum: '#EAF3DE', class: '#C0DD97',
  order: '#97C459', family: '#639922', genus: '#3B6D11', species: '#085041',
};

function TaxonRow({ item, onPress }: { item: TaxonListItem; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.thumb, { backgroundColor: RANK_BG[item.rank] ?? '#EAF3DE' }]}>
        {item.cover_image_url ? (
          <Image source={{ uri: item.cover_image_url }} style={styles.thumbImg} contentFit="cover" />
        ) : (
          <Text style={styles.thumbEmoji}>🌿</Text>
        )}
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.commonName} numberOfLines={1}>
          {item.common_name ?? item.scientific_name}
        </Text>
        <Text style={styles.latinName} numberOfLines={1}>{item.scientific_name}</Text>
        <Text style={styles.countText}>{item.species_count.toLocaleString()} видов</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function CatalogScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taxon_id?: string; rank?: TaxonRank; breadcrumb?: string }>();
  const isRoot = !params.taxon_id;

  const rankQuery = useTaxaByRank('kingdom', 'ru');
  const childrenQuery = useTaxonChildren(params.taxon_id ?? '', 'ru', !isRoot);
console.log('rankQuery', {
  data: rankQuery.data,
  error: rankQuery.error,
  status: rankQuery.status,
  isFetching: rankQuery.isFetching,
});
console.log('childrenQuery', {
  data: childrenQuery.data,
  error: childrenQuery.error,
  status: childrenQuery.status,
});
  const query = isRoot ? rankQuery : childrenQuery;
  const items: TaxonListItem[] = query.data?.data ?? [];
  const breadcrumb: TaxonListItem[] = params.breadcrumb ? JSON.parse(params.breadcrumb) : [];

  const handlePress = (item: TaxonListItem) => {
    if (item.rank === 'species') {
      router.push(`/taxon/${item.id}`);
      return;
    }
    const nextBreadcrumb = [...breadcrumb, item];
    router.push({
      pathname: '/(tabs)/catalog',
      params: {
        taxon_id: item.id,
        rank: item.rank,
        breadcrumb: JSON.stringify(nextBreadcrumb),
      },
    });
  };

  const currentRankIdx = params.rank ? RANK_ORDER.indexOf(params.rank) : 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Rank bar */}
      <View style={styles.rankBar}>
        {RANK_ORDER.map((r, i) => (
          <View key={r} style={[styles.rankPill, i === currentRankIdx && styles.rankPillActive]}>
            <Text style={[styles.rankPillText, i === currentRankIdx && styles.rankPillTextActive]}>
              {RANK_LABELS_RU[r]}
            </Text>
          </View>
        ))}
      </View>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
            <Text style={styles.bcItem}>Все</Text>
          </TouchableOpacity>
          {breadcrumb.map((bc, i) => (
            <View key={bc.id} style={styles.bcRow}>
              <Text style={styles.bcSep}>›</Text>
              <Text
                style={[styles.bcItem, i === breadcrumb.length - 1 && styles.bcItemActive]}
                onPress={() => {
                  router.push({
                    pathname: '/(tabs)/catalog',
                    params: {
                      taxon_id: bc.id,
                      rank: bc.rank,
                      breadcrumb: JSON.stringify(breadcrumb.slice(0, i)),
                    },
                  });
                }}
              >
                {bc.common_name ?? bc.scientific_name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {query.isLoading && <ActivityIndicator style={styles.loader} color="#1D9E75" />}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaxonRow item={item} onPress={() => handlePress(item)} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  rankBar: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, gap: 6, backgroundColor: '#F1EFE8', flexWrap: 'wrap' },
  rankPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 0.5, borderColor: '#C5C3BB', backgroundColor: '#FAFAF8' },
  rankPillActive: { backgroundColor: '#1D9E75', borderColor: '#1D9E75' },
  rankPillText: { fontSize: 10, color: '#5F5E5A' },
  rankPillTextActive: { color: '#fff', fontWeight: '600' },
  breadcrumb: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', flexWrap: 'wrap', borderBottomWidth: 0.5, borderBottomColor: '#E8E6DE', backgroundColor: '#F1EFE8' },
  bcRow: { flexDirection: 'row', alignItems: 'center' },
  bcSep: { fontSize: 12, color: '#888780', marginHorizontal: 4 },
  bcItem: { fontSize: 12, color: '#5F5E5A' },
  bcItemActive: { color: '#2C2C2A', fontWeight: '500' },
  loader: { marginTop: 40 },
  list: { paddingBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#E8E6DE', backgroundColor: '#FAFAF8' },
  thumb: { width: 46, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden', flexShrink: 0 },
  thumbImg: { width: 46, height: 46 },
  thumbEmoji: { fontSize: 22 },
  rowBody: { flex: 1 },
  commonName: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  latinName: { fontSize: 11, color: '#888780', fontStyle: 'italic', marginTop: 1 },
  countText: { fontSize: 11, color: '#AAA89E', marginTop: 2 },
  chevron: { fontSize: 18, color: '#C5C3BB' },
});
