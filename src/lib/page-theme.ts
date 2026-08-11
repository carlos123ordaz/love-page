import type { CSSProperties } from 'react';

/**
 * Traduce la paleta y la tipografía elegidas en el editor a las variables riso
 * que usan tanto el preview como la página publicada.
 *
 * Todo el diseño (círculos, misregistración, reglas, botones) está escrito
 * contra `--paper`, `--ink-black`, `--ink-red` y sus derivadas. Redefiniéndolas
 * en el contenedor, la carta entera adopta la paleta sin tocar un solo estilo.
 */

export interface PagePalette {
    backgroundColor?: string | null;
    textColor?: string | null;
    accentColor?: string | null;
    titleFont?: string | null;
    bodyFont?: string | null;
}

/** Identificadores de la paleta y la tipografía originales del producto. */
export const RISO_THEME_ID = 'riso';
export const RISO_FONT = 'Riso';

const RISO_COLORS = { bg: '#f3ead4', text: '#1a1410', accent: '#e8378a' };

function parseHex(hex: string): [number, number, number] | null {
    const h = hex.trim().replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) return null;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, alpha: number): string {
    const c = parseHex(hex);
    return c ? `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})` : hex;
}

/** Mezcla `a` hacia `b` en proporción `t` (0–1) y devuelve hex. */
function mix(a: string, b: string, t: number): string {
    const ca = parseHex(a);
    const cb = parseHex(b);
    if (!ca || !cb) return a;
    const out = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
    return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Luminancia percibida (ITU-R BT.601), suficiente para decidir contraste. */
function luminance(hex: string): number {
    const c = parseHex(hex);
    if (!c) return 255;
    return (c[0] * 299 + c[1] * 587 + c[2] * 114) / 1000;
}

/** Un tono claro se lee mejor sobre tinta oscura, y al revés. */
export function isDarkColor(hex: string): boolean {
    return luminance(hex) < 140;
}

/** De dos candidatos, el que más contrasta con `base`. */
function bestOn(base: string, a: string, b: string): string {
    const lb = luminance(base);
    return Math.abs(luminance(a) - lb) >= Math.abs(luminance(b) - lb) ? a : b;
}

/**
 * El acento sirve para rellenos aunque se parezca al papel, pero como texto
 * hay que separarlo: se acerca a la tinta hasta que se lee (p. ej. el rosa de
 * Jardín sobre papel rosa desaparecía).
 */
function readableInk(accent: string, bg: string, text: string): string {
    const lbg = luminance(bg);
    let out = accent;
    for (let step = 0; step < 6; step += 1) {
        if (Math.abs(luminance(out) - lbg) >= 70) break;
        out = mix(out, text, 0.2);
    }
    return out;
}

/**
 * Variables CSS derivadas de la paleta. Se aplican como `style` en el
 * contenedor de la carta, tanto en el editor como en la página pública.
 */
export function pageThemeVars(palette: PagePalette): CSSProperties {
    const bg = palette.backgroundColor || RISO_COLORS.bg;
    const text = palette.textColor || RISO_COLORS.text;
    const accent = palette.accentColor || RISO_COLORS.accent;

    return {
        // Papel y sus profundidades
        '--paper': bg,
        '--paper-soft': mix(bg, text, 0.03),
        '--paper-2': mix(bg, text, 0.08),
        '--paper-3': mix(bg, text, 0.16),

        // Tintas
        '--ink-black': text,
        '--ink': text,
        '--ink-2': text,
        '--ink-blue': text,
        '--ink-soft': rgba(text, 0.62),
        '--rule': rgba(text, 0.24),

        // Acento
        '--ink-red': accent,
        '--accent-hex': accent,
        // Texto sobre el acento: con paletas claras (Jardín, Cerezo) el papel
        // sobre el acento quedaba claro sobre claro e ilegible.
        '--on-accent': bestOn(accent, bg, text),
        // El acento cuando hace de texto sobre el papel.
        '--ink-red-ink': readableInk(accent, bg, text),
        '--ink-overlap': mix(accent, text, 0.45),
        '--plum': mix(accent, text, 0.45),

        // Lavados
        '--lila': rgba(text, 0.14),
        '--lila-2': rgba(text, 0.26),
        '--melocoton': rgba(accent, 0.14),
        '--melocoton-2': rgba(accent, 0.26),
    } as CSSProperties;
}

/**
 * Familia tipográfica para los títulos. `Riso` conserva la display condensada
 * del producto; cualquier otra es una Google Font elegida en el editor.
 */
export function titleFontFamily(font?: string | null): string {
    if (!font || font === RISO_FONT) return 'var(--display)';
    return `'${font}', var(--display)`;
}

/** Familia para el cuerpo del mensaje. */
export function bodyFontFamily(font?: string | null): string {
    if (!font || font === RISO_FONT) return 'var(--serif)';
    return `'${font}', var(--serif)`;
}

/**
 * URL de Google Fonts para las familias que hagan falta. Devuelve null si sólo
 * se usan las del producto, para no pedir nada.
 */
export function googleFontsHref(fonts: (string | null | undefined)[]): string | null {
    const families = Array.from(
        new Set(fonts.filter((f): f is string => Boolean(f) && f !== RISO_FONT))
    );
    if (families.length === 0) return null;
    const query = families.map((f) => `family=${f.replace(/ /g, '+')}:wght@400;700`).join('&');
    return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}
