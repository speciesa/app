import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  MeResponse, OfflinePack, SearchResponse,
  TaxonCard, TaxonListResponse, TaxonRank,
} from '@/types';

// ── Taxa ───────────────────────────────────────────────────────────────────

export const useTaxaByRank = (rank: TaxonRank, locale = 'ru') =>
  useQuery<TaxonListResponse>({
    queryKey: ['taxa', 'rank', rank, locale],
    queryFn: () => api.get('/taxa', { params: { rank, locale } }).then(r => r.data),
    staleTime: 1000 * 60 * 10,
  });

export const useTaxonChildren = (taxonId: string, locale = 'ru', enabled = true) =>
  useQuery<TaxonListResponse>({
    queryKey: ['taxa', taxonId, 'children', locale],
    queryFn: () => api.get(`/taxa/${taxonId}/children`, { params: { locale } }).then(r => r.data),
    enabled,
    staleTime: 1000 * 60 * 10,
  });

export const useTaxonCard = (taxonId: string, locale = 'ru') =>
  useQuery<TaxonCard>({
    queryKey: ['taxa', taxonId, locale],
    queryFn: () => api.get(`/taxa/${taxonId}`, { params: { locale } }).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  });

// ── Search ─────────────────────────────────────────────────────────────────

export const useSearch = (query: string, locale = 'ru', enabled = true) =>
  useQuery<SearchResponse>({
    queryKey: ['search', query, locale],
    queryFn: () => api.get('/search', { params: { q: query, locale } }).then(r => r.data),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 2,
  });

// ── Packs ──────────────────────────────────────────────────────────────────

export const usePacks = () =>
  useQuery<OfflinePack[]>({
    queryKey: ['packs'],
    queryFn: () => api.get('/packs').then(r => r.data),
    staleTime: 1000 * 60 * 30,
  });

// ── Me ─────────────────────────────────────────────────────────────────────

export const useMe = (enabled = true) =>
  useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: () => api.get('/me').then(r => r.data),
    enabled,
    retry: false,
  });

// ── Auth ───────────────────────────────────────────────────────────────────

export const useRegister = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string; locale?: string }) =>
      api.post('/auth/register', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });
};

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post('/auth/login', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });
};

// ── Collections ────────────────────────────────────────────────────────────

export const useCollections = (enabled = true) =>
  useQuery({
    queryKey: ['collections'],
    queryFn: () => api.get('/me/collections').then(r => r.data),
    enabled,
  });

export const useCreateCollection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api.post('/me/collections', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  });
};

export const useAddToCollection = (collectionId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { taxon_id: string; notes?: string }) =>
      api.post(`/me/collections/${collectionId}/items`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  });
};
