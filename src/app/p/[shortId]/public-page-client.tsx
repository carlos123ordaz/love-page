'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { ProPageRenderer } from '@/components/ProPageRenderer';
import { ParticleCanvas, animToKind, hasParticles } from '@/components/ParticleCanvas';
import { pageThemeVars, titleFontFamily, bodyFontFamily, googleFontsHref, isDarkColor, RISO_FONT } from '@/lib/page-theme';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/i18n';

// ── Embed URL helper ──────────────────────────────────────────
function getEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
            let videoId = u.searchParams.get('v');
            if (!videoId) {
                const parts = u.pathname.split('/').filter(Boolean);
                videoId = parts[parts.indexOf('shorts') + 1] || parts[parts.length - 1];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
        }
        if (u.hostname.includes('tiktok.com')) {
            const match = u.pathname.match(/\/video\/(\d+)/);
            return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null;
        }
        return null;
    } catch {
        return null;
    }
}

// ── Sticker map ───────────────────────────────────────────────
const STICKER_MAP: Record<string, string> = {
    'heart-big': '❤️',
    'heart-sparkling': '💖',
    'heart-arrow': '💘',
    'kiss': '💋',
    'rose': '🌹',
    'ring': '💍',
    'couple': '💑',
    'love-letter': '💌',
    'star': '⭐',
    'fire': '🔥',
    'butterfly': '🦋',
    'teddy': '🧸',
    'chocolate': '🍫',
    'champagne': '🍾',
    'moon': '🌙',
    'rainbow': '🌈',
};

// ── Music URLs ────────────────────────────────────────────────
const MUSIC_URLS: Record<string, string> = {
    'romantic-piano': '/audio/romantic-piano.mp3',
    'acoustic-guitar': '/audio/acoustic-guitar.mp3',
    'love-song': '/audio/love-song.mp3',
    'music-box': '/audio/music-box.mp3',
    'orchestra': '/audio/orchestra.mp3',
};

// ── EscapeNoButton — riso flat, blue outline ──────────────────
function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

