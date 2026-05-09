import { useLangStore } from '@/store/langStore';

export const LanguageToggle = () => {
  const { lang, setLang } = useLangStore();

  return (
    <>
      <Button
        title="EN"
        onPress={() => setLang('en')}
        disabled={lang === 'en'}
      />

      <Button
        title="RU"
        onPress={() => setLang('ru')}
        disabled={lang === 'ru'}
      />
    </>
  );
};