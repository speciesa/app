/**
 * Offline pack download manager.
 * Downloads taxa JSON + images from the manifest and stores in SQLite + filesystem.
 */

import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid'; // or use crypto.randomUUID()
import { api } from '../api';
import { storage } from '../storage';
import { getDb } from './db';
import type { TaxonCard } from '@/types';

const PACKS_DIR = `${FileSystem.documentDirectory}speciesa/packs/`;

export type DownloadProgress = {
  packId: string;
  phase: 'manifest' | 'taxa' | 'images' | 'done' | 'error';
  current: number;
  total: number;
  error?: string;
};

type ProgressCallback = (progress: DownloadProgress) => void;

// ── Helpers ────────────────────────────────────────────────────────────────

function packDir(packId: string): string {
  return `${PACKS_DIR}${packId}/`;
}

function imageDir(packId: string): string {
  return `${packDir(packId)}images/`;
}

function packKey(packId: string): string {
  return `pack_downloaded_${packId}`;
}

export function isPackDownloaded(packId: string): boolean {
  return storage.contains(packKey(packId));
}

export function getDownloadedPackIds(): string[] {
  // MMKV doesn't support prefix listing natively — we store a list separately
  const raw = storage.getString('downloaded_pack_ids');
  return raw ? JSON.parse(raw) : [];
}

function markPackDownloaded(packId: string, version: number): void {
  storage.set(packKey(packId), version.toString());
  const ids = getDownloadedPackIds();
  if (!ids.includes(packId)) {
    storage.set('downloaded_pack_ids', JSON.stringify([...ids, packId]));
  }
}

function markPackRemoved(packId: string): void {
  storage.delete(packKey(packId));
  const ids = getDownloadedPackIds().filter(id => id !== packId);
  storage.set('downloaded_pack_ids', JSON.stringify(ids));
}

// ── Main download function ─────────────────────────────────────────────────

export async function downloadPack(
  packId: string,
  onProgress?: ProgressCallback,
): Promise<void> {
  const report = (phase: DownloadProgress['phase'], current: number, total: number) =>
    onProgress?.({ packId, phase, current, total });

  try {
    // 1. Fetch manifest
    report('manifest', 0, 1);
    const manifest = await api.get(`/packs/${packId}/manifest`).then(r => r.data);
    report('manifest', 1, 1);

    // 2. Create directories
    await FileSystem.makeDirectoryAsync(imageDir(packId), { intermediates: true });

    // 3. Download + store taxa
    const db = await getDb();
    const total = manifest.taxa.length;
    report('taxa', 0, total);

    for (let i = 0; i < manifest.taxa.length; i++) {
      const { id } = manifest.taxa[i];
      // Fetch full taxon card
      try {
        const taxon: TaxonCard = await api.get(`/taxa/${id}?locale=en`).then(r => r.data);
        await storeTaxon(db, taxon, packId);
      } catch {
        // Skip failed individual taxa — don't abort whole download
      }
      report('taxa', i + 1, total);
    }

    // 4. Download images
    const imageEntries = manifest.images.filter((img: any) => img.type === 'cover');
    report('images', 0, imageEntries.length);

    for (let i = 0; i < imageEntries.length; i++) {
      const img = imageEntries[i];
      const localPath = `${imageDir(packId)}${img.taxon_id}_cover.webp`;
      try {
        await FileSystem.downloadAsync(img.url, localPath);
        // Update SQLite with local path
        await db.runAsync(
          `UPDATE taxon_images SET url_medium = ? WHERE taxon_id = ? AND is_cover = 1`,
          [localPath, img.taxon_id],
        );
      } catch {
        // Keep remote URL as fallback
      }
      report('images', i + 1, imageEntries.length);
    }

    // 5. Mark as downloaded
    markPackDownloaded(packId, manifest.version);
    report('done', 1, 1);
  } catch (err: any) {
    onProgress?.({ packId, phase: 'error', current: 0, total: 0, error: err.message });
    throw err;
  }
}

async function storeTaxon(
  db: SQLite.SQLiteDatabase,
  taxon: TaxonCard,
  packId: string,
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO taxa
     (id, rank, parent_id, scientific_name, slug, iucn_status, cover_image_url, species_count, pack_id, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      taxon.id, taxon.rank,
      taxon.breadcrumb[taxon.breadcrumb.length - 1]?.id ?? null,
      taxon.scientific_name, taxon.slug,
      taxon.iucn_status ?? null,
      taxon.cover_image_url ?? null,
      taxon.species_count, packId,
    ],
  );

  if (taxon.translation) {
    await db.runAsync(
      `INSERT OR REPLACE INTO taxon_translations
       (id, taxon_id, locale, common_name, description, habitat, interesting_facts)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        `${taxon.id}_ru`, taxon.id, 'ru',
        taxon.translation.common_name ?? null,
        taxon.translation.description ?? null,
        taxon.translation.habitat ?? null,
        taxon.translation.interesting_facts ?? null,
      ],
    );
  }

  for (const attr of taxon.attributes) {
    await db.runAsync(
      `INSERT OR REPLACE INTO taxon_attributes (id, taxon_id, key, value, unit)
       VALUES (?, ?, ?, ?, ?)`,
      [`${taxon.id}_${attr.key}`, taxon.id, attr.key, attr.value, attr.unit ?? null],
    );
  }

  for (const img of taxon.images) {
    await db.runAsync(
      `INSERT OR REPLACE INTO taxon_images
       (id, taxon_id, url_thumb, url_medium, is_cover, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [img.id, taxon.id, img.url_thumb, img.url_medium, img.is_cover ? 1 : 0, 0],
    );
  }
}

// ── Delete pack ────────────────────────────────────────────────────────────

export async function deletePack(packId: string): Promise<void> {
  const db = await getDb();

  // Delete taxa from SQLite (cascades to translations, images, attributes)
  await db.runAsync(`DELETE FROM taxa WHERE pack_id = ?`, [packId]);

  // Delete local files
  try {
    await FileSystem.deleteAsync(packDir(packId), { idempotent: true });
  } catch {}

  markPackRemoved(packId);
}

// Need to import SQLite type for storeTaxon
import * as SQLite from 'expo-sqlite';
