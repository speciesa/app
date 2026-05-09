import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSearch } from '@/hooks/useApi';
import type { SearchResult, TaxonRank } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/i18n';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  const { data, isLoading } = useSearch(debouncedQ);

  const handleChange = (text: string) => {
    setQuery(text);

    clearTimeout((handleChange as any)._t);
    (handleChange as any)._t = setTimeout(() => {
      setDebouncedQ(text);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.input}
          placeholder={t('search.placeholder')}
          placeholderTextColor="#AAA89E"
          value={query}
          onChangeText={handleChange}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery('');
              setDebouncedQ('');
            }}
          >
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <ActivityIndicator style={styles.loader} color="#1D9E75" />
      )}

      {!isLoading &&
        debouncedQ &&
        data?.results.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {t('search.no_results')}
            </Text>
            <Text style={styles.emptySubText}>
              {t('errors.retry')}
            </Text>
          </View>
        )}

      <FlatList
        data={data?.results ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchRow
            item={item}
            onPress={() => router.push(`/taxon/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}


// ── Row ─────────────────────────────────────────────────────────────────────

function SearchRow({
  item,
  onPress,
}: {
  item: SearchResult;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.thumb}>
        {item.cover_image_url ? (
          <Image
            source={{ uri: item.cover_image_url }}
            style={styles.thumbImg}
            contentFit="cover"
          />
        ) : (
          <Text style={styles.thumbEmoji}>🌿</Text>
        )}
      </View>

      <View style={styles.rowBody}>
        <Text style={styles.name} numberOfLines={1}>
          {item.common_name ?? item.scientific_name}
        </Text>

        <Text style={styles.latin} numberOfLines={1}>
          {item.scientific_name}
        </Text>

        <Text style={styles.rank}>
          {t(`rank.${item.rank as TaxonRank}`)}
        </Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}


// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 14,
    backgroundColor: '#F1EFE8',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },

  searchIcon: { fontSize: 16 },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#2C2C2A',
  },

  clearBtn: {
    fontSize: 14,
    color: '#888780',
    padding: 4,
  },

  loader: {
    marginTop: 20,
  },

  empty: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyText: {
    fontSize: 16,
    color: '#5F5E5A',
    fontWeight: '500',
  },

  emptySubText: {
    fontSize: 13,
    color: '#888780',
    marginTop: 6,
  },

  list: {
    paddingBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8E6DE',
  },

  thumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EAF3DE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },

  thumbImg: {
    width: 44,
    height: 44,
  },

  thumbEmoji: {
    fontSize: 20,
  },

  rowBody: {
    flex: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2A',
  },

  latin: {
    fontSize: 11,
    color: '#888780',
    fontStyle: 'italic',
    marginTop: 1,
  },

  rank: {
    fontSize: 11,
    color: '#1D9E75',
    marginTop: 2,
  },

  chevron: {
    fontSize: 18,
    color: '#C5C3BB',
  },
});