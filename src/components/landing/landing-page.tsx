'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

/**
 * Landing en tinta cálida.
 *
 * Paleta propia, definida sobre el contenedor: la página va en un negro cálido
 * con tipografía crema y un acento de cobre. No toca las variables globales,
 * así que el resto de la app sigue en papel.
 *
 * La densidad importa tanto como el color: los detalles — filetes de cobre,
 * grano, el resplandor detrás del teléfono, la numeración en versalitas — son
 * los que evitan que una paleta sobria acabe pareciendo una plantilla vacía.
 */

const INK = '#141110';        // fondo, negro cálido
const INK_RAISED = '#1d1815'; // superficies elevadas
const INK_LINE = '#2f2721';   // filetes
const CREAM = '#f0e7d5';      // texto principal
const CREAM_SOFT = '#a3937c'; // texto secundario
const COPPER = '#c98a52';     // acento
const COPPER_DIM = 'rgba(201, 138, 82, 0.28)';

// Grano: da materia al fondo plano. Sin él, el negro se ve digital y barato.
const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='260' height='260' filter='url(%23n)' opacity='0.55'/></svg>\")";

// ── Piezas tipográficas ───────────────────────────────────────

function Eyebrow({ children, tone = 'copper' }: { children: React.ReactNode; tone?: 'copper' | 'soft' }) {
    return (
        <span
            style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: tone === 'copper' ? COPPER : CREAM_SOFT,
            }}
        >
            {children}
        </span>
    );
}

function Italic({ children }: { children: React.ReactNode }) {
    return <span style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic' }}>{children}</span>;
}

function Headline({ children, size = 'section' }: { children: React.ReactNode; size?: 'hero' | 'section' }) {
    return (
        <h2
            style={{
                fontFamily: 'var(--serif)',
                fontWeight: 400,
                fontSize: size === 'hero' ? 'clamp(46px, 6.6vw, 92px)' : 'clamp(30px, 4vw, 50px)',
                lineHeight: size === 'hero' ? 1.0 : 1.1,
                letterSpacing: '-0.025em',
                color: CREAM,
                margin: 0,
                textWrap: 'balance',
            }}
        >
            {children}
        </h2>
    );
}

/** Título de sección con su número, como un índice de revista. */
function SectionHead({ index, children }: { index: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(16px, 3vw, 40px)', marginBottom: 48 }}>
            <span
                style={{
                    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
                    color: COPPER, paddingTop: 12, borderTop: `1px solid ${COPPER_DIM}`,
                    flexShrink: 0, minWidth: 34,
                }}
            >
                {index}
            </span>
            <Headline>{children}</Headline>
        </div>
    );
}

// ── Botones ───────────────────────────────────────────────────

function CopperButton({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
    return (
        <button
            style={{
                background: COPPER,
                color: INK,
                border: 'none',
                padding: wide ? '17px 32px' : '15px 28px',
                width: wide ? '100%' : undefined,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 0,
                transition: 'filter 150ms',
            }}
            className="hover:brightness-110"
        >
            {children}
        </button>
    );
}

function OutlineButton({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
    return (
        <button
            style={{
                background: 'transparent',
                color: CREAM,
                border: `1px solid ${INK_LINE}`,
                padding: wide ? '16px 30px' : '14px 26px',
                width: wide ? '100%' : undefined,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 0,
                transition: 'border-color 150ms, color 150ms',
            }}
            className="hover:!border-[#c98a52] hover:!text-[#c98a52]"
        >
            {children}
        </button>
    );
}

// ── Cifra ─────────────────────────────────────────────────────

function Stat({ n, label }: { n: string; label: string }) {
    return (
        <div style={{ flex: 1, minWidth: 96 }}>
            <div
                style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 'clamp(28px, 3.4vw, 38px)',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: CREAM,
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                {n}
            </div>
            <div style={{ marginTop: 9 }}>
                <Eyebrow tone="soft">{label}</Eyebrow>
            </div>
        </div>
    );
}

// ── Pilar ─────────────────────────────────────────────────────

function Pillar({ n, title, body }: { n: string; title: string; body: string }) {
    return (
        <div
            style={{
                background: INK_RAISED,
                padding: 'clamp(30px, 3.2vw, 44px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
            }}
        >
            <span
                style={{
                    fontFamily: 'var(--serif)', fontSize: 40, lineHeight: 1,
                    color: COPPER, opacity: 0.55, letterSpacing: '-0.03em',
                }}
            >
                {n}
            </span>
            <h3
                style={{
                    fontFamily: 'var(--serif)', fontWeight: 400,
                    fontSize: 'clamp(20px, 2vw, 24px)', lineHeight: 1.22,
                    letterSpacing: '-0.015em', color: CREAM, margin: 0,
                    textWrap: 'balance',
                }}
            >
                {title}
            </h3>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.8, color: CREAM_SOFT, margin: 0 }}>
                {body}
            </p>
        </div>
    );
}

