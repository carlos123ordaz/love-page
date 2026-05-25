'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
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
                        style={{ position: 'fixed', inset: 0, background: 'rgba(45,27,61,0.45)', backdropFilter: 'blur(4px)', zIndex: 40 }}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--paper)', borderTop: '2px solid var(--ink)', borderRadius: 0, zIndex: 50, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: height }}
                    >
                        <div style={{ flexShrink: 0, paddingTop: 12, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}>
                            <div style={{ width: 40, height: 4, background: 'var(--ink)', borderRadius: 0, margin: '0 auto', opacity: 0.2 }} />
                        </div>
                        {title && (
                            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px', borderBottom: '1.5px dashed var(--rule)' }}>
                                <h3 className="serif-display" style={{ fontSize: 20, color: 'var(--ink)' }}>{title}</h3>
                                <button
                                    onClick={onClose}
                                    style={{ width: 32, height: 32, borderRadius: 0, border: '2px solid var(--ink)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 var(--ink)' }}
                                >
                                    <X style={{ width: 16, height: 16, color: 'var(--ink)' }} />
                                </button>
                            </div>
                        )}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ── Stat chip ─────────────────────────────────────────────────
function StatChip({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
    return (
        <div style={{ border: '2px solid var(--ink)', borderRadius: 0, background: 'white', boxShadow: '4px 4px 0 var(--ink)', padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{icon}</div>
            <div className="serif-display" style={{ fontSize: 28, color, lineHeight: 1 }}>{value}</div>
            <div className="mono-eyebrow" style={{ marginTop: 6, fontSize: 10 }}>{label}</div>
        </div>
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
        if (!authLoading && !user) router.push('/');
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) loadPageDetails();
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
        } catch {
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

    const generateQrCode = useCallback(async () => {
        if (!user?.isPro) { setShowQrModal(true); return; }
        setGeneratingQr(true);
        setShowQrModal(true);
        try {
            const url = getPageUrl();
            const rawQrDataUrl = await QRCodeLib.toDataURL(url, {
                width: 360, margin: 2,
                color: { dark: '#2d1b3d', light: '#ffffff' },
                errorCorrectionLevel: 'M',
            });
            const img = new Image();
            img.src = rawQrDataUrl;
            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    try {
                        const canvas = brandedCanvasRef.current;
                        if (!canvas) { reject(new Error('Canvas not available')); return; }
                        const qrSize = 360, padding = 44, bottomExtra = 64;
                        canvas.width = qrSize + padding * 2;
                        canvas.height = qrSize + padding * 2 + bottomExtra;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) { reject(new Error('Context not available')); return; }
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
                        ctx.fill();
                        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                        gradient.addColorStop(0, '#ff6b9d');
                        gradient.addColorStop(1, '#c4458b');
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.roundRect(0, 0, canvas.width, 6, [16, 16, 0, 0]);
                        ctx.fill();
                        ctx.drawImage(img, padding, padding, qrSize, qrSize);
                        ctx.fillStyle = '#8a7099';
                        ctx.font = '600 15px system-ui, -apple-system, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('💕 lovepages.ink', canvas.width / 2, qrSize + padding + 30);
                        ctx.fillStyle = '#b8a0c8';
                        ctx.font = '400 12px system-ui, -apple-system, sans-serif';
                        const title = pageData?.title || '';
                        const truncated = title.length > 40 ? title.substring(0, 40) + '...' : title;
                        ctx.fillText(truncated, canvas.width / 2, qrSize + padding + 50);
                        setQrDataUrl(canvas.toDataURL('image/png'));
                        resolve();
                    } catch (err) { reject(err); }
                };
                img.onerror = () => reject(new Error('Error loading QR image'));
            });
        } catch {
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
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                toast.success(t.pageDetail.qrCopied);
            }
        } catch {
            toast.error(t.pageDetail.qrCopyError);
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('es-PE', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
                <Header />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 0, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            </div>
        );
    }

    if (!user || !pageData) return null;

    const yesPercentage = stats?.totalResponses > 0
        ? ((stats.yesCount / stats.totalResponses) * 100).toFixed(1) : 0;
    const noPercentage = stats?.totalResponses > 0
        ? ((stats.noCount / stats.totalResponses) * 100).toFixed(1) : 0;

    // ── QR modal content ──────────────────────────────────────
    const qrModalContent = user.isPro ? (
        <>
            <div style={{ padding: '8px 24px 24px', textAlign: 'center' }}>
                {generatingQr ? (
                    <div style={{ padding: '64px 0' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 0, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{t.pageDetail.generatingQR}</p>
                    </div>
                ) : qrDataUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ background: 'var(--lila-soft)', borderRadius: 0, padding: 12, border: '2px solid var(--ink)', display: 'inline-block' }}>
                            <img src={qrDataUrl} alt={t.pageDetail.qrCode} style={{ width: '100%', maxWidth: 280, borderRadius: 8, display: 'block', margin: '0 auto' }} />
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                            {t.pageDetail.scanToOpen} &quot;{pageData.title}&quot;
                        </p>
                    </div>
                ) : null}
            </div>
            {qrDataUrl && (
                <div
                    style={isMobile ? { borderTop: '1.5px dashed var(--rule)', padding: 16, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', display: 'flex', gap: 10 } as React.CSSProperties : { borderTop: '1.5px dashed var(--rule)', padding: 16, display: 'flex', gap: 10 }}
                >
                    <button onClick={downloadQr} className="btn-accent" style={{ flex: 1, padding: '12px 16px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Download style={{ width: 14, height: 14 }} />
                        {t.pageDetail.download}
                    </button>
                    <button onClick={copyQrToClipboard} style={{ flex: 1, padding: '12px 16px', border: '2px solid var(--ink)', background: 'white', borderRadius: 0, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Copy style={{ width: 14, height: 14 }} />
                        {t.common.copy}
                    </button>
                </div>
            )}
        </>
    ) : (
        <>
            <div style={{ background: 'var(--butter)', borderBottom: '2px solid var(--ink)', padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 0, background: 'white', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '3px 3px 0 var(--ink)' }}>
                    <QrCode style={{ width: 28, height: 28, color: 'var(--ink)' }} />
                </div>
                <h3 className="serif-display" style={{ fontSize: 24, color: 'var(--ink)', marginBottom: 4 }}>{t.pageDetail.qrCode}</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{t.pageDetail.proExclusive}</p>
            </div>
            <div style={isMobile ? { padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' } as React.CSSProperties : { padding: 24 }}>
                <div style={{ background: 'var(--lila-soft)', borderRadius: 0, padding: 24, border: '2px solid var(--ink)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <div style={{ width: 160, height: 160, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, filter: 'blur(6px)', opacity: 0.4 }}>
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} style={{ borderRadius: 3, background: [0,1,4,5,6,9,10,14,15,16,19,20,21,24].includes(i) ? 'var(--ink)' : 'white' }} />
                        ))}
                    </div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 0, background: 'white', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '3px 3px 0 var(--ink)' }}>
                            <Lock style={{ width: 20, height: 20, color: 'var(--ink)' }} />
                        </div>
                    </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>
                    {t.pageDetail.qrProDesc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link href="/upgrade">
                        <button style={{ width: '100%', padding: '14px 20px', background: 'var(--butter)', border: '2px solid var(--ink)', borderRadius: 0, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <Crown style={{ width: 16, height: 16 }} />
                            {t.pageDetail.getProPrice}
                        </button>
                    </Link>
                    <button onClick={closeQrModal} style={{ width: '100%', padding: '12px 20px', border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-soft)' }}>
                        {t.pageDetail.notNow}
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--sans)', color: 'var(--ink)' }}>
            <Header />
            <canvas ref={brandedCanvasRef} style={{ display: 'none' }} />

            <main style={{ maxWidth: 960, margin: '0 auto' }} className="px-5 pb-20 sm:px-8">

                {/* ── Back + title ── */}
                <section style={{ padding: '32px 0 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{ width: 40, height: 40, borderRadius: 0, border: '2px solid var(--ink)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '3px 3px 0 var(--ink)', flexShrink: 0, marginTop: 4 }}
                    >
                        <ArrowLeft style={{ width: 18, height: 18 }} />
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="mono-eyebrow" style={{ marginBottom: 6 }}>
                            {t.dashboard.forRecipient.replace('{name}', pageData.recipientName)}
                        </div>
                        <h1 className="serif-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--ink)', lineHeight: 0.95, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageData.title}</span>
                            {pageData.pageType === 'pro' && (
                                <span className="sticker-badge" style={{ background: 'var(--butter)', fontSize: 10, padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <Sparkles style={{ width: 10, height: 10 }} /> PRO
                                </span>
                            )}
                        </h1>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>
                            /p/{pageData.customSlug || pageData.shortId}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 4 }}>
                        <button onClick={handleCopyUrl} style={{ padding: '10px 16px', border: '2px solid var(--ink)', background: 'white', borderRadius: 0, fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink)', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Copy style={{ width: 14, height: 14 }} />
                            <span className="hidden sm:inline">{t.pageDetail.copyLink}</span>
                        </button>
                        <button onClick={handleOpenPublic} className="btn-accent" style={{ padding: '10px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ExternalLink style={{ width: 14, height: 14 }} />
                            <span className="hidden sm:inline">{t.pageDetail.viewPage}</span>
                        </button>
                    </div>
                </section>

                {/* ── Stats strip ── */}
                <section style={{ border: '2px solid var(--ink)', background: 'white', borderRadius: 0, boxShadow: '5px 5px 0 var(--ink)', marginBottom: 24 }} className="p-5 sm:p-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatChip icon={<Eye style={{ width: 18, height: 18, color: 'var(--lila-2)' }} />} value={stats?.uniqueViews || 0} label={t.pageDetail.views} color="var(--ink)" />
                    <StatChip icon={<MessageCircle style={{ width: 18, height: 18, color: 'var(--melocoton-2)' }} />} value={stats?.totalResponses || 0} label={t.pageDetail.responses} color="var(--ink)" />
                    <StatChip icon={<ThumbsUp style={{ width: 18, height: 18, color: 'var(--accent-hex)' }} />} value={stats?.yesCount || 0} label={`${t.pageDetail.yesLabel} (${yesPercentage}%)`} color="var(--accent-hex)" />
                    <StatChip icon={<ThumbsDown style={{ width: 18, height: 18, color: 'var(--ink-soft)' }} />} value={stats?.noCount || 0} label={`${t.pageDetail.noLabel} (${noPercentage}%)`} color="var(--ink-2)" />
                </section>

                {/* ── Progress bar ── */}
                {stats?.totalResponses > 0 && (
                    <section style={{ border: '2px solid var(--ink)', background: 'white', borderRadius: 0, boxShadow: '4px 4px 0 var(--ink)', padding: '20px 24px', marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, fontWeight: 600 }}>
                            <span style={{ color: 'var(--accent-hex)' }}>{t.pageDetail.yesLabel}: {stats.yesCount}</span>
                            <span style={{ color: 'var(--ink-soft)' }}>{t.pageDetail.noLabel}: {stats.noCount}</span>
                        </div>
                        <div style={{ height: 12, background: 'var(--lila-soft)', borderRadius: 0, overflow: 'hidden', border: '1.5px solid var(--ink)' }}>
                            <div style={{ width: `${yesPercentage}%`, height: '100%', background: 'var(--accent-hex)', transition: 'width 500ms ease' }} />
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--sans)' }}>
                            {yesPercentage}% dijeron sí 💖
                        </div>
                    </section>
                )}

                {/* ── QR card ── */}
                <section style={{ border: user.isPro ? '2px solid var(--ink)' : '2px dashed var(--ink)', background: user.isPro ? 'white' : 'var(--butter)', borderRadius: 0, boxShadow: user.isPro ? '4px 4px 0 var(--ink)' : '4px 4px 0 var(--ink)', padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 0, border: '2px solid var(--ink)', background: user.isPro ? 'var(--lila)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '2px 2px 0 var(--ink)' }}>
                            <QrCode style={{ width: 20, height: 20, color: 'var(--ink)' }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                {t.pageDetail.qrCode}
                                {!user.isPro && (
                                    <span className="sticker-badge" style={{ background: 'var(--butter)', fontSize: 9, padding: '2px 8px', gap: 3 }}>
                                        <Crown style={{ width: 9, height: 9 }} /> PRO
                                    </span>
                                )}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 3 }}>
                                {user.isPro ? t.pageDetail.qrDesc : t.pageDetail.qrShareDesc}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={generateQrCode}
                        style={user.isPro
                            ? { padding: '10px 18px', border: '2px solid var(--ink)', background: 'var(--accent-hex)', color: 'white', borderRadius: 0, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }
                            : { padding: '10px 18px', border: '2px solid var(--ink)', background: 'white', color: 'var(--ink)', borderRadius: 0, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                    >
                        {user.isPro ? (
                            <><QrCode style={{ width: 14, height: 14 }} /><span className="hidden sm:inline">{t.pageDetail.generateQR}</span><span className="sm:hidden">QR</span></>
                        ) : (
                            <><Lock style={{ width: 14, height: 14 }} /><span className="hidden sm:inline">{t.pageDetail.unlock}</span><span className="sm:hidden">PRO</span></>
                        )}
                    </button>
                </section>

                {/* ── QR Modal ── */}
                {isMobile ? (
                    <BottomSheet isOpen={showQrModal} onClose={closeQrModal} title={user.isPro ? t.pageDetail.qrCode : undefined}>
                        {qrModalContent}
                    </BottomSheet>
                ) : (
                    <AnimatePresence>
                        {showQrModal && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'fixed', inset: 0, background: 'rgba(45,27,61,0.45)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                                onClick={closeQrModal}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }}
                                    style={{ background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 0, boxShadow: '8px 8px 0 var(--ink)', maxWidth: 400, width: '100%', overflow: 'hidden' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {user.isPro && (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 12px', borderBottom: '1.5px dashed var(--rule)' }}>
                                            <h3 className="serif-display" style={{ fontSize: 22, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <QrCode style={{ width: 20, height: 20, color: 'var(--accent-hex)' }} />
                                                {t.pageDetail.qrCode}
                                            </h3>
                                            <button onClick={closeQrModal} style={{ width: 32, height: 32, borderRadius: 0, border: '2px solid var(--ink)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 var(--ink)' }}>
                                                <X style={{ width: 16, height: 16 }} />
                                            </button>
                                        </div>
                                    )}
                                    {qrModalContent}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* ── Page info ── */}
                <section style={{ border: '2px solid var(--ink)', background: 'white', borderRadius: 0, boxShadow: '4px 4px 0 var(--ink)', marginBottom: 24 }}>
                    <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px dashed var(--rule)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h2 className="serif-display" style={{ fontSize: 20, color: 'var(--ink)' }}>{t.pageDetail.pageInfo}</h2>
                    </div>
                    <div style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {pageData.message && (
                            <div>
                                <div className="mono-eyebrow" style={{ marginBottom: 4 }}>{t.pageDetail.messageLabel}</div>
                                <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{pageData.message}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 4 }}>
                            {[
                                { label: t.pageDetail.yesButton, value: pageData.yesButtonText },
                                { label: t.pageDetail.noButton, value: pageData.noButtonText },
                                { label: t.pageDetail.escapeButton, value: pageData.noButtonEscapes ? t.common.yes : t.common.no },
                                {
                                    label: t.pageDetail.status,
                                    value: pageData.isActive ? t.pageDetail.active : t.pageDetail.inactive,
                                    accent: pageData.isActive ? 'var(--accent-hex)' : 'var(--ink-soft)',
                                },
                            ].map(({ label, value, accent }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--paper)', borderRadius: 0, border: '1.5px solid var(--rule)' }}>
                                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{label}</span>
                                    <strong style={{ fontSize: 13, color: accent || 'var(--ink)' }}>{value}</strong>
                                </div>
                            ))}
                        </div>
                        <div className="mono-eyebrow" style={{ marginTop: 4, fontSize: 10 }}>
                            {t.pageDetail.createdAt} {formatDate(pageData.createdAt)}
                        </div>
                    </div>
                </section>

                {/* ── Responses ── */}
                <section style={{ border: '2px solid var(--ink)', background: 'white', borderRadius: 0, boxShadow: '4px 4px 0 var(--ink)' }}>
                    <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px dashed var(--rule)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <MessageCircle style={{ width: 18, height: 18, color: 'var(--melocoton-2)' }} />
                        <h2 className="serif-display" style={{ fontSize: 20, color: 'var(--ink)' }}>
                            {t.pageDetail.responsesTitle}
                        </h2>
                        <span className="sticker-badge" style={{ background: 'var(--lila-soft)', fontSize: 11, padding: '3px 10px' }}>{responses.length}</span>
                    </div>
                    <div style={{ padding: '16px 24px 20px' }}>
                        {responses.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                <span style={{ fontSize: 48 }}>💌</span>
                                <p className="serif-display" style={{ fontSize: 22, color: 'var(--ink)', margin: '12px 0 6px', fontStyle: 'italic' }}>{t.pageDetail.noResponses}</p>
                                <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{t.pageDetail.shareToGetResponses}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {responses.map((response: any, index: number) => (
                                    <div
                                        key={response._id || index}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                                            padding: '14px 16px', borderRadius: 0,
                                            border: `2px solid ${response.answer === 'yes' ? 'var(--accent-hex)' : 'var(--ink)'}`,
                                            background: response.answer === 'yes' ? 'linear-gradient(135deg, #fff0f6, #fde4ef)' : 'var(--lila-soft)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 0, border: '2px solid var(--ink)', background: response.answer === 'yes' ? 'var(--accent-hex)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '2px 2px 0 var(--ink)' }}>
                                                {response.answer === 'yes'
                                                    ? <ThumbsUp style={{ width: 16, height: 16, color: 'white' }} />
                                                    : <ThumbsDown style={{ width: 16, height: 16, color: 'var(--ink)' }} />}
                                            </div>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <span style={{ fontWeight: 700, fontSize: 14, color: response.answer === 'yes' ? 'var(--accent-hex)' : 'var(--ink)' }}>
                                                    {response.answer === 'yes' ? t.pageDetail.yesResponse : t.pageDetail.noResponse}
                                                </span>
                                                {response.location?.city && (
                                                    <p style={{ fontSize: 11, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                                        <Globe style={{ width: 10, height: 10, flexShrink: 0 }} />
                                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {response.location.city}, {response.location.country}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ink-soft)', flexShrink: 0 }}>
                                            <Clock style={{ width: 10, height: 10, flexShrink: 0 }} />
                                            <span className="hidden sm:inline">{formatDate(response.respondedAt)}</span>
                                            <span className="sm:hidden">{new Date(response.respondedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
