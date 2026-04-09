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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    // ---- Expired ----
    if (pageExpired) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                <div className="text-center max-w-sm mx-auto px-6">
                    <div className="text-6xl mb-4">⏰</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Esta página ha expirado</h1>
                    <p className="text-gray-600 mb-6">
                        Las páginas del plan gratuito están disponibles por 7 días. Esta página ya no está activa.
                    </p>
                    <a
                        href="/upgrade"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold rounded-full shadow hover:from-amber-500 hover:to-yellow-600 transition-all"
                    >
                        Crear con plan PRO — sin vencimiento
                    </a>
                </div>
            </div>
        );
    }

    // ---- Not found ----
    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.publicPage.pageNotFound}</h1>
                    <p className="text-gray-600">{t.publicPage.pageNotFoundDesc}</p>
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

    // ---- FREE page with enhanced design ----
    const animationClass = page.animation === 'fade-in' ? 'animate-fade-in' : '';
    const titleFont = page.titleFont || 'inherit';
    const bodyFont = page.bodyFont || 'inherit';
    const accentColor = page.accentColor || page.backgroundColor;

    return (
        <div
            className={`min-h-screen flex items-center justify-center p-4 transition-all relative overflow-hidden ${animationClass}`}
            style={{ backgroundColor: page.backgroundColor, color: page.textColor }}
        >
            {/* Imagen de fondo */}
            {page.backgroundImageUrl && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${page.backgroundImageUrl})`,
                        opacity: 0.25,
                    }}
                />
            )}

            {/* Animación de fondo */}
            <BackgroundAnimation type={page.animation || 'none'} color={page.textColor} />

            {/* Música de fondo */}
            {page.backgroundMusic && page.backgroundMusic !== 'none' && (
                <MusicPlayer musicId={page.backgroundMusic} />
            )}

            {/* Contenido principal */}
            <div className="max-w-2xl w-full text-center relative z-20">
                {/* Stickers */}
                <FloatingStickers stickerIds={page.selectedStickers || []} />

                {/* Corazón animado */}
                <div className="mb-6">
                    <Heart
                        className="w-20 h-20 mx-auto animate-heart-beat"
                        style={{ color: page.textColor }}
                    />
                </div>

                {/* Título */}
                <h1
                    className="text-4xl md:text-5xl font-bold mb-6"
                    style={{
                        fontFamily: `'${titleFont}', cursive`,
                        color: page.textColor,
                        animation: 'fadeInUp 0.8s ease-out both',
                    }}
                >
                    {page.title}
                </h1>

                {/* Nombre del destinatario */}
                <div
                    className="text-2xl md:text-3xl mb-4"
                    style={{
                        fontFamily: `'${bodyFont}', sans-serif`,
                        animation: 'fadeInUp 0.8s ease-out 0.2s both',
                    }}
                >
                    <span className="font-semibold">{page.recipientName}</span>
                </div>

                {/* Mensaje */}
                {page.message && (
                    <p
                        className="text-lg md:text-xl mb-6 opacity-90 max-w-xl mx-auto"
                        style={{
                            fontFamily: `'${bodyFont}', sans-serif`,
                            animation: 'fadeInUp 0.8s ease-out 0.4s both',
                        }}
                    >
                        {page.message}
                    </p>
                )}

                {/* Imágenes decorativas */}
                <DecorativeImages urls={page.decorativeImageUrls || []} />

                {/* Video embed */}
                {page.videoUrl && <VideoEmbed url={page.videoUrl} />}

                {/* Botones */}
                {!answered ? (
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
                        style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
                    >
                        <button
                            onClick={() => handleAnswer('yes')}
                            className="px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all min-w-[150px] shadow-lg"
                            style={{
                                backgroundColor: accentColor,
                                color: page.textColor,
                                fontFamily: `'${bodyFont}', sans-serif`,
                            }}
                        >
                            {page.yesButtonText}
                        </button>

                        {/* Botón No: si NO está escapando, renderizar inline */}
                        {!noButtonInitialized && (
                            <button
                                ref={noButtonRef}
                                onMouseEnter={handleNoButtonMouseEnter}
                                onTouchStart={handleNoButtonTouchStart}
                                onClick={() => !page.noButtonEscapes && handleAnswer('no')}
                                className="px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-colors min-w-[150px]"
                                style={{
                                    color: page.textColor,
                                    fontFamily: `'${bodyFont}', sans-serif`,
                                }}
                            >
                                {page.noButtonText}
                            </button>
                        )}

                        {/* Botón No escapando: renderizar con portal fuera de cualquier transform */}
                        {noButtonInitialized && noButtonPos && typeof document !== 'undefined' &&
                            createPortal(
                                <button
                                    onMouseEnter={handleNoButtonMouseEnter}
                                    onTouchStart={handleNoButtonTouchStart}
                                    onClick={() => {
                                        if (page.noButtonEscapes) return;
                                        handleAnswer('no');
                                    }}
                                    className="px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 min-w-[150px]"
                                    style={{
                                        position: 'fixed',
                                        left: `${noButtonPos.x}px`,
                                        top: `${noButtonPos.y}px`,
                                        zIndex: 9999,
                                        color: page.textColor,
                                        fontFamily: `'${bodyFont}', sans-serif`,
                                        transition: 'left 0.25s ease-out, top 0.25s ease-out',
                                        margin: 0,
                                    }}
                                >
                                    {page.noButtonText}
                                </button>,
                                document.body
                            )
                        }
                    </div>
                ) : (
                    <div
                        className="mt-10 p-6 bg-white/20 backdrop-blur rounded-xl inline-block"
                        style={{ animation: 'fadeInUp 0.5s ease-out both' }}
                    >
                        <div
                            className="text-2xl font-semibold mb-2"
                            style={{ fontFamily: `'${titleFont}', cursive` }}
                        >
                            {selectedAnswer === 'yes' ? `${t.publicPage.thanks} 💕` : `${t.publicPage.understood} 😊`}
                        </div>
                        <p
                            className="text-sm opacity-90"
                            style={{ fontFamily: `'${bodyFont}', sans-serif` }}
                        >
                            {t.publicPage.responseRecorded}
                        </p>
                    </div>
                )}

                {/* Watermark */}
                {page.showWatermark && (
                    <p
                        className="mt-12 text-xs opacity-30"
                        style={{ fontFamily: `'${bodyFont}', sans-serif` }}
                    >
                        {t.publicPage.madeWith}
                    </p>
                )}
            </div>

            {/* CSS para animaciones inline */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes heartBeat {
                    0%, 100% {
                        transform: scale(1);
                    }
                    25% {
                        transform: scale(1.1);
                    }
                    50% {
                        transform: scale(1);
                    }
                    75% {
                        transform: scale(1.05);
                    }
                }

                .animate-heart-beat {
                    animation: heartBeat 1.5s ease-in-out infinite;
                }

                .animate-fade-in {
                    animation: fadeInUp 1s ease-out both;
                }
            `}</style>
        </div>
    );
}