// ── Tarjeta de precio ─────────────────────────────────────────

function PriceCard({ plan, price, sub, pitch, features, highlight, ctaLabel, ctaHref, recommendedLabel }: {
    plan: string; price: string; sub?: string; pitch: string;
    features: string[]; highlight?: boolean; ctaLabel: string; ctaHref: string;
    recommendedLabel?: string;
}) {
    return (
        <div
            style={{
                padding: 'clamp(30px, 3.4vw, 48px)',
                background: highlight ? INK_RAISED : 'transparent',
                border: `1px solid ${highlight ? COPPER_DIM : INK_LINE}`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            {highlight && recommendedLabel && (
                <span
                    style={{
                        position: 'absolute', top: -1, right: -1,
                        background: COPPER, color: INK,
                        fontFamily: 'var(--mono)', fontSize: 9,
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        padding: '7px 13px',
                    }}
                >
                    {recommendedLabel}
                </span>
            )}

            <Eyebrow tone={highlight ? 'copper' : 'soft'}>{plan}</Eyebrow>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 22 }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(46px, 5.4vw, 62px)', lineHeight: 1, letterSpacing: '-0.035em', color: CREAM }}>
                    {price}
                </span>
                {sub && <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: CREAM_SOFT }}>{sub}</span>}
            </div>

            <p style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7, color: CREAM_SOFT, margin: '16px 0 34px' }}>
                {pitch}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 34px', display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>
                {features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 13, alignItems: 'baseline', fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.5, color: CREAM }}>
                        <span style={{ color: COPPER, flexShrink: 0, fontSize: 9 }}>◆</span>
                        {f}
                    </li>
                ))}
            </ul>

            <Link href={ctaHref} style={{ display: 'block' }}>
                {highlight ? <CopperButton wide>{ctaLabel}</CopperButton> : <OutlineButton wide>{ctaLabel}</OutlineButton>}
            </Link>
        </div>
    );
}

// ── Demo del teléfono ─────────────────────────────────────────
// La carta que se envía sigue siendo de papel: el contraste entre el fondo
// oscuro y la maqueta clara es lo que la hace destacar.

