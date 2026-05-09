import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import ru from './locales/ru';
import en from './locales/en';

import { useLangStore } from '@/store/langStore';
import { AppLang } from './types';

/**
 * i18n instance
 */
const i18n = new I18n({
  ru,
  en,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

/**
 * Resolve best language:
 * 1. user-selected (store)
 * 2. device language
 * 3. fallback EN
 */
const resolveLocale = (): AppLang => {
  const stored = useLangStore.getState().lang;

  if (stored) return stored;

  const deviceLang = Localization.getLocales()[0]?.languageCode;

  if (deviceLang === 'ru' || deviceLang === 'en') {
    return deviceLang;
  }

  return 'en';
};

/**
 * Sync i18n with current state
 * (call this on app start + after language change)
 */
export const syncI18n = () => {
  const locale = resolveLocale();

  i18n.locale = locale;
  return locale;
};

/**
 * Initialize once on app startup
 */
export const initI18n = () => {
  const locale = syncI18n();

  // if store is empty, hydrate it from resolved locale
  const store = useLangStore.getState();
  if (!store.lang) {
    store.setLang(locale);
  }

  return locale;
};

/**
 * Translation helper
 */
export const t = (key: string, opts?: object) => {
  // always keep i18n in sync with latest store value
  const lang = useLangStore.getState().lang;

  if (lang && i18n.locale !== lang) {
    i18n.locale = lang;
  }

  return i18n.t(key, opts);
};

export default i18n;