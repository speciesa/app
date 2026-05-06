import { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePacks } from '@/hooks/useApi';
import { downloadPack, deletePack, isPackDownloaded, type DownloadProgress } from '@/lib/offline/packManager';
import type { OfflinePack } from '@/types';
import { Button, TaxonListSkeleton } from '@/components/ui';

export default function OfflinePacksScreen() {
  const { data: packs, isLoading } = usePacks();
  const [progress, setProgress] = useState<Record<string, DownloadProgress>>({});

  const handleDownload = async (pack: OfflinePack) => {
    try {
      await downloadPack(pack.id, (p) => {
        setProgress(prev => ({ ...prev, [pack.id]: p }));
      });
    } catch (err: any) {
      Alert.alert('Ошибка загрузки', err.message ?? 'Попробуйте снова');
    }
  };

  const handleDelete = (pack: OfflinePack) => {
    Alert.alert(
      'Удалить пакет?',
      `Пакет «${pack.name_ru}» будет удалён с устройства.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить', style: 'destructive',
          onPress: async () => {
            await deletePack(pack.id);
            setProgress(prev => { const n = { ...prev }; delete n[pack.id]; return n; });
          },
        },
      ],
    );
  };

  if (isLoading) return <TaxonListSkeleton />;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <Text style={s.title}>Офлайн-пакеты</Text>
      <Text style={s.subtitle}>Скачайте разделы для работы без интернета</Text>

      <FlatList
        data={packs ?? []}
        keyExtractor={p => p.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <PackCard
            pack={item}
            progress={progress[item.id]}
            onDownload={() => handleDownload(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

function PackCard({
  pack, progress, onDownload, onDelete,
}: {
  pack: OfflinePack;
  progress?: DownloadProgress;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const downloaded = isPackDownloaded(pack.id);
  const isDownloading = progress && progress.phase !== 'done' && progress.phase !== 'error';
  const progressPct = isDownloading && progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={s.cardInfo}>
          <Text style={s.packName}>{pack.name_ru}</Text>
          <Text style={s.packMeta}>
            {pack.species_count} видов · ~{pack.size_mb_estimate} МБ
          </Text>
        </View>
        <Text style={s.price}>{pack.price_eur.toFixed(2)} €</Text>
      </View>

      {isDownloading && (
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${progressPct}%` }]} />
        </View>
      )}
      {isDownloading && (
        <Text style={s.progressText}>
          {progress!.phase === 'taxa' ? `Загрузка видов: ${progress!.current}/${progress!.total}` :
           progress!.phase === 'images' ? `Загрузка фото: ${progress!.current}/${progress!.total}` :
           'Загрузка...'}
        </Text>
      )}

      <View style={s.cardActions}>
        {downloaded ? (
          <>
            <View style={s.downloadedBadge}>
              <Text style={s.downloadedText}>✓ Загружено</Text>
            </View>
            <TouchableOpacity onPress={onDelete} style={s.deleteBtn}>
              <Text style={s.deleteBtnText}>Удалить</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Button
            label={isDownloading ? `${progressPct}%` : 'Скачать'}
            onPress={onDownload}
            loading={!!isDownloading}
            style={s.downloadBtn}
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  title: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', paddingHorizontal: 16, paddingTop: 16 },
  subtitle: { fontSize: 13, color: '#888780', paddingHorizontal: 16, marginTop: 4, marginBottom: 16 },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#F1EFE8', borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: '#E8E6DE' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardInfo: { flex: 1 },
  packName: { fontSize: 15, fontWeight: '500', color: '#2C2C2A' },
  packMeta: { fontSize: 12, color: '#888780', marginTop: 3 },
  price: { fontSize: 16, fontWeight: '500', color: '#085041' },
  progressBar: { height: 4, backgroundColor: '#E8E6DE', borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: '#1D9E75', borderRadius: 2 },
  progressText: { fontSize: 11, color: '#888780', marginBottom: 8 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  downloadBtn: { flex: 1 },
  downloadedBadge: { flex: 1, padding: 10, backgroundColor: '#EAF3DE', borderRadius: 10, alignItems: 'center' },
  downloadedText: { fontSize: 13, color: '#3B6D11', fontWeight: '500' },
  deleteBtn: { padding: 10 },
  deleteBtnText: { fontSize: 13, color: '#993C1D' },
});
