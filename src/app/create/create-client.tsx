'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { CustomSlugInput } from '@/components/CustomSlugInput';
import { ParticleCanvas, animToKind, hasParticles } from '@/components/ParticleCanvas';
import { LoginGateModal } from '@/components/auth/login-gate-modal';
import { saveDraft, loadDraft, clearDraft } from '@/lib/draft';
import {
    pageThemeVars,
    titleFontFamily,
    bodyFontFamily,
    googleFontsHref,
    isDarkColor,
    RISO_THEME_ID,
    RISO_FONT,
} from '@/lib/page-theme';
import { useTranslation } from '@/i18n';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Heart,
    Sparkles,
    Eye,
    ArrowLeft,
    Upload,
    Crown,
    CheckCircle2,
    ArrowRight,
    Type,
    Palette,
    Image as ImageIcon,
    Music,
    Wand2,
    Lock,
    X,
    Plus,
    Trash2,
    Volume2,
    Stars,
    PartyPopper,
    Snowflake,
    Flame,
    CloudRain,
    Clock,
    Smartphone,
    Tablet,
    Monitor,
    AlertCircle,
    RotateCcw,
    ChevronDown,
    Check,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HexColorPicker } from 'react-colorful';
import { useDropzone } from 'react-dropzone';

// ============================================================
// HOOK: useMediaQuery
// ============================================================
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
}

