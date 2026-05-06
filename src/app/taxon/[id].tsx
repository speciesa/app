import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Share,
} from 'react-native';
import { Image } from 'expo-image';
import { useTaxonCard } from '@/hooks/useApi';
import { IUCN_COLORS, IUCN_LABELS_RU, RANK_LABELS_RU, type TaxonRank } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TaxonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: taxon, isLoading, isError } = useTaxonCard(id ?? '');

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1D9E75" />
      </View>
    );
  }

  if (isError || !taxon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Не найдено</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.retryText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const coverImage = taxon.images.find(img => img.is_cover) ?? taxon.images[0];
  const iucnColor = taxon.iucn_status ? IUCN_COLORS[taxon.iucn_status] : '#3B6D11';
  const iucnLabel = taxon.iucn_status ? IUCN_LABELS_RU[taxon.iucn_status] : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => Share.share({ title: taxon.scientific_name, message: taxon.scientific_name })}
        >
          <Text style={styles.iconBtnText}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero image */}
        <View style={styles.hero}>
          {coverImage ? (
            <Image source={{ uri: coverImage.url_medium }} style={styles.heroImg} contentFit="cover" />
          ) : (
            <View style={[styles.heroImg, styles.heroPlaceholder]}>
              <Text style={styles.heroEmoji}>🌿</Text>
            </View>
          )}
          {iucnLabel && (
            <View style={[styles.iucnPill, { borderColor: iucnColor }]}>
              <View style={[styles.iucnDot, { backgroundColor: iucnColor }]} />
              <Text style={[styles.iucnText, { color: iucnColor }]}>{iucnLabel}</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Name */}
          <View style={styles.nameBlock}>
            <Text style={styles.commonName}>
              {taxon.translation?.common_name ?? taxon.scientific_name}
            </Text>
            <Text style={styles.latinName}>{taxon.scientific_name}</Text>
            {taxon.author && (
              <Text style={styles.author}>{taxon.author}</Text>
            )}
          </View>

          {/* Attributes grid */}
          {taxon.attributes.length > 0 && (
            <View style={styles.attrGrid}>
              {taxon.attributes.map((a) => (
                <View key={a.key} style={styles.attrCard}>
                  <Text style={styles.attrVal}>{a.value}{a.unit ? ` ${a.unit}` : ''}</Text>
                  <Text style={styles.attrKey}>{a.key.replace(/_/g, ' ')}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          {taxon.translation?.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ОПИСАНИЕ</Text>
              <Text style={styles.descText}>{taxon.translation.description}</Text>
            </View>
          )}

          {/* Habitat */}
          {taxon.translation?.habitat && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>АРЕАЛ</Text>
              <Text style={styles.descText}>{taxon.translation.habitat}</Text>
            </View>
          )}

          {/* Fun facts */}
          {taxon.translation?.interesting_facts && (
            <View style={[styles.section, styles.factsBox]}>
              <Text style={styles.sectionTitle}>ИНТЕРЕСНЫЕ ФАКТЫ</Text>
              <Text style={styles.descText}>{taxon.translation.interesting_facts}</Text>
            </View>
          )}

          {/* Classification */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>КЛАССИФИКАЦИЯ</Text>
            <View style={styles.classifBox}>
              {taxon.breadcrumb.map((bc) => (
                <TouchableOpacity
                  key={bc.id}
                  style={styles.classifRow}
                  onPress={() => router.push(`/taxon/${bc.id}`)}
                >
                  <Text style={styles.classifKey}>{RANK_LABELS_RU[bc.rank as TaxonRank]}</Text>
                  <View style={styles.classifRight}>
                    <Text style={styles.classifVal} numberOfLines={1}>
                      {bc.common_name ?? bc.scientific_name}
                    </Text>
                    <Text style={styles.classifChev}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={[styles.classifRow, styles.classifRowActive]}>
                <Text style={styles.classifKey}>{RANK_LABELS_RU[taxon.rank as TaxonRank]}</Text>
                <Text style={[styles.classifVal, { color: '#1D9E75', fontWeight: '600' }]}>
                  {taxon.scientific_name}
                </Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btnSave}>
          <Text style={styles.btnSaveText}>В коллекцию</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnShare}
          onPress={() => Share.share({ message: `${taxon.scientific_name} — Speciesa` })}
        >
          <Text style={styles.btnShareText}>Поделиться</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#5F5E5A', marginBottom: 12 },
  retryText: { fontSize: 14, color: '#1D9E75' },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10 },
  backBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1EFE8', justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 20, color: '#5F5E5A', lineHeight: 22 },
  iconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1EFE8', justifyContent: 'center', alignItems: 'center' },
  iconBtnText: { fontSize: 16, color: '#5F5E5A' },
  hero: { height: 220, backgroundColor: '#C0DD97', position: 'relative' },
  heroImg: { width: '100%', height: 220 },
  heroPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  heroEmoji: { fontSize: 64 },
  iucnPill: { position: 'absolute', bottom: 12, left: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(241,239,232,0.92)', borderWidth: 0.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  iucnDot: { width: 7, height: 7, borderRadius: 4 },
  iucnText: { fontSize: 11, fontWeight: '600' },
  scroll: { paddingBottom: 100 },
  body: { padding: 16 },
  nameBlock: { marginBottom: 14 },
  commonName: { fontSize: 22, fontWeight: '500', color: '#2C2C2A', lineHeight: 28 },
  latinName: { fontSize: 14, color: '#888780', fontStyle: 'italic', marginTop: 3 },
  author: { fontSize: 12, color: '#AAA89E', marginTop: 2 },
  attrGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  attrCard: { backgroundColor: '#F1EFE8', borderRadius: 10, padding: 10, minWidth: '47%', flex: 1 },
  attrVal: { fontSize: 17, fontWeight: '500', color: '#2C2C2A' },
  attrKey: { fontSize: 11, color: '#888780', marginTop: 2 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '500', color: '#888780', letterSpacing: 0.06, marginBottom: 8 },
  descText: { fontSize: 14, color: '#2C2C2A', lineHeight: 22 },
  factsBox: { backgroundColor: '#E1F5EE', borderRadius: 12, padding: 12 },
  classifBox: { backgroundColor: '#F1EFE8', borderRadius: 12, overflow: 'hidden' },
  classifRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: '#E8E6DE' },
  classifRowActive: { borderBottomWidth: 0 },
  classifKey: { fontSize: 12, color: '#888780', width: 90 },
  classifRight: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 },
  classifVal: { fontSize: 13, fontWeight: '500', color: '#2C2C2A', flex: 1, textAlign: 'right' },
  classifChev: { fontSize: 14, color: '#C5C3BB' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 8, padding: 12, backgroundColor: '#FAFAF8', borderTopWidth: 0.5, borderTopColor: '#E8E6DE' },
  btnSave: { flex: 1, padding: 11, borderRadius: 10, backgroundColor: '#F1EFE8', alignItems: 'center' },
  btnSaveText: { fontSize: 13, color: '#2C2C2A' },
  btnShare: { flex: 1, padding: 11, borderRadius: 10, backgroundColor: '#1D9E75', alignItems: 'center' },
  btnShareText: { fontSize: 13, color: '#fff', fontWeight: '500' },
});
