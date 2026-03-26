'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import es, { type Translations } from './translations/es';
import en from './translations/en';

export type Locale = 'es' | 'en';

const translations: Record<Locale, Translations> = { es, en };

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'es',
  t: es,
  setLocale: () => {},
});

const STORAGE_KEY = 'lovepages-lang';

function detectLanguage(): Locale {
  // 1. Check localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;

    // 2. Check browser language
    const browserLang = navigator.language || (navigator as any).userLanguage || '';
    if (browserLang.startsWith('en')) return 'en';
  }

  // 3. Default to Spanish
  return 'es';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(detectLanguage());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const value = useMemo(
    () => ({
      locale,
      t: translations[locale],
      setLocale,
    }),
    [locale, setLocale]
  );

  // Avoid hydration mismatch: render Spanish on server, switch after mount
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ locale: 'es', t: es, setLocale }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
