'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

// ── Stat badge ──────────────────────────────────────────────
function Stat({ n, label, tone }: { n: string; label: string; tone: 'lila' | 'peach' | 'mint' }) {
    const bgs = { lila: 'var(--lila)', peach: 'var(--melocoton)', mint: 'var(--mint)' };
    return (
        <div style={{ padding: '10px 16px', background: bgs[tone], border: '2px solid var(--ink)', borderRadius: 16, boxShadow: '3px 3px 0 var(--ink)' }}>
            <div className="serif-display" style={{ fontSize: 'clamp(22px, 4vw, 28px)', lineHeight: 1, color: 'var(--ink)' }}>{n}</div>
            <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
        </div>
    );
}

// ── Pillar card ──────────────────────────────────────────────
function Pillar({ n, emoji, tone, title, body }: { n: string; emoji: string; tone: 'lila' | 'peach' | 'mint'; title: string; body: string }) {
    const bgs = { lila: 'var(--lila)', peach: 'var(--melocoton)', mint: 'var(--mint)' };
    return (
        <div style={{ padding: 28, background: 'white', border: '2px solid var(--ink)', borderRadius: 24, boxShadow: '5px 5px 0 var(--ink)', position: 'relative', marginTop: 16 }}>
            <div style={{ position: 'absolute', top: -16, right: -8, width: 56, height: 56, borderRadius: '50%', background: bgs[tone], border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '3px 3px 0 var(--ink)' }}>
                {emoji}
            </div>
            <div className="mono-eyebrow">{n}</div>
            <h3 className="serif-display" style={{ fontSize: 'clamp(20px, 3vw, 26px)', margin: '8px 0 12px', lineHeight: 1.05, color: 'var(--ink)' }}>{title}</h3>
            <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>{body}</p>
        </div>
    );
}

// ── Price card ──────────────────────────────────────────────
function PriceCard({ plan, price, sub, pitch, features, highlight, ctaLabel, ctaHref }: {
    plan: string; price: string; sub?: string; pitch: string;
    features: string[]; highlight?: boolean; ctaLabel: string; ctaHref: string;
}) {
    return (
        <div style={{
            padding: 'clamp(20px, 4vw, 32px)',
            border: '2px solid var(--ink)', borderRadius: 28,
            background: highlight ? 'var(--ink)' : 'white',
            color: highlight ? 'white' : 'var(--ink)',
            position: 'relative',
            boxShadow: '6px 6px 0 var(--ink)',
        }}>
            {highlight && (
                <div className="sticker-badge" style={{ position: 'absolute', top: -16, right: 24, background: 'var(--butter)', color: 'var(--ink)' }}>
                    <span>⭐</span><span>recomendado</span>
                </div>
            )}
            <div className="mono-eyebrow" style={{ color: highlight ? 'var(--melocoton)' : 'var(--ink-soft)' }}>{plan}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
                <span className="serif-display" style={{ fontSize: 'clamp(48px, 8vw, 64px)', color: highlight ? 'white' : 'var(--ink)' }}>{price}</span>
                {sub && <span style={{ fontSize: 12, opacity: 0.7 }}>{sub}</span>}
            </div>
            <p style={{ fontSize: 15, margin: '8px 0 24px', opacity: highlight ? 0.85 : 1 }}>{pitch}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontSize: 14 }}>
                        <span style={{ color: highlight ? 'var(--melocoton)' : 'var(--accent-hex)', fontSize: 16 }}>♥</span>
                        {f}
                    </li>
                ))}
            </ul>
            <Link href={ctaHref}>
                <button style={{
                    marginTop: 28, width: '100%', padding: '14px 24px', borderRadius: 999,
                    border: '2px solid var(--ink)', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    background: highlight ? 'var(--accent-hex)' : 'var(--ink)', color: 'white',
                    boxShadow: highlight ? '3px 3px 0 var(--melocoton)' : '3px 3px 0 var(--accent-hex)',
                }}>{ctaLabel}</button>
            </Link>
        </div>
    );
}

