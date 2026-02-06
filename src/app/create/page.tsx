'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import {
    Heart,
    Sparkles,
    Eye,
    ArrowLeft,
    Upload,
    Crown,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HexColorPicker } from 'react-colorful';
import { useDropzone } from 'react-dropzone';

interface PageFormData {
    title: string;
    recipientName: string;
    message: string;
    yesButtonText: string;
    noButtonText: string;
    noButtonEscapes: boolean;
    pageType: 'free' | 'pro';
    theme: string;
    backgroundColor: string;
    textColor: string;
    referenceImage: File | null;
}

const THEMES = [
    {
        id: 'romantic',
        name: 'Romántico',
        colors: { bg: '#ff69b4', text: '#ffffff' },
        preview: 'bg-gradient-to-br from-pink-400 to-rose-500',
    },
    {
        id: 'playful',
        name: 'Divertido',
        colors: { bg: '#ffd700', text: '#333333' },
        preview: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    },
    {
        id: 'elegant',
        name: 'Elegante',
        colors: { bg: '#2c3e50', text: '#ecf0f1' },
        preview: 'bg-gradient-to-br from-slate-600 to-purple-700',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        colors: { bg: '#ffffff', text: '#333333' },
        preview: 'bg-gradient-to-br from-gray-100 to-gray-300',
    },
];

