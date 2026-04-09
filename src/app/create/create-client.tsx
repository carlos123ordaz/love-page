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
            className={`inline-flex items-center gap-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold rounded-full ${small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
                }`}
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
    return (
        <div
            onClick={onUpgrade}
            className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-lg flex items-center justify-center cursor-pointer z-10 group"
        >
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg group-hover:scale-105 transition-transform">
                <Lock className="w-3 h-3" />
                Desbloquear PRO
            </div>
        </div>
    );
}

// ============================================================
// COMPONENTE: UpgradeModal (modal en vez de redirección)
// ============================================================
function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-6 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Crown className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">Desbloquea Love Pages PRO</h3>
                    <p className="text-white/90 text-sm mt-1">Lleva tus páginas al siguiente nivel</p>
                </div>

                {/* Features */}
                <div className="p-6 space-y-3">
                    {[
                        'Páginas sin vencimiento (gratis expiran en 7 días)',
                        'Temas exclusivos (Neón, Aurora, Vintage...)',
                        'Tipografías premium',
                        'Hasta 5 imágenes decorativas',
                        'Hasta 10 stickers',
                        'Animaciones premium (confetti, fuegos artificiales...)',
                        'Música de fondo',
                        'Sin marca de agua',
                        'Diseño generado por IA',
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 space-y-3">
                    <Link href="/upgrade" className="block">
                        <Button variant="gradient" className="w-full gap-2" size="lg">
                            <Crown className="w-5 h-5" />
                            Ver planes PRO
                        </Button>
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                    >
                        Seguir con el plan gratuito
                    </button>
                </div>
            </div>
        </div>
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
    const { t } = useTranslation();

    const isPro = user?.isPro || false;

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

    // Auth no requerido - usuarios pueden diseñar sin login
    // Se pedirá login al momento de guardar si no están autenticados

    const updateForm = (updates: Partial<PageFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const goToUpgrade = () => {
        setShowUpgradeModal(true);
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
                toast.error(`Máximo ${maxStickers} stickers${!isPro ? ' (PRO: hasta 10)' : ''}`);
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
                    toast.error('La imagen no debe superar 5MB');
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
                    `Máximo ${maxImages} imagen${maxImages > 1 ? 'es' : ''} decorativa${maxImages > 1 ? 's' : ''}${!isPro ? ' (PRO: hasta 5)' : ''}`
                );
                return;
            }

            const file = acceptedFiles[0];
            if (file) {
                if (file.size > 15 * 1024 * 1024) {
                    toast.error('La imagen no debe superar 5MB');
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
                toast.error('La imagen no debe superar 5MB');
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
            toast.error('Inicia sesión con Google para guardar tu página');
            return;
        }
        if (!formData.title.trim()) {
            toast.error('El título es requerido');
            return;
        }
        if (!formData.recipientName.trim()) {
            toast.error('El nombre del destinatario es requerido');
            return;
        }

        if (formData.pageType === 'pro' && !isPro) {
            toast.error('Necesitas el plan PRO');
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
            toast.success('¡Página creada exitosamente!');
            const identifier = response.data.data.customSlug || response.data.data.shortId;
            router.push(`/p/${identifier}`);
        } catch (error: any) {
            console.error('Error creating page:', error);
            toast.error(error.response?.data?.message || 'Error al crear la página');
        } finally {
            setLoading(false);
        }
    };

    // ---- Loading guard ----
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
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
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Page header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{t.create.title}</h1>
                            <p className="text-gray-600 mt-1">
                                {t.create.subtitle}
                                {isPro && (
                                    <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-medium">
                                        <Crown className="w-4 h-4" /> {t.create.proActive}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-1 sm:gap-2">
                            {steps.map((step, index) => (
                                <div key={step.key} className="flex items-center">
                                    <button
                                        onClick={() => {
                                            if (index <= stepIndex) setCurrentStep(step.key);
                                        }}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${index <= stepIndex
                                            ? 'bg-pink-600 text-white cursor-pointer'
                                            : 'bg-gray-200 text-gray-500 cursor-default'
                                            }`}
                                    >
                                        {step.icon}
                                        <span className="hidden sm:inline">{step.label}</span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-6 sm:w-10 h-0.5 mx-1 transition-all ${index < stepIndex ? 'bg-pink-600' : 'bg-gray-200'
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expiration notice for free users */}
                    {!isPro && (
                        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                            <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 text-sm text-amber-800">
                                <span className="font-semibold">Tu página expirará en 7 días.</span>{' '}
                                Con el plan gratuito, las páginas se desactivan automáticamente después de 7 días.{' '}
                                <button
                                    onClick={goToUpgrade}
                                    className="font-semibold underline hover:text-amber-900 transition-colors"
                                >
                                    Actualiza a PRO
                                </button>{' '}
                                para que tu página nunca expire.
                            </div>
                        </div>
                    )}

                    {/* Main grid: Editor + Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT: Editor */}
                        <div>
                            {/* ======== STEP 1: CONTENIDO ======== */}
                            {currentStep === 'content' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Type className="w-5 h-5 text-pink-600" />
                                            {t.create.contentTitle}
                                        </CardTitle>
                                        <CardDescription>
                                            {t.create.contentDesc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
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

                                        <div className="grid grid-cols-2 gap-4">
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

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <input
                                                type="checkbox"
                                                id="noButtonEscapes"
                                                checked={formData.noButtonEscapes}
                                                onChange={(e) => updateForm({ noButtonEscapes: e.target.checked })}
                                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                            />
                                            <label htmlFor="noButtonEscapes" className="text-sm text-gray-700">
                                                {t.create.noEscapes}
                                            </label>
                                        </div>

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

                                        <Button onClick={goNext} variant="gradient" className="w-full" disabled={!canGoNext()}>
                                            {t.common.next} <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ======== STEP 2: DISEÑO (tema, colores, tipografía) ======== */}
                            {currentStep === 'design' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Palette className="w-5 h-5 text-pink-600" />
                                            {t.create.designTitle}
                                        </CardTitle>
                                        <CardDescription>{t.create.designDesc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Temas */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                {t.create.themeLabel}
                                            </label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {THEMES.map((theme) => (
                                                    <div key={theme.id} className="relative">
                                                        {!theme.free && !isPro && (
                                                            <div className="absolute top-1 right-1 z-10">
                                                                <ProBadge small />
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => selectTheme(theme)}
                                                            className={`w-full p-2 border-2 rounded-xl transition-all ${formData.theme === theme.id
                                                                ? 'border-pink-600 ring-2 ring-pink-200'
                                                                : 'border-gray-200 hover:border-pink-300'
                                                                } ${!theme.free && !isPro ? 'opacity-70' : ''}`}
                                                        >
                                                            <div className={`h-12 rounded-lg mb-1.5 ${theme.preview}`} />
                                                            <p className="text-[11px] font-medium text-center leading-tight">
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
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() =>
                                                                        setShowColorPicker(
                                                                            showColorPicker === colorType ? null : colorType
                                                                        )
                                                                    }
                                                                    className="w-full h-9 rounded-lg border-2 border-gray-300 flex items-center gap-1.5 px-2 hover:border-pink-400 transition-all"
                                                                    style={{ backgroundColor: formData[colorKey] }}
                                                                >
                                                                    <span className="text-[10px] font-mono text-white mix-blend-difference">
                                                                        {formData[colorKey]}
                                                                    </span>
                                                                </button>
                                                                {showColorPicker === colorType && (
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
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Tipografía */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                {t.create.titleFontLabel}
                                            </label>
                                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                                {GOOGLE_FONTS.map((font) => (
                                                    <div key={font.name} className="relative">
                                                        {!font.free && !isPro && (
                                                            <div className="absolute top-1 right-1 z-10">
                                                                <ProBadge small />
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => selectFont(font, 'titleFont')}
                                                            className={`w-full p-2.5 border-2 rounded-lg text-left transition-all ${formData.titleFont === font.name
                                                                ? 'border-pink-600 bg-pink-50'
                                                                : 'border-gray-200 hover:border-pink-300'
                                                                } ${!font.free && !isPro ? 'opacity-60' : ''}`}
                                                            style={{ fontFamily: `'${font.name}', ${font.category}` }}
                                                        >
                                                            <span className="text-base">Aa</span>
                                                            <span className="block text-[10px] text-gray-500 font-sans mt-0.5">
                                                                {font.name}
                                                            </span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex gap-3 pt-2">
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

                            {/* ======== STEP 3: IMÁGENES Y STICKERS ======== */}
                            {currentStep === 'media' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-pink-600" />
                                            {t.create.mediaTitle}
                                        </CardTitle>
                                        <CardDescription>
                                            {t.create.mediaDesc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Imagen de fondo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.create.bgImageLabel}
                                            </label>
                                            <div
                                                {...bgDropzone.getRootProps()}
                                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${bgDropzone.isDragActive
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
                                                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
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
                                                    className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-3 h-3" /> {t.create.bgImageRemove}
                                                </button>
                                            )}
                                        </div>

                                        {/* Imágenes decorativas */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
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

                                            {/* Preview de imágenes decorativas */}
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
                                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div
                                                {...decorativeDropzone.getRootProps()}
                                                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-pink-400 transition-all"
                                            >
                                                <input {...decorativeDropzone.getInputProps()} />
                                                <Plus className="w-6 h-6 text-gray-400 mx-auto" />
                                                <p className="text-xs text-gray-500 mt-1">{t.create.decorativeAdd}</p>
                                            </div>
                                        </div>

                                        {/* Stickers */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
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
                                            <div className="grid grid-cols-8 gap-2">
                                                {STICKERS.map((sticker) => (
                                                    <button
                                                        key={sticker.id}
                                                        onClick={() => toggleSticker(sticker.id)}
                                                        className={`relative aspect-square flex items-center justify-center text-2xl rounded-lg border-2 transition-all hover:scale-110 ${formData.selectedStickers.includes(sticker.id)
                                                            ? 'border-pink-500 bg-pink-50 scale-110'
                                                            : 'border-gray-200'
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

                                        <div className="flex gap-3 pt-2">
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
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-pink-600" />
                                            {t.create.effectsTitle}
                                        </CardTitle>
                                        <CardDescription>
                                            {t.create.effectsDesc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Animaciones */}
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
                                                            className={`w-full p-3 border-2 rounded-lg text-left transition-all ${formData.animation === anim.id
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
                                                            className={`w-full p-3 border-2 rounded-lg text-left text-sm transition-all flex items-center justify-between ${formData.backgroundMusic === music.id
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

                                        <div className="flex gap-3 pt-2">
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
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            ¡Todo listo!
                                        </CardTitle>
                                        <CardDescription>Revisa tu página y publícala</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {isPro && formData.customSlug && (
                                            <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Crown className="w-4 h-4 text-pink-600" />
                                                    <p className="text-sm font-bold text-pink-700">
                                                        URL Personalizada
                                                    </p>
                                                </div>
                                                <div className="bg-white rounded-lg p-3 border border-pink-200">
                                                    <p className="font-mono text-sm text-pink-800 break-all">
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

                                        <div className="flex gap-3">
                                            <Button onClick={goBack} variant="outline" className="flex-1">
                                                Atrás
                                            </Button>
                                            <Button
                                                onClick={handleSubmit}
                                                loading={loading}
                                                variant="gradient"
                                                className="flex-1"
                                            >
                                                🚀 Publicar Página
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* RIGHT: Live Preview */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            <Card className="bg-white/80 backdrop-blur overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-gray-600" />
                                        <CardTitle className="text-base">Vista Previa</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="aspect-[9/16] rounded-xl overflow-hidden relative flex flex-col items-center justify-center text-center transition-all"
                                        style={{
                                            backgroundColor: formData.backgroundColor,
                                            color: formData.textColor,
                                        }}
                                    >
                                        {/* Background image */}
                                        {bgImagePreview && (
                                            <div
                                                className="absolute inset-0 bg-cover bg-center opacity-30"
                                                style={{ backgroundImage: `url(${bgImagePreview})` }}
                                            />
                                        )}

                                        {/* Content */}
                                        <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full">
                                            {/* Stickers arriba */}
                                            {formData.selectedStickers.length > 0 && (
                                                <div className="flex gap-2 mb-4 text-3xl">
                                                    {formData.selectedStickers.map((id) => (
                                                        <span key={id} className="animate-bounce">
                                                            {STICKERS.find((s) => s.id === id)?.emoji}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <Heart className="w-14 h-14 mb-4 animate-pulse" />

                                            <h2
                                                className="text-2xl font-bold mb-3 leading-tight"
                                                style={{ fontFamily: `'${formData.titleFont}', cursive` }}
                                            >
                                                {formData.title || 'Tu título aquí'}
                                            </h2>

                                            <p
                                                className="text-lg mb-1"
                                                style={{ fontFamily: `'${formData.bodyFont}', sans-serif` }}
                                            >
                                                {formData.recipientName || 'Nombre'}
                                            </p>

                                            {formData.message && (
                                                <p
                                                    className="text-sm opacity-85 mb-4 max-w-[80%]"
                                                    style={{ fontFamily: `'${formData.bodyFont}', sans-serif` }}
                                                >
                                                    {formData.message}
                                                </p>
                                            )}

                                            {/* Decorative images */}
                                            {decorativeImagePreviews.length > 0 && (
                                                <div className="flex gap-2 my-3">
                                                    {decorativeImagePreviews.map((preview, i) => (
                                                        <img
                                                            key={i}
                                                            src={preview}
                                                            alt=""
                                                            className="w-16 h-16 object-cover rounded-lg border-2 border-white/30"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Buttons */}
                                            <div className="flex gap-3 mt-auto">
                                                <button
                                                    className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
                                                    style={{
                                                        backgroundColor: formData.accentColor,
                                                        color: formData.textColor,
                                                    }}
                                                >
                                                    {formData.yesButtonText || 'Sí'}
                                                </button>
                                                <button
                                                    className="px-5 py-2.5 bg-white/20 backdrop-blur rounded-lg font-semibold text-sm"
                                                    style={{ color: formData.textColor }}
                                                >
                                                    {formData.noButtonText || 'No'}
                                                </button>
                                            </div>

                                            {/* Watermark */}
                                            {!isPro && (
                                                <p className="absolute bottom-2 text-[9px] opacity-40">
                                                    Hecho con Love Pages 💕
                                                </p>
                                            )}

                                            {/* Animation indicator */}
                                            {formData.animation !== 'none' && (
                                                <div className="absolute top-2 right-2 text-xs bg-black/20 backdrop-blur px-2 py-1 rounded-full">
                                                    {ANIMATIONS.find((a) => a.id === formData.animation)?.emoji}{' '}
                                                    {ANIMATIONS.find((a) => a.id === formData.animation)?.name}
                                                </div>
                                            )}

                                            {/* Music indicator */}
                                            {formData.backgroundMusic !== 'none' && (
                                                <div className="absolute top-2 left-2 text-xs bg-black/20 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Volume2 className="w-3 h-3" />
                                                    🎵
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>



            {/* Modal de Upgrade PRO */}
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
}