'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import {
    ArrowLeft,
    Eye,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    ExternalLink,
    Copy,
    Clock,
    Globe,
    Sparkles,
    QrCode,
    Download,
    Crown,
    Lock,
    X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '@/lib/utils';
import Link from 'next/link';
import QRCodeLib from 'qrcode';

export default function PageDetailView() {
    const params = useParams();
    const router = useRouter();
    const shortId = params.shortId as string;
    const { user, loading: authLoading } = useAuthStore();
    const [pageData, setPageData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [generatingQr, setGeneratingQr] = useState(false);
    const brandedCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadPageDetails();
        }
    }, [user, shortId]);

    const loadPageDetails = async () => {
        try {
            setLoading(true);
            const { data: pagesData } = await api.pages.getMyPages();
            const page = pagesData.data.find((p: any) => p.shortId === shortId);
            if (!page) {
                toast.error('Página no encontrada');
                router.push('/dashboard');
                return;
            }

            const { data } = await api.pages.getDetails(page._id);
            setPageData(data.data.page);
            setStats(data.data.stats);
            setResponses(data.data.responses || []);
        } catch (error) {
            console.error('Error loading page details:', error);
            toast.error('Error al cargar detalles');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyUrl = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        const url = pageData?.url || `${window.location.origin}/p/${identifier}`;
        copyToClipboard(url);
        toast.success('¡Enlace copiado!');
    };

    const handleOpenPublic = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        window.open(`/p/${identifier}`, '_blank');
    };

    const getPageUrl = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        return pageData?.url || `${window.location.origin}/p/${identifier}`;
    };

    // =============================================
    // QR CODE GENERATION (100% client-side via qrcode lib)
    // =============================================
    const generateQrCode = useCallback(async () => {
        if (!user?.isPro) {
            setShowQrModal(true);
            return;
        }

        setGeneratingQr(true);
        setShowQrModal(true);

        try {
            const url = getPageUrl();

            // 1. Generate raw QR as data URL using the qrcode library
            const rawQrDataUrl = await QRCodeLib.toDataURL(url, {
                width: 360,
                margin: 2,
                color: {
                    dark: '#1a1a2e',
                    light: '#ffffff',
                },
                errorCorrectionLevel: 'M',
            });

            // 2. Load the raw QR image and draw branded version on canvas
            const img = new Image();
            img.src = rawQrDataUrl;

            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    try {
                        const canvas = brandedCanvasRef.current;
                        if (!canvas) { reject(new Error('Canvas no disponible')); return; }

                        const qrSize = 360;
                        const padding = 44;
                        const bottomExtra = 64;

                        canvas.width = qrSize + padding * 2;
                        canvas.height = qrSize + padding * 2 + bottomExtra;

                        const ctx = canvas.getContext('2d');
                        if (!ctx) { reject(new Error('Context no disponible')); return; }

                        // White background
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
                        ctx.fill();

                        // Top gradient accent bar
                        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                        gradient.addColorStop(0, '#ec4899');
                        gradient.addColorStop(1, '#f43f5e');
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.roundRect(0, 0, canvas.width, 6, [16, 16, 0, 0]);
                        ctx.fill();

                        // Draw the QR code image
                        ctx.drawImage(img, padding, padding, qrSize, qrSize);

                        // Branding text
                        ctx.fillStyle = '#6b7280';
                        ctx.font = '600 15px system-ui, -apple-system, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('💕 lovepages.ink', canvas.width / 2, qrSize + padding + 30);

                        // Page title
                        ctx.fillStyle = '#9ca3af';
                        ctx.font = '400 12px system-ui, -apple-system, sans-serif';
                        const title = pageData?.title || '';
                        const truncated = title.length > 40 ? title.substring(0, 40) + '...' : title;
                        ctx.fillText(truncated, canvas.width / 2, qrSize + padding + 50);

                        const finalDataUrl = canvas.toDataURL('image/png');
                        setQrDataUrl(finalDataUrl);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = () => reject(new Error('Error loading QR image'));
            });
        } catch (error) {
            console.error('Error generating QR:', error);
            toast.error('Error al generar código QR');
            setShowQrModal(false);
        } finally {
            setGeneratingQr(false);
        }
    }, [user, pageData, shortId]);

    const downloadQr = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = `lovepages-qr-${pageData?.shortId || 'code'}.png`;
        link.href = qrDataUrl;
        link.click();
        toast.success('¡QR descargado!');
    };

    const copyQrToClipboard = async () => {
        if (!qrDataUrl || !brandedCanvasRef.current) return;
        try {
            const blob = await new Promise<Blob | null>((resolve) =>
                brandedCanvasRef.current!.toBlob(resolve, 'image/png')
            );
            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob }),
                ]);
                toast.success('¡QR copiado al portapapeles!');
            }
        } catch {
            toast.error('No se pudo copiar. Descárgalo en su lugar.');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (!user || !pageData) return null;

    const yesPercentage = stats?.totalResponses > 0
        ? ((stats.yesCount / stats.totalResponses) * 100).toFixed(1)
        : 0;
    const noPercentage = stats?.totalResponses > 0
        ? ((stats.noCount / stats.totalResponses) * 100).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            {/* Hidden canvas for branded QR generation */}
            <canvas ref={brandedCanvasRef} style={{ display: 'none' }} />

            <main className="container py-8 max-w-4xl mx-auto px-4">
                {/* Back button & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard')}
                        className="self-start"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                            <span className="truncate">{pageData.title}</span>
                            {pageData.pageType === 'pro' && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 flex-shrink-0">
                                    <Sparkles className="w-3 h-3" />
                                    PRO
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-600">Para: {pageData.recipientName}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                            <Copy className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Copiar enlace</span>
                            <span className="sm:hidden">Copiar</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleOpenPublic}>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Ver página</span>
                            <span className="sm:hidden">Ver</span>
                        </Button>
                    </div>
                </div>

                {/* QR Code Card */}
                <Card className={`mb-8 overflow-hidden border-2 ${user.isPro ? 'border-pink-200 hover:border-pink-300' : 'border-dashed border-amber-300 bg-gradient-to-r from-amber-50/50 to-yellow-50/50'} transition-all`}>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${user.isPro
                                    ? 'bg-gradient-to-br from-pink-500 to-rose-500'
                                    : 'bg-gradient-to-br from-amber-400 to-yellow-500'
                                    }`}>
                                    <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                                        Código QR
                                        {!user.isPro && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                                                <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                PRO
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        {user.isPro
                                            ? 'Genera y descarga un QR para compartir tu página'
                                            : 'Comparte tu página con un código QR imprimible'
                                        }
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={generateQrCode}
                                variant={user.isPro ? 'gradient' : 'outline'}
                                size="sm"
                                className={`flex-shrink-0 gap-1.5 ${!user.isPro ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : ''}`}
                            >
                                {user.isPro ? (
                                    <>
                                        <QrCode className="w-4 h-4" />
                                        <span className="hidden sm:inline">Generar QR</span>
                                        <span className="sm:hidden">QR</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span className="hidden sm:inline">Desbloquear</span>
                                        <span className="sm:hidden">PRO</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* QR Modal */}
                {showQrModal && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => { setShowQrModal(false); setQrDataUrl(null); }}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
                            style={{ animation: 'fadeInScale 0.2s ease-out' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {user.isPro ? (
                                /* PRO: Show QR Code */
                                <>
                                    <div className="p-6 text-center">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <QrCode className="w-5 h-5 text-pink-600" />
                                                Código QR
                                            </h3>
                                            <button
                                                onClick={() => { setShowQrModal(false); setQrDataUrl(null); }}
                                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                <X className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>

                                        {generatingQr ? (
                                            <div className="py-16">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600 mx-auto mb-3"></div>
                                                <p className="text-sm text-gray-500">Generando código QR...</p>
                                            </div>
                                        ) : qrDataUrl ? (
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 rounded-xl p-3 inline-block">
                                                    <img
                                                        src={qrDataUrl}
                                                        alt="Código QR de la página"
                                                        className="w-full max-w-[280px] mx-auto rounded-lg"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 px-4">
                                                    Escanea este código para abrir &quot;{pageData.title}&quot;
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>

                                    {qrDataUrl && (
                                        <div className="border-t border-gray-100 p-4 flex gap-2">
                                            <Button
                                                onClick={downloadQr}
                                                variant="gradient"
                                                className="flex-1 gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Descargar
                                            </Button>
                                            <Button
                                                onClick={copyQrToClipboard}
                                                variant="outline"
                                                className="flex-1 gap-2"
                                            >
                                                <Copy className="w-4 h-4" />
                                                Copiar
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* FREE: Show upsell */
                                <>
                                    <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-6 text-center text-white">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <QrCode className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">Código QR</h3>
                                        <p className="text-white/80 text-sm">Función exclusiva PRO</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="relative bg-gray-100 rounded-xl p-6 flex items-center justify-center">
                                            {/* Blurred fake QR preview */}
                                            <div className="w-40 h-40 grid grid-cols-5 gap-1 blur-[6px] opacity-50">
                                                {Array.from({ length: 25 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`rounded-sm ${[0, 1, 4, 5, 6, 9, 10, 14, 15, 16, 19, 20, 21, 24].includes(i) ? 'bg-gray-800' : 'bg-white'}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-white rounded-full p-3 shadow-lg">
                                                    <Lock className="w-6 h-6 text-amber-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 text-center">
                                            Con PRO puedes generar un código QR de tu página para imprimirlo en cartas, regalos o invitaciones 💌
                                        </p>

                                        <div className="space-y-2">
                                            <Link href="/upgrade" className="block">
                                                <Button className="w-full gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white">
                                                    <Crown className="w-4 h-4" />
                                                    Obtener PRO — $1.75 USD
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                className="w-full text-gray-500"
                                                onClick={() => setShowQrModal(false)}
                                            >
                                                Ahora no
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold">{stats?.views || 0}</div>
                            <p className="text-sm text-gray-500">Vistas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <MessageCircle className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold">{stats?.totalResponses || 0}</div>
                            <p className="text-sm text-gray-500">Respuestas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <ThumbsUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-600">{stats?.yesCount || 0}</div>
                            <p className="text-sm text-gray-500">Sí ({yesPercentage}%)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <ThumbsDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-red-600">{stats?.noCount || 0}</div>
                            <p className="text-sm text-gray-500">No ({noPercentage}%)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Bar */}
                {stats?.totalResponses > 0 && (
                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-green-600">
                                    Sí: {stats.yesCount}
                                </span>
                                <span className="text-sm font-medium text-red-600">
                                    No: {stats.noCount}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${yesPercentage}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Page Info */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Información de la página</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pageData.message && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Mensaje:</span>
                                <p className="text-gray-900">{pageData.message}</p>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>Botón Sí: <strong>{pageData.yesButtonText}</strong></span>
                            <span>Botón No: <strong>{pageData.noButtonText}</strong></span>
                            <span>Botón escapa: <strong>{pageData.noButtonEscapes ? 'Sí' : 'No'}</strong></span>
                            <span>Estado: <strong className={pageData.isActive ? 'text-green-600' : 'text-red-600'}>{pageData.isActive ? 'Activa' : 'Inactiva'}</strong></span>
                        </div>
                        <div className="text-xs text-gray-400">
                            Creada: {formatDate(pageData.createdAt)}
                        </div>
                    </CardContent>
                </Card>

                {/* Responses List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Respuestas ({responses.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {responses.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="font-medium">Aún no hay respuestas</p>
                                <p className="text-sm mt-1">Comparte el enlace para recibir respuestas</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {responses.map((response: any, index: number) => (
                                    <div
                                        key={response._id || index}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${response.answer === 'yes'
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-red-50 border-red-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${response.answer === 'yes'
                                                ? 'bg-green-100'
                                                : 'bg-red-100'
                                                }`}>
                                                {response.answer === 'yes' ? (
                                                    <ThumbsUp className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <ThumbsDown className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <span className={`font-semibold ${response.answer === 'yes'
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                                    }`}>
                                                    {response.answer === 'yes' ? '¡Sí! 💕' : 'No 😢'}
                                                </span>
                                                {response.location?.city && (
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Globe className="w-3 h-3" />
                                                        {response.location.city}, {response.location.country}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(response.respondedAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>

            {/* Animation styles */}
            <style jsx global>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}