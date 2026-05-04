'use client';

import { useEffect, useState, useRef, useMemo } from 'react';

/** Convierte una URL de YouTube o TikTok a su URL de embed. Devuelve null si no es soportada. */
function getEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        // YouTube: youtube.com/watch?v=ID  |  youtu.be/ID  |  youtube.com/shorts/ID
        if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
            let videoId = u.searchParams.get('v');
            if (!videoId) {
                const parts = u.pathname.split('/').filter(Boolean);
                videoId = parts[parts.indexOf('shorts') + 1] || parts[parts.length - 1];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
        }
        // TikTok: tiktok.com/@user/video/ID
        if (u.hostname.includes('tiktok.com')) {
            const match = u.pathname.match(/\/video\/(\d+)/);
            return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null;
        }
        return null;
    } catch {
        return null;
    }
}
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Heart, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProPageRenderer } from '@/components/ProPageRenderer';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/i18n';

// ============================================================
// STICKER MAP (mismo que en create-page-enhanced)
// ============================================================
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

// ============================================================
// MUSIC URLs (reemplaza con tus URLs reales de audio)
// ============================================================
const MUSIC_URLS: Record<string, string> = {
    'romantic-piano': '/audio/romantic-piano.mp3',
    'acoustic-guitar': '/audio/acoustic-guitar.mp3',
    'love-song': '/audio/love-song.mp3',
    'music-box': '/audio/music-box.mp3',
    'orchestra': '/audio/orchestra.mp3',
};

// ============================================================
// COMPONENTE: Animación de fondo
// ============================================================
function BackgroundAnimation({ type, color }: { type: string; color: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || type === 'none') return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Partículas
        interface Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            rotation: number;
            rotationSpeed: number;
            emoji?: string;
        }

        const particles: Particle[] = [];
        const particleCount = type === 'particles' ? 60 : 30;

        const getEmoji = (): string => {
            switch (type) {
                case 'hearts-falling': return ['❤️', '💕', '💖', '💗'][Math.floor(Math.random() * 4)];
                case 'snow': return '❄️';
                case 'petals': return ['🌸', '🩷', '💮'][Math.floor(Math.random() * 3)];
                case 'confetti': return ['🎊', '✨', '🎉', '⭐'][Math.floor(Math.random() * 4)];
                case 'fireworks': return ['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)];
                case 'bubbles': return '🫧';
                default: return '✨';
            }
        };

        // Inicializar partículas
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 20 + 12,
                speedX: (Math.random() - 0.5) * 2,
                speedY: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.7 + 0.3,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 4,
                emoji: getEmoji(),
            });
        }

        // Ajustar velocidades según tipo
        if (type === 'snow') {
            particles.forEach(p => {
                p.speedY = Math.random() * 1 + 0.3;
                p.speedX = (Math.random() - 0.5) * 0.8;
            });
        } else if (type === 'float-up') {
            particles.forEach(p => {
                p.speedY = -(Math.random() * 1.5 + 0.5);
                p.y = canvas.height + Math.random() * 100;
                p.emoji = ['✨', '💕', '⭐'][Math.floor(Math.random() * 3)];
            });
        } else if (type === 'bubbles') {
            particles.forEach(p => {
                p.speedY = -(Math.random() * 1 + 0.3);
                p.y = canvas.height + Math.random() * 100;
                p.speedX = (Math.random() - 0.5) * 0.5;
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.rotation += p.rotationSpeed;

                // Reset cuando sale de pantalla
                if (type === 'float-up' || type === 'bubbles') {
                    if (p.y < -50) {
                        p.y = canvas.height + 20;
                        p.x = Math.random() * canvas.width;
                    }
                } else {
                    if (p.y > canvas.height + 50) {
                        p.y = -20;
                        p.x = Math.random() * canvas.width;
                    }
                }

                if (p.x < -50) p.x = canvas.width + 20;
                if (p.x > canvas.width + 50) p.x = -20;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.font = `${p.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.emoji || '✨', 0, 0);
                ctx.restore();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [type, color]);

    if (type === 'none' || type === 'fade-in') return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-10"
            style={{ width: '100%', height: '100%' }}
        />
    );
}

// ============================================================
// COMPONENTE: Reproductor de música
// ============================================================
function MusicPlayer({ musicId }: { musicId: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);

    const musicUrl = MUSIC_URLS[musicId];

    useEffect(() => {
        if (!musicUrl) return;

        // Intentar autoplay después de interacción del usuario
        const handleInteraction = () => {
            if (!userInteracted) {
                setUserInteracted(true);
                if (audioRef.current) {
                    audioRef.current.volume = 0.3;
                    audioRef.current.play().then(() => {
                        setPlaying(true);
                    }).catch(() => {
                        // Autoplay bloqueado, el usuario puede dar click
                    });
                }
            }
        };

        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, [musicUrl, userInteracted]);

    const toggleMusic = () => {
        if (!audioRef.current) return;

        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.volume = 0.3;
            audioRef.current.play().then(() => setPlaying(true)).catch(() => { });
        }
    };

    if (!musicUrl) return null;

    return (
        <>
            <audio ref={audioRef} src={musicUrl} loop preload="auto" />
            <button
                onClick={toggleMusic}
                className="fixed top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-all"
                aria-label={playing ? 'Pausar música' : 'Reproducir música'}
            >
                {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
        </>
    );
}

// ============================================================
// COMPONENTE: Stickers flotantes
// ============================================================
function FloatingStickers({ stickerIds }: { stickerIds: string[] }) {
    if (!stickerIds || stickerIds.length === 0) return null;

    return (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
            {stickerIds.map((id, index) => (
                <span
                    key={id}
                    className="text-4xl"
                    style={{
                        animation: `bounce 2s ease-in-out ${index * 0.2}s infinite`,
                        display: 'inline-block',
                    }}
                >
                    {STICKER_MAP[id] || '💖'}
                </span>
            ))}
        </div>
    );
}

// ============================================================
// COMPONENTE: Imágenes decorativas
// ============================================================
function DecorativeImages({ urls }: { urls: string[] }) {
    if (!urls || urls.length === 0) return null;

    return (
        <div className="flex flex-wrap justify-center gap-3 my-6">
            {urls.map((url, i) => (
                <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl border-2 border-white/30 shadow-lg"
                    style={{
                        animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both`,
                    }}
                />
            ))}
        </div>
    );
}