// ============================================================
// COMPONENTE: BottomSheet (para preview y color picker en mobile)
// ============================================================
function BottomSheet({
    isOpen,
    onClose,
    children,
    title,
    height = '85vh',
}: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    height?: string;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white z-50 overflow-hidden flex flex-col"
                        style={{ maxHeight: height, borderTop: '2px solid var(--ink-black)' }}
                    >
                        {/* Handle bar */}
                        <div className="flex-shrink-0 pt-3 pb-2 px-4">
                            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
                        </div>
                        {title && (
                            <div className="flex-shrink-0 flex items-center justify-between px-4 pb-3 border-b">
                                <h3 className="font-semibold text-gray-900">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        )}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ============================================================
// CONFIGURACIÓN DE OPCIONES
// ============================================================

const GOOGLE_FONTS = [
    // La display condensada del producto. Va primera y es la de fábrica, para
    // que elegir tipografía sea una decisión y no un cambio por omisión.
    { name: RISO_FONT, category: 'sans-serif', free: true },
    { name: 'Dancing Script', category: 'cursive', free: true },
    { name: 'Pacifico', category: 'cursive', free: true },
    { name: 'Lobster', category: 'cursive', free: true },
    { name: 'Great Vibes', category: 'cursive', free: true },
    { name: 'Satisfy', category: 'cursive', free: true },
    { name: 'Playfair Display', category: 'serif', free: true },
    { name: 'Quicksand', category: 'sans-serif', free: true },
    { name: 'Comfortaa', category: 'sans-serif', free: true },
    // PRO fonts
    { name: 'Cormorant Garamond', category: 'serif', free: false },
    { name: 'Cinzel', category: 'serif', free: false },
    { name: 'Abril Fatface', category: 'display', free: false },
    { name: 'Righteous', category: 'display', free: false },
    { name: 'Sacramento', category: 'cursive', free: false },
    { name: 'Amatic SC', category: 'cursive', free: false },
    { name: 'Caveat', category: 'cursive', free: false },
    { name: 'Indie Flower', category: 'cursive', free: false },
];

const THEMES = [
    {
        id: RISO_THEME_ID,
        name: 'Riso',
        emoji: '🖨',
        colors: { bg: '#f3ead4', text: '#1a1410', accent: '#e8378a' },
        preview: 'bg-gradient-to-br from-amber-50 to-pink-200',
        free: true,
    },
    {
        id: 'romantic',
        name: 'Romántico',
        emoji: '💕',
        colors: { bg: '#ff69b4', text: '#ffffff', accent: '#ff1493' },
        preview: 'bg-gradient-to-br from-pink-400 to-rose-500',
        free: true,
    },
    {
        id: 'sunset',
        name: 'Atardecer',
        emoji: '🌅',
        colors: { bg: '#ff6b35', text: '#ffffff', accent: '#f7c59f' },
        preview: 'bg-gradient-to-br from-orange-400 to-pink-500',
        free: true,
    },
    {
        id: 'ocean',
        name: 'Océano',
        emoji: '🌊',
        colors: { bg: '#0077b6', text: '#ffffff', accent: '#90e0ef' },
        preview: 'bg-gradient-to-br from-cyan-400 to-blue-600',
        free: true,
    },
    {
        id: 'garden',
        name: 'Jardín',
        emoji: '🌸',
        colors: { bg: '#ffc8dd', text: '#5c374c', accent: '#ffafcc' },
        preview: 'bg-gradient-to-br from-pink-200 to-purple-300',
        free: true,
    },
    {
        id: 'playful',
        name: 'Divertido',
        emoji: '🎉',
        colors: { bg: '#ffd700', text: '#333333', accent: '#ff6b6b' },
        preview: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        free: true,
    },
    {
        id: 'elegant',
        name: 'Elegante',
        emoji: '✨',
        colors: { bg: '#2c3e50', text: '#ecf0f1', accent: '#c9a84c' },
        preview: 'bg-gradient-to-br from-slate-600 to-purple-700',
        free: true,
    },
    {
        id: 'minimal',
        name: 'Minimal',
        emoji: '🤍',
        colors: { bg: '#ffffff', text: '#333333', accent: '#e91e63' },
        preview: 'bg-gradient-to-br from-gray-100 to-gray-300',
        free: true,
    },
    {
        id: 'dark',
        name: 'Oscuro',
        emoji: '🖤',
        colors: { bg: '#1a1a2e', text: '#e0e0e0', accent: '#e94560' },
        preview: 'bg-gradient-to-br from-gray-900 to-indigo-950',
        free: true,
    },
    // PRO themes
    {
        id: 'neon',
        name: 'Neón',
        emoji: '💜',
        colors: { bg: '#0f0f23', text: '#ffffff', accent: '#bf00ff' },
        preview: 'bg-gradient-to-br from-purple-900 to-fuchsia-800',
        free: false,
    },
    {
        id: 'vintage',
        name: 'Vintage',
        emoji: '📜',
        colors: { bg: '#f4e8c1', text: '#5c4033', accent: '#a0522d' },
        preview: 'bg-gradient-to-br from-amber-100 to-orange-200',
        free: false,
    },
    {
        id: 'aurora',
        name: 'Aurora',
        emoji: '🌌',
        colors: { bg: '#0b0c1e', text: '#e0f7fa', accent: '#00e5ff' },
        preview: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-teal-800',
        free: false,
    },
    {
        id: 'cherry',
        name: 'Cerezo',
        emoji: '🌸',
        colors: { bg: '#fff0f5', text: '#8b0032', accent: '#ff69b4' },
        preview: 'bg-gradient-to-br from-pink-100 to-rose-200',
        free: false,
    },
];

const ANIMATIONS = [
    { id: 'none', name: 'Sin animación', emoji: '—', free: true },
    { id: 'hearts-falling', name: 'Corazones cayendo', emoji: '💕', free: true },
    { id: 'fade-in', name: 'Aparecer suave', emoji: '✨', free: true },
    { id: 'float-up', name: 'Flotar', emoji: '🎈', free: true },
    // PRO animations
    { id: 'confetti', name: 'Confetti', emoji: '🎊', free: false },
    { id: 'particles', name: 'Partículas', emoji: '⭐', free: false },
    { id: 'fireworks', name: 'Fuegos artificiales', emoji: '🎆', free: false },
    { id: 'snow', name: 'Nieve', emoji: '❄️', free: false },
    { id: 'petals', name: 'Pétalos', emoji: '🌸', free: false },
    { id: 'bubbles', name: 'Burbujas', emoji: '🫧', free: false },
];

const STICKERS = [
    { id: 'heart-big', emoji: '❤️', free: true },
    { id: 'heart-sparkling', emoji: '💖', free: true },
    { id: 'heart-arrow', emoji: '💘', free: true },
    { id: 'kiss', emoji: '💋', free: true },
    { id: 'rose', emoji: '🌹', free: true },
    { id: 'ring', emoji: '💍', free: true },
    { id: 'couple', emoji: '💑', free: true },
    { id: 'love-letter', emoji: '💌', free: true },
    { id: 'star', emoji: '⭐', free: false },
    { id: 'fire', emoji: '🔥', free: false },
    { id: 'butterfly', emoji: '🦋', free: false },
    { id: 'teddy', emoji: '🧸', free: false },
    { id: 'chocolate', emoji: '🍫', free: false },
    { id: 'champagne', emoji: '🍾', free: false },
    { id: 'moon', emoji: '🌙', free: false },
    { id: 'rainbow', emoji: '🌈', free: false },
];

const BACKGROUND_MUSIC = [
    { id: 'none', name: 'Sin música', free: true },
    { id: 'romantic-piano', name: '🎹 Piano romántico', free: false },
    { id: 'acoustic-guitar', name: '🎸 Guitarra acústica', free: false },
    { id: 'love-song', name: '🎵 Canción de amor', free: false },
    { id: 'music-box', name: '🎶 Caja musical', free: false },
    { id: 'orchestra', name: '🎻 Orquesta suave', free: false },
];

// ============================================================
// TIPOS
// ============================================================

interface PageFormData {
    title: string;
    recipientName: string;
    message: string;
    yesButtonText: string;
    noButtonText: string;
    noButtonEscapes: boolean;
    pageType: 'free' | 'pro';
    // Diseño
    theme: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    // Tipografía
    titleFont: string;
    bodyFont: string;
    // Imágenes
    backgroundImage: File | null;
    decorativeImages: File[];
    referenceImage: File | null; // Para IA PRO
    // Stickers
    selectedStickers: string[];
    // Animaciones
    animation: string;
    // Música
    backgroundMusic: string;
    // Video embed (PRO)
    videoUrl: string;
    // Extras
    showWatermark: boolean; // free = true siempre
    customSlug: string;
    /** Fecha que celebra la carta; alimenta el recordatorio anual. */
    occasionDate: string;
}

type Step = 'content' | 'design' | 'media' | 'effects' | 'preview';

// ============================================================
// COMPONENTE: ProBadge (lock indicator para features PRO)
// ============================================================
function ProBadge({ small = false }: { small?: boolean }) {
    return (
        <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'var(--ink-blue)', color: 'var(--paper)', fontWeight: 700, border: '1.5px solid var(--ink-black)', padding: small ? '1px 6px' : '2px 8px', fontSize: small ? 10 : 11, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
            <Crown className={small ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
            PRO
        </span>
    );
}

// ============================================================
// COMPONENTE: LockedOverlay (para opciones PRO bloqueadas)
// ============================================================
function LockedOverlay({ onUpgrade }: { onUpgrade: () => void }) {
    const { t } = useTranslation();
    return (
        <div
            onClick={onUpgrade}
            className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-lg flex items-center justify-center cursor-pointer z-10 group"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--ink-blue)', color: 'var(--paper)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1.5px solid var(--ink-black)', boxShadow: '2px 2px 0 var(--ink-black)' }}>
                <Lock className="w-3 h-3" />
                {t.create.unlockProBadge}
            </div>
        </div>
    );
}

// ============================================================
// COMPONENTE: UpgradeModal (modal en vez de redirección)
// ============================================================
function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white max-w-md w-full p-0 overflow-hidden" style={{ border: '2px solid var(--ink-black)', boxShadow: '6px 6px 0 var(--ink-black)' }}>
                {/* Header */}
                <div className="p-6 text-white text-center" style={{ background: 'var(--ink-red)' }}>
                    <div className="flex items-center justify-center mx-auto mb-3" style={{ width: 64, height: 64, background: 'rgba(248,241,222,0.2)', border: '2px solid rgba(248,241,222,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Crown className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">{t.create.unlockPro}</h3>
                    <p className="text-white/90 text-sm mt-1">{t.create.unlockProDesc}</p>
                </div>

                {/* Features */}
                <div className="p-6 space-y-3">
                    {[t.create.proFeature9, t.create.proFeature1, t.create.proFeature2, t.create.proFeature3, t.create.proFeature4, t.create.proFeature5, t.create.proFeature6, t.create.proFeature7, t.create.proFeature8].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 space-y-3">
                    <Link href="/upgrade" className="block">
                        <button className="btn-accent" style={{ width: '100%', padding: '14px 20px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
                            <Crown className="w-4 h-4" />
                            {t.create.viewProPlans}
                        </button>
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                    >
                        {t.create.stayFree}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// COMPONENTE: ProDecisionModal
// Se abre al publicar con opciones PRO puestas y sin plan PRO.
// El usuario ya vio esas opciones funcionando en su propia carta, así que
// aquí sólo hay que decidir: publicar sin ellas o desbloquearlas.
// ============================================================
function ProDecisionModal({
    isOpen,
    onClose,
    onPublishFree,
    onUpgrade,
    selections,
}: {
    isOpen: boolean;
    onClose: () => void;
    onPublishFree: () => void;
    onUpgrade: () => void;
    selections: { label: string; value: string }[];
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div
                className="relative w-full max-w-sm"
                style={{ background: 'var(--paper-soft)', border: '2px solid var(--ink-black)', boxShadow: '6px 6px 0 var(--ink-black)' }}
            >
                <div style={{ padding: '28px 26px 26px' }}>
                    <span className="mono-eyebrow" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--ink-red)', display: 'block', marginBottom: 12 }}>
                        —— {selections.length === 1 ? 'una cosa es PRO' : `${selections.length} cosas son PRO`}
                    </span>

                    <h3 className="serif-display" style={{ fontSize: 28, lineHeight: 0.95, margin: 0, color: 'var(--ink-black)' }}>
                        Casi listo.
                    </h3>

                    <p style={{ marginTop: 12, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, lineHeight: 1.5, color: 'var(--ink-black)' }}>
                        Esto es lo que estabas probando y no entra en el plan gratis:
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selections.map((s) => (
                            <li
                                key={`${s.label}-${s.value}`}
                                style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 12px', background: 'var(--paper)', border: '1.5px solid var(--ink-black)', fontFamily: 'var(--mono)', fontSize: 11 }}
                            >
                                <span style={{ color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
                                <span style={{ fontWeight: 700, textAlign: 'right' }}>{s.value}</span>
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <button
                            onClick={onUpgrade}
                            className="btn-accent"
                            style={{ width: '100%', padding: '13px 18px', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}
                        >
                            <Crown style={{ width: 14, height: 14 }} />
                            Desbloquearlas · $9/año
                        </button>
                        <button
                            onClick={onPublishFree}
                            style={{ width: '100%', padding: '11px 18px', background: 'transparent', border: '1.5px solid var(--ink-black)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-black)' }}
                        >
                            Publicar sin ellas
                        </button>
                        <button
                            onClick={onClose}
                            style={{ width: '100%', padding: '4px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--ink-soft)', letterSpacing: '0.06em' }}
                        >
                            seguir editando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// DESKTOP HELPERS — defined outside component to avoid remount on each render
// ============================================================

/** Tamaños del lienzo de vista previa (columna izquierda del editor desktop). */
const PREVIEW_DEVICES = [
    { id: 'phone', label: 'iPhone 15', icon: Smartphone, width: 320, height: 640, radius: 44, notch: true },
    { id: 'tablet', label: 'Tablet', icon: Tablet, width: 480, height: 660, radius: 24, notch: false },
    { id: 'wide', label: 'Escritorio', icon: Monitor, width: 720, height: 460, radius: 8, notch: false },
] as const;

type PreviewDeviceId = (typeof PREVIEW_DEVICES)[number]['id'];
function DField({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="mono-eyebrow" style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-black)' }}>—— {label}</span>
                {hint && <span style={{ fontSize: 10, color: 'var(--ink-soft)' }}>{hint}</span>}
            </div>
            {children}
        </div>
    );
}

const dI: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid var(--ink-black)', background: 'var(--paper)',
    borderRadius: 0, fontSize: 12, color: 'var(--ink-black)',
    outline: 'none', fontFamily: 'var(--mono)',
};

/** Mismo campo, marcado en rojo tras un intento de publicar sin rellenarlo. */
const dInvalid: React.CSSProperties = {
    ...dI,
    border: '2px solid var(--ink-red)',
    background: 'var(--melocoton)',
};

/** Marca de campo obligatorio: visible desde el principio, no sólo al fallar. */
function RequiredMark({ filled, label }: { filled: boolean; label: string }) {
    return (
        <span
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: 9, fontFamily: 'var(--mono)', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: filled ? 'var(--ink-soft)' : 'var(--ink-red)',
            }}
        >
            {filled ? <Check style={{ width: 9, height: 9 }} /> : '*'}
            {label}
        </span>
    );
}

const colorKeyMap = { bg: 'backgroundColor', text: 'textColor', accent: 'accentColor' } as const;

function renderMsg(text: string): React.ReactNode {
    if (!text || !text.includes('*')) return text;
    return text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2
            ? <em key={i} style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic' }}>{part.slice(1, -1)}</em>
            : part
    );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function CreatePageEnhanced() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const [currentStep, setCurrentStep] = useState<Step>('content');
    const [loading, setLoading] = useState(false);
    const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);
    const [decorativeImagePreviews, setDecorativeImagePreviews] = useState<string[]>([]);
    const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
    const [showColorPicker, setShowColorPicker] = useState<'bg' | 'text' | 'accent' | null>(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [previewCollapsed, setPreviewCollapsed] = useState(false);
    /**
     * Hay un campo de texto enfocado, o sea que el teclado está abierto.
     *
     * En un móvil de ~700px el bloque fijo (cabecera + maqueta + secciones)
     * ocupa unos 350px. Con el teclado encima no quedaba sitio para ver lo que
     * se está escribiendo, así que mientras se escribe la maqueta se pliega y
     * la barra de publicar se aparta.
     */
    const [typing, setTyping] = useState(false);
    const [showMobileColorPicker, setShowMobileColorPicker] = useState<'bg' | 'text' | 'accent' | null>(null);
    const isMobile = useMediaQuery('(max-width: 1023px)');
    const { t } = useTranslation();

    // ── Borrador ──
    const [savedAt, setSavedAt] = useState<number | null>(null);
    const [restoredNotice, setRestoredNotice] = useState<{ hadImages: boolean } | null>(null);
    const hydratedRef = useRef(false);

    // ── Publicación ──
    const [showLoginGate, setShowLoginGate] = useState(false);
    const [showProDecision, setShowProDecision] = useState(false);
    const pendingPublishRef = useRef(false);

    // ── Validación ──
    const [invalidField, setInvalidField] = useState<'title' | 'recipientName' | null>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const recipientRef = useRef<HTMLInputElement>(null);
    const mTitleRef = useRef<HTMLInputElement>(null);
    const mRecipientRef = useRef<HTMLInputElement>(null);

    // ── Lienzo ──
    const [previewDevice, setPreviewDevice] = useState<PreviewDeviceId>('phone');

    const isPro = user?.isPro || false;
    const freeLimitReached = !!user && !isPro && user.canCreatePage === false;

    const [formData, setFormData] = useState<PageFormData>({
        title: '',
        recipientName: '',
        message: '',
        yesButtonText: t.landing.defaultYesText,
        noButtonText: t.landing.defaultNoText,
        noButtonEscapes: false,
        pageType: 'free',
        theme: RISO_THEME_ID,
        backgroundColor: '#f3ead4',
        textColor: '#1a1410',
        accentColor: '#e8378a',
        titleFont: RISO_FONT,
        bodyFont: RISO_FONT,
        backgroundImage: null,
        decorativeImages: [],
        referenceImage: null,
        selectedStickers: [],
        animation: 'hearts-falling',
        backgroundMusic: 'none',
        videoUrl: '',
        showWatermark: !isPro,
        customSlug: '',
        occasionDate: '',
    });

    // Cargar Google Fonts dinámicamente (todas, para poder previsualizar la lista)
    useEffect(() => {
        const href = googleFontsHref(GOOGLE_FONTS.map((f) => f.name));
        if (!href) return;
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        link.onload = () => setFontsLoaded(true);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    // ── Borrador: restaurar al montar ──────────────────────────
    // Se ejecuta una sola vez y antes del primer autoguardado, para no pisar
    // lo guardado con el formulario vacío del render inicial.
    useEffect(() => {
        const draft = loadDraft();
        if (draft) {
            setFormData((prev) => ({ ...prev, ...(draft.values as Partial<PageFormData>) }));
            setSavedAt(draft.savedAt);
            setRestoredNotice({ hadImages: draft.hadImages });
        }
        hydratedRef.current = true;
    }, []);

    // ── Borrador: autoguardar con debounce ─────────────────────
    useEffect(() => {
        if (!hydratedRef.current) return;
        const id = setTimeout(() => {
            const at = saveDraft(formData);
            if (at) setSavedAt(at);
        }, 600);
        return () => clearTimeout(id);
    }, [formData]);

    // Refresca la etiqueta «guardado hace X» sin depender de nuevas ediciones.
    const [savedTick, setSavedTick] = useState(0);
    useEffect(() => {
        if (!savedAt) return;
        const id = setInterval(() => setSavedTick((n) => n + 1), 15000);
        return () => clearInterval(id);
    }, [savedAt]);

    const savedLabel = (() => {
        void savedTick; // fuerza el recálculo con el intervalo
        if (!savedAt) return null;
        const secs = Math.max(0, Math.round((Date.now() - savedAt) / 1000));
        if (secs < 10) return t.create.draftSavedNow;
        if (secs < 60) return t.create.draftSavedSeconds.replace('{n}', String(secs));
        const mins = Math.round(secs / 60);
        return t.create.draftSavedMinutes.replace('{n}', String(mins));
    })();

    /** ¿El foco está en algo que abre teclado? */
    const isEditable = (el: EventTarget | Element | null) => {
        const node = el as HTMLElement | null;
        if (!node || !node.tagName) return false;
        return ['INPUT', 'TEXTAREA', 'SELECT'].includes(node.tagName) || node.isContentEditable;
    };

    const handleEditorFocus = (e: React.FocusEvent) => {
        if (isEditable(e.target)) setTyping(true);
    };

    // Al saltar de un campo a otro se dispara blur antes que el focus del
    // siguiente; sin esta comprobación la maqueta parpadearía entre campos.
    const handleEditorBlur = () => {
        setTimeout(() => setTyping(isEditable(document.activeElement)), 0);
    };

    // Cambiar de sección estando desplazado dejaba al usuario a media página.
    useEffect(() => {
        if (!isMobile) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep, isMobile]);

    const discardDraft = () => {
        clearDraft();
        setSavedAt(null);
        setRestoredNotice(null);
        setFormData((prev) => ({
            ...prev,
            title: '', recipientName: '', message: '',
            yesButtonText: t.landing.defaultYesText,
            noButtonText: t.landing.defaultNoText,
            customSlug: '',
        }));
        setCurrentStep('content');
        toast.success(t.create.draftDiscarded);
    };

    // Auth no requerido - usuarios pueden diseñar sin login
    // Se pedirá login al momento de guardar si no están autenticados

    const updateForm = (updates: Partial<PageFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const goToUpgrade = () => {
        setShowUpgradeModal(true);
    };

    // Las opciones PRO se pueden elegir sin plan PRO: se aplican al preview para
    // que la persona vea si le sirven. El cobro se plantea al publicar, cuando ya
    // sabe qué está comprando (ver handleSubmit y ProDecisionModal).
    const noteProTrial = () => {
        if (isPro) return;
        toast(t.create.proTrialToast, { icon: '👑', id: 'pro-trial' });
    };

    const selectTheme = (theme: (typeof THEMES)[0]) => {
        if (!theme.free && !isPro) noteProTrial();
        updateForm({
            theme: theme.id,
            backgroundColor: theme.colors.bg,
            textColor: theme.colors.text,
            accentColor: theme.colors.accent,
        });
    };

    const selectFont = (font: (typeof GOOGLE_FONTS)[0], target: 'titleFont' | 'bodyFont') => {
        if (!font.free && !isPro) noteProTrial();
        updateForm({ [target]: font.name });
    };

    const toggleSticker = (stickerId: string) => {
        const sticker = STICKERS.find((s) => s.id === stickerId);
        if (sticker && !sticker.free && !isPro) noteProTrial();

        setFormData((prev) => {
            const exists = prev.selectedStickers.includes(stickerId);
            const maxStickers = isPro ? 10 : 3;

            if (exists) {
                return { ...prev, selectedStickers: prev.selectedStickers.filter((s) => s !== stickerId) };
            }
            if (prev.selectedStickers.length >= maxStickers) {
                toast.error(t.create.maxStickers.replace('{count}', String(maxStickers)) + (!isPro ? t.create.maxStickersProHint : ''));
                return prev;
            }
            return { ...prev, selectedStickers: [...prev.selectedStickers, stickerId] };
        });
    };

    // ---- Dropzones ----
    const onDropBackground = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                if (file.size > 15 * 1024 * 1024) {
                    toast.error(t.create.imageTooLarge);
                    return;
                }
                updateForm({ backgroundImage: file });
                setBgImagePreview(URL.createObjectURL(file));
            }
        },
        []
    );

    const onDropDecorative = useCallback(
        (acceptedFiles: File[]) => {
            const maxImages = isPro ? 5 : 1;
            const currentCount = formData.decorativeImages.length;

            if (currentCount >= maxImages) {
                toast.error(
                    t.create.maxDecorativeImages
                        .replace('{count}', String(maxImages))
                        .replace('{plural}', maxImages > 1 ? 'es' : '')
                        .replace('{plural2}', maxImages > 1 ? 's' : '')
                    + (!isPro ? t.create.maxDecorativeProHint : '')
                );
                return;
            }

            const file = acceptedFiles[0];
            if (file) {
                if (file.size > 15 * 1024 * 1024) {
                    toast.error(t.create.imageTooLarge);
                    return;
                }
                updateForm({ decorativeImages: [...formData.decorativeImages, file] });
                setDecorativeImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
            }
        },
        [formData.decorativeImages, isPro]
    );

    const onDropReference = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                toast.error(t.create.imageTooLarge);
                return;
            }
            updateForm({ referenceImage: file });
            setReferenceImagePreview(URL.createObjectURL(file));
        }
    }, []);

    const bgDropzone = useDropzone({
        onDrop: onDropBackground,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
        maxFiles: 1,
    });

    const decorativeDropzone = useDropzone({
        onDrop: onDropDecorative,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
        maxFiles: 1,
    });

    const referenceDropzone = useDropzone({
        onDrop: onDropReference,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
        maxFiles: 1,
    });

    const removeDecorativeImage = (index: number) => {
        const newImages = [...formData.decorativeImages];
        newImages.splice(index, 1);
        const newPreviews = [...decorativeImagePreviews];
        newPreviews.splice(index, 1);
        updateForm({ decorativeImages: newImages });
        setDecorativeImagePreviews(newPreviews);
    };

    // ---- Validación ----
    // Una sola fuente de verdad, compartida por móvil y desktop: el botón de
    // publicar dice qué falta y al pulsarlo lleva al campo, en vez de avisar
    // desde una pestaña distinta a la del problema.
    const missingFields: { key: 'title' | 'recipientName'; label: string; step: Step }[] = [];
    if (!formData.title.trim()) missingFields.push({ key: 'title', label: t.create.fieldTitle, step: 'content' });
    if (!formData.recipientName.trim()) missingFields.push({ key: 'recipientName', label: t.create.fieldRecipient, step: 'content' });

    const focusMissing = () => {
        const first = missingFields[0];
        if (!first) return;
        setCurrentStep(first.step);
        setInvalidField(first.key);
        // El panel acaba de cambiar de pestaña: el input aún no está montado.
        setTimeout(() => {
            const el = isMobile
                ? (first.key === 'title' ? mTitleRef.current : mRecipientRef.current)
                : (first.key === 'title' ? titleRef.current : recipientRef.current);
            el?.focus();
            el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 60);
    };

    // La marca roja desaparece en cuanto el campo deja de estar vacío.
    useEffect(() => {
        if (!invalidField) return;
        if (formData[invalidField].trim()) setInvalidField(null);
    }, [formData.title, formData.recipientName, invalidField]);

    // ---- Opciones PRO en uso por alguien sin plan PRO ----
    // Cada entrada sabe cómo quitarse, para poder publicar sin ella de un clic.
    const proSelections: { label: string; value: string; strip: () => Partial<PageFormData> }[] = [];
    if (!isPro) {
        const theme = THEMES.find((th) => th.id === formData.theme);
        if (theme && !theme.free) {
            const fallback = THEMES[0];
            proSelections.push({
                label: t.create.summaryThemeKey,
                value: t.themes[theme.id as keyof typeof t.themes] || theme.name,
                strip: () => ({ theme: fallback.id, backgroundColor: fallback.colors.bg, textColor: fallback.colors.text, accentColor: fallback.colors.accent }),
            });
        }

        // El backend valida titleFont y bodyFont por separado, así que aquí se
        // miran los dos aunque hoy sólo el del título se pueda elegir.
        const font = GOOGLE_FONTS.find((f) => f.name === formData.titleFont);
        if (font && !font.free) {
            proSelections.push({ label: t.create.fieldFont, value: font.name, strip: () => ({ titleFont: GOOGLE_FONTS[0].name }) });
        }
        const bFont = GOOGLE_FONTS.find((f) => f.name === formData.bodyFont);
        if (bFont && !bFont.free) {
            proSelections.push({ label: t.create.fieldFont, value: bFont.name, strip: () => ({ bodyFont: GOOGLE_FONTS[0].name }) });
        }

        const anim = ANIMATIONS.find((a) => a.id === formData.animation);
        if (anim && !anim.free) {
            proSelections.push({
                label: t.create.summaryAnimKey,
                value: t.animations[anim.id as keyof typeof t.animations] || anim.name,
                strip: () => ({ animation: 'hearts-falling' }),
            });
        }

        const music = BACKGROUND_MUSIC.find((m) => m.id === formData.backgroundMusic);
        if (music && !music.free) {
            proSelections.push({
                label: t.create.fieldMusic,
                value: t.music[music.id as keyof typeof t.music] || music.name,
                strip: () => ({ backgroundMusic: 'none' }),
            });
        }

        const proStickers = formData.selectedStickers.filter((id) => STICKERS.find((s) => s.id === id)?.free === false);
        if (proStickers.length > 0) {
            proSelections.push({
                label: t.create.fieldStickers,
                value: proStickers.map((id) => STICKERS.find((s) => s.id === id)?.emoji).join(' '),
                strip: () => ({ selectedStickers: formData.selectedStickers.filter((id) => STICKERS.find((s) => s.id === id)?.free !== false) }),
            });
        }

        if (formData.videoUrl.trim()) {
            proSelections.push({ label: t.create.fieldVideo, value: formData.videoUrl.trim(), strip: () => ({ videoUrl: '' }) });
        }

        if (formData.customSlug.trim()) {
            proSelections.push({ label: t.create.fieldUrlCustom, value: `/p/${formData.customSlug.trim()}`, strip: () => ({ customSlug: '' }) });
        }
    }

    // ---- Publicación ----
    /**
     * `theme` es un enum cerrado en el backend: un id desconocido rompe la
     * validación de Mongoose. Cualquier id que esta lista no reconozca viaja
     * como 'custom', que el aspecto no depende de él — lo definen
     * backgroundColor / textColor / accentColor, que es lo que el renderizador
     * lee de verdad.
     *
     * 'riso' se queda fuera a propósito: el backend ya lo acepta en el código,
     * pero hasta que ese cambio esté desplegado enviarlo rompería la
     * publicación. Una vez desplegado, añadirlo aquí es opcional y sólo cambia
     * cómo queda guardado el id.
     */
    const API_THEME_IDS = new Set([
        'romantic', 'sunset', 'ocean', 'garden', 'playful',
        'elegant', 'minimal', 'dark',
        'neon', 'vintage', 'aurora', 'cherry', 'custom',
    ]);
    const apiThemeId = (theme: string) => (API_THEME_IDS.has(theme) ? theme : 'custom');

    const publish = async (values: PageFormData) => {
        setLoading(true);
        try {
            const data = new FormData();

            // Campos básicos
            data.append('title', values.title);
            data.append('recipientName', values.recipientName);
            data.append('message', values.message);
            data.append('yesButtonText', values.yesButtonText);
            data.append('noButtonText', values.noButtonText);
            data.append('noButtonEscapes', values.noButtonEscapes.toString());
            data.append('pageType', values.pageType);
            data.append('theme', apiThemeId(values.theme));
            data.append('backgroundColor', values.backgroundColor);
            data.append('textColor', values.textColor);
            data.append('accentColor', values.accentColor);

            // Nuevos campos
            data.append('titleFont', values.titleFont);
            data.append('bodyFont', values.bodyFont);
            data.append('animation', values.animation);
            data.append('backgroundMusic', values.backgroundMusic);
            if (isPro && values.videoUrl.trim()) {
                data.append('videoUrl', values.videoUrl.trim());
            }
            data.append('selectedStickers', JSON.stringify(values.selectedStickers));
            data.append('showWatermark', values.showWatermark.toString());
            if (values.occasionDate) {
                data.append('occasionDate', values.occasionDate);
            }

            // Imágenes
            if (values.backgroundImage) {
                data.append('backgroundImage', values.backgroundImage);
            }
            values.decorativeImages.forEach((img, i) => {
                data.append(`decorativeImage_${i}`, img);
            });
            if (values.referenceImage) {
                data.append('referenceImage', values.referenceImage);
            }
            if (isPro && values.customSlug && values.customSlug.trim()) {
                data.append('customSlug', values.customSlug.trim());
            }
            const response = await api.pages.create(data);
            // La página ya vive en el servidor: el borrador local sobra y, si se
            // quedara, reaparecería la próxima vez que alguien abra el editor.
            clearDraft();
            toast.success(t.create.pageCreated);
            const identifier = response.data.data.customSlug || response.data.data.shortId;
            router.push(`/p/${identifier}`);
        } catch (error: any) {
            console.error('Error creating page:', error);
            toast.error(error.response?.data?.message || t.create.createError);
        } finally {
            setLoading(false);
        }
    };

    /** Quita las opciones PRO del formulario y publica lo que queda. */
    const publishWithoutPro = () => {
        const stripped = proSelections.reduce<PageFormData>(
            (acc, sel) => ({ ...acc, ...sel.strip() }),
            formData
        );
        setFormData(stripped);
        setShowProDecision(false);
        publish(stripped);
    };

    const handleSubmit = async () => {
        // La sesión aún se está resolviendo: publicar ahora pediría login a
        // alguien que quizá ya lo tiene.
        if (authLoading) return;

        // 1. Lo que falta se resuelve antes que nada, y llevando al campo.
        if (missingFields.length > 0) {
            focusMissing();
            toast.error(
                missingFields.length === 1
                    ? t.create.missingOne.replace('{field}', missingFields[0].label)
                    : t.create.missingMany.replace('{fields}', missingFields.map((f) => f.label).join(', '))
            );
            return;
        }

        // 2. Sin sesión: se pide aquí mismo y la publicación sigue al volver.
        if (!user) {
            pendingPublishRef.current = true;
            setShowLoginGate(true);
            return;
        }

        if (freeLimitReached) {
            toast.error(t.create.freeLimitReached);
            router.push('/upgrade');
            return;
        }

        if (formData.pageType === 'pro' && !isPro) {
            toast.error(t.create.needProPlan);
            setShowUpgradeModal(true);
            return;
        }

        // 3. Probó cosas PRO: ahora sabe qué son y decide.
        if (proSelections.length > 0) {
            setShowProDecision(true);
            return;
        }

        publish(formData);
    };

    // Al volver del popup de Google, retomar la publicación que lo disparó.
    useEffect(() => {
        if (user && pendingPublishRef.current) {
            pendingPublishRef.current = false;
            setShowLoginGate(false);
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Antes había aquí un spinner a pantalla completa mientras se resolvía la
    // sesión. El editor no necesita usuario para funcionar — la cuenta sólo
    // hace falta al publicar — así que bloquearlo metía una pantalla en blanco
    // y un spinner entre la landing y el editor. Ahora pinta de inmediato y
    // los datos de la cuenta (isPro, límite) llegan cuando llegan.

    // ---- Steps config ----
    const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
        { key: 'content', label: t.create.stepContent, icon: <Type className="w-4 h-4" /> },
        { key: 'design', label: t.create.stepDesign, icon: <Palette className="w-4 h-4" /> },
        { key: 'media', label: t.create.stepMedia, icon: <ImageIcon className="w-4 h-4" /> },
        { key: 'effects', label: t.create.stepEffects, icon: <Sparkles className="w-4 h-4" /> },
        { key: 'preview', label: t.create.stepPublish, icon: <Eye className="w-4 h-4" /> },
    ];
    const stepIndex = steps.findIndex((s) => s.key === currentStep);

    const canGoNext = () => {
        if (currentStep === 'content') return missingFields.length === 0;
        return true;
    };

    const goNext = () => {
        if (!canGoNext()) {
            focusMissing();
            toast.error(
                missingFields.length === 1
                    ? t.create.missingOne.replace('{field}', missingFields[0].label)
                    : t.create.missingMany.replace('{fields}', missingFields.map((f) => f.label).join(', '))
            );
            return;
        }
        const nextIndex = stepIndex + 1;
        if (nextIndex < steps.length) setCurrentStep(steps[nextIndex].key);
    };

    const goBack = () => {
        const prevIndex = stepIndex - 1;
        if (prevIndex >= 0) setCurrentStep(steps[prevIndex].key);
    };

    // ============================================================
    // RENDER
    // ============================================================
    // ---- Preview component (reutilizable) ----
    const previewContent = () => {
        const words = (formData.title || t.create.previewDefaultTitle).trim().split(/\s+/);
        const recipient = formData.recipientName || t.create.previewDefaultRecipient;
        const customTitleFont = formData.titleFont !== RISO_FONT;
        const customBodyFont = formData.bodyFont !== RISO_FONT;
        // `multiply` desaparece sobre papel oscuro; ahí las tintas van en `screen`.
        const inkBlend: 'multiply' | 'screen' = isDarkColor(formData.backgroundColor) ? 'screen' : 'multiply';
        const stk = formData.selectedStickers.slice(0, 3).map(
            (id) => STICKERS.find((s) => s.id === id)?.emoji ?? ''
        );
        return (
            <div
                className="grain"
                style={{
                    // La paleta elegida redefine las variables riso aquí dentro,
                    // así que todo lo de abajo se tiñe solo.
                    ...pageThemeVars(formData),
                    width: '100%', height: '100%',
                    background: 'var(--paper)',
                    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.1  0 0 0 0 0 0 0 0 0.35 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")",
                    position: 'relative', overflow: 'hidden',
                    fontFamily: 'var(--mono)', color: 'var(--ink-black)',
                }}
            >
                {/* Imagen de fondo: se ve de verdad, con un velo de papel encima
                    para que el texto siga siendo legible. */}
                {bgImagePreview && (
                    <>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0 }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', opacity: 0.68, pointerEvents: 'none', zIndex: 1 }} />
                    </>
                )}
                {/* Partículas — mismo componente que la página publicada, para que
                    lo que se elige aquí sea exactamente lo que se va a ver. */}
                {hasParticles(formData.animation) && (
                    <ParticleCanvas kind={animToKind(formData.animation)} density={0.55} />
                )}
                {/* Riso circles — top right, identical proportions to prototipo */}
                <svg style={{ position: 'absolute', top: -60, right: -80, width: 220, height: 220, mixBlendMode: inkBlend, opacity: 0.78, pointerEvents: 'none' }} viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="var(--ink-red)" />
                </svg>
                <svg style={{ position: 'absolute', top: -40, right: -100, width: 220, height: 220, mixBlendMode: inkBlend, opacity: 0.7, pointerEvents: 'none' }} viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="86" fill="var(--ink-blue)" />
                </svg>

                {/* Top chrome */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
                    <div className="mono-eyebrow" style={{ fontSize: 7, padding: '3px 7px', border: '1.5px solid var(--ink-blue)', color: 'var(--ink-blue)', background: 'var(--paper)' }}>
                        lovepages.ink
                    </div>
                    {formData.backgroundMusic !== 'none' && (
                        <span style={{ width: 24, height: 24, border: '2px solid var(--ink-blue)', color: 'var(--ink-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>♪</span>
                    )}
                </div>

                {/* Main — absolutely centered, mirrors prototipo */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '52px 20px 72px', textAlign: 'center', zIndex: 3 }}>
                    {/* Eyebrow with lines */}
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 18, height: 1.5, background: 'var(--ink-blue)' }} />
                        <span className="mono-eyebrow" style={{ fontSize: 8 }}>{t.create.previewForLabel} {recipient.toLowerCase()}</span>
                        <span style={{ width: 18, height: 1.5, background: 'var(--ink-blue)' }} />
                    </div>

                    {/* Stickers + title (stickers float absolutely around title) */}
                    <div style={{ position: 'relative' }}>
                        {stk[0] && <span style={{ position: 'absolute', left: -22, top: 4, fontSize: 18, color: 'var(--ink-red)', transform: 'rotate(-18deg)' }}>{stk[0]}</span>}
                        {stk[1] && <span style={{ position: 'absolute', right: -18, top: -8, fontSize: 16, color: 'var(--ink-blue)', transform: 'rotate(14deg)' }}>{stk[1]}</span>}
                        <h1
                            className="serif-display"
                            style={{
                                fontFamily: titleFontFamily(formData.titleFont),
                                // Las cursivas y display de Google no aguantan
                                // la caja alta condensada del riso.
                                textTransform: customTitleFont ? 'none' : 'uppercase',
                                lineHeight: customTitleFont ? 1.04 : 0.86,
                                fontSize: 52, margin: 0, maxWidth: 260,
                            }}
                        >
                            {words.map((word, i) => (
                                <span
                                    key={i}
                                    className={i % 2 === 0 ? 'mis-red' : 'mis-blue'}
                                    style={{ display: 'inline-block', marginRight: '0.18em' }}
                                >
                                    {word}
                                </span>
                            ))}
                        </h1>
                    </div>

                    {/* Message */}
                    <div style={{ marginTop: 18, fontFamily: bodyFontFamily(formData.bodyFont), fontSize: 12, fontStyle: customBodyFont ? 'normal' : 'italic', color: 'var(--ink-black)', maxWidth: 240, lineHeight: 1.55 }}>
                        {formData.message ? renderMsg(formData.message) : t.create.previewMessagePlaceholder}
                    </div>

                    {/* Decorative images */}
                    {decorativeImagePreviews.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {decorativeImagePreviews.slice(0, 3).map((src, i) => (
                                <img key={i} src={src} alt="" style={{ width: 56, height: 56, objectFit: 'cover', border: '2px solid var(--ink-black)' }} />
                            ))}
                        </div>
                    )}

                    {/* Sender */}
                    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 14, height: 1, background: 'var(--ink-red-ink)' }} />
                        <span style={{ fontFamily: 'var(--hand)', fontSize: 18, color: 'var(--ink-red-ink)' }}>{t.create.previewFrom}</span>
                        {stk[2] && <span style={{ fontSize: 14 }}>{stk[2]}</span>}
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button className="btn-accent" style={{ fontSize: 10, padding: '8px 18px', cursor: 'default' }}>
                            {formData.yesButtonText || '¡Sí!'}
                        </button>
                        <button style={{
                            fontSize: 10, padding: '8px 18px', cursor: 'default',
                            background: 'transparent', border: '2px solid var(--ink-blue)',
                            color: 'var(--ink-blue)', fontFamily: 'var(--sans)',
                            fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                        }}>
                            {formData.noButtonText || 'No'}
                        </button>
                    </div>
                </div>

                {/* Footer — absolute bottom */}
                <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-soft)', zIndex: 4 }}>
                    <span>{t.create.previewFooter}</span>
                    <span>lovepages · mx</span>
                </div>
            </div>
        );
    };

    // ── Render ───────────────────────────────────────────────────
    return (
        <>
        {/* ═══════════════════════════════════════════════════════
            DESKTOP — 3-column builder (≥ lg)
        ═══════════════════════════════════════════════════════ */}
        <div
            className="hidden lg:flex flex-col"
            style={{ height: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', overflow: 'hidden', fontFamily: 'var(--mono)' }}
        >
            {/* ── TOP BAR ── */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1.5px solid var(--ink-black)', background: 'var(--paper-soft)', flexShrink: 0, gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href="/dashboard">
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-black)' }}>{t.create.backToPages}</button>
                    </Link>
                    <span style={{ width: 1, height: 18, background: 'var(--ink-black)' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--sans)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{formData.title || t.create.newLetter}</span>
                    <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'var(--ink-blue)', color: 'var(--paper)', border: '1.5px solid var(--ink-black)' }}>{t.create.draftBadge}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {freeLimitReached && <span className="mono-eyebrow" style={{ fontSize: 9, color: 'var(--ink-soft)' }}>{t.create.limitReached}</span>}
                    {isPro && <ProBadge />}
                    {/* Estado real del borrador, no una etiqueta decorativa */}
                    {!freeLimitReached && (
                        <span className="mono-eyebrow" style={{ fontSize: 9, color: savedLabel ? 'var(--ink-blue)' : 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {savedLabel && <Check style={{ width: 11, height: 11 }} />}
                            {savedLabel || t.create.unsaved}
                        </span>
                    )}
                    {savedLabel && (
                        <button
                            onClick={discardDraft}
                            title={t.create.draftDiscard}
                            style={{ padding: '7px 9px', border: '1.5px solid var(--ink-black)', background: 'var(--paper)', cursor: 'pointer', color: 'var(--ink-soft)', lineHeight: 0 }}
                        >
                            <RotateCcw style={{ width: 13, height: 13 }} />
                        </button>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || freeLimitReached}
                            className="btn-accent"
                            style={{ padding: '8px 16px', fontSize: 11, opacity: freeLimitReached ? 0.5 : 1, cursor: freeLimitReached ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? t.create.publishing : t.create.publishBtn}
                        </button>
                        {missingFields.length > 0 && (
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-red)', letterSpacing: '0.06em' }}>
                                {t.create.missingHint.replace('{fields}', missingFields.map((f) => f.label).join(' + '))}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* ── 3-COLUMN GRID ── */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '56px 1fr 380px' }}>

                {/* ─ SIDEBAR — controles del lienzo ─
                    Antes duplicaba las pestañas del panel derecho. Ahora hace lo
                    único que al lienzo le faltaba: elegir en qué pantalla se mira. */}
                <aside style={{ borderRight: '1.5px solid var(--ink-black)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 16, background: 'var(--paper-soft)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 0, background: 'var(--ink-red)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--ink-black)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>L</div>
                    <span style={{ width: 20, height: 1.5, background: 'var(--rule)' }} aria-hidden="true" />
                    <div role="group" aria-label={t.create.canvasDevice} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {PREVIEW_DEVICES.map((device) => {
                            const Icon = device.icon;
                            const active = previewDevice === device.id;
                            return (
                                <button
                                    key={device.id}
                                    onClick={() => setPreviewDevice(device.id)}
                                    title={device.label}
                                    aria-pressed={active}
                                    style={{
                                        width: 36, height: 36,
                                        border: active ? '2px solid var(--ink-red)' : '1.5px solid var(--ink-black)',
                                        background: active ? 'var(--paper)' : 'var(--paper-soft)',
                                        borderRadius: 0, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: active ? 'var(--ink-red)' : 'var(--ink-soft)',
                                        transition: 'all 0.1s',
                                    }}
                                >
                                    <Icon style={{ width: 16, height: 16 }} />
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* ─ CANVAS ─ */}
                <main className="grain" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--paper-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                    {/* Riso circles */}
                    <svg style={{ position: 'absolute', top: '5%', left: '5%', width: 300, height: 300, mixBlendMode: 'multiply', opacity: 0.4, pointerEvents: 'none' }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="var(--ink-red)" />
                    </svg>
                    <svg style={{ position: 'absolute', bottom: '5%', right: '5%', width: 250, height: 250, mixBlendMode: 'multiply', opacity: 0.4, pointerEvents: 'none' }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="85" fill="var(--ink-blue)" />
                    </svg>

                    {/* Marco del dispositivo elegido en el rail */}
                    {(() => {
                        const device = PREVIEW_DEVICES.find((d) => d.id === previewDevice) ?? PREVIEW_DEVICES[0];
                        return (
                            <div style={{ position: 'relative', width: device.width, height: device.height, maxWidth: '100%', maxHeight: '100%', background: 'var(--ink-black)', borderRadius: device.radius, padding: 10, flexShrink: 1, zIndex: 1 }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: Math.max(0, device.radius - 8), overflow: 'hidden' }}>
                                    {previewContent()}
                                </div>
                                {device.notch && (
                                    <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: 'var(--ink-black)', borderRadius: 999, zIndex: 10, pointerEvents: 'none' }} />
                                )}
                            </div>
                        );
                    })()}

                    {/* Preview badge */}
                    <div style={{ position: 'absolute', top: 32, left: 32, padding: '6px 12px', background: 'var(--paper-soft)', border: '1.5px solid var(--ink-black)', fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-blue)', zIndex: 2 }}>
                        {t.create.previewBadge} · {(PREVIEW_DEVICES.find((d) => d.id === previewDevice) ?? PREVIEW_DEVICES[0]).label}
                    </div>

                    {/* URL badge */}
                    <div style={{ position: 'absolute', bottom: 32, left: 32, padding: '8px 14px', background: 'var(--paper-soft)', border: '1.5px solid var(--ink-black)', fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 8, zIndex: 2 }}>
                        <span style={{ color: 'var(--ink-soft)' }}>lovepages.ink/p/</span>
                        <span style={{ color: 'var(--ink-red)', fontWeight: 700 }}>{formData.customSlug || '—'}</span>
                        <span style={{ marginLeft: 6, cursor: 'pointer' }} onClick={() => typeof window !== 'undefined' && navigator.clipboard.writeText(`${window.location.origin}/p/${formData.customSlug}`)}>📋</span>
                    </div>
                </main>

                {/* ─ RIGHT PANEL ─ */}
                <aside style={{ borderLeft: '1.5px solid var(--ink-black)', display: 'flex', flexDirection: 'column', background: 'var(--paper-soft)', overflowY: 'auto' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1.5px solid var(--ink-black)', flexShrink: 0 }}>
                        {([[t.create.tabContent, 'content'], [t.create.tabDesign, 'design'], [t.create.tabMedia, 'media'], [t.create.tabEffects, 'effects'], [t.create.tabLink, 'preview']] as [string, Step][]).map(([label, step]) => (
                            <button
                                key={step}
                                onClick={() => setCurrentStep(step)}
                                style={{
                                    flex: 1,
                                    background: currentStep === step ? 'var(--paper)' : 'transparent',
                                    border: 'none',
                                    borderRight: '1.5px solid var(--ink-black)',
                                    padding: '14px 8px', cursor: 'pointer',
                                    borderBottom: currentStep === step ? '3px solid var(--ink-red)' : '3px solid transparent',
                                    color: currentStep === step ? 'var(--ink-black)' : 'var(--ink-soft)',
                                    fontSize: 10, fontWeight: 600, marginBottom: -1.5,
                                    whiteSpace: 'nowrap', transition: 'all 0.1s',
                                    fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase',
                                }}
                            >{label}</button>
                        ))}
                    </div>

                    {/* Scrollable content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Borrador recuperado */}
                        {restoredNotice && (
                            <div style={{ padding: '10px 14px', background: 'var(--paper-2)', border: '1.5px solid var(--ink-black)', fontSize: 11, fontFamily: 'var(--mono)', display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.45 }}>
                                <RotateCcw style={{ width: 13, height: 13, flexShrink: 0, marginTop: 2, color: 'var(--ink-blue)' }} />
                                <span style={{ flex: 1 }}>{restoredNotice.hadImages ? t.create.draftRestoredImages : t.create.draftRestored}</span>
                                <button onClick={() => setRestoredNotice(null)} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--ink-soft)', padding: 0, lineHeight: 1 }}>×</button>
                            </div>
                        )}

                        {/* Opciones PRO en prueba: se cobran al publicar, no al elegirlas */}
                        {proSelections.length > 0 && (
                            <button
                                onClick={() => setShowProDecision(true)}
                                style={{ padding: '10px 14px', background: 'var(--melocoton)', border: '1.5px solid var(--ink-red)', fontSize: 11, fontFamily: 'var(--mono)', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'var(--ink-black)' }}
                            >
                                <Crown style={{ width: 13, height: 13, flexShrink: 0, color: 'var(--ink-red)' }} />
                                <span style={{ flex: 1, lineHeight: 1.4 }}>
                                    {proSelections.length === 1
                                        ? t.create.proTrialBarOne
                                        : t.create.proTrialBarMany.replace('{n}', String(proSelections.length))}
                                </span>
                                <span style={{ textDecoration: 'underline', color: 'var(--ink-red)', fontWeight: 700, whiteSpace: 'nowrap' }}>{t.create.proTrialBarCta}</span>
                            </button>
                        )}

                        {/* ── Tab: contenido ── */}
                        {currentStep === 'content' && (<>
                            <DField label={t.create.fieldTitle} hint={<RequiredMark filled={!!formData.title.trim()} label={t.create.requiredMark} />}>
                                <input
                                    ref={titleRef}
                                    value={formData.title}
                                    onChange={e => updateForm({ title: e.target.value })}
                                    placeholder={t.create.titlePlaceholder}
                                    maxLength={200}
                                    aria-required="true"
                                    aria-invalid={invalidField === 'title'}
                                    style={invalidField === 'title' ? dInvalid : dI}
                                />
                            </DField>
                            <DField label={t.create.fieldRecipient} hint={<RequiredMark filled={!!formData.recipientName.trim()} label={t.create.requiredMark} />}>
                                <input
                                    ref={recipientRef}
                                    value={formData.recipientName}
                                    onChange={e => updateForm({ recipientName: e.target.value })}
                                    placeholder={t.create.recipientPlaceholder}
                                    maxLength={100}
                                    aria-required="true"
                                    aria-invalid={invalidField === 'recipientName'}
                                    style={invalidField === 'recipientName' ? dInvalid : dI}
                                />
                            </DField>
                            <DField label={t.create.fieldMessage} hint={`${formData.message.length}/1000`}>
                                <textarea value={formData.message} onChange={e => updateForm({ message: e.target.value })} placeholder={t.create.messagePlaceholder} maxLength={1000} rows={5} style={{ ...dI, resize: 'none', lineHeight: 1.5 }} />
                            </DField>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <DField label={t.create.fieldYesBtn}>
                                    <input value={formData.yesButtonText} onChange={e => updateForm({ yesButtonText: e.target.value })} maxLength={50} style={dI} />
                                </DField>
                                <DField label={t.create.fieldNoBtn}>
                                    <input value={formData.noButtonText} onChange={e => updateForm({ noButtonText: e.target.value })} maxLength={50} style={dI} />
                                </DField>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--paper)', border: '1.5px solid var(--ink-black)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>
                                <input type="checkbox" checked={formData.noButtonEscapes} onChange={e => updateForm({ noButtonEscapes: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--ink-red)' }} />
                                {t.create.noEscapes}
                            </label>
                            {isPro && (
                                <div style={{ borderTop: '1.5px solid var(--rule)', paddingTop: 16 }}>
                                    <CustomSlugInput value={formData.customSlug} onChange={v => updateForm({ customSlug: v })} isPro={isPro} onUpgrade={goToUpgrade} recipientName={formData.recipientName} />
                                </div>
                            )}
                            {isPro && (
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'var(--paper)', border: '1.5px solid var(--ink-black)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--mono)' }}>
                                    <input type="checkbox" checked={formData.pageType === 'pro'} onChange={e => updateForm({ pageType: e.target.checked ? 'pro' : 'free' })} style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--ink-red)' }} />
                                    <div>
                                        <span style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>✦ {t.create.useAI}</span>
                                        <p style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.4 }}>{t.create.useAIDesc}</p>
                                    </div>
                                </label>
                            )}
                        </>)}

                        {/* ── Tab: tema ── */}
                        {currentStep === 'design' && (<>
                            <DField label={t.create.fieldPalette}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                    {THEMES.map(theme => (
                                        <div key={theme.id} style={{ position: 'relative' }}>
                                            {!theme.free && !isPro && <div style={{ position: 'absolute', top: 6, right: 6, zIndex: 10 }}><ProBadge small /></div>}
                                            <button
                                                onClick={() => selectTheme(theme)}
                                                style={{
                                                    width: '100%', padding: 10,
                                                    border: formData.theme === theme.id ? '2px solid var(--ink-red)' : '1.5px solid var(--ink-black)',
                                                    background: 'var(--paper)', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                    opacity: !theme.free && !isPro ? 0.5 : 1,
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <span style={{ display: 'flex', flexShrink: 0 }}>
                                                    <span style={{ width: 18, height: 18, background: theme.colors.bg, border: '1.5px solid var(--ink-black)' }} />
                                                    <span style={{ width: 18, height: 18, background: theme.colors.accent, border: '1.5px solid var(--ink-black)', borderLeft: 'none', mixBlendMode: 'multiply' }} />
                                                </span>
                                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.themes[theme.id as keyof typeof t.themes] || theme.name}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </DField>

                            <DField label={t.create.fieldColors}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    {(['bg', 'text', 'accent'] as const).map(ct => {
                                        const labels = { bg: t.create.colorBg, text: t.create.colorText, accent: t.create.colorAccent };
                                        const ck = colorKeyMap[ct];
                                        const val = formData[ck] as string;
                                        return (
                                            <div key={ct}>
                                                <span className="mono-eyebrow" style={{ fontSize: 9, color: 'var(--ink-soft)', display: 'block', marginBottom: 4 }}>{labels[ct]}</span>
                                                <button
                                                    onClick={() => setShowColorPicker(showColorPicker === ct ? null : ct)}
                                                    style={{ width: '100%', height: 40, border: '1.5px solid var(--ink-black)', background: val, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'white', mixBlendMode: 'difference' }}>{val}</span>
                                                </button>
                                                {showColorPicker === ct && (
                                                    <div style={{ position: 'relative' }}>
                                                        <div style={{ position: 'fixed', inset: 0, zIndex: 19 }} onClick={() => setShowColorPicker(null)} />
                                                        <div style={{ position: 'absolute', zIndex: 20, marginTop: 8 }}>
                                                            <HexColorPicker color={val} onChange={c => updateForm({ [ck]: c })} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </DField>

                            <DField label={t.create.fieldFont}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                                    {GOOGLE_FONTS.map(font => (
                                        <div key={font.name} style={{ position: 'relative' }}>
                                            {!font.free && !isPro && <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 5 }}><ProBadge small /></div>}
                                            <button
                                                onClick={() => selectFont(font, 'titleFont')}
                                                style={{
                                                    width: '100%', padding: '10px 12px',
                                                    border: formData.titleFont === font.name ? '2px solid var(--ink-red)' : '1.5px solid var(--ink-black)',
                                                    background: 'var(--paper)', cursor: 'pointer', textAlign: 'left',
                                                    opacity: !font.free && !isPro ? 0.5 : 1,
                                                }}
                                            >
                                                <span className="mono-eyebrow" style={{ fontSize: 9, color: 'var(--ink-soft)', display: 'block', marginBottom: 4 }}>{font.name}</span>
                                                <span style={{ fontSize: 22, fontFamily: titleFontFamily(font.name), display: 'block' }}>Aa Bb Cc</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </DField>
                        </>)}

                        {/* ── Tab: media ── */}
                        {currentStep === 'media' && (<>
                            <DField label={t.create.fieldBgImage}>
                                <div {...bgDropzone.getRootProps()} style={{ border: '2px dashed var(--ink)', borderRadius: 0, padding: 16, textAlign: 'center', cursor: 'pointer', background: bgDropzone.isDragActive ? 'var(--lila-soft)' : 'var(--paper)', boxShadow: '2px 2px 0 var(--ink)' }}>
                                    <input {...bgDropzone.getInputProps()} />
                                    {bgImagePreview ? (
                                        <div>
                                            <img src={bgImagePreview} alt="Fondo" style={{ maxHeight: 90, borderRadius: 0, margin: '0 auto', display: 'block' }} />
                                            <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>{t.create.bgImageChange}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload style={{ width: 26, height: 26, margin: '0 auto 6px', color: 'var(--ink-soft)' }} />
                                            <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{t.create.bgImageDrop}</p>
                                        </div>
                                    )}
                                </div>
                                {bgImagePreview && (
                                    <button onClick={() => { updateForm({ backgroundImage: null }); setBgImagePreview(null); }} style={{ marginTop: 6, fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Trash2 style={{ width: 11, height: 11 }} /> {t.create.bgImageRemove}
                                    </button>
                                )}
                            </DField>

                            <DField label={t.create.fieldStickers} hint={`${formData.selectedStickers.length}/${isPro ? 10 : 3}`}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                                    {STICKERS.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => toggleSticker(s.id)}
                                            style={{
                                                aspectRatio: '1', border: '2px solid var(--ink)', borderRadius: 0,
                                                background: formData.selectedStickers.includes(s.id) ? 'var(--lila)' : 'white',
                                                cursor: 'pointer', fontSize: 22,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: formData.selectedStickers.includes(s.id) ? '3px 3px 0 var(--ink)' : '2px 2px 0 var(--ink)',
                                                opacity: !s.free && !isPro ? 0.4 : 1, position: 'relative',
                                            }}
                                        >
                                            {s.emoji}
                                            {!s.free && !isPro && <Lock style={{ width: 10, height: 10, position: 'absolute', bottom: 2, right: 2, color: '#f59e0b' }} />}
                                        </button>
                                    ))}
                                </div>
                            </DField>

                            <DField label={t.create.fieldDecorative} hint={<span style={{ fontSize: 9, padding: '2px 8px', background: 'var(--lila-soft)', border: '1px solid var(--ink)', borderRadius: 0 }}>{!isPro ? t.create.decorativeHintFree : t.create.decorativeHintPro}</span>}>
                                {decorativeImagePreviews.length > 0 && (
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                                        {decorativeImagePreviews.map((p, i) => (
                                            <div key={i} style={{ position: 'relative' }}>
                                                <img src={p} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 0, border: '2px solid var(--ink)', display: 'block' }} />
                                                <button onClick={() => removeDecorativeImage(i)} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#ef4444', color: 'white', border: 'none', borderRadius: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div {...decorativeDropzone.getRootProps()} style={{ border: '2px dashed var(--ink)', borderRadius: 0, padding: 12, textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '2px 2px 0 var(--ink)', background: 'var(--paper)' }}>
                                    <input {...decorativeDropzone.getInputProps()} />
                                    <Plus style={{ width: 18, height: 18, color: 'var(--ink-soft)' }} />
                                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{t.create.decorativeAdd}</span>
                                </div>
                            </DField>
                        </>)}

                        {/* ── Tab: efectos ── */}
                        {currentStep === 'effects' && (<>
                            <DField label={t.create.fieldParticles}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                                    {ANIMATIONS.map(anim => (
                                        <div key={anim.id} style={{ position: 'relative' }}>
                                            {!anim.free && !isPro && <div style={{ position: 'absolute', top: 2, right: 2, zIndex: 5 }}><ProBadge small /></div>}
                                            <button
                                                onClick={() => { if (!anim.free && !isPro) noteProTrial(); updateForm({ animation: anim.id }); }}
                                                style={{
                                                    aspectRatio: '1', width: '100%',
                                                    border: formData.animation === anim.id ? '2px solid var(--ink-red)' : '1.5px solid var(--ink-black)',
                                                    background: 'var(--paper)', cursor: 'pointer',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                                                    opacity: !anim.free && !isPro ? 0.5 : 1,
                                                }}
                                            >
                                                <span style={{ fontSize: 22, color: 'var(--ink-red)' }}>{anim.emoji}</span>
                                                <span className="mono-eyebrow" style={{ fontSize: 8, color: 'var(--ink-soft)' }}>{anim.id}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </DField>

                            <DField label={t.create.fieldMusic} hint={!isPro ? <ProBadge small /> : undefined}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {BACKGROUND_MUSIC.map(music => (
                                        <button
                                            key={music.id}
                                            onClick={() => { if (!music.free && !isPro) noteProTrial(); updateForm({ backgroundMusic: music.id }); }}
                                            style={{
                                                padding: '10px 12px',
                                                border: formData.backgroundMusic === music.id ? '2px solid var(--ink-red)' : '1.5px solid var(--ink-black)',
                                                background: 'var(--paper)',
                                                cursor: 'pointer', textAlign: 'left', fontSize: 11, fontFamily: 'var(--mono)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                opacity: !music.free && !isPro ? 0.5 : 1,
                                            }}
                                        >
                                            <span>{t.music[music.id as keyof typeof t.music] || music.name}</span>
                                            {formData.backgroundMusic === music.id && <CheckCircle2 style={{ width: 12, height: 12, color: 'var(--ink-red)' }} />}
                                            {!music.free && !isPro && <Lock style={{ width: 10, height: 10, color: 'var(--ink-soft)' }} />}
                                        </button>
                                    ))}
                                </div>
                            </DField>

                            <DField label={t.create.fieldVideo} hint={!isPro ? <ProBadge small /> : undefined}>
                                <input
                                    type="url"
                                    placeholder="https://youtube.com/..."
                                    value={formData.videoUrl}
                                    onChange={e => {
                                        if (!isPro && e.target.value && !formData.videoUrl) noteProTrial();
                                        updateForm({ videoUrl: e.target.value });
                                    }}
                                    style={dI}
                                />
                            </DField>
                        </>)}

                        {/* ── Tab: enlace ── */}
                        {currentStep === 'preview' && (<>
                            {/* El slug se puede escribir sin PRO: se ve en la insignia de
                                URL del lienzo y se decide al publicar, como el resto. */}
                            <DField label={t.create.fieldUrlCustom} hint={!isPro ? <ProBadge small /> : undefined}>
                                <div style={{ display: 'flex', alignItems: 'stretch', border: '1.5px solid var(--ink-black)', background: 'var(--paper)', overflow: 'hidden' }}>
                                    <span style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', borderRight: '1.5px solid var(--ink-black)', background: 'var(--paper-3)', flexShrink: 0 }}>lovepages.ink/p/</span>
                                    <input
                                        value={formData.customSlug}
                                        onChange={e => {
                                            if (!isPro && e.target.value && !formData.customSlug) noteProTrial();
                                            updateForm({ customSlug: e.target.value });
                                        }}
                                        style={{ ...dI, border: 'none', flex: 1, color: 'var(--ink-red)' }}
                                        placeholder={formData.recipientName ? `para-${formData.recipientName.toLowerCase()}` : 'tu-slug-aqui'}
                                    />
                                </div>
                            </DField>

                            {/* La fecha alimenta el recordatorio anual: es lo que
                                da un motivo para volver fuera de San Valentín. */}
                            <DField label={t.create.fieldOccasion} hint={t.create.occasionHint}>
                                <input
                                    type="date"
                                    value={formData.occasionDate}
                                    onChange={e => updateForm({ occasionDate: e.target.value })}
                                    style={dI}
                                />
                                <p style={{ marginTop: 8, fontSize: 10.5, lineHeight: 1.5, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>
                                    {t.create.occasionHelp}
                                </p>
                            </DField>

                            <DField label={t.create.fieldPrivacy}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <label style={{ padding: 12, border: '2px solid var(--ink-red)', background: 'var(--paper)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 18 }}>🔓</span>
                                        <div>
                                            <div style={{ fontSize: 12, fontFamily: 'var(--sans)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{t.create.privacyPublic}</div>
                                            <div style={{ fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>{t.create.privacyPublicDesc}</div>
                                        </div>
                                    </label>
                                    {/* Todavía no existe: se enseña, pero no se ofrece como si se pudiera elegir. */}
                                    <div aria-disabled="true" style={{ padding: 12, border: '1.5px dashed var(--rule)', background: 'transparent', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.6, cursor: 'not-allowed' }}>
                                        <span style={{ fontSize: 18, filter: 'grayscale(1)' }}>🔒</span>
                                        <div>
                                            <div style={{ fontSize: 12, fontFamily: 'var(--sans)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--ink-soft)' }}>{t.create.privacyCode}</div>
                                            <div style={{ fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>{t.create.privacyCodeDesc}</div>
                                        </div>
                                    </div>
                                </div>
                            </DField>

                            <div style={{ padding: 14, background: 'var(--paper)', border: '1.5px solid var(--ink-black)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { k: t.create.summaryTitleKey, v: formData.title || '—', missing: !formData.title.trim() },
                                    { k: t.create.summaryForKey, v: formData.recipientName || '—', missing: !formData.recipientName.trim() },
                                    { k: t.create.summaryThemeKey, v: t.themes[formData.theme as keyof typeof t.themes] || THEMES.find(th => th.id === formData.theme)?.name || '—', missing: false },
                                    { k: t.create.summaryAnimKey, v: t.animations[formData.animation as keyof typeof t.animations] || ANIMATIONS.find(a => a.id === formData.animation)?.name || '—', missing: false },
                                ].map(({ k, v, missing }) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 11, fontFamily: 'var(--mono)' }}>
                                        <span style={{ color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</span>
                                        {/* Un campo obligatorio vacío no puede parecerse a uno opcional vacío */}
                                        {missing ? (
                                            <button
                                                onClick={focusMissing}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ink-red)', fontWeight: 700, fontFamily: 'var(--mono)', fontSize: 11, textDecoration: 'underline' }}
                                            >
                                                <AlertCircle style={{ width: 11, height: 11 }} />
                                                {t.create.requiredMark}
                                            </button>
                                        ) : (
                                            <span style={{ fontWeight: 700, textAlign: 'right' }}>{v}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* La caducidad se cuenta aquí, junto al enlace que se va a
                                mandar, y no como aviso descartable antes de escribir nada. */}
                            {!isPro && (
                                <div style={{ padding: 14, background: 'var(--paper-2)', border: '1.5px solid var(--ink-black)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Clock style={{ width: 14, height: 14, color: 'var(--ink-red)' }} />
                                        <span className="mono-eyebrow" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-black)' }}>{t.create.expirationLinkTitle}</span>
                                    </div>
                                    <p style={{ fontSize: 11, fontFamily: 'var(--mono)', lineHeight: 1.5, color: 'var(--ink-soft)', margin: 0 }}>
                                        {t.create.expirationLinkDesc}
                                    </p>
                                    <button onClick={goToUpgrade} style={{ marginTop: 2, width: '100%', padding: '9px 14px', background: 'var(--ink-red)', color: 'var(--paper)', border: '1.5px solid var(--ink-black)', borderRadius: 0, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '2px 2px 0 var(--ink-black)' }}>
                                        {t.create.expirationLinkCta}
                                    </button>
                                </div>
                            )}

                            <div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || freeLimitReached}
                                    style={{ width: '100%', padding: '12px 20px', background: freeLimitReached ? '#ccc' : 'var(--ink-red)', color: 'var(--paper)', border: '1.5px solid var(--ink-black)', borderRadius: 0, cursor: freeLimitReached ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: '0.06em', boxShadow: '3px 3px 0 var(--ink-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: freeLimitReached ? 0.5 : 1 }}
                                >
                                    <Sparkles style={{ width: 16, height: 16 }} />
                                    {loading ? t.create.publishing : t.create.publishPageBtn}
                                </button>
                                {missingFields.length > 0 && (
                                    <p style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-red)', letterSpacing: '0.04em' }}>
                                        <AlertCircle style={{ width: 11, height: 11 }} />
                                        {t.create.missingHint.replace('{fields}', missingFields.map((f) => f.label).join(' + '))}
                                    </p>
                                )}
                            </div>
                        </>)}
                    </div>
                </aside>
            </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            MOBILE — step wizard (< lg)
        ═══════════════════════════════════════════════════════ */}
        <div
            className="lg:hidden"
            style={{ background: 'var(--paper)', minHeight: 'var(--app-h)', paddingBottom: typing ? 24 : 96 }}
            onFocusCapture={handleEditorFocus}
            onBlurCapture={handleEditorBlur}
        >

            {/* ── Cabecera + vista previa en vivo (fija) ──
                El editor móvil era un asistente lineal donde la maqueta vivía
                detrás de un botón: se escribía a ciegas. Ahora la carta está
                siempre a la vista y las secciones dejan de ser un solo sentido. */}
            <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--paper-soft)', borderBottom: '2px solid var(--ink-black)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
                    <Link href="/dashboard" aria-label={t.create.backToPages} style={{ lineHeight: 0, color: 'var(--ink-black)' }}>
                        <ArrowLeft style={{ width: 18, height: 18 }} />
                    </Link>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontFamily: 'var(--sans)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formData.title || t.create.newLetter}
                    </span>
                    {isPro && <Crown style={{ width: 13, height: 13, color: 'var(--ink-red)', flexShrink: 0 }} />}
                    {savedLabel && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.06em', color: 'var(--ink-blue)', flexShrink: 0 }}>
                            <Check style={{ width: 10, height: 10 }} />
                            {savedLabel}
                        </span>
                    )}
                    <button
                        onClick={() => setPreviewCollapsed((v) => !v)}
                        aria-expanded={!previewCollapsed}
                        aria-label={t.create.previewBadge}
                        style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', lineHeight: 0, color: 'var(--ink-soft)', flexShrink: 0 }}
                    >
                        <ChevronDown style={{ width: 18, height: 18, transform: previewCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 200ms' }} />
                    </button>
                </div>

                {/* Sin marco de teléfono: ya estamos en uno. La carta se ve a
                    ancho real y se recorta en alto, en vez de encogerse a una
                    miniatura ilegible. */}
                <div
                    style={{
                        // Se pliega también mientras se escribe: es cuando hace
                        // falta la pantalla y cuando menos se mira la maqueta.
                        height: previewCollapsed || typing ? 0 : 'var(--preview-h)',
                        overflow: 'hidden',
                        transition: 'height 220ms ease',
                        background: 'var(--paper-3)',
                    }}
                >
                    <div style={{ height: 'var(--preview-h)', width: '100%' }}>
                        {previewContent()}
                    </div>
                </div>

                {/* Secciones: misma navegación y mismas etiquetas que en desktop */}
                <div style={{ display: 'flex', borderTop: '1.5px solid var(--ink-black)' }}>
                    {([[t.create.tabContent, 'content'], [t.create.tabDesign, 'design'], [t.create.tabMedia, 'media'], [t.create.tabEffects, 'effects'], [t.create.tabLink, 'preview']] as [string, Step][]).map(([label, key]) => {
                        const active = currentStep === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setCurrentStep(key)}
                                style={{
                                    // 5 × 78px = 390px: en un móvil de 360 el
                                    // último quedaba fuera y no se descubría.
                                    flex: '1 1 0', minWidth: 0, minHeight: 44,
                                    padding: '11px 4px',
                                    background: active ? 'var(--paper)' : 'transparent',
                                    border: 'none',
                                    borderRight: '1.5px solid var(--ink-black)',
                                    borderBottom: active ? '3px solid var(--ink-red)' : '3px solid transparent',
                                    color: active ? 'var(--ink-black)' : 'var(--ink-soft)',
                                    fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600,
                                    letterSpacing: '0.04em', textTransform: 'uppercase',
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <main className="container py-4 px-4">
                <div className="max-w-lg mx-auto">

                    {freeLimitReached && (
                        <div className="mb-4 px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--butter)', border: '1.5px solid var(--ink)' }}>
                            {t.create.freeLimitReached}
                        </div>
                    )}

                    {restoredNotice && (
                        <div className="mb-4 flex items-start gap-3 px-3 py-2.5" style={{ background: 'var(--paper-2)', border: '1.5px solid var(--ink)' }}>
                            <RotateCcw className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ink-blue)' }} />
                            <div className="flex-1 text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>
                                {restoredNotice.hadImages ? t.create.draftRestoredImages : t.create.draftRestored}
                                <button type="button" onClick={discardDraft} className="ml-1 font-semibold underline">{t.create.draftDiscard}</button>
                            </div>
                            <button type="button" onClick={() => setRestoredNotice(null)} aria-label="Cerrar" style={{ color: 'var(--ink-soft)' }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {proSelections.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowProDecision(true)}
                            className="mb-4 w-full flex items-center gap-2 px-3 py-2.5 text-left"
                            style={{ background: 'var(--melocoton)', border: '1.5px solid var(--ink-red)' }}
                        >
                            <Crown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ink-red)' }} />
                            <span className="flex-1 text-xs" style={{ color: 'var(--ink)' }}>
                                {proSelections.length === 1
                                    ? t.create.proTrialBarOne
                                    : t.create.proTrialBarMany.replace('{n}', String(proSelections.length))}
                            </span>
                            <span className="text-xs font-semibold underline" style={{ color: 'var(--ink-red)' }}>{t.create.proTrialBarCta}</span>
                        </button>
                    )}

                    {/* Mobile steps */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* LEFT: Editor */}
                        <div>
                            {/* ======== STEP 1: CONTENIDO ======== */}
                            {currentStep === 'content' && (
                                <Card>
                                    <CardHeader className="px-4 lg:px-6">
                                        <CardTitle className="flex items-center gap-2">
                                            <Type className="w-5 h-5 text-pink-600" />
                                            {t.create.contentTitle}
                                        </CardTitle>
                                        <CardDescription>
                                            {t.create.contentDesc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-4 lg:px-6">
                                        <Input
                                            ref={mTitleRef}
                                            label={t.create.titleLabel}
                                            placeholder={t.create.titlePlaceholder}
                                            value={formData.title}
                                            onChange={(e) => updateForm({ title: e.target.value })}
                                            maxLength={200}
                                            required
                                            aria-invalid={invalidField === 'title'}
                                            error={invalidField === 'title' ? t.create.titleRequired : undefined}
                                        />

                                        <Input
                                            ref={mRecipientRef}
                                            label={t.create.recipientLabel}
                                            placeholder={t.create.recipientPlaceholder}
                                            value={formData.recipientName}
                                            onChange={(e) => updateForm({ recipientName: e.target.value })}
                                            maxLength={100}
                                            required
                                            aria-invalid={invalidField === 'recipientName'}
                                            error={invalidField === 'recipientName' ? t.create.recipientRequired : undefined}
                                        />
                                        {isPro && (
                                            <div className="border-t pt-4 mt-4">
                                                <CustomSlugInput
                                                    value={formData.customSlug}
                                                    onChange={(value) => updateForm({ customSlug: value })}
                                                    isPro={isPro}
                                                    onUpgrade={goToUpgrade}
                                                    recipientName={formData.recipientName} // 🆕 NUEVO: Pasar el nombre para generar preview
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                {t.create.messageLabel}
                                            </label>
                                            <textarea
                                                placeholder={t.create.messagePlaceholder}
                                                value={formData.message}
                                                onChange={(e) => updateForm({ message: e.target.value })}
                                                maxLength={1000}
                                                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all min-h-[120px] resize-none"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formData.message.length}/1000
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <Input
                                                label={t.create.yesButtonLabel}
                                                placeholder={t.create.yesButtonPlaceholder}
                                                value={formData.yesButtonText}
                                                onChange={(e) => updateForm({ yesButtonText: e.target.value })}
                                                maxLength={50}
                                            />
                                            <Input
                                                label={t.create.noButtonLabel}
                                                placeholder={t.create.noButtonPlaceholder}
                                                value={formData.noButtonText}
                                                onChange={(e) => updateForm({ noButtonText: e.target.value })}
                                                maxLength={50}
                                            />
                                        </div>

                                        <label htmlFor="noButtonEscapes" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg min-h-[44px] cursor-pointer active:scale-[0.98] transition-transform">
                                            <input
                                                type="checkbox"
                                                id="noButtonEscapes"
                                                checked={formData.noButtonEscapes}
                                                onChange={(e) => updateForm({ noButtonEscapes: e.target.checked })}
                                                className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {t.create.noEscapes}
                                            </span>
                                        </label>

                                        {/* Tipo PRO con IA */}
                                        {isPro && (
                                            <div className="border-t pt-4">
                                                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                    <input
                                                        type="checkbox"
                                                        id="useAI"
                                                        checked={formData.pageType === 'pro'}
                                                        onChange={(e) =>
                                                            updateForm({ pageType: e.target.checked ? 'pro' : 'free' })
                                                        }
                                                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                                    />
                                                    <label htmlFor="useAI" className="text-sm text-gray-700">
                                                        <span className="font-medium flex items-center gap-1">
                                                            <Wand2 className="w-4 h-4 text-amber-600" />
                                                            {t.create.useAI}
                                                        </span>
                                                        <span className="text-xs text-gray-500 block mt-0.5">
                                                            {t.create.useAIDesc}
                                                        </span>
                                                    </label>
                                                </div>

                                                {formData.pageType === 'pro' && (
                                                    <div className="mt-4">
                                                        <div
                                                            {...referenceDropzone.getRootProps()}
                                                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${referenceDropzone.isDragActive
                                                                ? 'border-amber-500 bg-amber-50'
                                                                : 'border-gray-300 hover:border-amber-400'
                                                                }`}
                                                        >
                                                            <input {...referenceDropzone.getInputProps()} />
                                                            {referenceImagePreview ? (
                                                                <div className="space-y-3">
                                                                    <img
                                                                        src={referenceImagePreview}
                                                                        alt="Referencia"
                                                                        className="max-h-48 mx-auto rounded-lg"
                                                                    />
                                                                    <p className="text-sm text-gray-600">
                                                                        {t.create.refImageChange}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-2">
                                                                    <Wand2 className="w-10 h-10 text-amber-400 mx-auto" />
                                                                    <p className="text-sm font-medium text-gray-700">
                                                                        {t.create.refImageUpload}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {t.create.refImageFormat}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Navigation buttons - desktop only (mobile uses bottom bar) */}
                                        <div className="hidden lg:block">
                                            <Button onClick={goNext} variant="gradient" className="w-full" disabled={!canGoNext()}>
                                                {t.common.next} <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ======== STEP 2: DISEÑO (tema, colores, tipografía) ======== */}
                            {currentStep === 'design' && (
                                <Card>
                                    <CardHeader className="px-4 lg:px-6">
                                        <CardTitle className="flex items-center gap-2">
                                            <Palette className="w-5 h-5 text-pink-600" />
                                            {t.create.designTitle}
                                        </CardTitle>
                                        <CardDescription>{t.create.designDesc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 px-4 lg:px-6">
                                        {/* Temas - responsive grid */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                {t.create.themeLabel}
                                            </label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                                                {THEMES.map((theme) => (
                                                    <div key={theme.id} className="relative">
                                                        {!theme.free && !isPro && (
                                                            <div className="absolute top-1 right-1 z-10">
                                                                <ProBadge small />
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => selectTheme(theme)}
                                                            className={`w-full p-2.5 border-2 rounded-xl transition-all active:scale-95 min-h-[44px] ${formData.theme === theme.id
                                                                ? 'border-pink-600 ring-2 ring-pink-200'
                                                                : 'border-gray-200 hover:border-pink-300'
                                                                } ${!theme.free && !isPro ? 'opacity-70' : ''}`}
                                                        >
                                                            <div className={`h-14 sm:h-12 rounded-lg mb-1.5 ${theme.preview}`} />
                                                            <p className="text-xs sm:text-[11px] font-medium text-center leading-tight">
                                                                {theme.emoji} {t.themes[theme.id as keyof typeof t.themes]}
                                                            </p>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Colores personalizados */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                {t.create.colorsLabel}
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {(['bg', 'text', 'accent'] as const).map((colorType) => {
                                                    const labels = { bg: t.create.colorBg, text: t.create.colorText, accent: t.create.colorAccent };
                                                    const colorKey =
                                                        colorType === 'bg'
                                                            ? 'backgroundColor'
                                                            : colorType === 'text'
                                                                ? 'textColor'
                                                                : 'accentColor';

                                                    return (
                                                        <div key={colorType}>
                                                            <label className="block text-xs text-gray-600 mb-1.5">
                                                                {labels[colorType]}
                                                            </label>
                                                            <button
                                                                onClick={() => {
                                                                    if (isMobile) {
                                                                        setShowMobileColorPicker(colorType);
                                                                    } else {
                                                                        setShowColorPicker(
                                                                            showColorPicker === colorType ? null : colorType
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-full h-11 rounded-lg border-2 border-gray-300 flex items-center justify-center gap-1.5 px-2 hover:border-pink-400 active:scale-95 transition-all"
                                                                style={{ backgroundColor: formData[colorKey] }}
                                                            >
                                                                <span className="text-[10px] font-mono text-white mix-blend-difference">
                                                                    {formData[colorKey]}
                                                                </span>
                                                            </button>
                                                            {/* Desktop color picker (popup) */}
                                                            {!isMobile && showColorPicker === colorType && (
                                                                <div className="relative">
                                                                    <div className="absolute z-20 mt-2">
                                                                        <div
                                                                            className="fixed inset-0"
                                                                            onClick={() => setShowColorPicker(null)}
                                                                        />
                                                                        <div className="relative">
                                                                            <HexColorPicker
                                                                                color={formData[colorKey]}
                                                                                onChange={(color) =>
                                                                                    updateForm({ [colorKey]: color })
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Tipografía - responsive grid */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                {t.create.titleFontLabel}
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 lg:max-h-48 overflow-y-auto pr-1 overscroll-contain">
                                                {GOOGLE_FONTS.map((font) => (
                                                    <div key={font.name} className="relative">
                                                        {!font.free && !isPro && (
                                                            <div className="absolute top-1 right-1 z-10">
                                                                <ProBadge small />
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => selectFont(font, 'titleFont')}
                                                            className={`w-full p-3 sm:p-2.5 border-2 rounded-lg text-left transition-all active:scale-[0.97] min-h-[44px] ${formData.titleFont === font.name
                                                                ? 'border-pink-600 bg-pink-50'
                                                                : 'border-gray-200 hover:border-pink-300'
                                                                } ${!font.free && !isPro ? 'opacity-60' : ''}`}
                                                            style={{ fontFamily: titleFontFamily(font.name) }}
                                                        >
                                                            <span className="text-lg sm:text-base">Aa</span>
                                                            <span className="block text-xs sm:text-[10px] text-gray-500 font-sans mt-0.5">
                                                                {font.name}
                                                            </span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Navigation - desktop only */}
                                        <div className="hidden lg:flex gap-3 pt-2">
                                            <Button onClick={goBack} variant="outline" className="flex-1">
                                                {t.common.back}
                                            </Button>
                                            <Button onClick={goNext} variant="gradient" className="flex-1">
                                                {t.common.next} <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Mobile color picker bottom sheet */}
                            <BottomSheet
                                isOpen={!!showMobileColorPicker}
                                onClose={() => setShowMobileColorPicker(null)}
                                title={
                                    showMobileColorPicker === 'bg' ? t.create.colorBg :
                                    showMobileColorPicker === 'text' ? t.create.colorText :
                                    t.create.colorAccent
                                }
                                height="50vh"
                            >
                                <div className="p-4 flex flex-col items-center gap-4">
                                    {showMobileColorPicker && (
                                        <HexColorPicker
                                            color={formData[
                                                showMobileColorPicker === 'bg' ? 'backgroundColor' :
                                                showMobileColorPicker === 'text' ? 'textColor' : 'accentColor'
                                            ]}
                                            onChange={(color) =>
                                                updateForm({
                                                    [showMobileColorPicker === 'bg' ? 'backgroundColor' :
                                                     showMobileColorPicker === 'text' ? 'textColor' : 'accentColor']: color,
                                                })
                                            }
                                            style={{ width: '100%', maxWidth: 280, height: 200 }}
                                        />
                                    )}
                                    <Button
                                        onClick={() => setShowMobileColorPicker(null)}
                                        variant="gradient"
                                        className="w-full max-w-[280px]"
                                    >
                                        Listo
                                    </Button>
                                </div>
                            </BottomSheet>

                            {/* ======== STEP 3: IMÁGENES Y STICKERS ======== */}
                            {currentStep === 'media' && (
                                <Card>
                                    <CardHeader className="px-4 lg:px-6">
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-pink-600" />
                                            {t.create.mediaTitle}
                                        </CardTitle>
                                        <CardDescription>
                                            {t.create.mediaDesc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 px-4 lg:px-6">
                                        {/* Imagen de fondo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.create.bgImageLabel}
                                            </label>
                                            <div
                                                {...bgDropzone.getRootProps()}
                                                className={`border-2 border-dashed rounded-xl p-5 lg:p-6 text-center cursor-pointer transition-all active:scale-[0.99] ${bgDropzone.isDragActive
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-gray-300 hover:border-pink-400'
                                                    }`}
                                            >
                                                <input {...bgDropzone.getInputProps()} />
                                                {bgImagePreview ? (
                                                    <div className="space-y-2">
                                                        <img
                                                            src={bgImagePreview}
                                                            alt="Fondo"
                                                            className="max-h-32 mx-auto rounded-lg object-cover"
                                                        />
                                                        <p className="text-xs text-gray-500">{t.create.bgImageChange}</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <Upload className="w-9 h-9 lg:w-8 lg:h-8 text-gray-400 mx-auto" />
                                                        <p className="text-sm text-gray-600">
                                                            {t.create.bgImageDrop}
                                                        </p>
                                                        <p className="text-xs text-gray-400">{t.create.bgImageFormat}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {bgImagePreview && (
                                                <button
                                                    onClick={() => {
                                                        updateForm({ backgroundImage: null });
                                                        setBgImagePreview(null);
                                                    }}
                                                    className="mt-2 text-sm text-red-500 hover:text-red-700 active:scale-95 flex items-center gap-1 min-h-[36px] transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> {t.create.bgImageRemove}
                                                </button>
                                            )}
                                        </div>

                                        {/* Imágenes decorativas */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                                                <label className="text-sm font-medium text-gray-700">
                                                    {t.create.decorativeLabel}
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({formData.decorativeImages.length}/{isPro ? 5 : 1})
                                                    </span>
                                                </label>
                                                {!isPro && (
                                                    <span className="text-xs text-amber-600 flex items-center gap-1">
                                                        <Crown className="w-3 h-3" /> {t.create.decorativeProHint}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Preview de imágenes decorativas - botón X siempre visible en mobile */}
                                            {decorativeImagePreviews.length > 0 && (
                                                <div className="flex gap-2 mb-3 flex-wrap">
                                                    {decorativeImagePreviews.map((preview, i) => (
                                                        <div key={i} className="relative group">
                                                            <img
                                                                src={preview}
                                                                alt={`Decorativa ${i + 1}`}
                                                                className="w-20 h-20 object-cover rounded-lg border"
                                                            />
                                                            <button
                                                                onClick={() => removeDecorativeImage(i)}
                                                                aria-label="Eliminar imagen"
                                                                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div
                                                {...decorativeDropzone.getRootProps()}
                                                className="border-2 border-dashed rounded-lg p-5 lg:p-4 text-center cursor-pointer hover:border-pink-400 active:scale-[0.99] transition-all min-h-[80px] flex flex-col items-center justify-center"
                                            >
                                                <input {...decorativeDropzone.getInputProps()} />
                                                <Plus className="w-7 h-7 lg:w-6 lg:h-6 text-gray-400" />
                                                <p className="text-xs text-gray-500 mt-1">{t.create.decorativeAdd}</p>
                                            </div>
                                        </div>

                                        {/* Stickers - grid responsivo */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                                                <label className="text-sm font-medium text-gray-700">
                                                    {t.create.stickersLabel}
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({formData.selectedStickers.length}/{isPro ? 10 : 3})
                                                    </span>
                                                </label>
                                                {!isPro && (
                                                    <span className="text-xs text-amber-600 flex items-center gap-1">
                                                        <Crown className="w-3 h-3" /> {t.create.stickersProHint}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                                                {STICKERS.map((sticker) => (
                                                    <button
                                                        key={sticker.id}
                                                        onClick={() => toggleSticker(sticker.id)}
                                                        className={`relative aspect-square flex items-center justify-center text-3xl lg:text-2xl rounded-lg border-2 transition-all active:scale-95 min-h-[44px] ${formData.selectedStickers.includes(sticker.id)
                                                            ? 'border-pink-500 bg-pink-50 scale-105'
                                                            : 'border-gray-200 hover:border-pink-300'
                                                            } ${!sticker.free && !isPro ? 'opacity-40' : ''}`}
                                                    >
                                                        {sticker.emoji}
                                                        {!sticker.free && !isPro && (
                                                            <Lock className="w-2.5 h-2.5 absolute bottom-0.5 right-0.5 text-amber-500" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Navigation - desktop only */}
                                        <div className="hidden lg:flex gap-3 pt-2">
                                            <Button onClick={goBack} variant="outline" className="flex-1">
                                                {t.common.back}
                                            </Button>
                                            <Button onClick={goNext} variant="gradient" className="flex-1">
                                                {t.common.next} <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ======== STEP 4: EFECTOS (animaciones, música) ======== */}
                            {currentStep === 'effects' && (
                                <Card>
                                    <CardHeader className="px-4 lg:px-6">
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-pink-600" />
                                            {t.create.effectsTitle}
                                        </CardTitle>
                                        <CardDescription>
                                            {t.create.effectsDesc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 px-4 lg:px-6">
                                        {/* Animaciones - 2 cols mobile, 2 cols desktop */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                {t.create.animationLabel}
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {ANIMATIONS.map((anim) => (
                                                    <div key={anim.id} className="relative">
                                                        {!anim.free && !isPro && (
                                                            <div className="absolute top-1 right-1 z-10">
                                                                <ProBadge small />
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                if (!anim.free && !isPro) noteProTrial();
                                                                updateForm({ animation: anim.id });
                                                            }}
                                                            className={`w-full p-3 border-2 rounded-lg text-left transition-all active:scale-95 min-h-[48px] ${formData.animation === anim.id
                                                                ? 'border-pink-600 bg-pink-50'
                                                                : 'border-gray-200 hover:border-pink-300'
                                                                } ${!anim.free && !isPro ? 'opacity-60' : ''}`}
                                                        >
                                                            <span className="text-lg mr-2">{anim.emoji}</span>
                                                            <span className="text-sm">{t.animations[anim.id as keyof typeof t.animations]}</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Música de fondo */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                    <Music className="w-4 h-4" />
                                                    {t.create.musicLabel}
                                                </label>
                                                {!isPro && <ProBadge />}
                                            </div>
                                            <div className="space-y-2">
                                                {BACKGROUND_MUSIC.map((music) => (
                                                    <div key={music.id} className="relative">
                                                        <button
                                                            onClick={() => {
                                                                if (!music.free && !isPro) noteProTrial();
                                                                updateForm({ backgroundMusic: music.id });
                                                            }}
                                                            className={`w-full p-3 border-2 rounded-lg text-left text-sm transition-all flex items-center justify-between active:scale-[0.98] min-h-[48px] ${formData.backgroundMusic === music.id
                                                                ? 'border-pink-600 bg-pink-50'
                                                                : 'border-gray-200 hover:border-pink-300'
                                                                } ${!music.free && !isPro ? 'opacity-60' : ''}`}
                                                        >
                                                            <span>{t.music[music.id as keyof typeof t.music]}</span>
                                                            {formData.backgroundMusic === music.id && (
                                                                <CheckCircle2 className="w-4 h-4 text-pink-600" />
                                                            )}
                                                            {!music.free && !isPro && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Video embed PRO */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                    Video embed
                                                </label>
                                                {!isPro && <ProBadge />}
                                            </div>
                                            <div>
                                                <input
                                                    type="url"
                                                    placeholder="https://youtube.com/watch?v=... o https://tiktok.com/..."
                                                    value={formData.videoUrl}
                                                    onChange={(e) => {
                                                        if (!isPro && e.target.value && !formData.videoUrl) noteProTrial();
                                                        updateForm({ videoUrl: e.target.value });
                                                    }}
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[44px]"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">YouTube o TikTok. Se mostrará como video embed en tu página.</p>
                                            </div>
                                        </div>

                                        {/* Marca de agua */}
                                        {!isPro && (
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-amber-900">
                                                            {t.create.watermarkNote}
                                                        </p>
                                                        <p className="text-xs text-amber-700 mt-0.5">
                                                            {t.create.watermarkUpgrade}
                                                        </p>
                                                        <Button
                                                            onClick={goToUpgrade}
                                                            variant="gradient"
                                                            size="sm"
                                                            className="mt-2"
                                                        >
                                                            <Crown className="w-3.5 h-3.5 mr-1" />
                                                            {t.nav.upgradePro}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation - desktop only */}
                                        <div className="hidden lg:flex gap-3 pt-2">
                                            <Button onClick={goBack} variant="outline" className="flex-1">
                                                {t.common.back}
                                            </Button>
                                            <Button onClick={goNext} variant="gradient" className="flex-1">
                                                {t.create.livePreview} <Eye className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ======== STEP 5: PREVIEW & PUBLISH ======== */}
                            {currentStep === 'preview' && (
                                <Card>
                                    <CardHeader className="px-4 lg:px-6">
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            ¡Todo listo!
                                        </CardTitle>
                                        <CardDescription>Revisa tu página y publícala</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-4 lg:px-6">
                                        {/* La maqueta ya está fija arriba: repetirla aquí sobraba */}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                {t.create.fieldOccasion} <span className="text-gray-400">({t.create.occasionHint})</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.occasionDate}
                                                onChange={(e) => updateForm({ occasionDate: e.target.value })}
                                                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                                {t.create.occasionHelp}
                                            </p>
                                        </div>

                                        {isPro && formData.customSlug && (
                                            <div className="p-4" style={{ background: 'var(--paper-soft)', border: '2px solid var(--ink-black)' }}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Crown className="w-4 h-4" style={{ color: 'var(--ink-blue)' }} />
                                                    <p className="text-sm font-bold" style={{ color: 'var(--ink-black)', fontFamily: 'var(--mono)', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11 }}>
                                                        URL Personalizada
                                                    </p>
                                                </div>
                                                <div className="bg-white p-3" style={{ border: '1.5px solid var(--ink-black)' }}>
                                                    <p className="font-mono text-sm break-all" style={{ color: 'var(--ink-blue)' }}>
                                                        {window.location.origin}/p/{formData.customSlug}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-pink-600 mt-2 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    ¡{formData.recipientName} verá esto primero!
                                                </p>
                                            </div>
                                        )}

                                        {/* La caducidad se cuenta junto al enlace, en el momento
                                            en que la carta ya existe y hay algo que perder. */}
                                        {!isPro && (
                                            <div className="p-4" style={{ background: 'var(--paper-2)', border: '1.5px solid var(--ink-black)' }}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="w-4 h-4" style={{ color: 'var(--ink-red)' }} />
                                                    <p className="text-sm font-bold" style={{ color: 'var(--ink-black)' }}>
                                                        {t.create.expirationLinkTitle}
                                                    </p>
                                                </div>
                                                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                                                    {t.create.expirationLinkDesc}
                                                    <br />
                                                    <span style={{ color: 'var(--ink-soft)' }}>{t.create.proUrlYour} </span>
                                                    <span className="font-mono">lovepages.ink/p/xK9mP2nQ7z</span>
                                                    {formData.recipientName && (
                                                        <>
                                                            <br />
                                                            <span style={{ color: 'var(--ink-soft)' }}>{t.create.proUrlWithPro} </span>
                                                            <span className="font-mono font-bold" style={{ color: 'var(--ink-red)' }}>
                                                                lovepages.ink/p/para-{formData.recipientName.toLowerCase()}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                                <Button
                                                    onClick={goToUpgrade}
                                                    variant="gradient"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    <Crown className="w-4 h-4 mr-1" />
                                                    {t.create.expirationLinkCta}
                                                </Button>
                                            </div>
                                        )}

                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Título</p>
                                                <p className="font-medium">{formData.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Para</p>
                                                <p className="font-medium">{formData.recipientName}</p>
                                            </div>
                                            {formData.message && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Mensaje</p>
                                                    <p className="text-sm text-gray-700">{formData.message}</p>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">Tema</p>
                                                    <p className="font-medium capitalize">
                                                        {THEMES.find((t) => t.id === formData.theme)?.emoji}{' '}
                                                        {THEMES.find((t) => t.id === formData.theme)?.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Tipografía</p>
                                                    <p className="font-medium">{formData.titleFont}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Animación</p>
                                                    <p className="font-medium">
                                                        {ANIMATIONS.find((a) => a.id === formData.animation)?.emoji}{' '}
                                                        {ANIMATIONS.find((a) => a.id === formData.animation)?.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Stickers</p>
                                                    <p className="font-medium">
                                                        {formData.selectedStickers.length > 0
                                                            ? formData.selectedStickers
                                                                .map((id) => STICKERS.find((s) => s.id === id)?.emoji)
                                                                .join(' ')
                                                            : 'Ninguno'}
                                                    </p>
                                                </div>
                                            </div>
                                            {formData.backgroundImage && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Imagen de fondo</p>
                                                    <p className="text-sm text-green-600">✓ Incluida</p>
                                                </div>
                                            )}
                                            {formData.decorativeImages.length > 0 && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Imágenes decorativas</p>
                                                    <p className="text-sm text-green-600">
                                                        ✓ {formData.decorativeImages.length} imagen(es)
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {formData.pageType === 'pro' && (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center gap-2">
                                                <Wand2 className="w-4 h-4" />
                                                La IA generará un diseño único basado en tu imagen de referencia
                                            </div>
                                        )}

                                        {/* Publish button - desktop only (mobile uses bottom bar) */}
                                        <div className="hidden lg:flex gap-3">
                                            <Button onClick={goBack} variant="outline" className="flex-1">
                                                Atrás
                                            </Button>
                                            <Button
                                                onClick={handleSubmit}
                                                loading={loading}
                                                variant="gradient"
                                                className="flex-1"
                                            >
                                                Publicar Página
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            {/* ── Barra inferior: publicar desde cualquier sección ──
                Ya no hay «Atrás / Siguiente»: el orden lo sugieren las secciones,
                no lo impone la barra. Si falta algo, aquí se dice qué. */}
            {/* Con el teclado abierto, una barra fija se queda flotando encima
                en iOS y tapa el campo. Se aparta mientras se escribe. */}
            <div
                className="fixed bottom-0 left-0 right-0 z-30 px-3 py-2.5 pb-[max(10px,env(safe-area-inset-bottom))]"
                style={{
                    background: 'var(--paper-soft)',
                    borderTop: '2px solid var(--ink)',
                    transform: typing ? 'translateY(110%)' : 'none',
                    transition: 'transform 180ms ease',
                    pointerEvents: typing ? 'none' : 'auto',
                }}
                aria-hidden={typing}
            >
                <div className="max-w-md mx-auto flex flex-col gap-1.5">
                    {missingFields.length > 0 && (
                        <button
                            type="button"
                            onClick={focusMissing}
                            className="flex items-center justify-center gap-1.5 text-[11px]"
                            style={{ fontFamily: 'var(--mono)', color: 'var(--ink-red)', background: 'none', border: 'none', letterSpacing: '0.04em' }}
                        >
                            <AlertCircle className="w-3 h-3" />
                            {t.create.missingHint.replace('{fields}', missingFields.map((f) => f.label).join(' + '))}
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        {currentStep !== 'preview' && (
                            <Button
                                onClick={() => setCurrentStep('preview')}
                                variant="outline"
                                size="lg"
                                className="flex-1 min-h-[48px]"
                            >
                                {t.create.tabLink}
                                <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        )}
                        <Button
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={freeLimitReached}
                            variant="gradient"
                            size="lg"
                            className={currentStep === 'preview' ? 'w-full min-h-[48px]' : 'flex-[1.5] min-h-[48px]'}
                        >
                            <Sparkles className="w-4 h-4 mr-1.5" />
                            {loading ? t.create.publishing : 'Publicar'}
                        </Button>
                    </div>
                </div>
            </div>

        </div>

        {/* ═══════════════════════════════════════════════════════
            SHARED — BottomSheets + Modal (mobile + desktop)
        ═══════════════════════════════════════════════════════ */}
        <LoginGateModal
            isOpen={showLoginGate}
            onClose={() => { pendingPublishRef.current = false; setShowLoginGate(false); }}
            title={t.create.loginGateTitle}
            description={t.create.loginGateDesc}
        />

        <ProDecisionModal
            isOpen={showProDecision}
            onClose={() => setShowProDecision(false)}
            onPublishFree={publishWithoutPro}
            onUpgrade={() => { setShowProDecision(false); setShowUpgradeModal(true); }}
            selections={proSelections.map(({ label, value }) => ({ label, value }))}
        />

        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </>
    );
}
