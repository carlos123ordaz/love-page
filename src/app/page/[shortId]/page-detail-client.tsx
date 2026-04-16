'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useTranslation } from '@/i18n';

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
// COMPONENTE: BottomSheet (modal del QR en mobile)
// ============================================================
function BottomSheet({
    isOpen,
    onClose,
    children,
    title,
    height = '90vh',
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
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 overflow-hidden flex flex-col"
                        style={{ maxHeight: height }}
                    >
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

export default function PageDetailView() {
    const params = useParams();
    const router = useRouter();
    const shortId = params.shortId as string;
    const { user, loading: authLoading } = useAuthStore();
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 1023px)');
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
                toast.error(t.pageDetail.pageNotFound);
                router.push('/dashboard');
                return;
            }

            const { data } = await api.pages.getDetails(page._id);
            setPageData(data.data.page);
            setStats(data.data.stats);
            setResponses(data.data.responses || []);
        } catch (error) {
            console.error('Error loading page details:', error);
            toast.error(t.pageDetail.loadError);
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyUrl = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        const url = pageData?.url || `${window.location.origin}/p/${identifier}`;
        copyToClipboard(url);
        toast.success(t.pageDetail.linkCopied);
    };

    const handleOpenPublic = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        window.open(`/p/${identifier}`, '_blank');
    };

    const getPageUrl = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        return pageData?.url || `${window.location.origin}/p/${identifier}`;
    };

    const closeQrModal = () => {
        setShowQrModal(false);
        setQrDataUrl(null);
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

            const rawQrDataUrl = await QRCodeLib.toDataURL(url, {
                width: 360,
                margin: 2,
                color: {
                    dark: '#1a1a2e',
                    light: '#ffffff',
                },
                errorCorrectionLevel: 'M',
            });

            const img = new Image();
            img.src = rawQrDataUrl;

            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    try {
                        const canvas = brandedCanvasRef.current;
                        if (!canvas) { reject(new Error('Canvas not available')); return; }

                        const qrSize = 360;
                        const padding = 44;
                        const bottomExtra = 64;

                        canvas.width = qrSize + padding * 2;
                        canvas.height = qrSize + padding * 2 + bottomExtra;

                        const ctx = canvas.getContext('2d');
                        if (!ctx) { reject(new Error('Context not available')); return; }

                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
                        ctx.fill();

                        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                        gradient.addColorStop(0, '#ec4899');
                        gradient.addColorStop(1, '#f43f5e');
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.roundRect(0, 0, canvas.width, 6, [16, 16, 0, 0]);
                        ctx.fill();

                        ctx.drawImage(img, padding, padding, qrSize, qrSize);

                        ctx.fillStyle = '#6b7280';
                        ctx.font = '600 15px system-ui, -apple-system, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('💕 lovepages.ink', canvas.width / 2, qrSize + padding + 30);

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
            toast.error(t.pageDetail.loadError);
            setShowQrModal(false);
        } finally {
            setGeneratingQr(false);
        }
    }, [user, pageData, shortId, t]);

    const downloadQr = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = `lovepages-qr-${pageData?.shortId || 'code'}.png`;
        link.href = qrDataUrl;
        link.click();
        toast.success(t.pageDetail.qrDownloaded);
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
                toast.success(t.pageDetail.qrCopied);
            }
        } catch {
            toast.error(t.pageDetail.qrCopyError);
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
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
                <Header />
                <main className="container py-8 max-w-4xl mx-auto px-4 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                </main>
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

    // ============================================================
    // QR MODAL CONTENT (compartido entre desktop y mobile)
    // ============================================================
    const qrModalContent = user.isPro ? (
        <>
            <div className="px-4 sm:px-6 pt-2 pb-6 text-center">
                {generatingQr ? (
                    <div className="py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-500">{t.pageDetail.generatingQR}</p>
                    </div>
                ) : qrDataUrl ? (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-3 inline-block">
                            <img
                                src={qrDataUrl}
                                alt={t.pageDetail.qrCode}
                                className="w-full max-w-[280px] mx-auto rounded-lg"
                            />
                        </div>
                        <p className="text-xs text-gray-500 px-4">
                            {t.pageDetail.scanToOpen} &quot;{pageData.title}&quot;
                        </p>
                    </div>
                ) : null}
            </div>
            {qrDataUrl && (
                <div
                    className="border-t border-gray-100 p-4 flex gap-2"
                    style={isMobile ? { paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' } : undefined}
                >
                    <Button
                        onClick={downloadQr}
                        variant="gradient"
                        className="flex-1 gap-2 min-h-[48px] active:scale-95 transition-transform"
                    >
                        <Download className="w-4 h-4" />
                        {t.pageDetail.download}
                    </Button>
                    <Button
                        onClick={copyQrToClipboard}
                        variant="outline"
                        className="flex-1 gap-2 min-h-[48px] active:scale-95 transition-transform"
                    >
                        <Copy className="w-4 h-4" />
                        {t.common.copy}
                    </Button>
                </div>
            )}
        </>
    ) : (
        <>
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-6 text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-1">{t.pageDetail.qrCode}</h3>
                <p className="text-white/80 text-sm">{t.pageDetail.proExclusive}</p>
            </div>
            <div
                className="p-6 space-y-4"
                style={isMobile ? { paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' } : undefined}
            >
                <div className="relative bg-gray-100 rounded-xl p-6 flex items-center justify-center">
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
                    {t.pageDetail.qrProDesc}
                </p>

                <div className="space-y-2">
                    <Link href="/upgrade" className="block">
                        <Button className="w-full gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white min-h-[48px] active:scale-95 transition-transform">
                            <Crown className="w-4 h-4" />
                            {t.pageDetail.getProPrice}
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="w-full text-gray-500 min-h-[44px]"
                        onClick={closeQrModal}
                    >
                        {t.pageDetail.notNow}
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            {/* Hidden canvas for branded QR generation */}
            <canvas ref={brandedCanvasRef} style={{ display: 'none' }} />

            <main className="container py-4 lg:py-8 max-w-4xl mx-auto px-4 lg:px-6">
                {/* ============================================== */}
                {/* MOBILE: Compact header                          */}
                {/* ============================================== */}
                <div className="lg:hidden mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/60 active:scale-95 transition-all flex-shrink-0"
                            aria-label="Back"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="truncate">{pageData.title}</span>
                                {pageData.pageType === 'pro' && (
                                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-semibold rounded-full flex items-center gap-0.5 flex-shrink-0">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        PRO
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs text-gray-500 truncate">
                                {t.dashboard.forRecipient.replace('{name}', pageData.recipientName)}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCopyUrl}
                            className="min-h-[44px] active:scale-95 transition-transform gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            {t.common.copy}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleOpenPublic}
                            className="min-h-[44px] active:scale-95 transition-transform gap-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            {t.common.view}
                        </Button>
                    </div>
                </div>

                {/* ============================================== */}
                {/* DESKTOP: Original header                        */}
                {/* ============================================== */}
                <div className="hidden lg:flex items-center gap-4 mb-8">
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
                        <p className="text-gray-600">{t.dashboard.forRecipient.replace('{name}', pageData.recipientName)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                            <Copy className="w-4 h-4 mr-1" />
                            {t.pageDetail.copyLink}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleOpenPublic}>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            {t.pageDetail.viewPage}
                        </Button>
                    </div>
                </div>

                {/* ============================================== */}
                {/* QR Code Card                                    */}
                {/* ============================================== */}
                <Card className={`mb-4 lg:mb-8 overflow-hidden border-2 ${user.isPro ? 'border-pink-200 hover:border-pink-300' : 'border-dashed border-amber-300 bg-gradient-to-r from-amber-50/50 to-yellow-50/50'} transition-all`}>
                    <CardContent className="p-4 lg:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${user.isPro
                                    ? 'bg-gradient-to-br from-pink-500 to-rose-500'
                                    : 'bg-gradient-to-br from-amber-400 to-yellow-500'
                                    }`}>
                                    <QrCode className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap text-sm lg:text-base">
                                        {t.pageDetail.qrCode}
                                        {!user.isPro && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] lg:text-xs font-semibold rounded-full">
                                                <Crown className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                                                PRO
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs lg:text-sm text-gray-500 line-clamp-2 lg:line-clamp-1">
                                        {user.isPro ? t.pageDetail.qrDesc : t.pageDetail.qrShareDesc}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={generateQrCode}
                                variant={user.isPro ? 'gradient' : 'outline'}
                                size="sm"
                                className={`flex-shrink-0 gap-1.5 min-h-[44px] active:scale-95 transition-transform ${!user.isPro ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : ''}`}
                            >
                                {user.isPro ? (
                                    <>
                                        <QrCode className="w-4 h-4" />
                                        <span className="hidden sm:inline">{t.pageDetail.generateQR}</span>
                                        <span className="sm:hidden">QR</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span className="hidden sm:inline">{t.pageDetail.unlock}</span>
                                        <span className="sm:hidden">PRO</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* ============================================== */}
                {/* QR Modal — BottomSheet en mobile, modal en desktop */}
                {/* ============================================== */}
                {isMobile ? (
                    <BottomSheet
                        isOpen={showQrModal}
                        onClose={closeQrModal}
                        title={user.isPro ? t.pageDetail.qrCode : undefined}
                    >
                        {qrModalContent}
                    </BottomSheet>
                ) : (
                    <AnimatePresence>
                        {showQrModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                onClick={closeQrModal}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {user.isPro && (
                                        <div className="flex items-center justify-between px-6 pt-6 pb-2">
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <QrCode className="w-5 h-5 text-pink-600" />
                                                {t.pageDetail.qrCode}
                                            </h3>
                                            <button
                                                onClick={closeQrModal}
                                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                <X className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                    )}
                                    {qrModalContent}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ============================================== */}
                {/* Stats Cards                                     */}
                {/* ============================================== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-8">
                    <Card className="active:scale-[0.98] transition-transform">
                        <CardContent className="pt-4 lg:pt-6 pb-4 lg:pb-6 text-center">
                            <Eye className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 mx-auto mb-1.5 lg:mb-2" />
                            <div className="text-xl lg:text-2xl font-bold">{stats?.uniqueViews || 0}</div>
                            <p className="text-xs lg:text-sm text-gray-500">{t.pageDetail.views}</p>
                        </CardContent>
                    </Card>
                    <Card className="active:scale-[0.98] transition-transform">
                        <CardContent className="pt-4 lg:pt-6 pb-4 lg:pb-6 text-center">
                            <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500 mx-auto mb-1.5 lg:mb-2" />
                            <div className="text-xl lg:text-2xl font-bold">{stats?.totalResponses || 0}</div>
                            <p className="text-xs lg:text-sm text-gray-500">{t.pageDetail.responses}</p>
                        </CardContent>
                    </Card>
                    <Card className="active:scale-[0.98] transition-transform">
                        <CardContent className="pt-4 lg:pt-6 pb-4 lg:pb-6 text-center">
                            <ThumbsUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 mx-auto mb-1.5 lg:mb-2" />
                            <div className="text-xl lg:text-2xl font-bold text-green-600">{stats?.yesCount || 0}</div>
                            <p className="text-xs lg:text-sm text-gray-500">{t.pageDetail.yesLabel} ({yesPercentage}%)</p>
                        </CardContent>
                    </Card>
                    <Card className="active:scale-[0.98] transition-transform">
                        <CardContent className="pt-4 lg:pt-6 pb-4 lg:pb-6 text-center">
                            <ThumbsDown className="w-5 h-5 lg:w-6 lg:h-6 text-red-500 mx-auto mb-1.5 lg:mb-2" />
                            <div className="text-xl lg:text-2xl font-bold text-red-600">{stats?.noCount || 0}</div>
                            <p className="text-xs lg:text-sm text-gray-500">{t.pageDetail.noLabel} ({noPercentage}%)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ============================================== */}
                {/* Progress Bar                                    */}
                {/* ============================================== */}
                {stats?.totalResponses > 0 && (
                    <Card className="mb-4 lg:mb-8">
                        <CardContent className="pt-4 lg:pt-6 pb-4 lg:pb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-green-600">
                                    {t.pageDetail.yesLabel}: {stats.yesCount}
                                </span>
                                <span className="text-sm font-medium text-red-600">
                                    {t.pageDetail.noLabel}: {stats.noCount}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 lg:h-4 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 lg:h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${yesPercentage}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ============================================== */}
                {/* Page Info                                       */}
                {/* ============================================== */}
                <Card className="mb-4 lg:mb-8">
                    <CardHeader className="pb-3 lg:pb-6 px-4 lg:px-6">
                        <CardTitle className="text-base lg:text-lg">{t.pageDetail.pageInfo}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4 lg:px-6">
                        {pageData.message && (
                            <div>
                                <span className="text-xs lg:text-sm font-medium text-gray-500">{t.pageDetail.messageLabel}</span>
                                <p className="text-sm lg:text-base text-gray-900">{pageData.message}</p>
                            </div>
                        )}
                        {/* Mobile: stacked metadata; Desktop: wrapped row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 lg:gap-4 text-sm text-gray-600">
                            <span className="flex items-center justify-between sm:justify-start gap-2 py-1 border-b border-gray-100 lg:border-0 lg:py-0">
                                <span>{t.pageDetail.yesButton}</span>
                                <strong className="text-gray-900">{pageData.yesButtonText}</strong>
                            </span>
                            <span className="flex items-center justify-between sm:justify-start gap-2 py-1 border-b border-gray-100 lg:border-0 lg:py-0">
                                <span>{t.pageDetail.noButton}</span>
                                <strong className="text-gray-900">{pageData.noButtonText}</strong>
                            </span>
                            <span className="flex items-center justify-between sm:justify-start gap-2 py-1 border-b border-gray-100 lg:border-0 lg:py-0">
                                <span>{t.pageDetail.escapeButton}</span>
                                <strong className="text-gray-900">{pageData.noButtonEscapes ? t.common.yes : t.common.no}</strong>
                            </span>
                            <span className="flex items-center justify-between sm:justify-start gap-2 py-1 lg:py-0">
                                <span>{t.pageDetail.status}</span>
                                <strong className={pageData.isActive ? 'text-green-600' : 'text-red-600'}>{pageData.isActive ? t.pageDetail.active : t.pageDetail.inactive}</strong>
                            </span>
                        </div>
                        <div className="text-xs text-gray-400 pt-1">
                            {t.pageDetail.createdAt} {formatDate(pageData.createdAt)}
                        </div>
                    </CardContent>
                </Card>

                {/* ============================================== */}
                {/* Responses List                                  */}
                {/* ============================================== */}
                <Card className="mb-4 lg:mb-0">
                    <CardHeader className="pb-3 lg:pb-6 px-4 lg:px-6">
                        <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            {t.pageDetail.responsesTitle} ({responses.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 lg:px-6">
                        {responses.length === 0 ? (
                            <div className="text-center py-10 lg:py-12 text-gray-500">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="font-medium">{t.pageDetail.noResponses}</p>
                                <p className="text-sm mt-1">{t.pageDetail.shareToGetResponses}</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 lg:space-y-3">
                                {responses.map((response: any, index: number) => (
                                    <div
                                        key={response._id || index}
                                        className={`flex items-center justify-between gap-3 p-3 lg:p-4 rounded-lg border ${response.answer === 'yes'
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-red-50 border-red-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${response.answer === 'yes'
                                                ? 'bg-green-100'
                                                : 'bg-red-100'
                                                }`}>
                                                {response.answer === 'yes' ? (
                                                    <ThumbsUp className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <ThumbsDown className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <span className={`font-semibold text-sm lg:text-base ${response.answer === 'yes'
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                                    }`}>
                                                    {response.answer === 'yes' ? t.pageDetail.yesResponse : t.pageDetail.noResponse}
                                                </span>
                                                {response.location?.city && (
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                                                        <Globe className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{response.location.city}, {response.location.country}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] lg:text-xs text-gray-500 flex-shrink-0 text-right">
                                            <Clock className="w-3 h-3 flex-shrink-0" />
                                            <span className="hidden sm:inline">{formatDate(response.respondedAt)}</span>
                                            <span className="sm:hidden">{new Date(response.respondedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
