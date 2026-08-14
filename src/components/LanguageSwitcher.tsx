'use client';

import { useTranslation, type Locale } from '@/i18n';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LANGUAGES: { code: Locale; label: string; abbr: string }[] = [
  { code: 'es', label: 'Español', abbr: 'ES' },
  { code: 'en', label: 'English', abbr: 'EN' },
];

/**
 * Paletas del selector.
 *
 * `light` es la de la app; `dark` queda para superficies oscuras (la maqueta
 * del teléfono, páginas publicadas con tema oscuro).
 */
const TONES = {
  light: {
    bg: 'var(--paper-2)',
    text: 'var(--ink-soft)',
    openBg: 'var(--accent-soft)',
    openText: 'var(--accent-2-hex)',
    menuBg: 'var(--paper-soft)',
    activeBg: 'var(--accent-soft)',
    activeText: 'var(--accent-2-hex)',
  },
  dark: {
    bg: 'rgba(255,255,255,0.1)',
    text: 'rgba(255,255,255,0.85)',
    openBg: 'rgba(255,255,255,0.18)',
    openText: '#fff',
    menuBg: '#262230',
    activeBg: 'rgba(255,255,255,0.12)',
    activeText: '#fff',
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
          display: 'flex', alignItems: 'center', gap: 6,
          border: 'none',
          background: open ? c.openBg : c.bg,
          color: open ? c.openText : c.text,
          padding: compact ? '9px 13px' : '11px 16px',
          fontFamily: 'var(--sans)',
          fontSize: 14,
          letterSpacing: 0,
          textTransform: 'none',
          fontWeight: 600,
          cursor: 'pointer',
          borderRadius: 10,
          transition: 'background 140ms, color 140ms',
        }}
        aria-label="Change language"
        aria-expanded={open}
      >
        <span>{current.abbr}</span>
        <ChevronDown size={13} strokeWidth={2.5} style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 140ms' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 6px)',
          background: c.menuBg,
          border: 'none',
          borderRadius: 12,
          boxShadow: 'var(--shadow-card)',
          padding: 5,
          zIndex: 50,
          minWidth: 148,
          overflow: 'hidden',
        }}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px',
                fontFamily: 'var(--sans)',
                fontSize: 15,
                letterSpacing: 0,
                textTransform: 'none',
                background: locale === lang.code ? c.activeBg : 'transparent',
                color: locale === lang.code ? c.activeText : c.text,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: locale === lang.code ? 600 : 500,
                textAlign: 'left',
              }}
            >
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
