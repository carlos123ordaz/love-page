'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { CustomSlugInput } from '@/components/CustomSlugInput';
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

const EXPIRATION_NOTICE_DISMISSED_KEY = 'love-pages:create:expiration-notice-dismissed';

const THEMES = [
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
// DESKTOP HELPERS — defined outside component to avoid remount on each render
// ============================================================
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
    const [showExpirationNotice, setShowExpirationNotice] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);
    const [decorativeImagePreviews, setDecorativeImagePreviews] = useState<string[]>([]);
    const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
    const [showColorPicker, setShowColorPicker] = useState<'bg' | 'text' | 'accent' | null>(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [showMobileColorPicker, setShowMobileColorPicker] = useState<'bg' | 'text' | 'accent' | null>(null);
    const isMobile = useMediaQuery('(max-width: 1023px)');
    const { t } = useTranslation();

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
        theme: 'romantic',
        backgroundColor: '#ff69b4',
        textColor: '#ffffff',
        accentColor: '#ff1493',
        titleFont: 'Dancing Script',
        bodyFont: 'Quicksand',
        backgroundImage: null,
        decorativeImages: [],
        referenceImage: null,
        selectedStickers: [],
        animation: 'hearts-falling',
        backgroundMusic: 'none',
        videoUrl: '',
        showWatermark: !isPro,
        customSlug: '',
    });

    // Cargar Google Fonts dinámicamente
    useEffect(() => {
        const fontsToLoad = GOOGLE_FONTS.map((f) => f.name.replace(/ /g, '+')).join('&family=');
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        link.onload = () => setFontsLoaded(true);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    useEffect(() => {
        const isDismissed = localStorage.getItem(EXPIRATION_NOTICE_DISMISSED_KEY) === 'true';
        setShowExpirationNotice(!isDismissed);
    }, []);

    // Auth no requerido - usuarios pueden diseñar sin login
    // Se pedirá login al momento de guardar si no están autenticados

    const updateForm = (updates: Partial<PageFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const goToUpgrade = () => {
        setShowUpgradeModal(true);
    };

    const dismissExpirationNotice = () => {
        localStorage.setItem(EXPIRATION_NOTICE_DISMISSED_KEY, 'true');
        setShowExpirationNotice(false);
    };

    const selectTheme = (theme: (typeof THEMES)[0]) => {
        if (!theme.free && !isPro) {
            goToUpgrade();
            return;
        }
        updateForm({
            theme: theme.id,
            backgroundColor: theme.colors.bg,
            textColor: theme.colors.text,
            accentColor: theme.colors.accent,
        });
    };

    const selectFont = (font: (typeof GOOGLE_FONTS)[0], target: 'titleFont' | 'bodyFont') => {
        if (!font.free && !isPro) {
            goToUpgrade();
            return;
        }
        updateForm({ [target]: font.name });
    };

    const toggleSticker = (stickerId: string) => {
        const sticker = STICKERS.find((s) => s.id === stickerId);
        if (sticker && !sticker.free && !isPro) {
            goToUpgrade();
            return;
        }

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

    // ---- Submit ----
    const handleSubmit = async () => {
        if (!user) {
            toast.error(t.auth.loginToSave);
            return;
        }
        if (freeLimitReached) {
            toast.error(t.create.freeLimitReached);
            router.push('/upgrade');
            return;
        }
        if (!formData.title.trim()) {
            toast.error(t.create.titleRequired);
            return;
        }
        if (!formData.recipientName.trim()) {
            toast.error(t.create.recipientRequired);
            return;
        }

        if (formData.pageType === 'pro' && !isPro) {
            toast.error(t.create.needProPlan);
            setShowUpgradeModal(true);
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();

            // Campos básicos
            data.append('title', formData.title);
            data.append('recipientName', formData.recipientName);
            data.append('message', formData.message);
            data.append('yesButtonText', formData.yesButtonText);
            data.append('noButtonText', formData.noButtonText);
            data.append('noButtonEscapes', formData.noButtonEscapes.toString());
            data.append('pageType', formData.pageType);
            data.append('theme', formData.theme);
            data.append('backgroundColor', formData.backgroundColor);
            data.append('textColor', formData.textColor);
            data.append('accentColor', formData.accentColor);

            // Nuevos campos
            data.append('titleFont', formData.titleFont);
            data.append('bodyFont', formData.bodyFont);
            data.append('animation', formData.animation);
            data.append('backgroundMusic', formData.backgroundMusic);
            if (isPro && formData.videoUrl.trim()) {
                data.append('videoUrl', formData.videoUrl.trim());
            }
            data.append('selectedStickers', JSON.stringify(formData.selectedStickers));
            data.append('showWatermark', formData.showWatermark.toString());

            // Imágenes
            if (formData.backgroundImage) {
                data.append('backgroundImage', formData.backgroundImage);
            }
            formData.decorativeImages.forEach((img, i) => {
                data.append(`decorativeImage_${i}`, img);
            });
            if (formData.referenceImage) {
                data.append('referenceImage', formData.referenceImage);
            }
            if (isPro && formData.customSlug && formData.customSlug.trim()) {
                data.append('customSlug', formData.customSlug.trim());
            }
            const response = await api.pages.create(data);
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

    // ---- Loading guard ----
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--lila)', borderTopColor: 'var(--ink-red)', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        );
    }

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
        if (currentStep === 'content') return formData.title.trim() && formData.recipientName.trim();
        return true;
    };

    const goNext = () => {
        if (!canGoNext()) {
            toast.error(t.create.requiredFields);
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
        const stk = formData.selectedStickers.slice(0, 3).map(
            (id) => STICKERS.find((s) => s.id === id)?.emoji ?? ''
        );
        return (
            <div
                className="grain"
                style={{
                    width: '100%', height: '100%',
                    background: 'var(--paper)',
                    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.1  0 0 0 0 0 0 0 0 0.35 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")",
                    position: 'relative', overflow: 'hidden',
                    fontFamily: 'var(--mono)', color: 'var(--ink-black)',
                }}
            >
                {/* Background image overlay — mirrors public page rendering */}
                {bgImagePreview && (
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08, pointerEvents: 'none', mixBlendMode: 'multiply', zIndex: 1 }} />
                )}
                {/* Riso circles — top right, identical proportions to prototipo */}
                <svg style={{ position: 'absolute', top: -60, right: -80, width: 220, height: 220, mixBlendMode: 'multiply', opacity: 0.78, pointerEvents: 'none' }} viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="var(--ink-red)" />
                </svg>
                <svg style={{ position: 'absolute', top: -40, right: -100, width: 220, height: 220, mixBlendMode: 'multiply', opacity: 0.7, pointerEvents: 'none' }} viewBox="0 0 200 200">
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
                            style={{ fontSize: 52, margin: 0, maxWidth: 260, lineHeight: 0.86 }}
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
                    <div style={{ marginTop: 18, fontFamily: 'var(--serif)', fontSize: 12, fontStyle: 'italic', color: 'var(--ink-black)', maxWidth: 240, lineHeight: 1.55 }}>
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
                        <span style={{ width: 14, height: 1, background: 'var(--ink-red)' }} />
                        <span style={{ fontFamily: 'var(--hand)', fontSize: 18, color: 'var(--ink-red)' }}>{t.create.previewFrom}</span>
                        {stk[2] && <span style={{ fontSize: 14, color: 'var(--ink-red)' }}>{stk[2]}</span>}
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
                    {!freeLimitReached && <span className="mono-eyebrow" style={{ fontSize: 9, color: 'var(--ink-soft)' }}>{t.create.unsaved}</span>}
                    <button
                        style={{ padding: '8px 14px', border: '1.5px solid var(--ink-black)', background: 'var(--paper)', fontSize: 11, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', color: 'var(--ink-black)' }}
                        onClick={() => setShowMobilePreview(true)}
                    >{t.create.previewBtn}</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || freeLimitReached}
                        className="btn-accent"
                        style={{ padding: '8px 16px', fontSize: 11, opacity: freeLimitReached ? 0.5 : 1, cursor: freeLimitReached ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? t.create.publishing : t.create.publishBtn}
                    </button>
                </div>
            </header>

            {/* ── 3-COLUMN GRID ── */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '56px 1fr 380px' }}>

                {/* ─ SIDEBAR ─ */}
                <aside style={{ borderRight: '1.5px solid var(--ink-black)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 16, background: 'var(--paper-soft)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 0, background: 'var(--ink-red)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--ink-black)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>L</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                        {([['Aa', 'content', t.create.tabContent], ['◐', 'design', t.create.tabDesign], ['✦', 'media', t.create.tabMedia], ['♪', 'effects', t.create.tabEffects], ['⚙', 'preview', t.create.tabLink]] as [string, Step, string][]).map(([icon, step, label]) => (
                            <button
                                key={step}
                                onClick={() => setCurrentStep(step)}
                                title={label}
                                style={{
                                    width: 36, height: 36,
                                    border: currentStep === step ? '2px solid var(--ink-red)' : '1.5px solid var(--ink-black)',
                                    background: currentStep === step ? 'var(--paper)' : 'var(--paper-soft)',
                                    borderRadius: 0, cursor: 'pointer', fontSize: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.1s',
                                }}
                            >{icon}</button>
                        ))}
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

                    {/* iPhone frame */}
                    <div style={{ position: 'relative', width: 320, height: 640, background: 'var(--ink-black)', borderRadius: 44, padding: 10, flexShrink: 0, zIndex: 1 }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden' }}>
                            {previewContent()}
                        </div>
                        {/* Notch */}
                        <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: 'var(--ink-black)', borderRadius: 999, zIndex: 10, pointerEvents: 'none' }} />
                    </div>

                    {/* Preview badge */}
                    <div style={{ position: 'absolute', top: 32, left: 32, padding: '6px 12px', background: 'var(--paper-soft)', border: '1.5px solid var(--ink-black)', fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-blue)', zIndex: 2 }}>
                        {t.create.previewBadge}
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

                        {/* Expiration notice */}
                        {!isPro && showExpirationNotice && (
                            <div style={{ padding: '10px 14px', background: 'var(--paper-2)', border: '1.5px solid var(--ink-black)', fontSize: 11, fontFamily: 'var(--mono)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                <span style={{ flex: 1, lineHeight: 1.4 }}>⏱ expira en <strong>{t.create.expirationDays}</strong>. <button onClick={goToUpgrade} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'var(--ink-red)', padding: 0, fontFamily: 'var(--mono)', fontSize: 11 }}>{t.create.expirationUpgradeLink}</button></span>
                                <button onClick={dismissExpirationNotice} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--ink-soft)', padding: 0, lineHeight: 1 }}>×</button>
                            </div>
                        )}

                        {/* ── Tab: contenido ── */}
                        {currentStep === 'content' && (<>
                            <DField label={t.create.fieldTitle}>
                                <input value={formData.title} onChange={e => updateForm({ title: e.target.value })} placeholder={t.create.titlePlaceholder} maxLength={200} style={dI} />
                            </DField>
                            <DField label={t.create.fieldRecipient}>
                                <input value={formData.recipientName} onChange={e => updateForm({ recipientName: e.target.value })} placeholder={t.create.recipientPlaceholder} maxLength={100} style={dI} />
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
                                                <span style={{ fontSize: 22, fontFamily: `'${font.name}', ${font.category}`, display: 'block' }}>Aa Bb Cc</span>
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
                                                onClick={() => { if (!anim.free && !isPro) { goToUpgrade(); return; } updateForm({ animation: anim.id }); }}
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
                                            onClick={() => { if (!music.free && !isPro) { goToUpgrade(); return; } updateForm({ backgroundMusic: music.id }); }}
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
                                {isPro ? (
                                    <input type="url" placeholder="https://youtube.com/..." value={formData.videoUrl} onChange={e => updateForm({ videoUrl: e.target.value })} style={dI} />
                                ) : (
                                    <button onClick={goToUpgrade} style={{ width: '100%', padding: '10px 12px', border: '1.5px dashed var(--ink-black)', background: 'var(--paper)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--ink-soft)', textAlign: 'center', letterSpacing: '0.04em' }}>
                                        {t.create.videoHint}
                                    </button>
                                )}
                            </DField>
                        </>)}

                        {/* ── Tab: enlace ── */}
                        {currentStep === 'preview' && (<>
                            <DField label={t.create.fieldUrlCustom} hint={!isPro ? <span style={{ padding: '2px 6px', fontSize: 9, background: 'var(--ink-black)', color: 'var(--ink-red)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>pro</span> : undefined}>
                                <div style={{ display: 'flex', alignItems: 'stretch', border: '1.5px solid var(--ink-black)', background: 'var(--paper)', overflow: 'hidden' }}>
                                    <span style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', borderRight: '1.5px solid var(--ink-black)', background: 'var(--paper-3)', flexShrink: 0 }}>lovepages.ink/p/</span>
                                    {isPro ? (
                                        <input value={formData.customSlug} onChange={e => updateForm({ customSlug: e.target.value })} style={{ ...dI, border: 'none', flex: 1, color: 'var(--ink-red)' }} placeholder="tu-slug-aqui" />
                                    ) : (
                                        <button onClick={goToUpgrade} style={{ flex: 1, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-soft)', textAlign: 'left' }}>
                                            {formData.recipientName ? `para-${formData.recipientName.toLowerCase()}` : '—'}
                                        </button>
                                    )}
                                </div>
                            </DField>

                            <DField label={t.create.fieldPrivacy}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {[['🔓', t.create.privacyPublic, t.create.privacyPublicDesc], ['🔒', t.create.privacyCode, t.create.privacyCodeDesc]].map(([icon, title, hint], k) => (
                                        <label key={title} style={{ padding: 12, border: k === 0 ? '2px solid var(--ink-red)' : '1.5px solid var(--ink-black)', background: 'var(--paper)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: 18 }}>{icon}</span>
                                            <div>
                                                <div style={{ fontSize: 12, fontFamily: 'var(--sans)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{title}</div>
                                                <div style={{ fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>{hint}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </DField>

                            <div style={{ padding: 14, background: 'var(--paper)', border: '1.5px solid var(--ink-black)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    [t.create.summaryTitleKey, formData.title || '—'],
                                    [t.create.summaryForKey, formData.recipientName || '—'],
                                    [t.create.summaryThemeKey, THEMES.find(th => th.id === formData.theme) ? (t.themes[formData.theme as keyof typeof t.themes] || THEMES.find(th => th.id === formData.theme)?.name || '—') : '—'],
                                    [t.create.summaryAnimKey, t.animations[formData.animation as keyof typeof t.animations] || ANIMATIONS.find(a => a.id === formData.animation)?.name || '—'],
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--mono)' }}>
                                        <span style={{ color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</span>
                                        <span style={{ fontWeight: 700 }}>{v}</span>
                                    </div>
                                ))}
                            </div>

                            {!isPro && (
                                <div style={{ padding: 12, background: 'var(--lila-soft)', border: '1.5px solid var(--ink)', borderRadius: 0, fontSize: 12, color: 'var(--ink)' }}>
                                    <span>{t.create.proUrlYour} <strong className="mono-eyebrow" style={{ fontSize: 10 }}>lovepages.ink/p/xK9mP2</strong></span>
                                    <br />
                                    <span style={{ color: 'var(--ink-soft)' }}>{t.create.proUrlWithPro} </span>
                                    <strong style={{ color: 'var(--ink-blue)', fontFamily: 'var(--mono)', fontSize: 11 }}>para-{(formData.recipientName || 'ella').toLowerCase()}</strong>
                                    <button onClick={goToUpgrade} style={{ display: 'block', marginTop: 8, width: '100%', padding: '8px 14px', background: 'var(--ink-red)', color: 'var(--paper)', border: '1.5px solid var(--ink-black)', borderRadius: 0, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: '0.06em', boxShadow: '2px 2px 0 var(--ink-black)' }}>
                                        {t.create.proUrlUpgrade}
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading || freeLimitReached}
                                style={{ width: '100%', padding: '12px 20px', background: freeLimitReached ? '#ccc' : 'var(--ink-red)', color: 'var(--paper)', border: '1.5px solid var(--ink-black)', borderRadius: 0, cursor: freeLimitReached ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: '0.06em', boxShadow: '3px 3px 0 var(--ink-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: freeLimitReached ? 0.5 : 1 }}
                            >
                                <Sparkles style={{ width: 16, height: 16 }} />
                                {loading ? t.create.publishing : t.create.publishPageBtn}
                            </button>
                        </>)}
                    </div>
                </aside>
            </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            MOBILE — step wizard (< lg)
        ═══════════════════════════════════════════════════════ */}
        <div className="lg:hidden min-h-screen pb-20" style={{ background: 'var(--paper)' }}>
            <Header />

            <main className="container py-4 px-4">
                <div className="max-w-lg mx-auto">
                    {/* Mobile header */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Link href="/dashboard">
                                <button className="p-2 rounded-full hover:bg-white/60 active:scale-95 transition-all">
                                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                                </button>
                            </Link>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {stepIndex + 1}/{steps.length}: {steps[stepIndex].label}
                                    {isPro && (
                                        <span className="ml-2 inline-flex items-center gap-0.5 text-amber-600">
                                            <Crown className="w-3 h-3" />
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 overflow-hidden" style={{ background: 'var(--paper-2)', border: '1px solid var(--ink-black)' }}>
                            <motion.div
                                className="h-full"
                                style={{ background: 'var(--ink-red)' }}
                                initial={false}
                                animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        </div>
                    </div>

                    {freeLimitReached && (
                        <div className="mb-4 px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--butter)', border: '1.5px solid var(--ink)' }}>
                            {t.create.freeLimitReached}
                        </div>
                    )}

                    {!isPro && showExpirationNotice && (
                        <div className="mb-4 flex items-start gap-3 rounded-xl px-3 py-2.5" style={{ background: 'var(--butter)', border: '1.5px solid var(--ink)' }}>
                            <div className="flex-1 text-xs" style={{ color: 'var(--ink)' }}>
                                <span className="font-semibold">{t.create.expirationMobile}</span>{' '}
                                <button type="button" onClick={goToUpgrade} className="font-semibold underline">{t.create.expirationMobileUpgrade}</button>
                            </div>
                            <button type="button" onClick={dismissExpirationNotice} style={{ color: 'var(--ink-soft)' }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
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
                                            label={t.create.titleLabel}
                                            placeholder={t.create.titlePlaceholder}
                                            value={formData.title}
                                            onChange={(e) => updateForm({ title: e.target.value })}
                                            maxLength={200}
                                        />

                                        <Input
                                            label={t.create.recipientLabel}
                                            placeholder={t.create.recipientPlaceholder}
                                            value={formData.recipientName}
                                            onChange={(e) => updateForm({ recipientName: e.target.value })}
                                            maxLength={100}
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
                                                            style={{ fontFamily: `'${font.name}', ${font.category}` }}
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
                                                                if (!anim.free && !isPro) {
                                                                    goToUpgrade();
                                                                    return;
                                                                }
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
                                                                if (!music.free && !isPro) {
                                                                    goToUpgrade();
                                                                    return;
                                                                }
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
                                            {isPro ? (
                                                <div>
                                                    <input
                                                        type="url"
                                                        placeholder="https://youtube.com/watch?v=... o https://tiktok.com/..."
                                                        value={formData.videoUrl}
                                                        onChange={(e) => updateForm({ videoUrl: e.target.value })}
                                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[44px]"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">YouTube o TikTok. Se mostrará como video embed en tu página.</p>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={goToUpgrade}
                                                    className="w-full p-3 border-2 border-dashed border-amber-300 rounded-lg text-sm text-amber-600 hover:bg-amber-50 active:scale-[0.99] transition-all text-center min-h-[48px]"
                                                >
                                                    Agrega un video de YouTube o TikTok — solo PRO
                                                </button>
                                            )}
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
                                        {/* Mobile preview snapshot inline */}
                                        <div className="lg:hidden">
                                            <div className="max-w-[260px] mx-auto" style={{ height: 520 }}>
                                                {previewContent()}
                                            </div>
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

                                        {!isPro && (
                                            <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Crown className="w-5 h-5 text-amber-600" />
                                                    <p className="text-sm font-bold text-amber-900">
                                                        ¿Quieres que el enlace diga su nombre? 💕
                                                    </p>
                                                </div>
                                                <p className="text-xs text-amber-700 mb-3">
                                                    Tu página tendrá: <span className="font-mono bg-white px-2 py-0.5 rounded">lovepages.ink/p/xK9mP2nQ7z</span>
                                                    <br />
                                                    Con PRO podría ser: <span className="font-mono bg-white px-2 py-0.5 rounded text-pink-600 font-bold">lovepages.ink/p/para-{formData.recipientName.toLowerCase()}</span>
                                                </p>
                                                <Button
                                                    onClick={goToUpgrade}
                                                    variant="gradient"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    <Crown className="w-4 h-4 mr-1" />
                                                    Hacerlo más especial – $1.75
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

            {/* Mobile: Floating Preview Button */}
            {currentStep !== 'preview' && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setShowMobilePreview(true)}
                    style={{ background: 'var(--accent-hex)' }}
                    className="fixed right-4 bottom-20 z-30 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Ver vista previa"
                >
                    <Eye className="w-6 h-6" />
                </motion.button>
            )}

            {/* Mobile: Bottom navigation bar */}
            <div className="fixed bottom-0 left-0 right-0 z-30 px-3 py-2.5 pb-[max(10px,env(safe-area-inset-bottom))]" style={{ background: 'white', borderTop: '2px solid var(--ink)' }}>
                <div className="flex items-center gap-2 max-w-md mx-auto">
                    {stepIndex > 0 ? (
                        <Button
                            onClick={goBack}
                            variant="outline"
                            size="lg"
                            className="flex-1 min-h-[48px]"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            {t.common.back}
                        </Button>
                    ) : (
                        <Link href="/dashboard" className="flex-1">
                            <Button variant="outline" size="lg" className="w-full min-h-[48px]">
                                <X className="w-4 h-4 mr-1.5" />
                                Cancelar
                            </Button>
                        </Link>
                    )}

                    {currentStep === 'preview' ? (
                        <Button
                            onClick={handleSubmit}
                            loading={loading}
                            variant="gradient"
                            size="lg"
                            className="flex-[1.5] min-h-[48px]"
                        >
                            <Sparkles className="w-4 h-4 mr-1.5" />
                            Publicar
                        </Button>
                    ) : (
                        <Button
                            onClick={goNext}
                            variant="gradient"
                            size="lg"
                            disabled={!canGoNext()}
                            className="flex-[1.5] min-h-[48px]"
                        >
                            {t.common.next}
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                    )}
                </div>
            </div>

        </div>

        {/* ═══════════════════════════════════════════════════════
            SHARED — BottomSheets + Modal (mobile + desktop)
        ═══════════════════════════════════════════════════════ */}
        <BottomSheet
            isOpen={showMobilePreview}
            onClose={() => setShowMobilePreview(false)}
            title="Vista previa"
            height="90vh"
        >
            <div className="p-4">
                <div className="max-w-[300px] mx-auto" style={{ height: 600 }}>
                    {previewContent()}
                </div>
                <p className="text-center text-xs mt-4" style={{ color: 'var(--ink-soft)' }}>
                    Así se verá tu página
                </p>
            </div>
        </BottomSheet>

        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </>
    );
}
