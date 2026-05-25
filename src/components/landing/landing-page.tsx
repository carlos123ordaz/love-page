'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

// ── Stat badge — riso grid cell ──────────────────────────────
function Stat({ n, label, tone }: { n: string; label: string; tone: 'lila' | 'peach' | 'mint' }) {
    const colors = { lila: 'var(--ink-blue)', peach: 'var(--ink-red)', mint: 'var(--ink-overlap)' };
    return (
        <div style={{ padding: '16px 20px', flex: 1, borderLeft: '1.5px solid var(--ink-black)' }}>
            <div className="serif-display" style={{ fontSize: 'clamp(20px, 4vw, 26px)', lineHeight: 1, color: colors[tone] }}>{n}</div>
            <div className="mono-eyebrow" style={{ marginTop: 6, color: 'var(--ink-soft)' }}>{label}</div>
        </div>
    );
}

// ── Pillar card — riso editorial ──────────────────────────────
function Pillar({ n, tone, title, body }: { n: string; tone: 'lila' | 'peach' | 'mint'; title: string; body: string }) {
    const colors = { lila: 'var(--ink-blue)', peach: 'var(--ink-red)', mint: 'var(--ink-overlap)' };
    return (
        <div style={{ padding: '48px 36px', position: 'relative' }}>
            <div style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(80px, 10vw, 120px)',
                lineHeight: 1,
                opacity: 0.07,
                color: colors[tone],
                marginBottom: -24,
                pointerEvents: 'none',
                userSelect: 'none',
            }}>{n}</div>
            <h3 className="serif-display" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', margin: '0 0 16px', color: 'var(--ink-black)' }}>{title}</h3>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7, color: 'var(--ink-soft)', margin: 0 }}>{body}</p>
        </div>
    );
}

// ── Price card — riso flat ────────────────────────────────────
function PriceCard({ plan, price, sub, pitch, features, highlight, ctaLabel, ctaHref, recommendedLabel }: {
    plan: string; price: string; sub?: string; pitch: string;
    features: string[]; highlight?: boolean; ctaLabel: string; ctaHref: string;
    recommendedLabel?: string;
}) {
    return (
        <div style={{
            padding: 'clamp(24px, 4vw, 40px)',
            border: '1.5px solid var(--ink-black)',
            background: highlight ? 'var(--ink-black)' : 'var(--paper-soft)',
            color: highlight ? 'var(--paper)' : 'var(--ink-black)',
            position: 'relative',
        }}>
            {highlight && recommendedLabel && (
                <div className="sticker-badge" style={{ position: 'absolute', top: -1, right: -1, background: 'var(--ink-red)', color: 'var(--paper)', border: '1.5px solid var(--ink-black)' }}>
                    {recommendedLabel}
                </div>
            )}
            <div className="mono-eyebrow" style={{ color: highlight ? 'var(--ink-red)' : 'var(--ink-blue)' }}>{plan}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 16 }}>
                <span className="serif-display" style={{ fontSize: 'clamp(48px, 8vw, 64px)', color: highlight ? 'var(--paper)' : 'var(--ink-black)' }}>{price}</span>
                {sub && <span style={{ fontSize: 11, opacity: 0.65, fontFamily: 'var(--mono)' }}>{sub}</span>}
            </div>
            <p style={{ fontSize: 12, margin: '12px 0 28px', fontFamily: 'var(--mono)', lineHeight: 1.6, opacity: highlight ? 0.8 : 1 }}>{pitch}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontSize: 12, fontFamily: 'var(--mono)' }}>
                        <span style={{ color: highlight ? 'var(--ink-red)' : 'var(--ink-blue)', fontSize: 14, flexShrink: 0 }}>→</span>
                        {f}
                    </li>
                ))}
            </ul>
            <Link href={ctaHref}>
                <button style={{
                    marginTop: 32, width: '100%', padding: '14px 24px',
                    border: highlight ? '1.5px solid var(--paper-2)' : '1.5px solid var(--ink-black)',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'var(--sans)',
                    background: highlight ? 'var(--ink-red)' : 'var(--ink-black)',
                    color: 'var(--paper)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderRadius: 0,
                    position: 'relative',
                }}>{ctaLabel}</button>
            </Link>
        </div>
    );
}

