import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Image } from 'expo-image';

import { useTaxonCard } from '@/hooks/useApi';
import { IUCN_COLORS } from '@/types';
import type { TaxonRank } from '@/types';

import { t } from '@/i18n';
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
        <Text style={styles.errorText}>
          {t('errors.not_found')}
        </Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.retryText}>
            {t('errors.retry')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const coverImage =
    taxon.images.find((img) => img.is_cover) ?? taxon.images[0];

  const iucnColor = taxon.iucn_status
    ? IUCN_COLORS[taxon.iucn_status]
    : '#3B6D11';

  const iucnLabel = taxon.iucn_status
    ? t(`iucn.${taxon.iucn_status}`)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            Share.share({
              title: taxon.scientific_name,
              message: taxon.scientific_name,
            })
          }
        >
          <Text style={styles.iconBtnText}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          {coverImage ? (
            <Image
              source={{ uri: coverImage.url_medium }}
              style={styles.heroImg}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.heroImg, styles.heroPlaceholder]}>
              <Text style={styles.heroEmoji}>🌿</Text>
            </View>
          )}

          {iucnLabel && (
            <View
              style={[
                styles.iucnPill,
                { borderColor: iucnColor },
              ]}
            >
              <View
                style={[
                  styles.iucnDot,
                  { backgroundColor: iucnColor },
                ]}
              />
              <Text
                style={[
                  styles.iucnText,
                  { color: iucnColor },
                ]}
              >
                {iucnLabel}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Name */}
          <View style={styles.nameBlock}>
            <Text style={styles.commonName}>
              {taxon.translation?.common_name ??
                taxon.scientific_name}
            </Text>

            <Text style={styles.latinName}>
              {taxon.scientific_name}
            </Text>

            {taxon.author && (
              <Text style={styles.author}>
                {taxon.author}
              </Text>
            )}
          </View>

          {/* Attributes */}
          {taxon.attributes.length > 0 && (
            <View style={styles.attrGrid}>
              {taxon.attributes.map((a) => (
                <View key={a.key} style={styles.attrCard}>
                  <Text style={styles.attrVal}>
                    {a.value}
                    {a.unit ? ` ${a.unit}` : ''}
                  </Text>
                  <Text style={styles.attrKey}>
                    {a.key.replace(/_/g, ' ')}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          {taxon.translation?.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('species.description')}
              </Text>
              <Text style={styles.descText}>
                {taxon.translation.description}
              </Text>
            </View>
          )}

          {/* Habitat */}
          {taxon.translation?.habitat && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('species.habitat')}
              </Text>
              <Text style={styles.descText}>
                {taxon.translation.habitat}
              </Text>
            </View>
          )}

          {/* Facts */}
          {taxon.translation?.interesting_facts && (
            <View style={[styles.section, styles.factsBox]}>
              <Text style={styles.sectionTitle}>
                {t('species.related')}
              </Text>
              <Text style={styles.descText}>
                {taxon.translation.interesting_facts}
              </Text>
            </View>
          )}

          {/* Classification */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('species.classification')}
            </Text>

            <View style={styles.classifBox}>
              {taxon.breadcrumb.map((bc) => (
                <TouchableOpacity
                  key={bc.id}
                  style={styles.classifRow}
                  onPress={() =>
                    router.push(`/taxon/${bc.id}`)
                  }
                >
                  <Text style={styles.classifKey}>
                    {t(`rank.${bc.rank as TaxonRank}`)}
                  </Text>

                  <View style={styles.classifRight}>
                    <Text
                      style={styles.classifVal}
                      numberOfLines={1}
                    >
                      {bc.common_name ??
                        bc.scientific_name}
                    </Text>
                    <Text style={styles.classifChev}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}

              <View
                style={[
                  styles.classifRow,
                  styles.classifRowActive,
                ]}
              >
                <Text style={styles.classifKey}>
                  {t(`rank.${taxon.rank as TaxonRank}`)}
                </Text>

                <Text
                  style={[
                    styles.classifVal,
                    {
                      color: '#1D9E75',
                      fontWeight: '600',
                    },
                  ]}
                >
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
          <Text style={styles.btnSaveText}>
            {t('species.add_to_collection')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnShare}
          onPress={() =>
            Share.share({
              message: `${taxon.scientific_name} — Speciesa`,
            })
          }
        >
          <Text style={styles.btnShareText}>
            {t('species.share')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}