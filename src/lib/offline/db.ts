import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('speciesa_offline.db');
  await initSchema(_db);
  return _db;
}

async function initSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS taxa (
      id TEXT PRIMARY KEY,
      rank TEXT NOT NULL,
      parent_id TEXT,
      scientific_name TEXT NOT NULL,
      slug TEXT NOT NULL,
      iucn_status TEXT,
      cover_image_url TEXT,
      species_count INTEGER DEFAULT 0,
      pack_id TEXT NOT NULL,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS taxon_translations (
      id TEXT PRIMARY KEY,
      taxon_id TEXT NOT NULL,
      locale TEXT NOT NULL,
      common_name TEXT,
      description TEXT,
      habitat TEXT,
      interesting_facts TEXT,
      UNIQUE(taxon_id, locale),
      FOREIGN KEY(taxon_id) REFERENCES taxa(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS taxon_attributes (
      id TEXT PRIMARY KEY,
      taxon_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      unit TEXT,
      FOREIGN KEY(taxon_id) REFERENCES taxa(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS taxon_images (
      id TEXT PRIMARY KEY,
      taxon_id TEXT NOT NULL,
      url_thumb TEXT NOT NULL,
      url_medium TEXT NOT NULL,
      is_cover INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY(taxon_id) REFERENCES taxa(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS downloaded_packs (
      pack_id TEXT PRIMARY KEY,
      downloaded_at TEXT NOT NULL,
      manifest_version INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_taxa_parent ON taxa(parent_id);
    CREATE INDEX IF NOT EXISTS idx_taxa_pack ON taxa(pack_id);
    CREATE INDEX IF NOT EXISTS idx_taxa_slug ON taxa(slug);
    CREATE INDEX IF NOT EXISTS idx_translations_taxon ON taxon_translations(taxon_id);
    CREATE VIRTUAL TABLE IF NOT EXISTS taxa_fts USING fts5(
      taxon_id UNINDEXED, common_name, scientific_name,
      content='', contentless_delete=1
    );
  `);
}

export async function closeDb(): Promise<void> {
  if (_db) {
    await _db.closeAsync();
    _db = null;
  }
}
