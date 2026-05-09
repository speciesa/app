export const SUPPORTED_LANGS = ['en', 'ru'] as const;

export type AppLang = (typeof SUPPORTED_LANGS)[number];