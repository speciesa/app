import { useLangStore } from '@/store/langStore';
import { resolveAppLanguage } from './resolveAppLanguage';

export const initLanguage = () => {
  const store = useLangStore.getState();

  const deviceLang = resolveAppLanguage();

  // only used if user never picked language
  store.hydrateFromDevice(deviceLang);

  return store.lang ?? deviceLang;
};