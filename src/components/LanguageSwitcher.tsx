'use client';

import { useTranslation, type Locale } from '@/i18n';
import { useState, useRef, useEffect } from 'react';

const LANGUAGES: { code: Locale; label: string; abbr: string }[] = [
  { code: 'es', label: 'Español', abbr: 'ES' },
  { code: 'en', label: 'English', abbr: 'EN' },
];

/**
 * Paletas del selector.
 *
 * El componente usa el mismo token para el borde y para el texto, así que
 * sobre fondo oscuro no basta con redefinir variables: hace falta una variante
 * explícita. `light` reproduce exactamente el aspecto anterior.
 */
const TONES = {
  light: {
    border: 'var(--ink-black)',
    text: 'var(--ink-black)',
    openBg: 'var(--ink-blue)',
    openText: 'var(--paper)',
    menuBg: 'var(--paper-soft)',
    menuBorder: 'var(--ink-black)',
    activeBg: 'var(--ink-red)',
    activeText: 'var(--paper)',
    divider: 'var(--rule)',
  },
  dark: {
    border: '#2f2721',
    text: '#f0e7d5',
    openBg: '#1d1815',
    openText: '#f0e7d5',
    menuBg: '#1d1815',
    menuBorder: '#2f2721',
    activeBg: '#c98a52',
    activeText: '#141110',
    divider: '#2f2721',
  },
} as const;

export function LanguageSwitcher({
  compact = false,
  tone = 'light',
}: {
  compact?: boolean;
  tone?: keyof typeof TONES;
}) {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const c = TONES[tone];

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
          border: `1.5px solid ${c.border}`,
          background: open ? c.openBg : 'transparent',
          color: open ? c.openText : c.text,
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
        aria-expanded={open}
      >
        <span>{current.abbr}</span>
        <span style={{ fontSize: 7, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%',
          background: c.menuBg,
          border: `1.5px solid ${c.menuBorder}`,
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
                background: locale === lang.code ? c.activeBg : 'transparent',
                color: locale === lang.code ? c.activeText : c.text,
                border: 'none',
                borderBottom: i < LANGUAGES.length - 1 ? `1px solid ${c.divider}` : 'none',
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
