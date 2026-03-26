'use client';

import { useTranslation, type Locale } from '@/i18n';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === locale)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
          compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-1.5 text-sm'
        }`}
        aria-label="Change language"
      >
        <Globe className={compact ? 'w-3.5 h-3.5 text-gray-500' : 'w-4 h-4 text-gray-500'} />
        <span className="font-medium text-gray-700">{current.flag}</span>
        {!compact && <span className="text-gray-600 hidden sm:inline">{current.label}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[140px]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                locale === lang.code
                  ? 'bg-pink-50 text-pink-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