// ── Demo phone mockup ────────────────────────────────────────
function DemoPhone() {
    const [answered, setAnswered] = useState(false);
    const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);

    const bumpNo = () => {
        setNoPos({ x: Math.random() * 180, y: Math.random() * 80 });
    };

    return (
        /* scale down on narrow screens so the 320px phone fits */
        <div style={{ width: 320, height: 640, background: 'var(--ink)', borderRadius: 44, padding: 10, boxShadow: '8px 8px 0 rgba(45,27,61,.2), var(--shadow-card)', border: '2px solid var(--ink)', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden', position: 'relative', background: 'linear-gradient(160deg, #ede4fa 0%, #fde5dd 50%, #ffd4d4 100%)' }}>
                <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: 'var(--ink)', borderRadius: 999 }} />
                <div style={{ padding: '70px 24px 0', textAlign: 'center' }}>
                    <div className="sticker-badge" style={{ fontSize: 9, padding: '4px 10px', marginBottom: 16, background: 'var(--lila-soft)' }}>
                        <span>💌</span><span>una carta para ti</span>
                    </div>
                    <h3 className="serif-display" style={{ fontSize: 36, margin: 0, lineHeight: 0.95, color: 'var(--ink)' }}>
                        ¿quieres ser <em style={{ color: 'var(--accent-hex)', fontStyle: 'italic' }}>mi novia?</em>
                    </h3>
                    <div style={{ marginTop: 18, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                        después de 247 cafés y 31 películas...
                    </div>
                    {!answered ? (
                        <div style={{ marginTop: 24, position: 'relative', minHeight: 44 }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                <button onClick={() => setAnswered(true)} style={{ background: 'var(--accent-hex)', color: 'white', border: '2px solid var(--ink)', padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, boxShadow: '2px 2px 0 var(--ink)', cursor: 'pointer' }}>
                                    sí 💖
                                </button>
                                {!noPos && (
                                    <button onMouseEnter={bumpNo} style={{ background: 'white', border: '2px solid var(--ink)', padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, boxShadow: '2px 2px 0 var(--ink)', cursor: 'pointer' }}>
                                        no
                                    </button>
                                )}
                            </div>
                            {noPos && (
                                <button onMouseEnter={bumpNo} style={{ position: 'absolute', left: noPos.x, top: noPos.y - 48, background: 'white', border: '2px solid var(--ink)', padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, boxShadow: '2px 2px 0 var(--ink)', cursor: 'pointer', transition: 'all 300ms cubic-bezier(.2,.9,.3,1.1)' }}>
                                    no
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <h2 className="serif-display" style={{ fontSize: 56, color: 'var(--ink)', margin: 0 }}>
                                <em style={{ color: 'var(--accent-hex)', fontStyle: 'italic' }}>¡sí!</em> 💖
                            </h2>
                            <button onClick={() => { setAnswered(false); setNoPos(null); }} style={{ marginTop: 12, fontSize: 10, color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                volver
                            </button>
                        </div>
                    )}
                </div>
                {['🌷', '💌', '💗', '✨'].map((e, i) => (
                    <span key={i} style={{ position: 'absolute', top: `${18 + i * 18}%`, left: `${10 + (i * 23) % 80}%`, fontSize: 20, opacity: 0.7, transform: `rotate(${i * 17}deg)`, pointerEvents: 'none' }}>
                        {e}
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Main landing page ────────────────────────────────────────
export default function LandingPage() {
    const { user } = useAuthStore();
    const { t } = useTranslation();

    return (
        <div style={{ width: '100%', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--sans)', position: 'relative', overflowX: 'hidden' }}>
            {/* Floating background stickers — hidden on mobile to avoid overflow */}
            <div className="hidden sm:block" style={{ position: 'absolute', top: 200, left: 80, fontSize: 80, transform: 'rotate(-18deg)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}>💗</div>
            <div className="hidden sm:block" style={{ position: 'absolute', top: 540, right: 120, fontSize: 64, transform: 'rotate(20deg)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}>🌸</div>
            <div className="hidden sm:block" style={{ position: 'absolute', top: 1200, left: 100, fontSize: 70, transform: 'rotate(15deg)', opacity: 0.3, pointerEvents: 'none', zIndex: 0 }}>✨</div>

            {/* ── HERO ── */}
            <section
                style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}
                className="px-5 pt-10 pb-14 sm:px-12 sm:pt-16 sm:pb-20 grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-10 sm:gap-14 items-center"
            >
                <div>
                    <div className="sticker-badge" style={{ background: 'var(--mint)', marginBottom: 24 }}>
                        <span>✨</span><span>nuevo · 2.4M páginas creadas</span>
                    </div>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(40px, 7vw, 88px)', margin: 0, lineHeight: 0.92, color: 'var(--ink)' }}>
                        cartas de amor<br />
                        que <em style={{ color: 'var(--accent-hex)', fontStyle: 'italic' }}>responden</em>
                        <span style={{ display: 'inline-block', fontSize: '0.7em', marginLeft: 12, transform: 'rotate(8deg)' }}>💌</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 500, marginTop: 20, fontWeight: 400 }}>
                        diseña una página inolvidable, comparte el link, y descubre en tiempo real lo que la otra persona contesta.{' '}
                        <span style={{ color: 'var(--accent-deep-hex)', fontWeight: 600 }}>romántico, cursi, inevitable.</span>
                    </p>

                    <div style={{ display: 'flex', gap: 12, marginTop: 28, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link href="/create">
                            <button className="btn-accent" style={{ fontSize: 15, padding: '14px 24px' }}>
                                crear mi página · gratis →
                            </button>
                        </Link>
                        <a href="#demo">
                            <button style={{ background: 'white', border: '2px solid var(--ink)', color: 'var(--ink)', padding: '12px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)' }}>
                                ver demo 👀
                            </button>
                        </a>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
                        <Stat n="2.4M" label="páginas creadas" tone="lila" />
                        <Stat n="89%" label="dicen sí" tone="peach" />
                        <Stat n="$1.75" label="pro · una vez" tone="mint" />
                    </div>
                </div>

                <div className="hidden sm:flex" style={{ position: 'relative', justifyContent: 'center' }}>
                    <DemoPhone />
                    <div style={{ position: 'absolute', top: 30, left: -10, transform: 'rotate(-8deg)' }}>
                        <span className="sticker-badge" style={{ background: 'var(--butter)', fontSize: 11 }}>👀 vista previa en vivo</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 80, right: -40, transform: 'rotate(10deg)' }}>
                        <span className="sticker-badge" style={{ background: 'var(--lila)', fontSize: 11 }}>🏃 el "no" se escapa</span>
                    </div>
                </div>
            </section>

            {/* ── Marquee ── */}
            <section style={{ overflow: 'hidden', background: 'var(--ink)', color: 'var(--paper)', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }} className="py-4 sm:py-5">
                <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 32px)', animation: 'scroll-x 30s linear infinite', whiteSpace: 'nowrap' }}>
                    {Array.from({ length: 4 }).flatMap((_, k) =>
                        [['san valentín', '💕'], ['aniversarios', '🥂'], ['cumpleaños', '🎂'], ['declaraciones', '💌'], ['amistad', '🫶'], ['pedidas', '💍'], ['perdón', '🌷']].map(([text, emoji], i) => (
                            <span key={`${k}-${i}`} className="serif-display" style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontStyle: i % 2 ? 'italic' : 'normal', color: i % 2 ? 'var(--melocoton)' : 'var(--paper)' }}>
                                {text} {emoji}
                            </span>
                        ))
                    )}
                </div>
            </section>

            {/* ── Pillars ── */}
            <section
                style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}
                className="px-5 py-14 sm:px-12 sm:py-20 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6"
            >
                <Pillar n="01" emoji="🎨" tone="lila" title="diseña sin saber diseñar" body="plantillas curadas, animaciones suaves, paleta heredada del color rosa-melocotón más bonito que existe." />
                <Pillar n="02" emoji="🔗" tone="peach" title="comparte un link, recibe respuesta" body="cada página vive en su propia URL. tu pareja la abre, contesta sí o no, y tú lo ves al instante." />
                <Pillar n="03" emoji="📊" tone="mint" title="estadísticas que importan" body="visitas, tiempo dedicado, y la respuesta. notificaciones push cuando recibes una visita." />
            </section>

            {/* ── Testimonial ── */}
            <section style={{ background: 'var(--lila-soft)' }} className="px-5 py-14 sm:px-12 sm:py-20">
                <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                    {/* Decorative icons — hidden on small screens to avoid overlap */}
                    <span className="hidden sm:block" style={{ position: 'absolute', top: -10, left: 60, fontSize: 60, transform: 'rotate(-20deg)', pointerEvents: 'none' }}>💬</span>
                    <span className="hidden sm:block" style={{ position: 'absolute', top: 0, right: 60, fontSize: 60, transform: 'rotate(15deg)', pointerEvents: 'none' }}>💖</span>
                    <div className="sticker-badge" style={{ background: 'white', marginBottom: 24 }}>
                        <span>⭐</span><span>ana p. · guadalajara</span>
                    </div>
                    <blockquote className="serif-display" style={{ fontSize: 'clamp(26px, 4.5vw, 56px)', lineHeight: 1.05, margin: 0, fontStyle: 'italic', color: 'var(--ink)' }}>
                        "le dije que sí antes de leer el último <em style={{ color: 'var(--accent-hex)' }}>párrafo</em>"
                    </blockquote>
                    <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--accent-hex)', border: '2px solid var(--ink)', flexShrink: 0 }} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>ana patricia m.</div>
                            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>recibió una pedida · feb 2026</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Demo ── */}
            <section id="demo" style={{ maxWidth: 1200, margin: '0 auto' }} className="px-5 py-14 sm:px-12 sm:py-20">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                    <h2 className="serif-display" style={{ fontSize: 'clamp(32px, 5vw, 64px)', margin: 0, lineHeight: 0.95, color: 'var(--ink)' }}>
                        pruébalo tú mismo,<br /><em style={{ color: 'var(--accent-hex)' }}>ahora</em> 👇
                    </h2>
                    <span className="sticker-badge" style={{ background: 'var(--lila)' }}>03 · demo</span>
                </div>
                {/* Phone wrapper: scale down on narrow screens */}
                <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                    <div style={{ transform: 'scale(min(1, calc((100vw - 40px) / 320px)))', transformOrigin: 'top center' }}>
                        <DemoPhone />
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Link href="/create">
                        <button className="btn-accent" style={{ fontSize: 15, padding: '14px 24px' }}>
                            crear mi página gratis →
                        </button>
                    </Link>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto' }} className="px-5 py-14 sm:px-12 sm:py-20">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                    <h2 className="serif-display" style={{ fontSize: 'clamp(32px, 5vw, 64px)', margin: 0, lineHeight: 0.95, color: 'var(--ink)' }}>
                        un precio justo,<br /><em style={{ color: 'var(--accent-hex)' }}>para siempre</em> 💸
                    </h2>
                    <span className="sticker-badge" style={{ background: 'var(--butter)' }}>04 · precios</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <PriceCard
                        plan="free"
                        price="$0"
                        pitch="suficiente para esa carta importante"
                        features={['2 páginas activas', 'animaciones básicas', 'URL lovepages.ink/p/xxxx', 'marca de agua sutil']}
                        ctaLabel="empezar gratis"
                        ctaHref="/create"
                    />
                    <PriceCard
                        plan="pro"
                        price="$1.75"
                        sub="una vez · de por vida"
                        pitch="para los que se enamoran seguido"
                        features={['páginas ilimitadas', 'diseño con IA ✨', 'URL personalizada', 'sin marca de agua', 'música ilimitada', 'estadísticas avanzadas']}
                        highlight
                        ctaLabel="hacer upgrade ✨"
                        ctaHref="/upgrade"
                    />
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section
                style={{ background: 'var(--accent-hex)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                className="px-5 py-20 sm:px-12 sm:py-32"
            >
                <span className="hidden sm:block" style={{ position: 'absolute', top: 60, left: '15%', fontSize: 60, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>💌</span>
                <span className="hidden sm:block" style={{ position: 'absolute', bottom: 80, right: '15%', fontSize: 60, transform: 'rotate(20deg)', pointerEvents: 'none' }}>🌸</span>
                <h2 className="serif-display" style={{ fontSize: 'clamp(48px, 9vw, 112px)', margin: 0, lineHeight: 0.95, position: 'relative', zIndex: 2 }}>
                    ¿y tú,<br />
                    <em style={{ fontStyle: 'italic' }}>a quién le escribes?</em>
                </h2>
                <Link href={user ? '/dashboard' : '/create'}>
                    <button style={{ marginTop: 36, background: 'white', color: 'var(--ink)', border: '2px solid var(--ink)', padding: '16px 28px', borderRadius: 999, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '4px 4px 0 var(--ink)', position: 'relative', zIndex: 2 }}>
                        {user ? 'ir a mis páginas →' : 'empezar mi página →'}
                    </button>
                </Link>
            </section>

            {/* ── Footer ── */}
            <footer
                style={{ borderTop: '2px solid var(--rule)', background: 'white', gap: 16 }}
                className="px-5 py-8 sm:px-12 flex flex-wrap justify-between items-center max-sm:flex-col max-sm:text-center"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="serif-display" style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--ink)' }}>love</span>
                    <span>💗</span>
                    <span className="serif-display" style={{ fontSize: 18, color: 'var(--ink)' }}>pages</span>
                </div>
                <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { href: '/blog', label: 'Blog' },
                        { href: '/about', label: 'Acerca de' },
                        { href: '/privacy-policy', label: 'Privacidad' },
                        { href: '/terms', label: 'Términos' },
                        { href: '/contact', label: 'Contacto' },
                    ].map(({ href, label }) => (
                        <Link key={href} href={href} style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none' }}
                            className="hover:text-[var(--ink)] transition-colors">
                            {label}
                        </Link>
                    ))}
                </nav>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: 0 }}>
                    © {new Date().getFullYear()} Love Pages. hecho con 💗
                </p>
            </footer>
        </div>
    );
}
