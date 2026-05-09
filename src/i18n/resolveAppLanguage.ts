import { SUPPORTED_LANGS, AppLang } from './types';
import { getDeviceLanguage } from './deviceLocale';

export const resolveAppLanguage = (): AppLang => {
  const deviceLang = getDeviceLanguage();

  // 1. device language if supported
  if (SUPPORTED_LANGS.includes(deviceLang as AppLang)) {
    return deviceLang as AppLang;
  }

  // 2. fallback EN
  return 'en';
};