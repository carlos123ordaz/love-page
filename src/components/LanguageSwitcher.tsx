'use client';

import { useTranslation, type Locale } from '@/i18n';
import { useState, useRef, useEffect } from 'react';

const LANGUAGES: { code: Locale; label: string; abbr: string }[] = [
  { code: 'es', label: 'Español', abbr: 'ES' },
  { code: 'en', label: 'English', abbr: 'EN' },
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
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          border: '1.5px solid var(--ink-black)',
          background: open ? 'var(--ink-blue)' : 'transparent',
          color: open ? 'var(--paper)' : 'var(--ink-black)',
          padding: compact ? '4px 8px' : '6px 12px',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 500,
          cursor: 'pointer',
          borderRadius: 0,
          transition: 'background 120ms, color 120ms',
        }}
        aria-label="Change language"
      >
        <span>{current.abbr}</span>
        <span style={{ fontSize: 7, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%',
          background: 'var(--paper-soft)',
          border: '1.5px solid var(--ink-black)',
          borderTop: 'none',
          zIndex: 50,
          minWidth: 120,
        }}>
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: locale === lang.code ? 'var(--ink-red)' : 'transparent',
                color: locale === lang.code ? 'var(--paper)' : 'var(--ink-black)',
                border: 'none',
                borderBottom: i < LANGUAGES.length - 1 ? '1px solid var(--rule)' : 'none',
                cursor: 'pointer',
                fontWeight: locale === lang.code ? 700 : 400,
                textAlign: 'left',
              }}
            >
              <span>{lang.abbr}</span>
              <span style={{ opacity: 0.55, fontSize: 10 }}>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
