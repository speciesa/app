/**
 * Tests for offline pack manager and SQLite queries.
 */

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => {
    const store: Record<string, string> = {};
    return {
      set: jest.fn((k: string, v: string) => { store[k] = v; }),
      getString: jest.fn((k: string) => store[k] ?? null),
      delete: jest.fn((k: string) => { delete store[k]; }),
      contains: jest.fn((k: string) => k in store),
    };
  }),
}));

jest.mock('expo-file-system');
jest.mock('expo-sqlite');

import { isPackDownloaded, getDownloadedPackIds } from '../src/lib/offline/packManager';

describe('Pack Manager', () => {
  it('reports pack as not downloaded initially', () => {
    expect(isPackDownloaded('nonexistent-pack-id')).toBe(false);
  });

  it('returns empty list of downloaded packs initially', () => {
    expect(getDownloadedPackIds()).toEqual([]);
  });
});

describe('Offline queries', () => {
  it('getOfflineKingdoms returns empty array when DB is empty', async () => {
    const { getOfflineKingdoms } = require('../src/lib/offline/queries');
    const result = await getOfflineKingdoms();
    expect(Array.isArray(result)).toBe(true);
  });

  it('getOfflineTaxonCard returns null for unknown ID', async () => {
    const { getOfflineTaxonCard } = require('../src/lib/offline/queries');
    const result = await getOfflineTaxonCard('00000000-0000-0000-0000-000000000000');
    expect(result).toBeNull();
  });

  it('searchOffline returns empty array for no matches', async () => {
    const { searchOffline } = require('../src/lib/offline/queries');
    const results = await searchOffline('xyznotfound');
    expect(results).toEqual([]);
  });
});