function EscapeNoButton({
    label,
    containerRef,
    noButtonEscapes,
    onAnswer,
    answered,
}: {
    label: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
    noButtonEscapes: boolean;
    onAnswer: () => void;
    answered: boolean;
}) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLButtonElement>(null);

    const bump = () => {
        if (!noButtonEscapes || answered) return;
        const c = containerRef.current;
        const btn = ref.current;
        if (!c || !btn) return;
        const cr = c.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        const maxX = cr.width - br.width - 24;
        const maxY = cr.height - br.height - 24;
        setPos({
            x: (Math.random() - 0.5) * Math.min(maxX, 320),
            y: (Math.random() - 0.5) * Math.min(maxY, 200),
        });
    };

    return (
        <button
            ref={ref}
            onMouseEnter={bump}
            onFocus={bump}
            onClick={() => { if (!noButtonEscapes) onAnswer(); }}
            style={{
                position: 'relative',
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: 'transform 320ms cubic-bezier(.2,.9,.3,1.1)',
                background: 'transparent',
                color: 'var(--ink-blue)',
                border: '2px solid var(--ink-blue)',
                padding: '12px 28px',
                borderRadius: 0,
                fontFamily: 'var(--sans)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}
        >
            {label}
        </button>
    );
}

// ── VideoEmbed ─────────────────────────────────────────────────
function VideoEmbed({ url }: { url: string }) {
    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) return null;
    return (
        <div style={{ width: '100%', maxWidth: 480, margin: '20px auto', border: '2px solid var(--ink-black)' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                <iframe
                    src={embedUrl}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title="Video embed"
                />
            </div>
        </div>
    );
}

function renderMsg(text: string): React.ReactNode {
    if (!text || !text.includes('*')) return text;
    return text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2
            ? <em key={i} style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic' }}>{part.slice(1, -1)}</em>
            : part
    );
}

// ── YesScene ──────────────────────────────────────────────────
function YesScene({ recipient, sender, onReset }: { recipient: string; sender?: string; onReset: () => void }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'fadeUp .6s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 24, height: 1.5, background: 'var(--ink-blue)' }} />
                <span className="mono-eyebrow" style={{ fontSize: 10 }}>respuesta registrada</span>
                <span style={{ width: 24, height: 1.5, background: 'var(--ink-blue)' }} />
            </div>
            <h1 className="serif-display mis-red" style={{ fontSize: 'clamp(96px, 26vw, 140px)', margin: 0, lineHeight: 0.86 }}>
                sí.
            </h1>
            <div style={{ marginTop: 24, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-black)', maxWidth: 340, lineHeight: 1.5 }}>
                {recipient} ya recibió la noticia.
            </div>
            <button
                onClick={onReset}
                style={{ marginTop: 28, background: 'transparent', border: '1.5px solid var(--ink-blue)', padding: '8px 16px', borderRadius: 0, cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-blue)', textTransform: 'uppercase', letterSpacing: '0.15em' }}
            >
                ← ver carta otra vez
            </button>
            <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }`}</style>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────
export default function PublicPageView() {
    const params = useParams();
    const shortId = params.shortId as string;
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pageExpired, setPageExpired] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
    const [musicOn, setMusicOn] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pageLoadedRef = useRef(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (pageLoadedRef.current) return;
        pageLoadedRef.current = true;
        api.pages.getByShortId(shortId)
            .then(({ data }) => setPage(data.data))
            .catch((err: any) => {
                if (err.response?.status === 410 || err.response?.data?.code === 'PAGE_EXPIRED') {
                    setPageExpired(true);
                } else {
                    toast.error(t.publicPage.pageNotFound);
                }
            })
            .finally(() => setLoading(false));
    }, [shortId]);

    // Sólo se pide a Google la tipografía que esta carta use de verdad.
    useEffect(() => {
        const href = googleFontsHref([page?.titleFont, page?.bodyFont]);
        if (!href) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        return () => { link.remove(); };
    }, [page?.titleFont, page?.bodyFont]);

    const handleAnswer = async (answer: 'yes' | 'no') => {
        if (answered) return;
        try {
            await api.pages.respond(shortId, answer);
            setAnswered(true);
            setSelectedAnswer(answer);
        } catch {
            toast.error(t.publicPage.responseError);
        }
    };

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (musicOn) {
            audio.pause();
            setMusicOn(false);
        } else {
            audio.volume = 0.3;
            audio.play().then(() => setMusicOn(true)).catch(() => { });
        }
    };

    // ── Loading ───────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--lila)', borderTopColor: 'var(--ink-red)', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    // ── Expired ───────────────────────────────────────────────
    if (pageExpired) {
        return (
            <div className="grain" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', padding: 24, fontFamily: 'var(--mono)' }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <div className="mono-eyebrow" style={{ marginBottom: 16, color: 'var(--ink-red)' }}>— página expirada —</div>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(48px, 10vw, 72px)', lineHeight: 0.88, color: 'var(--ink-black)', marginBottom: 16 }}>
                        <span className="mis-red">esta</span> <span className="mis-blue">página</span> ya no está activa
                    </h1>
                    <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 28 }}>
                        Las páginas del plan gratuito están disponibles por 7 días.
                    </p>
                    <a href="/upgrade" className="btn-accent" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        crear con plan PRO
                    </a>
                </div>
            </div>
        );
    }

    // ── Not found ─────────────────────────────────────────────
    if (!page) {
        return (
            <div className="grain" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', padding: 24, fontFamily: 'var(--mono)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="mono-eyebrow" style={{ marginBottom: 16, color: 'var(--ink-blue)' }}>— 404 —</div>
                    <h1 className="serif-display mis-red" style={{ fontSize: 'clamp(48px, 10vw, 72px)', lineHeight: 0.88, marginBottom: 12 }}>
                        {t.publicPage.pageNotFound}
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{t.publicPage.pageNotFoundDesc}</p>
                </div>
            </div>
        );
    }

    // ── PRO page — custom AI HTML ─────────────────────────────
    if (page.pageType === 'pro' && page.customHTML && page.customCSS) {
        return (
            <>
                {answered && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div style={{ background: 'var(--paper)', border: '2px solid var(--ink-black)', padding: '32px 40px', textAlign: 'center', maxWidth: 400 }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>{selectedAnswer === 'yes' ? '💕' : '😊'}</div>
                            <h2 className="serif-display" style={{ fontSize: 36, color: 'var(--ink-black)', marginBottom: 8 }}>
                                {selectedAnswer === 'yes' ? t.publicPage.thanks : t.publicPage.understood}
                            </h2>
                            <p style={{ color: 'var(--ink-soft)', fontFamily: 'var(--mono)', fontSize: 13 }}>{t.publicPage.responseRecorded}</p>
                        </div>
                    </div>
                )}
                {page.backgroundMusic && page.backgroundMusic !== 'none' && (
                    <audio ref={audioRef} src={MUSIC_URLS[page.backgroundMusic]} loop preload="auto" />
                )}
                <ProPageRenderer
                    html={page.customHTML}
                    css={page.customCSS}
                    noButtonEscapes={page.noButtonEscapes && !answered}
                    onYesClick={() => handleAnswer('yes')}
                    onNoClick={() => handleAnswer('no')}
                />
            </>
        );
    }

    // ── FREE page — Risograph zine aesthetic ──────────────────
    const stickers = (page.selectedStickers || []).map((id: string) => STICKER_MAP[id] || '💖');
    const words = (page.title || '').trim().split(/\s+/);
    const hasMusic = page.backgroundMusic && page.backgroundMusic !== 'none';
    const hasAnimation = hasParticles(page.animation);
    const customTitleFont = Boolean(page.titleFont) && page.titleFont !== RISO_FONT;
    const customBodyFont = Boolean(page.bodyFont) && page.bodyFont !== RISO_FONT;
    // `multiply` desaparece sobre papel oscuro; ahí las tintas van en `screen`.
    const inkBlend: 'multiply' | 'screen' = isDarkColor(page.backgroundColor) ? 'screen' : 'multiply';

    return (
        <div
            ref={containerRef}
            className="grain"
            style={{
                // Misma traducción de paleta que usa el editor: lo que se ve en
                // el preview es literalmente lo que se publica.
                ...pageThemeVars(page),
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                background: 'var(--paper)',
                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.1  0 0 0 0 0 0 0 0 0.35 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")",
                overflow: 'hidden',
                fontFamily: 'var(--mono)',
                color: 'var(--ink-black)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Imagen de fondo — cubre la página entera, no sólo el bloque de
                texto donde estaba antes, y con un velo de papel que mantiene
                legible la carta. */}
            {page.backgroundImageUrl && (
                <>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${page.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', opacity: 0.68, pointerEvents: 'none', zIndex: 0 }} />
                </>
            )}

            {/* Particle canvas */}
            {hasAnimation && <ParticleCanvas kind={animToKind(page.animation)} />}

            {/* Riso circles — top right */}
            <svg style={{ position: 'absolute', top: -60, right: -80, width: 320, height: 320, mixBlendMode: inkBlend, opacity: 0.78, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="var(--ink-red)" />
            </svg>
            <svg style={{ position: 'absolute', top: -40, right: -100, width: 320, height: 320, mixBlendMode: inkBlend, opacity: 0.7, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="86" fill="var(--ink-blue)" />
            </svg>

            {/* Audio */}
            {hasMusic && <audio ref={audioRef} src={MUSIC_URLS[page.backgroundMusic]} loop preload="auto" />}

            {/* Top chrome — music toggle only */}
            {hasMusic && (
                <div style={{ position: 'absolute', top: 14, right: 20, zIndex: 5 }}>
                    <button
                        onClick={toggleMusic}
                        aria-label="música"
                        style={{ width: 34, height: 34, borderRadius: 0, border: '2px solid var(--ink-blue)', background: musicOn ? 'var(--ink-blue)' : 'transparent', color: musicOn ? 'var(--paper)' : 'var(--ink-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'var(--mono)' }}
                    >
                        ♪
                    </button>
                </div>
            )}

            {/* Main */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '70px 24px 100px', textAlign: 'center', zIndex: 3, position: 'relative' }}>

                {!answered ? (
                    <>
                        {/* Eyebrow */}
                        <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 24, height: 1.5, background: 'var(--ink-blue)' }} />
                            <span className="mono-eyebrow" style={{ fontSize: 10 }}>una carta para {(page.recipientName || '').toLowerCase()}</span>
                            <span style={{ width: 24, height: 1.5, background: 'var(--ink-blue)' }} />
                        </div>

                        {/* Stickers + title */}
                        <div style={{ position: 'relative' }}>
                            {stickers[0] && (
                                <span style={{ position: 'absolute', left: -28, top: 4, fontSize: 26, color: 'var(--ink-red)', transform: 'rotate(-18deg)' }}>{stickers[0]}</span>
                            )}
                            {stickers[1] && (
                                <span style={{ position: 'absolute', right: -24, top: -10, fontSize: 22, color: 'var(--ink-blue)', transform: 'rotate(14deg)' }}>{stickers[1]}</span>
                            )}
                            <h1
                                className="serif-display"
                                style={{
                                    fontFamily: titleFontFamily(page.titleFont),
                                    textTransform: customTitleFont ? 'none' : 'uppercase',
                                    lineHeight: customTitleFont ? 1.04 : 0.86,
                                    fontSize: 'clamp(54px, 13vw, 80px)', margin: 0, maxWidth: 360,
                                }}
                            >
                                {words.map((w: string, i: number) => (
                                    <span
                                        key={i}
                                        className={i % 2 === 0 ? 'mis-red' : 'mis-blue'}
                                        style={{ display: 'inline-block', marginRight: '0.18em' }}
                                    >
                                        {w}
                                    </span>
                                ))}
                            </h1>
                        </div>

                        {/* Message */}
                        {page.message && (
                            <div style={{ marginTop: 26, fontFamily: bodyFontFamily(page.bodyFont), fontSize: 17, fontStyle: customBodyFont ? 'normal' : 'italic', color: 'var(--ink-black)', maxWidth: 320, lineHeight: 1.55 }}>
                                {renderMsg(page.message)}
                            </div>
                        )}

                        {/* Decorative images */}
                        {(page.decorativeImageUrls || []).length > 0 && (
                            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {page.decorativeImageUrls.slice(0, 3).map((url: string, i: number) => (
                                    <img key={i} src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', border: '2px solid var(--ink-black)' }} />
                                ))}
                            </div>
                        )}

                        {/* Video */}
                        {page.videoUrl && <VideoEmbed url={page.videoUrl} />}

                        {/* Sender */}
                        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 18, height: 1, background: 'var(--ink-red-ink)' }} />
                            <span style={{ fontSize: 24, color: 'var(--ink-red-ink)', fontFamily: 'var(--hand)' }}>— con amor</span>
                            {stickers[2] && <span style={{ fontSize: 18 }}>{stickers[2]}</span>}
                        </div>

                        {/* CTA */}
                        <div style={{ marginTop: 40, display: 'flex', gap: 16, alignItems: 'center', position: 'relative' }}>
                            <button
                                onClick={() => handleAnswer('yes')}
                                className="btn-accent"
                                style={{ padding: '14px 32px', fontSize: 15 }}
                            >
                                {page.yesButtonText}
                            </button>
                            <EscapeNoButton
                                label={page.noButtonText}
                                containerRef={containerRef}
                                noButtonEscapes={!!page.noButtonEscapes}
                                onAnswer={() => handleAnswer('no')}
                                answered={answered}
                            />
                        </div>

                        {/* Footer */}
                        <div style={{ position: 'absolute', bottom: 16, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                            <span>printed with ♥</span>
                            <span>lovepages · mx</span>
                        </div>
                    </>
                ) : (
                    <YesScene
                        recipient={page.recipientName || ''}
                        onReset={() => { setAnswered(false); setSelectedAnswer(null); }}
                    />
                )}
            </div>
        </div>
    );
}
