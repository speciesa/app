import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { IUCN_COLORS, IUCN_LABELS_RU, RANK_LABELS_RU, RANK_ORDER } from '@/types';
import type { IucnStatus, TaxonListItem, TaxonRank } from '@/types';

// ── TaxonRow ───────────────────────────────────────────────────────────────

const RANK_BG: Record<TaxonRank, string> = {
  kingdom: '#E1F5EE', phylum: '#EAF3DE', class: '#C0DD97',
  order: '#97C459',  family: '#639922',  genus: '#3B6D11', species: '#085041',
};

interface TaxonRowProps {
  item: TaxonListItem;
  onPress: () => void;
  showRank?: boolean;
}

export function TaxonRow({ item, onPress, showRank = false }: TaxonRowProps) {
  return (
    <TouchableOpacity style={rowStyles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[rowStyles.thumb, { backgroundColor: RANK_BG[item.rank] }]}>
        {item.cover_image_url ? (
          <Image
            source={{ uri: item.cover_image_url }}
            style={rowStyles.thumbImg}
            contentFit="cover"
          />
        ) : (
          <Text style={rowStyles.thumbEmoji}>🌿</Text>
        )}
      </View>

      <View style={rowStyles.body}>
        <Text style={rowStyles.name} numberOfLines={1}>
          {item.common_name ?? item.scientific_name}
        </Text>
        <Text style={rowStyles.latin} numberOfLines={1}>{item.scientific_name}</Text>
        <View style={rowStyles.meta}>
          {showRank && (
            <Text style={rowStyles.rankLabel}>{RANK_LABELS_RU[item.rank]}</Text>
          )}
          {item.species_count > 1 && (
            <Text style={rowStyles.count}>{item.species_count.toLocaleString()} видов</Text>
          )}
        </View>
      </View>

      <Text style={rowStyles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#E8E6DE', backgroundColor: '#FAFAF8' },
  thumb: { width: 46, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden', flexShrink: 0 },
  thumbImg: { width: 46, height: 46 },
  thumbEmoji: { fontSize: 22 },
  body: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  latin: { fontSize: 11, color: '#888780', fontStyle: 'italic', marginTop: 1 },
  meta: { flexDirection: 'row', gap: 8, marginTop: 3, alignItems: 'center' },
  rankLabel: { fontSize: 10, color: '#1D9E75', fontWeight: '600' },
  count: { fontSize: 11, color: '#AAA89E' },
  chevron: { fontSize: 18, color: '#C5C3BB' },
});


// ── BreadcrumbBar ──────────────────────────────────────────────────────────

interface BreadcrumbBarProps {
  breadcrumb: TaxonListItem[];
  onTapRoot: () => void;
  onTapCrumb: (item: TaxonListItem, index: number) => void;
}

export function BreadcrumbBar({ breadcrumb, onTapRoot, onTapCrumb }: BreadcrumbBarProps) {
  if (breadcrumb.length === 0) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={bcStyles.bar}
      contentContainerStyle={bcStyles.content}
    >
      <TouchableOpacity onPress={onTapRoot}>
        <Text style={bcStyles.item}>Все</Text>
      </TouchableOpacity>
      {breadcrumb.map((bc, i) => (
        <View key={bc.id} style={bcStyles.crumb}>
          <Text style={bcStyles.sep}>›</Text>
          <TouchableOpacity onPress={() => onTapCrumb(bc, i)}>
            <Text style={[bcStyles.item, i === breadcrumb.length - 1 && bcStyles.active]}>
              {bc.common_name ?? bc.scientific_name}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const bcStyles = StyleSheet.create({
  bar: { backgroundColor: '#F1EFE8', borderBottomWidth: 0.5, borderBottomColor: '#E8E6DE', maxHeight: 36 },
  content: { paddingHorizontal: 14, alignItems: 'center', paddingVertical: 8, gap: 2 },
  crumb: { flexDirection: 'row', alignItems: 'center' },
  sep: { fontSize: 12, color: '#888780', marginHorizontal: 4 },
  item: { fontSize: 12, color: '#5F5E5A' },
  active: { color: '#2C2C2A', fontWeight: '500' },
});


// ── RankBar ────────────────────────────────────────────────────────────────

interface RankBarProps {
  currentRank: TaxonRank | null;
}

export function RankBar({ currentRank }: RankBarProps) {
  const currentIdx = currentRank ? RANK_ORDER.indexOf(currentRank) : 0;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={rankStyles.bar}
      contentContainerStyle={rankStyles.content}
    >
      {RANK_ORDER.map((rank, i) => (
        <View key={rank} style={[rankStyles.pill, i === currentIdx && rankStyles.pillActive]}>
          <Text style={[rankStyles.text, i === currentIdx && rankStyles.textActive]}>
            {RANK_LABELS_RU[rank]}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const rankStyles = StyleSheet.create({
  bar: { backgroundColor: '#F1EFE8', maxHeight: 38 },
  content: { paddingHorizontal: 12, paddingVertical: 7, gap: 6, alignItems: 'center' },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 0.5, borderColor: '#C5C3BB', backgroundColor: '#FAFAF8' },
  pillActive: { backgroundColor: '#1D9E75', borderColor: '#1D9E75' },
  text: { fontSize: 10, color: '#5F5E5A', whiteSpace: 'nowrap' },
  textActive: { color: '#fff', fontWeight: '600' },
});


// ── IucnBadge ──────────────────────────────────────────────────────────────

export function IucnBadge({ status }: { status: IucnStatus }) {
  const color = IUCN_COLORS[status];
  const label = IUCN_LABELS_RU[status];
  return (
    <View style={[iucnStyles.pill, { borderColor: color }]}>
      <View style={[iucnStyles.dot, { backgroundColor: color }]} />
      <Text style={[iucnStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const iucnStyles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(241,239,232,0.92)', borderWidth: 0.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontSize: 11, fontWeight: '600' },
});