function DemoPhone() {
    const [answered, setAnswered] = useState(false);
    const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
    const { t } = useTranslation();

    const bumpNo = () => setNoPos({ x: Math.random() * 150 - 20, y: Math.random() * 70 });

    return (
        <div
            style={{
                width: 300, height: 600, flexShrink: 0,
                background: '#0d0a09',
                borderRadius: 34, padding: 9,
                border: `1px solid ${INK_LINE}`,
                boxShadow: '0 40px 90px -30px rgba(0,0,0,0.9)',
            }}
        >
            <div
                style={{
                    width: '100%', height: '100%', borderRadius: 26, overflow: 'hidden',
                    position: 'relative', background: '#f3ead4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
                <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 78, height: 21, background: '#0d0a09', borderRadius: 999 }} />

                <div style={{ padding: '0 22px', textAlign: 'center', position: 'relative', width: '100%' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a7358' }}>
                        {t.landing.demoCardBadge}
                    </span>

                    <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 27, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '20px 0 0', color: '#1a1410' }}>
                        {t.landing.demoCardTitle1} <Italic>{t.landing.demoCardTitle2Italic}</Italic>
                    </h3>

                    <p style={{ marginTop: 16, fontSize: 11, color: '#6b5a4a', lineHeight: 1.6, fontFamily: 'var(--mono)' }}>
                        {t.landing.demoCardSubtitle}
                    </p>

                    {!answered ? (
                        <div style={{ marginTop: 26, position: 'relative', minHeight: 46 }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button
                                    onClick={() => setAnswered(true)}
                                    style={{ background: '#1a1410', color: '#f3ead4', border: 'none', padding: '10px 18px', fontSize: 10.5, fontFamily: 'var(--mono)', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 0 }}
                                >
                                    {t.landing.demoYesBtn}
                                </button>
                                {!noPos && (
                                    <button
                                        onMouseEnter={bumpNo}
                                        style={{ background: 'transparent', border: '1px solid #1a1410', padding: '10px 18px', fontSize: 10.5, fontFamily: 'var(--mono)', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'default', borderRadius: 0, color: '#1a1410' }}
                                    >
                                        {t.landing.demoNoBtn}
                                    </button>
                                )}
                            </div>
                            {noPos && (
                                <button
                                    onMouseEnter={bumpNo}
                                    style={{ position: 'absolute', left: noPos.x, top: noPos.y - 46, background: 'transparent', border: '1px solid #1a1410', padding: '10px 18px', fontSize: 10.5, fontFamily: 'var(--mono)', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'default', borderRadius: 0, color: '#1a1410', transition: 'all 260ms cubic-bezier(.2,.9,.3,1.1)' }}
                                >
                                    {t.landing.demoNoBtn}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ marginTop: 26 }}>
                            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 56, margin: 0, lineHeight: 1, letterSpacing: '-0.03em', color: '#1a1410' }}>
                                <Italic>{t.landing.demoAnsweredYes}</Italic>
                            </h2>
                            <button
                                onClick={() => { setAnswered(false); setNoPos(null); }}
                                style={{ marginTop: 16, fontSize: 10, color: '#6b5a4a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--mono)', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                            >
                                {t.landing.demoReset}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Página ────────────────────────────────────────────────────

export default function LandingPage() {
    const { user } = useAuthStore();
    const { t } = useTranslation();

    const occasions = ['san valentín', 'aniversarios', 'cumpleaños', 'declaraciones', 'amistad', 'pedidas', 'perdón'];

    // El `body` de la app es crema. Mientras la landing esté montada reclama el
    // fondo oscuro: si no, el fundido entre rutas dejaría ver el crema por
    // debajo, y en iOS el rebote del scroll asomaría en el color equivocado.
    useEffect(() => {
        const { background, backgroundImage } = document.body.style;
        document.body.style.background = INK;
        document.body.style.backgroundImage = 'none';
        return () => {
            document.body.style.background = background;
            document.body.style.backgroundImage = backgroundImage;
        };
    }, []);

    return (
        <div style={{ width: '100%', background: INK, color: CREAM, fontFamily: 'var(--mono)', position: 'relative', overflowX: 'hidden' }}>

            {/* Grano sobre todo el fondo */}
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed', inset: 0, backgroundImage: GRAIN,
                    opacity: 0.05, pointerEvents: 'none', zIndex: 1,
                }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>

                {/* ── Cabecera ── */}
                <header style={{ borderBottom: `1px solid ${INK_LINE}` }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 0' }} className="px-6 sm:px-10">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
                            <span style={{ fontFamily: 'var(--serif)', fontSize: 17, letterSpacing: '-0.01em', color: CREAM }}>love</span>
                            <span aria-hidden="true" style={{ width: 4, height: 4, background: COPPER, display: 'inline-block' }} />
                            <span style={{ fontFamily: 'var(--serif)', fontSize: 17, letterSpacing: '-0.01em', color: CREAM }}>pages</span>
                        </span>

                        <span className="hidden md:block"><Eyebrow tone="soft">{t.landing.mastheadVol}</Eyebrow></span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                            <span className="hidden sm:block"><Eyebrow>{t.landing.mastheadEdition}</Eyebrow></span>
                            <LanguageSwitcher tone="dark" compact />
                        </div>
                    </div>
                </header>

                {/* ── Hero ── */}
                <section
                    style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}
                    className="px-6 sm:px-10 pt-14 pb-16 sm:pt-20 sm:pb-24 grid grid-cols-1 lg:grid-cols-[1.06fr_auto] gap-14 lg:gap-16 items-center"
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
                            <span style={{ width: 26, height: 1, background: COPPER }} />
                            <Eyebrow>{t.landing.heroBadge}</Eyebrow>
                        </div>

                        <Headline size="hero">
                            {t.landing.heroLine1}
                            <br />
                            {t.landing.heroLine2} <Italic>{t.landing.heroLine2Italic}</Italic>.
                        </Headline>

                        <p
                            style={{
                                fontFamily: 'var(--serif)', fontSize: 'clamp(16px, 1.5vw, 19px)',
                                lineHeight: 1.65, color: CREAM_SOFT, maxWidth: '44ch', margin: '26px 0 0',
                            }}
                        >
                            {t.landing.heroDesc}
                        </p>

                        <div style={{ display: 'flex', gap: 13, marginTop: 34, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Link href="/create"><CopperButton>{t.landing.ctaCreateRiso}</CopperButton></Link>
                            <a href="#demo"><OutlineButton>{t.landing.ctaDemoRiso}</OutlineButton></a>
                        </div>

                        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 44, paddingTop: 26, borderTop: `1px solid ${INK_LINE}` }}>
                            <Stat n="2.4M" label={t.landing.statsPagesLabel} />
                            <Stat n="89%" label={t.landing.statsSiLabel} />
                            <Stat n="$9" label={t.landing.statsProLabel} />
                        </div>
                    </div>

                    {/* El resplandor cálido detrás de la maqueta es la firma de la página */}
                    <div className="hidden lg:flex" style={{ justifyContent: 'center', position: 'relative' }}>
                        <div
                            aria-hidden="true"
                            style={{
                                position: 'absolute', inset: '-16% -26%',
                                background: 'radial-gradient(closest-side, rgba(201,138,82,0.30), rgba(201,138,82,0.07) 58%, transparent 78%)',
                                pointerEvents: 'none',
                            }}
                        />
                        <DemoPhone />
                        <div style={{ position: 'absolute', bottom: -28, right: 4, transform: 'rotate(-3deg)' }}>
                            <span className="hand" style={{ fontSize: 17, color: COPPER, whiteSpace: 'nowrap' }}>{t.landing.noEscapesAnnotation}</span>
                        </div>
                    </div>
                </section>

                {/* ── Ocasiones — cinta lenta, en voz baja ── */}
                <section style={{ borderTop: `1px solid ${INK_LINE}`, borderBottom: `1px solid ${INK_LINE}`, overflow: 'hidden', background: '#100d0b' }}>
                    <div style={{ display: 'flex', gap: 0, animation: 'scroll-x 64s linear infinite', whiteSpace: 'nowrap', padding: '17px 0' }}>
                        {Array.from({ length: 4 }).flatMap((_, k) =>
                            occasions.map((o, i) => (
                                <span key={`${k}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 26, paddingRight: 26 }}>
                                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: CREAM_SOFT }}>{o}</span>
                                    <span aria-hidden="true" style={{ width: 3, height: 3, background: COPPER, display: 'inline-block', flexShrink: 0 }} />
                                </span>
                            ))
                        )}
                    </div>
                </section>

                {/* ── Pilares ── */}
                <section style={{ maxWidth: 1200, margin: '0 auto' }} className="px-6 sm:px-10 py-16 sm:py-24">
                    <SectionHead index="01">
                        {t.landing.pillar1Title.split(' ').slice(0, 2).join(' ')} <Italic>&amp;</Italic> {t.landing.pillar3Title.split(' ').slice(0, 2).join(' ')}
                    </SectionHead>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: INK_LINE, border: `1px solid ${INK_LINE}` }}>
                        <Pillar n="01" title={t.landing.pillar1Title} body={t.landing.pillar1Body} />
                        <Pillar n="02" title={t.landing.pillar2Title} body={t.landing.pillar2Body} />
                        <Pillar n="03" title={t.landing.pillar3Title} body={t.landing.pillar3Body} />
                    </div>
                </section>

                {/* ── Testimonio ── */}
                <section style={{ background: INK_RAISED, borderTop: `1px solid ${INK_LINE}`, borderBottom: `1px solid ${INK_LINE}`, position: 'relative', overflow: 'hidden' }} className="px-6 sm:px-10 py-20 sm:py-28">
                    <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                        <span
                            aria-hidden="true"
                            style={{
                                position: 'absolute', top: -46, left: '50%', transform: 'translateX(-50%)',
                                fontFamily: 'var(--serif-italic)', fontStyle: 'italic',
                                fontSize: 150, lineHeight: 1, color: COPPER, opacity: 0.16,
                                pointerEvents: 'none', userSelect: 'none',
                            }}
                        >
                            &ldquo;
                        </span>

                        <div style={{ position: 'relative' }}>
                            <Eyebrow>{t.landing.testimonialBadge}</Eyebrow>
                        </div>

                        <blockquote
                            style={{
                                fontFamily: 'var(--serif)', fontWeight: 400,
                                fontSize: 'clamp(26px, 3.6vw, 44px)', lineHeight: 1.26,
                                letterSpacing: '-0.02em', color: CREAM,
                                margin: '28px 0 0', position: 'relative', textWrap: 'balance',
                            }}
                        >
                            {t.landing.testimonialLine1} {t.landing.testimonialLine2}{' '}
                            <span style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic', color: COPPER }}>
                                {t.landing.testimonialLine3Italic}
                            </span>
                        </blockquote>

                        <div style={{ marginTop: 34, display: 'flex', gap: 13, justifyContent: 'center', alignItems: 'center' }}>
                            <span
                                aria-hidden="true"
                                style={{
                                    width: 38, height: 38, borderRadius: '50%',
                                    border: `1px solid ${COPPER_DIM}`, color: COPPER,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: 'var(--serif)', fontSize: 15, flexShrink: 0,
                                }}
                            >
                                {t.landing.testimonialName.trim().charAt(0).toUpperCase()}
                            </span>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '0.06em', color: CREAM }}>{t.landing.testimonialName}</div>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: CREAM_SOFT, marginTop: 2 }}>{t.landing.testimonialDate}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Demo ── */}
                <section id="demo" style={{ maxWidth: 1200, margin: '0 auto' }} className="px-6 sm:px-10 py-16 sm:py-24">
                    <SectionHead index="02">
                        {t.landing.demoSectionLine1} {t.landing.demoSectionLine2}
                    </SectionHead>

                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <div
                            aria-hidden="true"
                            style={{
                                position: 'absolute', width: 620, height: 620, top: -20,
                                background: 'radial-gradient(closest-side, rgba(201,138,82,0.20), transparent 72%)',
                                pointerEvents: 'none',
                            }}
                        />
                        <div style={{ transform: 'scale(min(1, calc((100vw - 48px) / 300px)))', transformOrigin: 'top center', position: 'relative' }}>
                            <DemoPhone />
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 48 }}>
                        <Link href="/create"><OutlineButton>{t.landing.demoCtaBtn}</OutlineButton></Link>
                    </div>
                </section>

                {/* ── Precios ── */}
                <section style={{ borderTop: `1px solid ${INK_LINE}` }} className="px-6 sm:px-10 py-16 sm:py-24">
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <SectionHead index="03">
                            {t.landing.pricingLine1} <Italic>{t.landing.pricingLine2}</Italic>
                        </SectionHead>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <PriceCard
                                plan="free"
                                price="$0"
                                pitch={t.landing.freePlanPitch}
                                features={[t.landing.freePlanFeature1, t.landing.freePlanFeature2, t.landing.freePlanFeature3, t.landing.freePlanFeature4]}
                                ctaLabel={t.landing.freePlanCtaLabel}
                                ctaHref="/create"
                            />
                            <PriceCard
                                plan="pro"
                                price="$9"
                                sub={t.landing.proPlanSub}
                                pitch={t.landing.proPlanPitch}
                                features={[t.landing.proPlanFeature1, t.landing.proPlanFeature2, t.landing.proPlanFeature3, t.landing.proPlanFeature4, t.landing.proPlanFeature5, t.landing.proPlanFeature6]}
                                highlight
                                ctaLabel={t.landing.proPlanCtaLabel}
                                ctaHref="/upgrade"
                                recommendedLabel={t.landing.pricingRecommended}
                            />
                        </div>
                    </div>
                </section>

                {/* ── Cierre ── */}
                <section style={{ borderTop: `1px solid ${INK_LINE}`, position: 'relative', overflow: 'hidden' }} className="px-6 sm:px-10 py-24 sm:py-32">
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                            width: 'min(1000px, 120%)', height: 560,
                            background: 'radial-gradient(closest-side, rgba(201,138,82,0.17), transparent 70%)',
                            pointerEvents: 'none',
                        }}
                    />
                    <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                        <h2
                            style={{
                                fontFamily: 'var(--serif)', fontWeight: 400,
                                fontSize: 'clamp(38px, 6vw, 82px)', lineHeight: 1.04,
                                letterSpacing: '-0.03em', margin: 0, color: CREAM, textWrap: 'balance',
                            }}
                        >
                            {t.landing.finalLine1}{' '}
                            <span style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic', color: COPPER }}>
                                {t.landing.finalLine2Italic}
                            </span>
                        </h2>

                        <div style={{ marginTop: 40 }}>
                            <Link href={user ? '/dashboard' : '/create'}>
                                <CopperButton>{user ? t.landing.finalCtaUser : t.landing.finalCtaGuest}</CopperButton>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Pie ── */}
                <footer style={{ borderTop: `1px solid ${INK_LINE}`, background: '#100d0b' }} className="px-6 sm:px-10 py-10 flex flex-wrap justify-between items-center gap-6 max-sm:flex-col max-sm:text-center">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span style={{ fontFamily: 'var(--serif)', fontSize: 17, letterSpacing: '-0.01em', color: CREAM }}>love</span>
                        <span aria-hidden="true" style={{ width: 4, height: 4, background: COPPER, display: 'inline-block' }} />
                        <span style={{ fontFamily: 'var(--serif)', fontSize: 17, letterSpacing: '-0.01em', color: CREAM }}>pages</span>
                    </div>

                    <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 24px' }}>
                        {[
                            { href: '/blog', label: 'Blog' },
                            { href: '/about', label: t.landing.footerAbout },
                            { href: '/privacy-policy', label: t.landing.footerPrivacy },
                            { href: '/terms', label: t.landing.footerTerms },
                            { href: '/contact', label: t.nav.contact },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: CREAM_SOFT, textDecoration: 'none' }}
                                className="hover:!text-[#c98a52] transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <p style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: CREAM_SOFT, margin: 0, letterSpacing: '0.06em' }}>
                        © {new Date().getFullYear()} love pages.
                    </p>
                </footer>
            </div>
        </div>
    );
}
