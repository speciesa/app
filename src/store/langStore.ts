import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppLang } from '@/i18n/types';

type LangState = {
  lang: AppLang | null;
  setLang: (lang: AppLang) => void;
  hydrateFromDevice: (lang: AppLang) => void;
};

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: null,

      setLang: (lang) => set({ lang }), // user override

      hydrateFromDevice: (lang) => {
        // only set if user has never chosen language
        if (get().lang == null) {
          set({ lang });
        }
      },
    }),
    {
      name: 'app-lang',
    }
  )
);