// ============================================================
// COMPONENTE: Video embed
// ============================================================
function VideoEmbed({ url }: { url: string }) {
    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) return null;

    return (
        <div className="w-full max-w-lg mx-auto my-6 rounded-xl overflow-hidden shadow-lg">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title="Video embed"
                />
            </div>
        </div>
    );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function PublicPageView() {
    const params = useParams();
    const shortId = params.shortId as string;
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pageExpired, setPageExpired] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (pageLoadedRef.current) return;
        pageLoadedRef.current = true;
        loadPage();
    }, [shortId]);

    // Cargar Google Fonts dinámicamente según la página
    useEffect(() => {
        if (!page) return;
        const fonts = [page.titleFont, page.bodyFont].filter(Boolean);
        if (fonts.length === 0) return;

        const fontsParam = fonts.map((f: string) => f.replace(/ /g, '+')).join('&family=');
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontsParam}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, [page?.titleFont, page?.bodyFont]);

    const loadPage = async () => {
        try {
            const { data } = await api.pages.getByShortId(shortId);
            setPage(data.data);
        } catch (error: any) {
            if (error.response?.status === 410 || error.response?.data?.code === 'PAGE_EXPIRED') {
                setPageExpired(true);
            } else {
                toast.error(t.publicPage.pageNotFound);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (answer: 'yes' | 'no') => {
        if (answered) return;

        try {
            await api.pages.respond(shortId, answer);
            setAnswered(true);
            setSelectedAnswer(answer);

            if (answer === 'yes') {
                toast.success(t.publicPage.joyResponse, {
                    duration: 4000,
                    icon: '💖',
                });
            } else {
                toast(t.publicPage.responseRegistered, {
                    duration: 3000,
                    icon: '😊',
                });
            }
        } catch (error) {
            toast.error(t.publicPage.responseError);
        }
    };
    const pageLoadedRef = useRef(false);
    const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);
    const [noButtonInitialized, setNoButtonInitialized] = useState(false);

    const handleNoButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!page?.noButtonEscapes || answered) return;

        const button = e.currentTarget;
        const bw = button.offsetWidth;
        const bh = button.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 20;

        // Primera vez: capturar posición original
        if (!noButtonInitialized) {
            const rect = button.getBoundingClientRect();
            setNoButtonInitialized(true);
            // Generar primera posición aleatoria
            const safeMaxX = vw - bw - margin;
            const safeMaxY = vh - bh - margin;
            setNoButtonPos({
                x: margin + Math.random() * Math.max(0, safeMaxX - margin),
                y: margin + Math.random() * Math.max(0, safeMaxY - margin),
            });
            return;
        }

        const safeMaxX = vw - bw - margin;
        const safeMaxY = vh - bh - margin;

        setNoButtonPos({
            x: margin + Math.random() * Math.max(0, safeMaxX - margin),
            y: margin + Math.random() * Math.max(0, safeMaxY - margin),
        });
    };

    const handleNoButtonTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (!page?.noButtonEscapes || answered) return;
        e.preventDefault();
        handleNoButtonMouseEnter(e as any);
    };

    // ---- Loading ----
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #ede4fa 0%, #fde5dd 50%, #ffd4d4 100%)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, border: '3px solid #d9c7f5', borderTopColor: '#ff6b9d', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    // ---- Expired ----
    if (pageExpired) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #ede4fa 0%, #fde5dd 50%, #ffd4d4 100%)', padding: '24px' }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <div style={{ fontSize: 72, marginBottom: 16 }}>⏰</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'white', border: '2px solid #2d1b3d', borderRadius: 999, boxShadow: '3px 3px 0 #2d1b3d', fontWeight: 600, fontSize: 12, marginBottom: 16 }}>
                        <span>😔</span><span>página expirada</span>
                    </div>
                    <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 40, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#2d1b3d', margin: '0 0 12px' }}>
                        esta <em style={{ fontStyle: 'italic', color: '#ff6b9d' }}>página</em> ya no está activa
                    </h1>
                    <p style={{ fontSize: 16, color: '#4d3361', lineHeight: 1.55, marginBottom: 28 }}>
                        Las páginas del plan gratuito están disponibles por 7 días.
                    </p>
                    <a href="/upgrade" style={{ display: 'inline-block', background: '#ff6b9d', color: 'white', border: '2px solid #2d1b3d', padding: '14px 24px', borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '3px 3px 0 #2d1b3d' }}>
                        crear con plan PRO · sin vencimiento ✨
                    </a>
                </div>
            </div>
        );
    }

    // ---- Not found ----
    if (!page) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #ede4fa 0%, #fde5dd 50%, #ffd4d4 100%)', padding: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 72, marginBottom: 16 }}>💔</div>
                    <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 40, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#2d1b3d', margin: '0 0 12px' }}>
                        {t.publicPage.pageNotFound}
                    </h1>
                    <p style={{ fontSize: 16, color: '#4d3361' }}>{t.publicPage.pageNotFoundDesc}</p>
                </div>
            </div>
        );
    }

    // ---- PRO page with custom AI HTML ----
    if (page.pageType === 'pro' && page.customHTML && page.customCSS) {
        return (
            <>
                {answered && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-bounce-soft">
                            <div className="text-6xl mb-4">
                                {selectedAnswer === 'yes' ? '💕' : '😊'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {selectedAnswer === 'yes' ? t.publicPage.thanks : t.publicPage.understood}
                            </h2>
                            <p className="text-gray-600">{t.publicPage.responseRecorded}</p>
                        </div>
                    </div>
                )}

                {/* Música de fondo (también para PRO) */}
                {page.backgroundMusic && page.backgroundMusic !== 'none' && (
                    <MusicPlayer musicId={page.backgroundMusic} />
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

    // ---- FREE page — Pastel Gen-Z aesthetic ----
    const stickers = (page.selectedStickers || []).map((id: string) => STICKER_MAP[id] || '💖').slice(0, 3);
    const titleFont = page.titleFont;
    const bodyFont = page.bodyFont;

    return (
        <div
            style={{
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                background: page.backgroundColor || 'linear-gradient(160deg, #ede4fa 0%, #fde5dd 50%, #ffd4d4 100%)',
                overflow: 'hidden',
                fontFamily: 'Bricolage Grotesque, system-ui, sans-serif',
                color: page.textColor || '#2d1b3d',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Soft blob shapes */}
            <div style={{ position: 'absolute', top: '-10%', left: '-15%', width: '60%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,199,245,0.6), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: '70%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,181,154,0.5), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            {/* Background image */}
            {page.backgroundImageUrl && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${page.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2, pointerEvents: 'none' }} />
            )}

            {/* Particle animation */}
            <BackgroundAnimation type={page.animation || 'none'} color={page.textColor || '#ff6b9d'} />

            {/* Music */}
            {page.backgroundMusic && page.backgroundMusic !== 'none' && (
                <MusicPlayer musicId={page.backgroundMusic} />
            )}


            {/* Main composition */}
            <div style={{ position: 'relative', zIndex: 3, padding: '80px 24px 100px', textAlign: 'center', maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {!answered ? (
                    <>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(237,228,250,0.9)', border: '2px solid #2d1b3d', borderRadius: 999, boxShadow: '3px 3px 0 #2d1b3d', fontWeight: 600, fontSize: 12, marginBottom: 22 }}>
                            <span>💌</span><span>una carta para {page.recipientName?.toLowerCase()}</span>
                        </div>

                        {/* Floating stickers + title */}
                        <div style={{ position: 'relative', marginBottom: 4 }}>
                            {stickers[0] && <span style={{ position: 'absolute', left: -36, top: -10, fontSize: 32, transform: 'rotate(-18deg)', filter: 'drop-shadow(2px 2px 0 rgba(45,27,61,0.15))' }}>{stickers[0]}</span>}
                            {stickers[1] && <span style={{ position: 'absolute', right: -32, top: -20, fontSize: 28, transform: 'rotate(20deg)', filter: 'drop-shadow(2px 2px 0 rgba(45,27,61,0.15))' }}>{stickers[1]}</span>}

                            <h1 style={{
                                fontFamily: titleFont ? `'${titleFont}', Fraunces, Georgia, serif` : 'Fraunces, Georgia, serif',
                                fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 0.95,
                                fontSize: 'clamp(40px, 10vw, 60px)', margin: 0, color: page.textColor || '#2d1b3d',
                            }}>
                                {page.title}
                            </h1>
                        </div>

                        {/* Message */}
                        {page.message && (
                            <p style={{ marginTop: 24, fontFamily: bodyFont ? `'${bodyFont}', sans-serif` : 'inherit', fontSize: 16, color: page.textColor || '#4d3361', maxWidth: 320, lineHeight: 1.55, fontWeight: 400, opacity: 0.9 }}>
                                {page.message}
                            </p>
                        )}

                        {/* Images & video */}
                        <DecorativeImages urls={page.decorativeImageUrls || []} />
                        {page.videoUrl && <VideoEmbed url={page.videoUrl} />}

                        {/* Sender signature */}
                        <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: 'white', borderRadius: 999, border: '2px solid #2d1b3d', boxShadow: '3px 3px 0 #2d1b3d' }}>
                            <span style={{ fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: 22, color: '#ff6b9d' }}>
                                con amor ♥
                            </span>
                            {stickers[2] && <span style={{ fontSize: 18 }}>{stickers[2]}</span>}
                        </div>

                        {/* CTA buttons */}
                        <div style={{ marginTop: 44, display: 'flex', gap: 16, alignItems: 'center', position: 'relative' }}>
                            <button
                                onClick={() => handleAnswer('yes')}
                                style={{ background: page.accentColor || '#ff6b9d', color: 'white', border: '2px solid #2d1b3d', padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '3px 3px 0 #2d1b3d' }}
                            >
                                {page.yesButtonText}
                            </button>

                            {!noButtonInitialized && (
                                <button
                                    ref={noButtonRef}
                                    onMouseEnter={handleNoButtonMouseEnter}
                                    onTouchStart={handleNoButtonTouchStart}
                                    onClick={() => !page.noButtonEscapes && handleAnswer('no')}
                                    style={{ background: 'white', color: '#2d1b3d', border: '2px solid #2d1b3d', padding: '14px 30px', borderRadius: 999, fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '3px 3px 0 #2d1b3d' }}
                                >
                                    {page.noButtonText}
                                </button>
                            )}

                            {noButtonInitialized && noButtonPos && typeof document !== 'undefined' &&
                                createPortal(
                                    <button
                                        onMouseEnter={handleNoButtonMouseEnter}
                                        onTouchStart={handleNoButtonTouchStart}
                                        onClick={() => { if (!page.noButtonEscapes) handleAnswer('no'); }}
                                        style={{ position: 'fixed', left: `${noButtonPos.x}px`, top: `${noButtonPos.y}px`, zIndex: 9999, background: 'white', color: '#2d1b3d', border: '2px solid #2d1b3d', padding: '14px 30px', borderRadius: 999, fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '3px 3px 0 #2d1b3d', transition: 'left 0.25s cubic-bezier(.2,.9,.3,1.1), top 0.25s cubic-bezier(.2,.9,.3,1.1)', margin: 0 }}
                                    >
                                        {page.noButtonText}
                                    </button>,
                                    document.body
                                )
                            }
                        </div>

                        {/* Watermark */}
                        {page.showWatermark && (
                            <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                                <span style={{ fontSize: 10, color: 'rgba(45,27,61,0.4)', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, letterSpacing: '0.06em' }}>
                                    made with 💗 on lovepages
                                </span>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'fadeUp .6s ease' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#b8e6d2', border: '2px solid #2d1b3d', borderRadius: 999, boxShadow: '3px 3px 0 #2d1b3d', fontWeight: 600, fontSize: 12, marginBottom: 18 }}>
                            <span>✨</span><span>{selectedAnswer === 'yes' ? 'respondiste que sí 💖' : 'respuesta registrada'}</span>
                        </div>
                        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 0.95, fontSize: 'clamp(64px, 18vw, 100px)', margin: 0, color: '#2d1b3d' }}>
                            {selectedAnswer === 'yes'
                                ? <><em style={{ fontStyle: 'italic', color: '#ff6b9d' }}>¡sí!</em><span style={{ fontSize: 56, marginLeft: 8 }}>💖</span></>
                                : <em style={{ fontStyle: 'italic', color: '#8a7099' }}>entendido</em>
                            }
                        </h1>
                        <div style={{ marginTop: 20, fontSize: 16, color: '#4d3361', maxWidth: 300, lineHeight: 1.55 }}>
                            {t.publicPage.responseRecorded}
                        </div>
                        <button onClick={() => { setAnswered(false); setSelectedAnswer(null); setNoButtonPos(null); setNoButtonInitialized(false); }}
                            style={{ marginTop: 28, background: 'white', border: '2px solid #2d1b3d', padding: '8px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 11, boxShadow: '2px 2px 0 #2d1b3d', color: '#8a7099', fontWeight: 600, letterSpacing: '0.06em' }}>
                            ← ver carta otra vez
                        </button>
                        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }`}</style>
                    </div>
                )}
            </div>
        </div>
    );
}