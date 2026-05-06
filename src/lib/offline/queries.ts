/**
 * SQLite query helpers for offline data access.
 * Mirror the API response shapes so components work identically online/offline.
 */

import { getDb } from './db';
import { isPackDownloaded } from './packManager';
import type { TaxonCard, TaxonListItem, TaxonRank } from '@/types';

// ── Check if offline data is available ────────────────────────────────────

export async function hasOfflineTaxa(parentId: string | null): Promise<boolean> {
  const db = await getDb();
  const col = parentId ? 'parent_id' : 'parent_id IS NULL AND';
  const result = await db.getFirstAsync<{ count: number }>(
    parentId
      ? `SELECT COUNT(*) as count FROM taxa WHERE parent_id = ?`
      : `SELECT COUNT(*) as count FROM taxa WHERE parent_id IS NULL`,
    parentId ? [parentId] : [],
  );
  return (result?.count ?? 0) > 0;
}

// ── List taxa children (offline) ──────────────────────────────────────────

export async function getOfflineChildren(
  parentId: string,
  locale = 'ru',
): Promise<TaxonListItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT t.id, t.rank, t.scientific_name, t.slug, t.iucn_status,
            t.cover_image_url, t.species_count,
            tt.common_name
     FROM taxa t
     LEFT JOIN taxon_translations tt ON tt.taxon_id = t.id AND tt.locale = ?
     WHERE t.parent_id = ?
     ORDER BY COALESCE(tt.common_name, t.scientific_name)`,
    [locale, parentId],
  );
  return rows.map(rowToListItem);
}

// ── Get kingdoms (offline) ────────────────────────────────────────────────

export async function getOfflineKingdoms(locale = 'ru'): Promise<TaxonListItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT t.id, t.rank, t.scientific_name, t.slug, t.iucn_status,
            t.cover_image_url, t.species_count,
            tt.common_name
     FROM taxa t
     LEFT JOIN taxon_translations tt ON tt.taxon_id = t.id AND tt.locale = ?
     WHERE t.parent_id IS NULL
     ORDER BY COALESCE(tt.common_name, t.scientific_name)`,
    [locale],
  );
  return rows.map(rowToListItem);
}

// ── Get full taxon card (offline) ─────────────────────────────────────────

export async function getOfflineTaxonCard(
  taxonId: string,
  locale = 'ru',
): Promise<TaxonCard | null> {
  const db = await getDb();

  const taxon = await db.getFirstAsync<any>(
    `SELECT t.*, tt.common_name, tt.description, tt.habitat, tt.interesting_facts
     FROM taxa t
     LEFT JOIN taxon_translations tt ON tt.taxon_id = t.id AND tt.locale = ?
     WHERE t.id = ?`,
    [locale, taxonId],
  );
  if (!taxon) return null;

  const attributes = await db.getAllAsync<any>(
    `SELECT key, value, unit FROM taxon_attributes WHERE taxon_id = ?`,
    [taxonId],
  );

  const images = await db.getAllAsync<any>(
    `SELECT id, url_thumb, url_medium, is_cover FROM taxon_images
     WHERE taxon_id = ? ORDER BY is_cover DESC, sort_order`,
    [taxonId],
  );

  return {
    id: taxon.id,
    rank: taxon.rank as TaxonRank,
    scientific_name: taxon.scientific_name,
    slug: taxon.slug,
    author: null,
    year_described: null,
    common_name: taxon.common_name ?? null,
    iucn_status: taxon.iucn_status ?? null,
    cover_image_url: taxon.cover_image_url ?? null,
    species_count: taxon.species_count ?? 0,
    translation: {
      locale,
      common_name: taxon.common_name ?? null,
      description: taxon.description ?? null,
      habitat: taxon.habitat ?? null,
      diet: null,
      interesting_facts: taxon.interesting_facts ?? null,
    },
    images: images.map(img => ({
      id: img.id,
      url_full: img.url_medium, // offline uses medium as "full"
      url_medium: img.url_medium,
      url_thumb: img.url_thumb,
      caption: null,
      photographer: null,
      license: null,
      is_cover: img.is_cover === 1,
    })),
    attributes: attributes.map(a => ({
      key: a.key,
      value: a.value,
      unit: a.unit ?? null,
    })),
    breadcrumb: [], // breadcrumb not available offline (simplified)
  };
}

// ── Offline search ────────────────────────────────────────────────────────

export async function searchOffline(
  query: string,
  locale = 'ru',
): Promise<TaxonListItem[]> {
  const db = await getDb();
  const q = `%${query}%`;
  const rows = await db.getAllAsync<any>(
    `SELECT t.id, t.rank, t.scientific_name, t.slug, t.iucn_status,
            t.cover_image_url, t.species_count,
            tt.common_name
     FROM taxa t
     LEFT JOIN taxon_translations tt ON tt.taxon_id = t.id AND tt.locale = ?
     WHERE tt.common_name LIKE ? OR t.scientific_name LIKE ?
     ORDER BY
       CASE WHEN tt.common_name LIKE ? THEN 0 ELSE 1 END,
       COALESCE(tt.common_name, t.scientific_name)
     LIMIT 30`,
    [locale, q, q, q],
  );
  return rows.map(rowToListItem);
}

// ── Helper ────────────────────────────────────────────────────────────────

function rowToListItem(row: any): TaxonListItem {
  return {
    id: row.id,
    rank: row.rank as TaxonRank,
    scientific_name: row.scientific_name,
    slug: row.slug,
    common_name: row.common_name ?? null,
    cover_image_url: row.cover_image_url ?? null,
    species_count: row.species_count ?? 0,
  };
}