// ── Demo phone mockup — riso style ───────────────────────────
function DemoPhone() {
    const [answered, setAnswered] = useState(false);
    const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
    const { t } = useTranslation();

    const bumpNo = () => {
        setNoPos({ x: Math.random() * 160, y: Math.random() * 80 });
    };

    return (
        <div style={{ width: 300, height: 600, background: 'var(--ink-black)', borderRadius: 36, padding: 10, border: '1.5px solid var(--ink-black)', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: 28, overflow: 'hidden', position: 'relative', background: 'var(--paper-soft)' }}>
                {/* Dynamic island */}
                <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 80, height: 22, background: 'var(--ink-black)', borderRadius: 999 }} />

                {/* Riso background circles */}
                <svg style={{ position: 'absolute', bottom: -20, right: -20, width: 140, height: 140, mixBlendMode: 'multiply', opacity: 0.55, pointerEvents: 'none' }} viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="65" fill="var(--ink-red)" />
                </svg>
                <svg style={{ position: 'absolute', bottom: -10, right: 10, width: 100, height: 100, mixBlendMode: 'multiply', opacity: 0.45, pointerEvents: 'none' }} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="var(--ink-blue)" />
                </svg>

                <div style={{ padding: '62px 20px 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div className="sticker-badge" style={{ fontSize: 9, padding: '3px 8px', marginBottom: 16 }}>
                        {t.landing.demoCardBadge}
                    </div>
                    <h3 className="serif-display mis-red" style={{ fontSize: 28, margin: 0, lineHeight: 0.9 }}>
                        {t.landing.demoCardTitle1}
                    </h3>
                    <h3 style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic', fontSize: 26, margin: '4px 0 0', lineHeight: 1, color: 'var(--ink-red)', textTransform: 'lowercase' }}>
                        {t.landing.demoCardTitle2Italic}
                    </h3>
                    <div style={{ marginTop: 14, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5, fontFamily: 'var(--mono)' }}>
                        {t.landing.demoCardSubtitle}
                    </div>

                    {!answered ? (
                        <div style={{ marginTop: 20, position: 'relative', minHeight: 44 }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                <button onClick={() => setAnswered(true)} className="btn-accent" style={{ padding: '8px 14px', fontSize: 11 }}>
                                    {t.landing.demoYesBtn}
                                </button>
                                {!noPos && (
                                    <button onMouseEnter={bumpNo} style={{ background: 'var(--paper-soft)', border: '1.5px solid var(--ink-black)', padding: '8px 14px', fontSize: 11, fontFamily: 'var(--sans)', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {t.landing.demoNoBtn}
                                    </button>
                                )}
                            </div>
                            {noPos && (
                                <button onMouseEnter={bumpNo} style={{ position: 'absolute', left: noPos.x, top: noPos.y - 48, background: 'var(--paper-soft)', border: '1.5px solid var(--ink-black)', padding: '8px 14px', fontSize: 11, fontFamily: 'var(--sans)', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 300ms cubic-bezier(.2,.9,.3,1.1)' }}>
                                    {t.landing.demoNoBtn}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ marginTop: 20, textAlign: 'center' }}>
                            <h2 className="serif-display mis-red" style={{ fontSize: 52, margin: 0 }}>{t.landing.demoAnsweredYes}</h2>
                            <button onClick={() => { setAnswered(false); setNoPos(null); }} style={{ marginTop: 12, fontSize: 10, color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                {t.landing.demoReset}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main landing page ─────────────────────────────────────────
export default function LandingPage() {
    const { user } = useAuthStore();
    const { t } = useTranslation();

    return (
        <div style={{ width: '100%', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)', position: 'relative', overflowX: 'hidden' }}>

            {/* ── Masthead — magazine cover style ── */}
            <section style={{ borderBottom: '3px double var(--ink-black)', padding: '10px 0', background: 'var(--paper)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }} className="px-5 sm:px-12">
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-black)' }}>{t.landing.mastheadVol}</span>
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-black)' }}>{t.landing.mastheadPrice}</span>
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-red)' }}>{t.landing.mastheadEdition}</span>
                </div>
            </section>

            {/* ── HERO ── */}
            <section
                style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}
                className="px-5 pt-12 pb-16 sm:px-12 sm:pt-16 sm:pb-20 grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-10 sm:gap-14 items-center"
            >
                <div>
                    <div className="sticker-badge" style={{ marginBottom: 28 }}>
                        {t.landing.heroBadge}
                    </div>

                    <h1 className="serif-display" style={{ fontSize: 'clamp(40px, 7vw, 96px)', margin: 0, lineHeight: 0.86 }}>
                        <span className="mis-red" style={{ display: 'block' }}>{t.landing.heroLine1}</span>
                        <span className="mis-blue" style={{ display: 'block' }}>
                            {t.landing.heroLine2} <span style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic', textTransform: 'lowercase' }}>{t.landing.heroLine2Italic}</span>.
                        </span>
                    </h1>

                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.55, color: 'var(--ink-black)', maxWidth: 500, marginTop: 24 }}>
                        {t.landing.heroDesc}{' '}
                        <span style={{ fontStyle: 'normal', fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em', color: 'var(--ink-red)' }}>
                            {t.landing.heroDescAccent}
                        </span>
                    </p>

                    <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link href="/create">
                            <button className="btn-accent" style={{ fontSize: 12, padding: '13px 22px' }}>
                                {t.landing.ctaCreateRiso}
                            </button>
                        </Link>
                        <a href="#demo">
                            <button style={{ background: 'transparent', border: '1.5px solid var(--ink-blue)', color: 'var(--ink-blue)', padding: '11px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--sans)', borderRadius: 0 }}>
                                {t.landing.ctaDemoRiso}
                            </button>
                        </a>
                    </div>

                    {/* Stats grid */}
                    <div style={{ display: 'flex', marginTop: 48, border: '1.5px solid var(--ink-black)', borderLeft: 'none' }}>
                        <Stat n="2.4M" label={t.landing.statsPagesLabel} tone="lila" />
                        <Stat n="89%" label={t.landing.statsSiLabel} tone="peach" />
                        <Stat n="$1.75" label={t.landing.statsProLabel} tone="mint" />
                    </div>
                </div>

                {/* Phone with riso circles */}
                <div className="hidden sm:flex" style={{ position: 'relative', justifyContent: 'center' }}>
                    <svg style={{ position: 'absolute', top: '8%', left: '6%', width: '86%', height: '86%', mixBlendMode: 'multiply', opacity: 0.6, pointerEvents: 'none' }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="85" fill="var(--ink-red)" />
                    </svg>
                    <svg style={{ position: 'absolute', top: '12%', left: '3%', width: '86%', height: '86%', mixBlendMode: 'multiply', opacity: 0.55, pointerEvents: 'none' }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="80" fill="var(--ink-blue)" />
                    </svg>

                    <DemoPhone />

                    <div style={{ position: 'absolute', top: 36, left: -10, transform: 'rotate(-6deg)', zIndex: 2 }}>
                        <span className="hand" style={{ fontSize: 20, color: 'var(--ink-red)' }}>{t.landing.livePreviewAnnotation}</span>
                        <svg width="70" height="34" viewBox="0 0 70 34" style={{ display: 'block' }}>
                            <path d="M4 4 Q 24 24 62 30" stroke="var(--ink-red)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="2 3" />
                            <path d="M57 27 L64 30 L59 35" stroke="var(--ink-red)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div style={{ position: 'absolute', bottom: 56, right: -44, transform: 'rotate(8deg)', zIndex: 2 }}>
                        <span className="hand" style={{ fontSize: 18, color: 'var(--ink-blue)' }}>{t.landing.noEscapesAnnotation}</span>
                    </div>
                </div>
            </section>

            {/* ── Marquee ── */}
            <section style={{ overflow: 'hidden', borderTop: '3px double var(--ink-black)', borderBottom: '3px double var(--ink-black)', padding: '14px 0', background: 'var(--paper-soft)' }}>
                <div style={{ display: 'flex', gap: 40, animation: 'scroll-x 50s linear infinite', whiteSpace: 'nowrap' }}>
                    {Array.from({ length: 3 }).flatMap((_, k) =>
                        ['san valentín', '✦', 'aniversarios', '✦', 'cumpleaños', '✦', 'declaraciones', '✦', 'amistad', '✦', 'pedidas', '✦', 'perdón', '✦'].map((text, i) => (
                            <span key={`${k}-${i}`} className="serif-display" style={{ fontSize: 'clamp(20px, 3vw, 32px)', color: i % 4 === 1 || i % 4 === 3 ? 'var(--ink-overlap)' : i % 2 === 0 ? 'var(--ink-red)' : 'var(--ink-blue)' }}>
                                {text}
                            </span>
                        ))
                    )}
                </div>
            </section>

            {/* ── Pillars ── */}
            <section style={{ borderTop: '1.5px solid var(--ink-black)', borderBottom: '1.5px solid var(--ink-black)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }} className="grid grid-cols-1 sm:grid-cols-3">
                    <Pillar n="01" tone="lila" title={t.landing.pillar1Title} body={t.landing.pillar1Body} />
                    <div style={{ borderLeft: '1.5px solid var(--ink-black)', borderRight: '1.5px solid var(--ink-black)' }}>
                        <Pillar n="02" tone="peach" title={t.landing.pillar2Title} body={t.landing.pillar2Body} />
                    </div>
                    <Pillar n="03" tone="mint" title={t.landing.pillar3Title} body={t.landing.pillar3Body} />
                </div>
            </section>

            {/* ── Testimonial ── */}
            <section style={{ background: 'var(--paper-soft)', borderBottom: '1.5px solid var(--ink-black)' }} className="px-5 py-16 sm:px-12 sm:py-24">
                <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                    {/* Riso circles */}
                    <svg style={{ position: 'absolute', top: -30, left: 20, width: 160, height: 160, mixBlendMode: 'multiply', opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="85" fill="var(--ink-red)" />
                    </svg>
                    <svg style={{ position: 'absolute', bottom: -20, right: 20, width: 130, height: 130, mixBlendMode: 'multiply', opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="75" fill="var(--ink-blue)" />
                    </svg>

                    <div className="sticker-badge" style={{ marginBottom: 28, position: 'relative', zIndex: 2 }}>
                        {t.landing.testimonialBadge}
                    </div>
                    <blockquote className="serif-display" style={{ fontSize: 'clamp(28px, 5vw, 60px)', lineHeight: 0.92, margin: '20px 0 0', position: 'relative', zIndex: 2 }}>
                        <span className="mis-blue" style={{ display: 'block' }}>{t.landing.testimonialLine1}</span>
                        <span className="mis-red" style={{ display: 'block' }}>{t.landing.testimonialLine2}</span>
                        <span style={{ display: 'block', fontFamily: 'var(--serif-italic)', fontStyle: 'italic', textTransform: 'lowercase', color: 'var(--ink-red)', textShadow: 'none' }}>{t.landing.testimonialLine3Italic}</span>
                    </blockquote>
                    <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink-red)', border: '1.5px solid var(--ink-black)', mixBlendMode: 'multiply', flexShrink: 0 }} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--mono)' }}>{t.landing.testimonialName}</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>{t.landing.testimonialDate}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Demo ── */}
            <section id="demo" style={{ maxWidth: 1200, margin: '0 auto' }} className="px-5 py-14 sm:px-12 sm:py-20">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
                    <h2 className="serif-display" style={{ fontSize: 'clamp(32px, 5vw, 64px)', margin: 0, lineHeight: 0.88 }}>
                        <span className="mis-red" style={{ display: 'block' }}>{t.landing.demoSectionLine1}</span>
                        <span className="mis-blue" style={{ display: 'block' }}>{t.landing.demoSectionLine2}</span>
                    </h2>
                    <div className="sticker-badge">{t.landing.demoSectionBadge}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                    <div style={{ transform: 'scale(min(1, calc((100vw - 40px) / 300px)))', transformOrigin: 'top center' }}>
                        <DemoPhone />
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <Link href="/create">
                        <button className="btn-accent" style={{ fontSize: 12, padding: '14px 24px' }}>
                            {t.landing.demoCtaBtn}
                        </button>
                    </Link>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section style={{ borderTop: '1.5px solid var(--ink-black)', maxWidth: '100%' }} className="px-5 py-14 sm:px-12 sm:py-20">
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
                        <h2 className="serif-display" style={{ fontSize: 'clamp(32px, 5vw, 64px)', margin: 0, lineHeight: 0.88 }}>
                            <span className="mis-red" style={{ display: 'block' }}>{t.landing.pricingLine1}</span>
                            <span className="mis-blue" style={{ display: 'block' }}>{t.landing.pricingLine2}</span>
                        </h2>
                        <div className="sticker-badge" style={{ background: 'var(--paper-2)' }}>{t.landing.pricingBadge}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'var(--ink-black)' }}>
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
                            price="$1.75"
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

            {/* ── Final CTA ── */}
            <section style={{ background: 'var(--ink-red)', color: 'var(--paper)', textAlign: 'center', position: 'relative', overflow: 'hidden' }} className="px-5 py-20 sm:px-12 sm:py-32">
                {/* Riso blue overlay circles */}
                <svg style={{ position: 'absolute', top: '-10%', left: '2%', width: '28%', height: '120%', mixBlendMode: 'multiply', opacity: 0.4, pointerEvents: 'none' }} viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="92" fill="var(--ink-blue)" />
                </svg>
                <svg style={{ position: 'absolute', bottom: '-10%', right: '4%', width: '22%', height: '100%', mixBlendMode: 'multiply', opacity: 0.4, pointerEvents: 'none' }} viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="var(--ink-blue)" />
                </svg>

                <h2 className="serif-display" style={{ fontSize: 'clamp(48px, 9vw, 112px)', margin: 0, lineHeight: 0.86, position: 'relative', zIndex: 2 }}>
                    {t.landing.finalLine1}
                    <br />
                    <span style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic', textTransform: 'lowercase' }}>{t.landing.finalLine2Italic}</span>
                </h2>
                <Link href={user ? '/dashboard' : '/create'}>
                    <button style={{ marginTop: 40, background: 'var(--paper)', color: 'var(--ink-black)', border: '2px solid var(--ink-black)', padding: '16px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'relative', zIndex: 2, borderRadius: 0 }}>
                        {user ? t.landing.finalCtaUser : t.landing.finalCtaGuest}
                    </button>
                </Link>
            </section>

            {/* ── Footer ── */}
            <footer style={{ borderTop: '1.5px solid var(--ink-black)', background: 'var(--paper-soft)', gap: 16 }} className="px-5 py-8 sm:px-12 flex flex-wrap justify-between items-center max-sm:flex-col max-sm:text-center">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="serif-display mis-red" style={{ fontSize: 18 }}>love</span>
                    <span style={{ width: 7, height: 7, background: 'var(--ink-blue)', display: 'inline-block' }} />
                    <span className="serif-display mis-blue" style={{ fontSize: 18 }}>pages</span>
                </div>
                <nav style={{ display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { href: '/blog', label: 'Blog' },
                        { href: '/about', label: t.landing.footerAbout },
                        { href: '/privacy-policy', label: t.landing.footerPrivacy },
                        { href: '/terms', label: t.landing.footerTerms },
                        { href: '/contact', label: t.nav.contact },
                    ].map(({ href, label }, i, arr) => (
                        <Link key={href} href={href} style={{ fontSize: 11, color: 'var(--ink-soft)', textDecoration: 'none', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRight: i < arr.length - 1 ? '1px solid var(--rule)' : 'none' }}
                            className="hover:text-[var(--ink-black)] transition-colors">
                            {label}
                        </Link>
                    ))}
                </nav>
                <p style={{ fontSize: 11, color: 'var(--ink-soft)', margin: 0, fontFamily: 'var(--mono)' }}>
                    © {new Date().getFullYear()} love pages.
                </p>
            </footer>
        </div>
    );
}
