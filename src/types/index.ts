export type TaxonRank =
  | 'kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'genus' | 'species';

export type IucnStatus = 'lc' | 'nt' | 'vu' | 'en' | 'cr' | 'ew' | 'ex' | 'dd';

export interface TaxonListItem {
  id: string;
  rank: TaxonRank;
  scientific_name: string;
  slug: string;
  common_name: string | null;
  cover_image_url: string | null;
  species_count: number;
}

export interface TaxonTranslation {
  locale: string;
  common_name: string | null;
  description: string | null;
  habitat: string | null;
  diet: string | null;
  interesting_facts: string | null;
}

export interface TaxonImage {
  id: string;
  url_full: string;
  url_medium: string;
  url_thumb: string;
  caption: string | null;
  photographer: string | null;
  license: string | null;
  is_cover: boolean;
}

export interface TaxonAttribute {
  key: string;
  value: string;
  unit: string | null;
}

export interface TaxonCard extends TaxonListItem {
  author: string | null;
  year_described: number | null;
  iucn_status: IucnStatus | null;
  translation: TaxonTranslation | null;
  images: TaxonImage[];
  attributes: TaxonAttribute[];
  breadcrumb: TaxonListItem[];
}

export interface ListMeta {
  total: number;
  page: number;
  per_page: number;
}

export interface TaxonListResponse {
  data: TaxonListItem[];
  meta: ListMeta;
}

export interface SearchResult extends TaxonListItem {
  match_type: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

export interface OfflinePack {
  id: string;
  slug: string;
  name_ru: string;
  name_en: string;
  description_ru: string | null;
  description_en: string | null;
  price_eur: number;
  size_mb_estimate: number;
  species_count: number;
  cover_image_url: string | null;
  store_product_id_ios: string | null;
  store_product_id_android: string | null;
}

export interface User {
  id: string;
  email: string;
  locale: string;
}

export interface Subscription {
  plan: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  trial_ends_at: string | null;
  current_period_end: string | null;
}

export interface MeResponse extends User {
  subscription: Subscription | null;
  purchased_pack_ids: string[];
}

export const RANK_LABELS_RU: Record<TaxonRank, string> = {
  kingdom: 'Царство',
  phylum: 'Тип / Отдел',
  class: 'Класс',
  order: 'Порядок',
  family: 'Семейство',
  genus: 'Род',
  species: 'Вид',
};

export const RANK_ORDER: TaxonRank[] = [
  'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species',
];

export const IUCN_LABELS_RU: Record<IucnStatus, string> = {
  lc: 'Наим. угрожаемый',
  nt: 'Близко к угрозе',
  vu: 'Уязвимый',
  en: 'Под угрозой',
  cr: 'Критически',
  ew: 'Исчезнувший в дикой природе',
  ex: 'Вымерший',
  dd: 'Недостаточно данных',
};

export const IUCN_COLORS: Record<IucnStatus, string> = {
  lc: '#3B6D11', nt: '#854F0B', vu: '#993C1D',
  en: '#7B0C0C', cr: '#4A0000', ew: '#5B2782', ex: '#1A1A1A', dd: '#666660',
};
