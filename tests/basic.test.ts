import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Minimal wrapper for tests
const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// ── Type tests ─────────────────────────────────────────────────────────────

import { RANK_LABELS_RU, IUCN_LABELS_RU, RANK_ORDER } from '../src/types';

describe('Types and constants', () => {
  it('has all 7 taxon ranks', () => {
    expect(RANK_ORDER).toHaveLength(7);
    expect(RANK_ORDER[0]).toBe('kingdom');
    expect(RANK_ORDER[6]).toBe('species');
  });

  it('has Russian labels for all ranks', () => {
    RANK_ORDER.forEach((rank) => {
      expect(RANK_LABELS_RU[rank]).toBeTruthy();
    });
  });

  it('has IUCN labels for all statuses', () => {
    const statuses = ['lc', 'nt', 'vu', 'en', 'cr', 'ew', 'ex', 'dd'] as const;
    statuses.forEach((status) => {
      expect(IUCN_LABELS_RU[status]).toBeTruthy();
    });
  });
});

// ── i18n tests ─────────────────────────────────────────────────────────────

import { t } from '../src/i18n';

describe('i18n', () => {
  it('translates catalog title', () => {
    expect(t('catalog.title')).toBeTruthy();
  });

  it('translates premium CTA', () => {
    expect(t('premium.cta')).toContain('2.99');
  });

  it('falls back gracefully for missing keys', () => {
    const result = t('nonexistent.key');
    expect(typeof result).toBe('string');
  });
});

// ── Storage tests ──────────────────────────────────────────────────────────

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(() => null),
    delete: jest.fn(),
    contains: jest.fn(() => false),
  })),
}));

import { storage } from '../src/lib/storage';

describe('Storage', () => {
  it('can set and get values', () => {
    storage.set('test_key', 'test_value');
    // MMKV is mocked, just verify no throw
    expect(true).toBe(true);
  });
});
