import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import ru from './locales/ru';
import en from './locales/en';

const i18n = new I18n({ ru, en });
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
export const t = (key: string, opts?: object) => i18n.t(key, opts);
