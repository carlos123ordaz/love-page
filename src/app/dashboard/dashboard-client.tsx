'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, usePageStore } from '@/store';
import { Header } from '@/components/layout/header';
import { api } from '@/lib/api';
import { useTranslation } from '@/i18n';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Plus, Eye, Trash2, ToggleLeft, ToggleRight, Crown, Sparkles, Link2, Clock, Bell, BellOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getTimeAgo, copyToClipboard } from '@/lib/utils';

// ── Mini stat ────────────────────────────────────────────────
function Mini({ n, l, accent }: { n: string | number; l: string; accent?: boolean }) {
    return (
        <div style={{ padding: '16px 24px', borderRight: '1.5px dashed var(--ink-black)' }}>
            <div className="serif-display" style={{ fontSize: 'clamp(26px, 5.5vw, 42px)', lineHeight: 1, color: accent ? 'var(--ink-red)' : 'var(--ink-black)' }}>{n}</div>
            <div className="mono-eyebrow" style={{ marginTop: 6, color: 'var(--ink-black)' }}>{l}</div>
        </div>
    );
}

// ── Sparkline chart ──────────────────────────────────────────
function Sparkline({ points }: { points: number[] }) {
    const max = Math.max(...points, 1);
    const w = 200, h = 48;
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * w} ${h - (p / max) * h}`).join(' ');
    const last = points[points.length - 1];
    return (
        <div>
            <div className="mono-eyebrow" style={{ fontSize: 11, marginBottom: 6 }}>respuestas · 14 días</div>
            <svg viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%', height: h }}>
                <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="rgba(26,20,16,0.1)" />
                <path d={path} stroke="var(--ink-red)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx={w} cy={h - (last / max) * h} r="5" fill="var(--ink-red)" stroke="var(--ink-black)" strokeWidth="1.5" />
            </svg>
        </div>
    );
}

// ── Page card ────────────────────────────────────────────────
function PageCard({
    page, onToggle, onDelete, onCopy, openMenuId, setOpenMenuId,
}: {
    page: any; onToggle: () => void; onDelete: () => void; onCopy: () => void;
    openMenuId: string | null; setOpenMenuId: (id: string | null) => void;
}) {
    const { t } = useTranslation();
    const total = page.yesCount + page.noCount;
    const yesPct = total ? Math.round((page.yesCount / total) * 100) : 0;

    const toneIndex = Math.abs(page.title?.charCodeAt(0) ?? 0) % 3;
    const tones = ['lila', 'butter', 'peach'];
    const tone = tones[toneIndex];
    const bgs: Record<string, string> = {
        lila: 'var(--lila-2)',
        butter: 'var(--paper-2)',
        peach: 'var(--melocoton-2)',
    };

    const isExpired = page.expiresAt ? new Date(page.expiresAt) < new Date() : false;
    const expirationText = page.expiresAt
        ? isExpired ? t.dashboard.cardExpired : t.dashboard.cardExpires.replace('{time}', getTimeAgo(page.expiresAt))
        : null;

    const titleChars = [...(page.title ?? '')];
    const emoji = titleChars.find((c: string) => c.codePointAt(0)! > 0xffff) ?? '💌';

    return (
        <div style={{ border: '1.5px solid var(--ink-black)', background: 'white', overflow: 'hidden', boxShadow: '4px 4px 0 var(--ink-black)' }}>
            {/* Card header */}
            <div style={{ height: 140, background: bgs[tone], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1.5px solid var(--ink-black)', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: 0.6 }} viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="var(--ink-red)" />
                </svg>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: 0.55 }} viewBox="0 0 200 200">
                    <circle cx="105" cy="95" r="75" fill="var(--ink-blue)" />
                </svg>
                <div style={{ position: 'relative', zIndex: 1, fontSize: 50 }}>{emoji}</div>

                <span style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', fontSize: 9, fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', background: page.isActive ? 'var(--ink-red)' : 'var(--ink-black)', color: 'var(--paper)', border: '1.5px solid var(--ink-black)', zIndex: 2 }}>
                    ● {page.isActive ? t.dashboard.active : t.dashboard.draft}
                </span>

                {page.pageType === 'pro' && (
                    <span style={{ position: 'absolute', top: 12, left: page.isActive ? 'auto' : 12, right: page.isActive ? 50 : 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'var(--ink-blue)', color: 'var(--paper)', border: '1.5px solid var(--ink-black)', fontSize: 9, fontWeight: 700, zIndex: 2 }}>
                        <Sparkles style={{ width: 8, height: 8 }} /> PRO
                    </span>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === page._id ? null : page._id); }}
                    style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, background: 'white', border: '2px solid var(--ink)', cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, zIndex: 10 }}>
                    ⋯
                </button>
                {openMenuId === page._id && (
                    <div style={{ position: 'absolute', top: 50, right: 12, background: 'white', border: '2px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)', overflow: 'hidden', minWidth: 160, zIndex: 50 }}>
                        <button onClick={() => { onToggle(); setOpenMenuId(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', width: '100%', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', textAlign: 'left' }}
                            className="hover:bg-[var(--lila-soft)]">
                            {page.isActive ? <ToggleRight style={{ width: 14, height: 14 }} /> : <ToggleLeft style={{ width: 14, height: 14 }} />}
                            {page.isActive ? t.dashboard.deactivate : t.dashboard.activate}
                        </button>
                        <button onClick={() => { onDelete(); setOpenMenuId(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', width: '100%', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', textAlign: 'left', borderTop: '1.5px dashed var(--rule)' }}
                            className="hover:bg-red-50">
                            <Trash2 style={{ width: 14, height: 14 }} />
                            {t.common.delete}
                        </button>
                    </div>
                )}
            </div>

            {/* Card body */}
            <div style={{ padding: 20 }}>
                <div className="mono-eyebrow" style={{ fontSize: 11 }}>para {page.recipientName}</div>
                <h3 className="serif-display" style={{ fontSize: 22, margin: '6px 0 4px', color: 'var(--ink)', lineHeight: 1.1 }}>
                    {page.title}
                </h3>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)' }}>
                    /p/{page.shortId}
                </div>

                {expirationText && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, padding: '3px 10px', background: isExpired ? '#fee2e2' : 'var(--butter)', border: '1.5px solid var(--ink)', fontSize: 10, fontWeight: 600, color: isExpired ? '#dc2626' : 'var(--ink)' }}>
                        <Clock style={{ width: 10, height: 10 }} /> {expirationText}
                    </span>
                )}

                {page.isActive && page.totalResponses > 0 ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 16, borderTop: '1.5px dashed var(--rule)' }}>
                            <div>
                                <div className="serif-display" style={{ fontSize: 26, lineHeight: 1, color: 'var(--ink-black)' }}>{page.views}</div>
                                <div className="mono-eyebrow" style={{ fontSize: 10, marginTop: 4 }}>{t.dashboard.statsViews}</div>
                            </div>
                            <div>
                                <div className="serif-display" style={{ fontSize: 26, lineHeight: 1, color: 'var(--ink-red)' }}>{page.yesCount}</div>
                                <div className="mono-eyebrow" style={{ fontSize: 10, marginTop: 4 }}>{t.dashboard.statsSi}</div>
                            </div>
                            <div>
                                <div className="serif-display" style={{ fontSize: 26, lineHeight: 1, color: 'var(--ink-black)' }}>{page.noCount}</div>
                                <div className="mono-eyebrow" style={{ fontSize: 10, marginTop: 4 }}>{t.dashboard.statsNo}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <div style={{ display: 'flex', height: 10, overflow: 'hidden', background: 'var(--paper-3)', border: '1.5px solid var(--ink-black)' }}>
                                <div style={{ width: `${yesPct}%`, background: 'var(--ink-red)', mixBlendMode: 'multiply' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--ink-soft)' }}>
                                <span>{yesPct}% dijeron sí 💖</span>
                                <span>{getTimeAgo(page.createdAt)}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1.5px dashed var(--rule)', fontSize: 13, color: 'var(--ink-soft)' }}>
                        {page.isActive ? `${page.views} ${t.dashboard.statsViews} · ${t.dashboard.statsNo}` : `${t.dashboard.noPublished} · ${getTimeAgo(page.createdAt)}`}
                    </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <Link href={`/page/${page.shortId}`} style={{ flex: 1 }}>
                        <button style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--ink-black)', background: page.isActive ? 'var(--ink-red)' : 'var(--ink-black)', color: 'var(--paper)', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink-black)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
                            {page.isActive ? t.dashboard.viewPage : t.dashboard.continuePage}
                        </button>
                    </Link>
                    <button onClick={onCopy} style={{ flex: 1, padding: '10px 12px', border: '1.5px solid var(--ink-black)', background: 'var(--paper-soft)', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink-black)', color: 'var(--ink-black)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
                        {t.dashboard.copyBtn}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Free limit modal ─────────────────────────────────────────
function LimitModal({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}
            onClick={onClose}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(45,27,61,0.45)', backdropFilter: 'blur(4px)' }} />
            <div style={{ position: 'relative', background: 'white', border: '2px solid var(--ink)', padding: '40px 32px', maxWidth: 400, width: '100%', boxShadow: '6px 6px 0 var(--ink)', textAlign: 'center' }}
                onClick={(e) => e.stopPropagation()}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>💌</div>
                <h2 className="serif-display" style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.05 }}>
                    {t.dashboard.limitModalTitle}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 28 }}>
                    {t.dashboard.limitModalDesc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link href="/upgrade">
                        <button className="btn-accent" style={{ width: '100%', padding: '14px 20px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <Crown style={{ width: 16, height: 16 }} /> {t.dashboard.limitModalCta}
                        </button>
                    </Link>
                    <button onClick={onClose}
                        style={{ width: '100%', padding: '12px 20px', border: '2px solid var(--ink)', background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--ink)', boxShadow: '2px 2px 0 var(--ink)' }}>
                        {t.dashboard.limitModalDecline}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── New page card ────────────────────────────────────────────
function NewCard({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} style={{ border: '2px dashed var(--ink)', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--sans)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 380, width: '100%' }}
            className="hover:bg-white/50 transition-colors">
            <div style={{ width: 64, height: 64, background: 'var(--ink-red)', border: '2px solid var(--ink-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: 'var(--paper)', boxShadow: '4px 4px 0 var(--ink-black)' }} className="serif-display">+</div>
            <div className="serif-display" style={{ fontSize: 22, fontStyle: 'italic', color: 'var(--ink)' }}>nueva carta</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>en blanco o desde plantilla ✨</div>
        </button>
    );
}

// ── Main dashboard ───────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, updateUser } = useAuthStore();
    const { pages, setPages, removePage, updatePage } = usePageStore();
    const [loadingPages, setLoadingPages] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'draft'>('all');
    const [showLimitModal, setShowLimitModal] = useState(false);
    const { t } = useTranslation();
    const { permission, loading: pushLoading, subscribe, unsubscribe } = usePushNotifications();

    const handlePushToggle = async () => {
        if (permission === 'granted') { await unsubscribe(); toast(t.dashboard.pushToastDeactivated); return; }
        const ok = await subscribe();
        if (ok) toast.success(t.dashboard.pushToastActivated);
        else if (permission === 'denied') toast.error(t.dashboard.pushToastDenied);
    };

    useEffect(() => { if (user) loadPages(); }, [user]);

    useEffect(() => {
        const close = () => setOpenMenuId(null);
        if (openMenuId) { document.addEventListener('click', close); return () => document.removeEventListener('click', close); }
    }, [openMenuId]);

    const loadPages = async () => {
        try {
            setLoadingPages(true);
            const { data } = await api.pages.getMyPages();
            setPages(data.data);
        } catch { toast.error(t.dashboard.loadError); }
        finally { setLoadingPages(false); }
    };

    const handleCopyUrl = (url: string) => { copyToClipboard(url); toast.success(t.dashboard.linkCopied); };

    const handleToggleStatus = async (pageId: string, current: boolean) => {
        try {
            await api.pages.toggleStatus(pageId);
            updatePage(pageId, { isActive: !current });
            toast.success(current ? t.dashboard.pageDeactivated : t.dashboard.pageActivated);
        } catch { toast.error(t.dashboard.statusChangeError); }
    };

    const handleDelete = async (pageId: string) => {
        if (!confirm(t.dashboard.confirmDelete)) return;
        try {
            await api.pages.delete(pageId);
            removePage(pageId);
            const newCount = Math.max(0, user!.pagesCreated - 1);
            updateUser({
                pagesCreated: newCount,
                canCreatePage: true,
                remainingPages: typeof user!.remainingPages === 'number' ? user!.remainingPages + 1 : 'unlimited',
            });
            toast.success(t.dashboard.pageDeleted);
        } catch { toast.error(t.dashboard.deleteError); }
    };

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, border: '3px solid var(--lila)', borderTopColor: 'var(--ink-red)', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
                <Header />
                <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <span style={{ fontSize: 64 }}>💌</span>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(28px, 5vw, 48px)', margin: '16px 0 12px', color: 'var(--ink)', lineHeight: 0.95 }}>
                        <em style={{ color: 'var(--accent-hex)', fontStyle: 'italic' }}>inicia sesión</em> para ver tus páginas
                    </h1>
                    <p style={{ color: 'var(--ink-2)', fontSize: 17, lineHeight: 1.55 }}>{t.dashboard.heroDesc}</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
                        <Link href="/create">
                            <button className="btn-accent" style={{ fontSize: 15, padding: '14px 24px' }}>
                                <Plus style={{ width: 16, height: 16, display: 'inline', marginRight: 6 }} />
                                {t.dashboard.createPageFree}
                            </button>
                        </Link>
                        <Link href="/templates">
                            <button style={{ background: 'white', border: '2px solid var(--ink)', color: 'var(--ink)', padding: '12px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)' }}>
                                {t.dashboard.viewTemplates}
                            </button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const totalViews = pages.reduce((s, p) => s + p.views, 0);
    const totalResponses = pages.reduce((s, p) => s + p.totalResponses, 0);
    const activeCount = pages.filter((p) => p.isActive).length;
    const draftCount = pages.filter((p) => !p.isActive).length;
    const freeLimitReached = !user.isPro && user.canCreatePage === false;
    const handleCreate = () => {
        if (freeLimitReached) { setShowLimitModal(true); return; }
        router.push('/create');
    };

    const filteredPages = pages.filter((p) =>
        filter === 'all' ? true : filter === 'active' ? p.isActive : !p.isActive
    );

    const greetingHour = new Date().getHours();
    const greeting = greetingHour < 12 ? t.dashboard.goodMorning : greetingHour < 19 ? t.dashboard.goodAfternoon : t.dashboard.goodEvening;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--sans)', color: 'var(--ink)' }}>
            <Header />

            <main style={{ maxWidth: 1200, margin: '0 auto' }} className="px-5 pb-20 sm:px-12">
                {/* ── Hero section ── */}
                <section style={{ padding: '40px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <span className="sticker-badge" style={{ background: 'var(--butter)', marginBottom: 12 }}>
                            {greeting}, {user.displayName?.split(' ')[0]?.toLowerCase() ?? 'tú'}
                        </span>
                        <h1 className="serif-display" style={{ fontSize: 'clamp(48px, 6vw, 72px)', margin: '12px 0 0', color: 'var(--ink-black)', lineHeight: 0.9 }}>
                            <em className="mis-blue" style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic' }}>{t.dashboard.yourLetters}</em>
                        </h1>
                    </div>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Filter pills */}
                        <div style={{ display: 'flex', gap: 0, border: '2px solid var(--ink)', background: 'white', boxShadow: '3px 3px 0 var(--ink)' }}>
                            {([['all', 'todas', pages.length], ['active', 'activas', activeCount], ['draft', 'borradores', draftCount]] as const).map(([val, label, count]) => (
                                <button key={val} onClick={() => setFilter(val)}
                                    style={{ padding: '6px 14px', background: filter === val ? 'var(--ink)' : 'transparent', color: filter === val ? 'white' : 'var(--ink)', border: 'none', borderRight: val !== 'draft' ? '1.5px solid var(--ink)' : 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                    {label} · {count}
                                </button>
                            ))}
                        </div>

                        <button onClick={handleCreate} className="btn-accent" style={{ padding: '12px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Plus style={{ width: 14, height: 14 }} />
                            + nueva carta ✨
                        </button>
                    </div>
                </section>

                {/* ── Stats strip ── */}
                <section style={{ margin: '0 0 32px', border: '1.5px solid var(--ink-black)', background: 'var(--paper-soft)' }} className="grid grid-cols-2 sm:grid-cols-[repeat(4,1fr)_2fr] items-center">
                    {/* Todas las cifras de esta tira salen de `pages`, igual que la
                        lista de abajo. Usar aquí el contador histórico del backend
                        hacía que dijera «7 páginas» junto a «aún no has creado ninguna». */}
                    <Mini n={pages.length} l="páginas" />
                    <Mini n={totalViews} l="visitas totales" />
                    <Mini n={totalResponses} l="respuestas sí" accent />
                    <Mini n={activeCount} l="activas" />
                    <div className="max-sm:col-span-2" style={{ padding: '16px 24px' }}>
                        <Sparkline points={[3, 7, 4, 12, 18, 11, 22, 28, 18, 24, 31, 29, 38, totalResponses || 1]} />
                    </div>
                </section>

                {/* ── Push notifications toggle ── */}
                {permission !== 'unsupported' && (
                    <div style={{ marginBottom: 24 }}>
                        <button onClick={handlePushToggle} disabled={pushLoading || permission === 'denied'}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', border: '2px solid var(--ink)', background: permission === 'granted' ? 'var(--mint)' : 'white', cursor: permission === 'denied' ? 'not-allowed' : 'pointer', opacity: permission === 'denied' ? 0.6 : 1, boxShadow: '3px 3px 0 var(--ink)' }}
                            title={permission === 'denied' ? t.dashboard.pushTitleBlocked : permission === 'granted' ? t.dashboard.pushTitleDeactivate : t.dashboard.pushTitleActivate}>
                            {permission === 'granted' ? <Bell style={{ width: 16, height: 16 }} /> : <BellOff style={{ width: 16, height: 16 }} />}
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                                    {permission === 'granted' ? t.dashboard.pushAlertsActive : t.dashboard.pushAlertsTitle}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                                    {permission === 'granted' ? t.dashboard.pushAlertsActiveDesc : permission === 'denied' ? t.dashboard.pushAlertsBlockedDesc : t.dashboard.pushAlertsInactiveDesc}
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* ── Pages grid ── */}
                <section>
                    <div className="mono-eyebrow" style={{ marginBottom: 18, fontSize: 12 }}>{t.dashboard.sectionTitle}</div>

                    {loadingPages ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 999, border: '3px solid var(--lila)', borderTopColor: 'var(--ink-red)', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                        </div>
                    ) : filteredPages.length === 0 && pages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 24px', border: '2px dashed var(--ink)', borderRadius: 0 }}>
                            <span style={{ fontSize: 64 }}>💌</span>
                            <h3 className="serif-display" style={{ fontSize: 'clamp(22px, 4vw, 36px)', margin: '16px 0 8px', color: 'var(--ink)', lineHeight: 0.95, fontStyle: 'italic' }}>
                                {t.dashboard.noPages}
                            </h3>
                            <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginBottom: 28 }}>{t.dashboard.noPagesDesc}</p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/create">
                                    <button className="btn-accent" style={{ padding: '14px 24px', fontSize: 14 }}>
                                        + {t.dashboard.createFirstPage}
                                    </button>
                                </Link>
                                <Link href="/templates">
                                    <button style={{ background: 'white', border: '2px solid var(--ink)', color: 'var(--ink)', padding: '12px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)' }}>
                                        {t.dashboard.useTemplate}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
                            {filteredPages.map((page) => (
                                <PageCard
                                    key={page._id}
                                    page={page}
                                    onToggle={() => handleToggleStatus(page._id, page.isActive)}
                                    onDelete={() => handleDelete(page._id)}
                                    onCopy={() => handleCopyUrl(page.url)}
                                    openMenuId={openMenuId}
                                    setOpenMenuId={setOpenMenuId}
                                />
                            ))}
                            {filter === 'all' && <NewCard onClick={handleCreate} />}
                        </div>
                    )}
                </section>
            </main>

            {/* Mobile FAB */}
            {pages.length > 0 && (
                <button onClick={handleCreate} className="btn-accent fixed bottom-5 right-5 z-40 md:hidden" style={{ width: 56, height: 56, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '4px 4px 0 var(--accent-deep-hex)' }}>
                    +
                </button>
            )}

            {showLimitModal && <LimitModal onClose={() => setShowLimitModal(false)} />}
        </div>
    );
}