export default function CreatePagePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const [currentStep, setCurrentStep] = useState<'type' | 'content' | 'design' | 'preview'>('type');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showColorPicker, setShowColorPicker] = useState<'bg' | 'text' | null>(null);

    const [formData, setFormData] = useState<PageFormData>({
        title: '',
        recipientName: '',
        message: '',
        yesButtonText: 'Sí',
        noButtonText: 'No',
        noButtonEscapes: false,
        pageType: 'free',
        theme: 'romantic',
        backgroundColor: '#ff69b4',
        textColor: '#ffffff',
        referenceImage: null,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && !user.canCreatePage && !user.isPro) {
            toast.error('Has alcanzado el límite de páginas gratuitas');
            router.push('/upgrade');
        }
    }, [user, router]);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('La imagen no debe superar 5MB');
                return;
            }
            setFormData({ ...formData, referenceImage: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        },
        maxFiles: 1,
    });

    const selectTheme = (theme: typeof THEMES[0]) => {
        setFormData({
            ...formData,
            theme: theme.id,
            backgroundColor: theme.colors.bg,
            textColor: theme.colors.text,
        });
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast.error('El título es requerido');
            return;
        }
        if (!formData.recipientName.trim()) {
            toast.error('El nombre del destinatario es requerido');
            return;
        }

        if (formData.pageType === 'pro' && !user?.isPro) {
            toast.error('Necesitas el plan PRO para crear páginas personalizadas');
            router.push('/upgrade');
            return;
        }

        if (formData.pageType === 'pro' && !formData.referenceImage) {
            toast.error('Debes subir una imagen de referencia para páginas PRO');
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
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

            if (formData.referenceImage) {
                data.append('referenceImage', formData.referenceImage);
            }

            const response = await api.pages.create(data);
            toast.success('¡Página creada exitosamente!');
            router.push(`/p/${response.data.data.shortId}`);
        } catch (error: any) {
            console.error('Error creating page:', error);
            toast.error(error.response?.data?.message || 'Error al crear la página');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (!user) return null;

    const steps = ['Tipo', 'Contenido', 'Diseño', 'Vista Previa'];
    const stepIndex = ['type', 'content', 'design', 'preview'].indexOf(currentStep);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Página</h1>
                            <p className="text-gray-600 mt-1">
                                Personaliza tu página en {user.isPro ? 'diseño PRO con IA' : 'diseño gratuito'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2">
                            {steps.map((step, index) => (
                                <div key={step} className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${index <= stepIndex ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                    {index < 3 && (
                                        <div
                                            className={`w-12 h-1 mx-2 transition-all ${index < stepIndex ? 'bg-pink-600' : 'bg-gray-200'
                                                }`}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            {currentStep === 'type' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tipo de Página</CardTitle>
                                        <CardDescription>Elige entre diseño básico o personalizado con IA</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div
                                            onClick={() => setFormData({ ...formData, pageType: 'free' })}
                                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${formData.pageType === 'free'
                                                ? 'border-pink-600 bg-pink-50'
                                                : 'border-gray-200 hover:border-pink-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                                        <Heart className="w-5 h-5 text-pink-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">Diseño Gratuito</h3>
                                                        <p className="text-sm text-gray-600">Temas predefinidos</p>
                                                    </div>
                                                </div>
                                                {formData.pageType === 'free' && (
                                                    <CheckCircle2 className="w-6 h-6 text-pink-600" />
                                                )}
                                            </div>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>✓ 4 temas prediseñados</li>
                                                <li>✓ Personalización de colores</li>
                                                <li>✓ Botón que escapa (opcional)</li>
                                            </ul>
                                        </div>

                                        <div
                                            onClick={() => {
                                                if (user.isPro) {
                                                    setFormData({ ...formData, pageType: 'pro' });
                                                } else {
                                                    router.push('/upgrade');
                                                }
                                            }}
                                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all relative ${formData.pageType === 'pro'
                                                ? 'border-amber-500 bg-amber-50'
                                                : 'border-gray-200 hover:border-amber-300'
                                                }`}
                                        >
                                            {!user.isPro && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                        <Crown className="w-3 h-3" />
                                                        PRO
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                        <Sparkles className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">Diseño con IA</h3>
                                                        <p className="text-sm text-gray-600">Personalización total</p>
                                                    </div>
                                                </div>
                                                {formData.pageType === 'pro' && (
                                                    <CheckCircle2 className="w-6 h-6 text-amber-600" />
                                                )}
                                            </div>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>✓ Diseño generado por IA</li>
                                                <li>✓ Sube imagen de referencia</li>
                                                <li>✓ Estilo 100% personalizado</li>
                                            </ul>
                                        </div>

                                        <Button onClick={() => setCurrentStep('content')} variant="gradient" className="w-full">
                                            Continuar
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {currentStep === 'content' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contenido de la Página</CardTitle>
                                        <CardDescription>Personaliza el mensaje para esa persona especial</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Input
                                            label="Título *"
                                            placeholder="¿Quieres ser mi San Valentín?"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            maxLength={200}
                                        />

                                        <Input
                                            label="Nombre del destinatario *"
                                            placeholder="María"
                                            value={formData.recipientName}
                                            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                            maxLength={100}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Mensaje (opcional)
                                            </label>
                                            <textarea
                                                placeholder="Me harías muy feliz..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                maxLength={1000}
                                                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all min-h-[100px]"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formData.message.length}/1000 caracteres
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label='Texto botón "Sí"'
                                                placeholder="Sí"
                                                value={formData.yesButtonText}
                                                onChange={(e) => setFormData({ ...formData, yesButtonText: e.target.value })}
                                                maxLength={50}
                                            />

                                            <Input
                                                label='Texto botón "No"'
                                                placeholder="No"
                                                value={formData.noButtonText}
                                                onChange={(e) => setFormData({ ...formData, noButtonText: e.target.value })}
                                                maxLength={50}
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <input
                                                type="checkbox"
                                                id="noButtonEscapes"
                                                checked={formData.noButtonEscapes}
                                                onChange={(e) => setFormData({ ...formData, noButtonEscapes: e.target.checked })}
                                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                            />
                                            <label htmlFor="noButtonEscapes" className="text-sm text-gray-700">
                                                El botón "No" escapa del cursor (más divertido 😄)
                                            </label>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button onClick={() => setCurrentStep('type')} variant="outline" className="flex-1">
                                                Atrás
                                            </Button>
                                            <Button onClick={() => setCurrentStep('design')} variant="gradient" className="flex-1">
                                                Continuar
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {currentStep === 'design' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Diseño</CardTitle>
                                        <CardDescription>
                                            {formData.pageType === 'pro'
                                                ? 'Sube una imagen de referencia para generar el diseño con IA'
                                                : 'Elige un tema y personaliza los colores'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {formData.pageType === 'pro' ? (
                                            <>
                                                <div
                                                    {...getRootProps()}
                                                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'
                                                        }`}
                                                >
                                                    <input {...getInputProps()} />
                                                    {imagePreview ? (
                                                        <div className="space-y-4">
                                                            <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                                                            <p className="text-sm text-gray-600">
                                                                Click o arrastra otra imagen para cambiar
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                                            <div>
                                                                <p className="text-lg font-medium text-gray-700">
                                                                    Sube una imagen de referencia
                                                                </p>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    La IA generará un diseño similar al estilo de la imagen
                                                                </p>
                                                            </div>
                                                            <p className="text-xs text-gray-400">PNG, JPG, GIF o WEBP (máx. 5MB)</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {THEMES.map((theme) => (
                                                            <div
                                                                key={theme.id}
                                                                onClick={() => selectTheme(theme)}
                                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.theme === theme.id
                                                                    ? 'border-pink-600 bg-pink-50'
                                                                    : 'border-gray-200 hover:border-pink-300'
                                                                    }`}
                                                            >
                                                                <div className={`h-20 rounded-lg mb-2 ${theme.preview}`}></div>
                                                                <p className="text-sm font-medium text-center">{theme.name}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Colores personalizados
                                                    </label>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs text-gray-600 mb-2">Color de fondo</label>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')}
                                                                    className="w-full h-10 rounded-lg border-2 border-gray-300 flex items-center gap-2 px-3 hover:border-pink-400 transition-all"
                                                                    style={{ backgroundColor: formData.backgroundColor }}
                                                                >
                                                                    <span className="text-xs font-mono text-white mix-blend-difference">
                                                                        {formData.backgroundColor}
                                                                    </span>
                                                                </button>
                                                                {showColorPicker === 'bg' && (
                                                                    <div className="absolute z-10 mt-2">
                                                                        <HexColorPicker
                                                                            color={formData.backgroundColor}
                                                                            onChange={(color) => setFormData({ ...formData, backgroundColor: color })}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs text-gray-600 mb-2">Color de texto</label>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
                                                                    className="w-full h-10 rounded-lg border-2 border-gray-300 flex items-center gap-2 px-3 hover:border-pink-400 transition-all"
                                                                    style={{ backgroundColor: formData.textColor }}
                                                                >
                                                                    <span className="text-xs font-mono text-white mix-blend-difference">
                                                                        {formData.textColor}
                                                                    </span>
                                                                </button>
                                                                {showColorPicker === 'text' && (
                                                                    <div className="absolute z-10 mt-2">
                                                                        <HexColorPicker
                                                                            color={formData.textColor}
                                                                            onChange={(color) => setFormData({ ...formData, textColor: color })}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="flex gap-3">
                                            <Button onClick={() => setCurrentStep('content')} variant="outline" className="flex-1">
                                                Atrás
                                            </Button>
                                            <Button onClick={() => setCurrentStep('preview')} variant="gradient" className="flex-1">
                                                Continuar
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {currentStep === 'preview' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>¡Todo listo!</CardTitle>
                                        <CardDescription>Revisa tu página y créala cuando estés listo</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
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
                                                    <p className="text-sm">{formData.message}</p>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">Tipo</p>
                                                    <p className="font-medium">
                                                        {formData.pageType === 'pro' ? '✨ PRO con IA' : '💖 Gratuito'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Tema</p>
                                                    <p className="font-medium capitalize">{formData.theme}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button onClick={() => setCurrentStep('design')} variant="outline" className="flex-1">
                                                Atrás
                                            </Button>
                                            <Button onClick={handleSubmit} loading={loading} variant="gradient" className="flex-1">
                                                Crear Página
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="lg:sticky lg:top-24 h-fit">
                            <Card className="bg-white/80 backdrop-blur">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-gray-600" />
                                        <CardTitle>Vista Previa</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="aspect-[9/16] rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all"
                                        style={{
                                            backgroundColor: formData.backgroundColor,
                                            color: formData.textColor,
                                        }}
                                    >
                                        <Heart className="w-16 h-16 mb-6 animate-heart-beat" />
                                        <h2 className="text-2xl font-bold mb-4">{formData.title || 'Tu título aquí'}</h2>
                                        <p className="text-lg mb-2">{formData.recipientName || 'Nombre'}</p>
                                        {formData.message && <p className="text-sm opacity-90 mb-6">{formData.message}</p>}
                                        <div className="flex gap-4 mt-auto">
                                            <button
                                                className="px-6 py-3 bg-white/20 backdrop-blur rounded-lg font-semibold hover:bg-white/30 transition-all"
                                                style={{ color: formData.textColor }}
                                            >
                                                {formData.yesButtonText}
                                            </button>
                                            <button
                                                className="px-6 py-3 bg-white/20 backdrop-blur rounded-lg font-semibold hover:bg-white/30 transition-all"
                                                style={{ color: formData.textColor }}
                                            >
                                                {formData.noButtonText}
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}