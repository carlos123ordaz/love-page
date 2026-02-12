'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { LoginButton } from '@/components/auth/login-page';
import { Heart, Sparkles, Eye, Send, Crown, ChevronDown, Star, ArrowRight, Play, Check, X, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============================================================
// MINI PREVIEW COMPONENT - Interactive demo card
// ============================================================
function MiniPagePreview({
    title,
    recipient,
    message,
    theme,
    yesText,
    noText,
    noEscapes,
    stickers,
    animation,
}: {
    title: string;
    recipient: string;
    message: string;
    theme: { bg: string; text: string; accent: string; name: string };
    yesText: string;
    noText: string;
    noEscapes: boolean;
    stickers: string[];
    animation: string;
}) {
    const [answered, setAnswered] = useState(false);
    const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
    const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string; delay: number }[]>([]);

    useEffect(() => {
        if (animation === 'hearts-falling' || animation === 'confetti') {
            const emojis = animation === 'hearts-falling'
                ? ['❤️', '💕', '💖', '💗']
                : ['🎊', '✨', '🎉', '⭐'];
            const newParticles = Array.from({ length: 12 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                delay: Math.random() * 3,
            }));
            setParticles(newParticles);
        }
    }, [animation]);

    const handleNoHover = () => {
        if (!noEscapes || answered) return;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        setNoPos({
            x: Math.random() * (rect.width - 100),
            y: Math.random() * (rect.height - 50),
        });
    };

    const handleAnswer = (a: 'yes' | 'no') => {
        setAnswered(true);
        setAnswer(a);
    };

    const reset = () => {
        setAnswered(false);
        setAnswer(null);
        setNoPos(null);
    };

    return (
        <div
            ref={containerRef}
            className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-w-[320px] mx-auto"
            style={{ backgroundColor: theme.bg, color: theme.text }}
        >
            {/* Falling particles */}
            {particles.map((p) => (
                <span
                    key={p.id}
                    className="absolute text-sm pointer-events-none opacity-60"
                    style={{
                        left: `${p.x}%`,
                        top: `-10%`,
                        animation: `demoFall ${4 + p.delay}s linear ${p.delay}s infinite`,
                    }}
                >
                    {p.emoji}
                </span>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full p-5 text-center">
                {/* Stickers */}
                {stickers.length > 0 && (
                    <div className="flex gap-1.5 mb-3">
                        {stickers.map((s, i) => (
                            <span key={i} className="text-2xl" style={{ animation: `demoBounce 2s ease-in-out ${i * 0.15}s infinite` }}>
                                {s}
                            </span>
                        ))}
                    </div>
                )}

                <Heart
                    className="w-10 h-10 mb-3"
                    style={{ animation: 'demoHeartBeat 1.5s ease-in-out infinite', color: theme.text }}
                />

                <h3 className="text-xl font-bold mb-2 leading-tight" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    {title}
                </h3>

                <p className="text-base font-medium mb-1">{recipient}</p>

                {message && (
                    <p className="text-xs opacity-80 mb-4 max-w-[85%] leading-relaxed">{message}</p>
                )}

                {/* Buttons */}
                {!answered ? (
                    <div className="flex gap-3 mt-auto relative w-full justify-center">
                        <button
                            onClick={() => handleAnswer('yes')}
                            className="px-5 py-2 text-sm font-bold rounded-lg transition-transform hover:scale-105 shadow-md"
                            style={{ backgroundColor: theme.accent, color: theme.text }}
                        >
                            {yesText}
                        </button>

                        {!noPos ? (
                            <button
                                onMouseEnter={handleNoHover}
                                onTouchStart={(e) => { e.preventDefault(); handleNoHover(); }}
                                onClick={() => !noEscapes && handleAnswer('no')}
                                className="px-5 py-2 text-sm font-bold rounded-lg bg-white/15 backdrop-blur transition-colors hover:bg-white/25"
                                style={{ color: theme.text }}
                            >
                                {noText}
                            </button>
                        ) : null}

                        {noPos && (
                            <button
                                onMouseEnter={handleNoHover}
                                onTouchStart={(e) => { e.preventDefault(); handleNoHover(); }}
                                className="absolute px-5 py-2 text-sm font-bold rounded-lg bg-white/15 backdrop-blur transition-all duration-200"
                                style={{ left: noPos.x, top: noPos.y, color: theme.text }}
                            >
                                {noText}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="mt-auto bg-white/15 backdrop-blur rounded-xl p-4">
                        <p className="text-2xl mb-1">{answer === 'yes' ? '💕' : '😊'}</p>
                        <p className="text-sm font-bold">{answer === 'yes' ? '¡Gracias!' : 'Entendido'}</p>
                        <button
                            onClick={reset}
                            className="mt-2 text-[10px] underline opacity-60 hover:opacity-100"
                        >
                            Reiniciar demo
                        </button>
                    </div>
                )}

                <p className="absolute bottom-1.5 text-[8px] opacity-30">Hecho con Love Pages 💕</p>
            </div>
        </div>
    );
}

// ============================================================
// DEMO BUILDER - Try before signing up
// ============================================================
const DEMO_THEMES = [
    { id: 'romantic', name: 'Romántico', emoji: '💕', bg: '#ff69b4', text: '#ffffff', accent: '#ff1493', preview: 'from-pink-400 to-rose-500' },
    { id: 'sunset', name: 'Atardecer', emoji: '🌅', bg: '#ff6b35', text: '#ffffff', accent: '#f7c59f', preview: 'from-orange-400 to-pink-500' },
    { id: 'ocean', name: 'Océano', emoji: '🌊', bg: '#0077b6', text: '#ffffff', accent: '#90e0ef', preview: 'from-cyan-400 to-blue-600' },
    { id: 'elegant', name: 'Elegante', emoji: '✨', bg: '#2c3e50', text: '#ecf0f1', accent: '#c9a84c', preview: 'from-slate-600 to-purple-700' },
    { id: 'garden', name: 'Jardín', emoji: '🌸', bg: '#ffc8dd', text: '#5c374c', accent: '#ffafcc', preview: 'from-pink-200 to-purple-300' },
    { id: 'dark', name: 'Oscuro', emoji: '🖤', bg: '#1a1a2e', text: '#e0e0e0', accent: '#e94560', preview: 'from-gray-900 to-indigo-950' },
];

const DEMO_STICKERS = ['❤️', '💖', '💘', '💋', '🌹', '💍', '💑', '💌'];

function DemoBuilder() {
    const [title, setTitle] = useState('¿Quieres ser mi San Valentín?');
    const [recipient, setRecipient] = useState('María');
    const [message, setMessage] = useState('Cada día a tu lado es un regalo... 💕');
    const [selectedTheme, setSelectedTheme] = useState(DEMO_THEMES[0]);
    const [yesText, setYesText] = useState('¡Sí, quiero! 💖');
    const [noText, setNoText] = useState('Déjame pensarlo');
    const [noEscapes, setNoEscapes] = useState(true);
    const [selectedStickers, setSelectedStickers] = useState<string[]>(['❤️', '💖']);
    const [animation, setAnimation] = useState('hearts-falling');

    const toggleSticker = (emoji: string) => {
        setSelectedStickers((prev) =>
            prev.includes(emoji) ? prev.filter((s) => s !== emoji) : prev.length < 3 ? [...prev, emoji] : prev
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Editor */}
            <div className="space-y-5 order-2 lg:order-1">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título de tu página</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm bg-white/80"
                        placeholder="¿Quieres ser mi San Valentín?"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Para</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            maxLength={50}
                            className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm bg-white/80"
                            placeholder="Nombre"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Animación</label>
                        <select
                            value={animation}
                            onChange={(e) => setAnimation(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm bg-white/80"
                        >
                            <option value="none">Sin animación</option>
                            <option value="hearts-falling">💕 Corazones</option>
                            <option value="confetti">🎊 Confetti</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mensaje</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={200}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm resize-none bg-white/80"
                        placeholder="Tu mensaje especial..."
                    />
                </div>

                {/* Theme selector */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tema</label>
                    <div className="grid grid-cols-6 gap-2">
                        {DEMO_THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTheme(t)}
                                className={`aspect-square rounded-xl bg-gradient-to-br ${t.preview} transition-all flex items-center justify-center text-lg ${selectedTheme.id === t.id ? 'ring-3 ring-pink-500 ring-offset-2 scale-110' : 'hover:scale-105 opacity-75 hover:opacity-100'}`}
                                title={t.name}
                            >
                                {t.emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stickers */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Stickers <span className="text-xs text-gray-400 font-normal">({selectedStickers.length}/3)</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {DEMO_STICKERS.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => toggleSticker(emoji)}
                                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${selectedStickers.includes(emoji) ? 'border-pink-500 bg-pink-50 scale-110' : 'border-gray-200 hover:border-pink-300 hover:scale-105'}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Button texts */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Botón "Sí"</label>
                        <input
                            type="text"
                            value={yesText}
                            onChange={(e) => setYesText(e.target.value)}
                            maxLength={30}
                            className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm bg-white/80"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Botón "No"</label>
                        <input
                            type="text"
                            value={noText}
                            onChange={(e) => setNoText(e.target.value)}
                            maxLength={30}
                            className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-sm bg-white/80"
                        />
                    </div>
                </div>

                {/* No escapes toggle */}
                <label className="flex items-center gap-3 p-3 bg-white/60 rounded-xl cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={noEscapes}
                        onChange={(e) => setNoEscapes(e.target.checked)}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        El botón "No" escapa del cursor 😄
                    </span>
                    {noEscapes && <MousePointer className="w-3.5 h-3.5 text-pink-400 ml-auto" />}
                </label>

                {/* CTA */}
                <div className="pt-2">
                    <p className="text-xs text-gray-500 text-center mb-3">
                        ¿Te gusta cómo se ve? Crea tu página real gratis 👇
                    </p>
                    <LoginButton />
                </div>
            </div>

            {/* Live Preview */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-8">
                <div className="text-center mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                        <Eye className="w-3 h-3" />
                        Vista previa en vivo
                    </span>
                </div>
                <MiniPagePreview
                    title={title}
                    recipient={recipient}
                    message={message}
                    theme={selectedTheme}
                    yesText={yesText}
                    noText={noText}
                    noEscapes={noEscapes}
                    stickers={selectedStickers}
                    animation={animation}
                />
            </div>
        </div>
    );
}

// ============================================================
// TESTIMONIAL DATA
// ============================================================
const TESTIMONIALS = [
    { name: 'Carlos M.', text: 'Le envié la página a mi novia y dijo que sí! El botón que escapa fue lo mejor 😂💕', emoji: '💑' },
    { name: 'Ana P.', text: 'Súper fácil de usar y quedó hermosa. La usé para San Valentín.', emoji: '🌹' },
    { name: 'Diego R.', text: 'El diseño con IA de la versión PRO es increíble. Totalmente vale la pena.', emoji: '✨' },
    { name: 'Lucía S.', text: 'Creé una para pedirle matrimonio a mi novio. ¡Dijo que sí! 💍', emoji: '💍' },
];

// ============================================================
// SHOWCASE PAGES - pre-made examples
// ============================================================
const SHOWCASE_PAGES = [
    {
        title: '¿Quieres ser mi San Valentín?',
        recipient: 'María',
        message: 'Cada momento contigo es especial...',
        theme: DEMO_THEMES[0],
        stickers: ['❤️', '💖'],
    },
    {
        title: '¿Salimos a cenar?',
        recipient: 'Alejandro',
        message: 'Tengo algo especial planeado 🌹',
        theme: DEMO_THEMES[1],
        stickers: ['🌹', '💋'],
    },
    {
        title: '¿Me perdonas?',
        recipient: 'Andrea',
        message: 'Prometo que no volverá a pasar...',
        theme: DEMO_THEMES[2],
        stickers: ['💌', '💑'],
    },
];

// ============================================================
// FLOATING HEARTS BACKGROUND
// ============================================================
function FloatingHearts() {
    const hearts = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 16 + 8,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 8,
        opacity: Math.random() * 0.15 + 0.05,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((h) => (
                <div
                    key={h.id}
                    className="absolute text-pink-400"
                    style={{
                        left: `${h.x}%`,
                        bottom: '-5%',
                        fontSize: `${h.size}px`,
                        opacity: h.opacity,
                        animation: `floatUp ${h.duration}s ease-in ${h.delay}s infinite`,
                    }}
                >
                    ♥
                </div>
            ))}
        </div>
    );
}

// ============================================================
// MAIN LANDING PAGE
// ============================================================
export default function LandingPage() {
    const { user, loading } = useAuthStore();
    const router = useRouter();
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev: any) => new Set([...prev, entry.target.id]));
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
            </div>
        );
    }

    if (user) return null;

    const isVisible = (id: string) => visibleSections.has(id);

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white overflow-x-hidden">
            <FloatingHearts />

            {/* ===== HERO ===== */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 sm:py-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/40 via-transparent to-transparent" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-full px-4 py-1.5 mb-6 shadow-sm animate-fadeInDown">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
                        </span>
                        <span className="text-sm text-gray-700 font-medium">+2,000 páginas creadas este mes</span>
                    </div>

                    {/* Hero icon */}
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl rotate-3 shadow-xl shadow-pink-500/25 animate-heroHeart">
                            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-white" />
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-[1.1] tracking-tight animate-fadeInUp">
                        Dile lo que sientes
                        <br />
                        <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 bg-clip-text text-transparent">
                            de forma única
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed animate-fadeInUp animation-delay-200">
                        Crea páginas personalizadas con animaciones, stickers y el botón que escapa.
                        Comparte un link único y ve su respuesta en tiempo real.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 animate-fadeInUp animation-delay-400">
                        <a
                            href="#demo"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all text-base flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Probar gratis ahora
                        </a>
                        <LoginButton />
                    </div>

                    {/* Social proof row */}
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 animate-fadeInUp animation-delay-600">
                        <span className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                            1 página gratis
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1.5">
                            <Crown className="w-4 h-4 text-amber-500" />
                            PRO por solo $1.39
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
                        <span className="hidden sm:flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            Diseño con IA
                        </span>
                    </div>

                    {/* Scroll indicator */}
                    <div className="mt-12 animate-bounce">
                        <ChevronDown className="w-6 h-6 text-gray-400 mx-auto" />
                    </div>
                </div>
            </section>

            {/* ===== SHOWCASE - Example pages ===== */}
            <section
                id="showcase"
                data-animate
                className={`py-16 sm:py-24 px-4 transition-all duration-700 ${isVisible('showcase') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                            Mira lo que puedes crear
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
                            Desde declaraciones de amor hasta invitaciones. Cada página es única.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                        {SHOWCASE_PAGES.map((page, i) => (
                            <div
                                key={i}
                                className="transition-all duration-500"
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                <MiniPagePreview
                                    title={page.title}
                                    recipient={page.recipient}
                                    message={page.message}
                                    theme={page.theme}
                                    yesText="¡Sí! 💖"
                                    noText="No 😅"
                                    noEscapes={i === 0}
                                    stickers={page.stickers}
                                    animation={i === 0 ? 'hearts-falling' : 'none'}
                                />
                                {i === 0 && (
                                    <p className="text-center text-xs text-pink-500 mt-2 font-medium">
                                        👆 ¡Intenta presionar "No"!
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section
                id="how-it-works"
                data-animate
                className={`py-16 sm:py-24 px-4 bg-white/60 backdrop-blur-sm transition-all duration-700 ${isVisible('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                            Así de fácil funciona
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg">En menos de 2 minutos tienes tu página lista</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                icon: '✍️',
                                title: 'Personaliza tu página',
                                desc: 'Escribe tu mensaje, elige tema, stickers, animaciones y el texto de los botones.',
                            },
                            {
                                step: '2',
                                icon: '🔗',
                                title: 'Comparte el enlace',
                                desc: 'Envía la URL única por WhatsApp, Instagram, o donde prefieras.',
                            },
                            {
                                step: '3',
                                icon: '💌',
                                title: 'Ve la respuesta',
                                desc: 'Cuando respondan, recibirás la notificación con su respuesta en tiempo real.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                                    <div className="relative bg-white rounded-2xl w-full h-full flex items-center justify-center shadow-sm text-3xl">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES HIGHLIGHT ===== */}
            <section
                id="features"
                data-animate
                className={`py-16 sm:py-24 px-4 transition-all duration-700 ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                            Todo lo que necesitas
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {[
                            { emoji: '🎨', title: '8+ Temas', desc: 'Romántico, océano, elegante y más' },
                            { emoji: '✨', title: 'Animaciones', desc: 'Corazones, confetti, nieve...' },
                            { emoji: '😄', title: 'Botón que escapa', desc: '¡El "No" huye del cursor!' },
                            { emoji: '🎭', title: '16 Stickers', desc: 'Corazones, rosas, anillos...' },
                            { emoji: '🔤', title: 'Tipografías', desc: '16 fuentes para personalizar' },
                            { emoji: '📊', title: 'Estadísticas', desc: 'Vistas y respuestas en vivo' },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-pink-100 hover:border-pink-300 hover:shadow-lg hover:-translate-y-1 transition-all group"
                            >
                                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{f.emoji}</span>
                                <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{f.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* PRO upsell */}
                    <div className="mt-10 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Crown className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                ¿Quieres algo aún más especial?
                            </h3>
                            <p className="text-sm text-gray-600">
                                Con PRO desbloqueas diseño con IA, URL personalizada con su nombre, música de fondo,
                                animaciones premium y páginas ilimitadas. Todo por solo <strong>$1.39 USD</strong> — pago único.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <LoginButton />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== INTERACTIVE DEMO ===== */}
            <section
                id="demo"
                data-animate
                className={`py-16 sm:py-24 px-4 bg-gradient-to-b from-white/60 to-pink-50/60 backdrop-blur-sm transition-all duration-700 ${isVisible('demo') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
                            <Play className="w-4 h-4" />
                            Demo interactiva
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                            Prueba cómo se verá tu página
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
                            Personaliza el contenido abajo y ve los cambios en tiempo real. ¡No necesitas cuenta!
                        </p>
                    </div>

                    <DemoBuilder />
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section
                id="testimonials"
                data-animate
                className={`py-16 sm:py-24 px-4 transition-all duration-700 ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                            Lo que dicen nuestros usuarios
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div
                                key={i}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-lg">
                                        {t.emoji}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-20 sm:py-28 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-6 shadow-xl shadow-pink-500/20">
                        <Heart className="w-8 h-8 text-white fill-white" />
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        ¿Listo para decirle
                        <br />
                        <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                            lo que sientes?
                        </span>
                    </h2>

                    <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-lg mx-auto">
                        Crea tu primera página gratis en menos de 2 minutos.
                        Sin tarjeta de crédito.
                    </p>

                    <LoginButton />

                    <p className="mt-6 text-xs text-gray-400">
                        Al continuar, aceptas nuestros términos y condiciones
                    </p>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="py-8 px-4 border-t border-pink-100 bg-white/40">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                        <span className="font-semibold text-gray-700">Love Pages</span>
                    </div>
                    <p>© {new Date().getFullYear()} Love Pages. Hecho con amor.</p>
                </div>
            </footer>

            {/* ===== GLOBAL ANIMATIONS CSS ===== */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 0.5; }
                    100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes demoFall {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(600px) rotate(360deg); }
                }

                @keyframes demoBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }

                @keyframes demoHeartBeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.15); }
                    50% { transform: scale(1); }
                    75% { transform: scale(1.08); }
                }

                @keyframes heroHeart {
                    0%, 100% { transform: rotate(3deg) scale(1); }
                    50% { transform: rotate(-3deg) scale(1.05); }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out both;
                }

                .animate-fadeInDown {
                    animation: fadeInDown 0.6s ease-out both;
                }

                .animate-heroHeart {
                    animation: heroHeart 3s ease-in-out infinite;
                }

                .animation-delay-200 {
                    animation-delay: 200ms;
                }

                .animation-delay-400 {
                    animation-delay: 400ms;
                }

                .animation-delay-600 {
                    animation-delay: 600ms;
                }
            `}</style>
        </div>
    );
}