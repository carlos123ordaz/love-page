'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, usePageStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useTranslation } from '@/i18n';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import {
    Plus,
    Heart,
    Eye,
    MessageCircle,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Crown,
    Sparkles,
    MoreVertical,
    Link2,
    LayoutTemplate,
    Gamepad2,
    Clock,
    Bell,
    BellOff,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getTimeAgo, copyToClipboard } from '@/lib/utils';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { pages, setPages, removePage, updatePage } = usePageStore();
    const [loadingPages, setLoadingPages] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const { t } = useTranslation();
    const { permission, loading: pushLoading, subscribe, unsubscribe } = usePushNotifications();

    const handlePushToggle = async () => {
        if (permission === 'granted') {
            await unsubscribe();
            toast('Notificaciones desactivadas');
            return;
        }

        const ok = await subscribe();
        if (ok) {
            toast.success('Notificaciones activadas. Te avisaremos cuando alguien vea tu pagina.');
        } else if (permission === 'denied') {
            toast.error('Bloqueaste las notificaciones en tu navegador. Activalas desde la configuracion del sitio.');
        }
    };

    useEffect(() => {
        if (user) {
            loadPages();
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        if (openMenuId) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openMenuId]);

    const loadPages = async () => {
        try {
            setLoadingPages(true);
            const { data } = await api.pages.getMyPages();
            setPages(data.data);
        } catch (error) {
            toast.error(t.dashboard.loadError);
        } finally {
            setLoadingPages(false);
        }
    };

    const handleCopyUrl = (url: string) => {
        copyToClipboard(url);
        toast.success(t.dashboard.linkCopied);
    };

    const handleToggleStatus = async (pageId: string, currentStatus: boolean) => {
        try {
            await api.pages.toggleStatus(pageId);
            updatePage(pageId, { isActive: !currentStatus });
            toast.success(currentStatus ? t.dashboard.pageDeactivated : t.dashboard.pageActivated);
        } catch (error) {
            toast.error(t.dashboard.statusChangeError);
        }
    };

    const handleDelete = async (pageId: string) => {
        if (!confirm(t.dashboard.confirmDelete)) return;

        try {
            await api.pages.delete(pageId);
            removePage(pageId);
            toast.success(t.dashboard.pageDeleted);
        } catch (error) {
            toast.error(t.dashboard.deleteError);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
                <Header />
                <main className="container px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto">
                        <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            {t.dashboard.heroTitle}
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            {t.dashboard.heroDesc}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/create">
                                <Button variant="gradient" size="lg" className="gap-2">
                                    <Plus className="w-5 h-5" />
                                    {t.dashboard.createPageFree}
                                </Button>
                            </Link>
                            <Link href="/templates">
                                <Button variant="outline" size="lg" className="gap-2 border-pink-200 text-pink-700 hover:bg-pink-50">
                                    <LayoutTemplate className="w-5 h-5" />
                                    {t.dashboard.viewTemplates}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const totalViews = pages.reduce((sum, page) => sum + page.views, 0);
    const totalResponses = pages.reduce((sum, page) => sum + page.totalResponses, 0);
    const freeLimitReached = !user.isPro && user.canCreatePage === false;
    const createHref = freeLimitReached ? '/upgrade' : '/create';
    const visiblePages = pages.filter((page) => page.isActive).length;
    const tools = [
        {
            href: '/templates',
            label: t.dashboard.viewTemplates,
            icon: LayoutTemplate,
            className: 'border-pink-200 text-pink-700 hover:bg-pink-50',
        },
        {
            href: '/games',
            label: t.nav.games,
            icon: Gamepad2,
            className: 'border-rose-200 text-rose-700 hover:bg-rose-50',
        },
    ];
    const summaryStats = [
        {
            label: t.dashboard.pages,
            value: user.pagesCreated,
            helper: `${visiblePages} activas`,
            icon: Heart,
            iconClassName: 'text-pink-600',
        },
        {
            label: t.dashboard.views,
            value: totalViews,
            helper: t.common.total,
            icon: Eye,
            iconClassName: 'text-sky-600',
        },
        {
            label: t.dashboard.responses,
            value: totalResponses,
            helper: t.common.total,
            icon: MessageCircle,
            iconClassName: 'text-emerald-600',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
                <section className="mb-6 sm:mb-8">
                    <Card className="overflow-hidden border-pink-100 bg-white/85 shadow-sm backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-pink-700 ring-1 ring-pink-100">
                                            <Heart className="h-3.5 w-3.5 text-pink-500" />
                                            {t.dashboard.myPages}
                                        </div>
                                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                            {user.displayName}, aqui estan tus paginas
                                        </h1>

                                        {freeLimitReached && (
                                            <p className="mt-3 text-sm font-medium text-amber-700">
                                                {t.create.freeLimitReached}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 sm:min-w-[220px]">
                                        <Link href={createHref} className="w-full">
                                            <Button variant="gradient" size="lg" className="h-12 w-full gap-2 rounded-xl">
                                                {freeLimitReached ? <Crown className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                {freeLimitReached ? t.nav.upgradeAPro : t.dashboard.createPage}
                                            </Button>
                                        </Link>
                                        <div className="grid grid-cols-2 gap-2">
                                            {tools.map((tool) => {
                                                const Icon = tool.icon;
                                                return (
                                                    <Link key={tool.href} href={tool.href} className="w-full">
                                                        <Button variant="outline" className={`h-11 w-full gap-2 rounded-xl text-sm ${tool.className}`}>
                                                            <Icon className="h-4 w-4" />
                                                            <span className="truncate">{tool.label}</span>
                                                        </Button>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                                    <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
                                        {summaryStats.map((stat) => {
                                            const Icon = stat.icon;
                                            return (
                                                <div
                                                    key={stat.label}
                                                    className="min-w-[152px] snap-start rounded-2xl bg-white px-4 py-3 ring-1 ring-gray-100 shadow-sm sm:min-w-0"
                                                >
                                                    <div className="mb-2 flex items-center justify-between gap-3">
                                                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
                                                            {stat.label}
                                                        </span>
                                                        <Icon className={`h-4 w-4 ${stat.iconClassName}`} />
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {stat.value}
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500">{stat.helper}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {permission !== 'unsupported' && (
                                        <button
                                            onClick={handlePushToggle}
                                            disabled={pushLoading || permission === 'denied'}
                                            title={permission === 'denied' ? 'Notificaciones bloqueadas en el navegador' : permission === 'granted' ? 'Desactivar notificaciones' : 'Activar notificaciones de visitas'}
                                            className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors sm:w-[240px] ${permission === 'granted'
                                                    ? 'border-green-200 bg-green-50 text-green-800'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                                } ${permission === 'denied' ? 'cursor-not-allowed opacity-60' : ''}`}
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold">
                                                    {permission === 'granted' ? 'Alertas activas' : 'Alertas de visitas'}
                                                </p>
                                                <p className="text-xs text-current/75">
                                                    {permission === 'granted'
                                                        ? 'Te avisaremos cuando alguien abra tu pagina.'
                                                        : permission === 'denied'
                                                            ? 'El navegador bloqueo este permiso.'
                                                            : 'Activalas para seguir tus visitas en tiempo real.'}
                                                </p>
                                            </div>
                                            {permission === 'granted' ? (
                                                <Bell className="h-5 w-5 flex-shrink-0" />
                                            ) : (
                                                <BellOff className="h-5 w-5 flex-shrink-0" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="space-y-4">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{t.dashboard.myPages}</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Gestiona tus links, revisa su estado y comparte mas rapido.
                            </p>
                        </div>
                        {pages.length > 0 && (
                            <Link href={createHref} className="hidden sm:block">
                                <Button variant="outline" className="gap-2 border-pink-200 text-pink-700 hover:bg-pink-50">
                                    <Plus className="h-4 w-4" />
                                    {t.dashboard.createPage}
                                </Button>
                            </Link>
                        )}
                    </div>

                    {loadingPages ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-pink-600 mx-auto"></div>
                        </div>
                    ) : pages.length === 0 ? (
                        <Card className="text-center py-8 sm:py-12">
                            <CardContent>
                                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    {t.dashboard.noPages}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                                    {t.dashboard.noPagesDesc}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link href="/create">
                                        <Button variant="gradient" size="lg" className="gap-2">
                                            <Plus className="w-5 h-5" />
                                            {t.dashboard.createFirstPage}
                                        </Button>
                                    </Link>
                                    <Link href="/templates">
                                        <Button variant="outline" size="lg" className="gap-2 border-pink-200 text-pink-700 hover:bg-pink-50">
                                            <LayoutTemplate className="w-5 h-5" />
                                            {t.dashboard.useTemplate}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                            {pages.map((page) => {
                                const isExpired = page.expiresAt ? new Date(page.expiresAt) < new Date() : false;
                                const expirationText = page.expiresAt
                                    ? isExpired
                                        ? 'Expirada'
                                        : `Expira ${getTimeAgo(page.expiresAt)}`
                                    : null;

                                return (
                                    <Card key={page._id} className="overflow-hidden border-white/60 bg-white/95 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                        <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <CardTitle className="mb-1 line-clamp-2 text-lg leading-snug sm:text-xl">
                                                        {page.title}
                                                    </CardTitle>
                                                    <CardDescription className="truncate text-sm">
                                                        {t.dashboard.forRecipient.replace('{name}', page.recipientName)}
                                                    </CardDescription>
                                                </div>
                                                {page.pageType === 'pro' && (
                                                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-1 text-[10px] font-semibold text-white sm:text-xs">
                                                        <Sparkles className="h-3 w-3" />
                                                        PRO
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${page.isActive
                                                            ? 'bg-green-50 text-green-700 ring-green-200'
                                                            : 'bg-gray-100 text-gray-600 ring-gray-200'
                                                        }`}
                                                >
                                                    <span className={`h-2 w-2 rounded-full ${page.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                    {page.isActive ? t.dashboard.active : t.dashboard.inactive}
                                                </span>
                                                {expirationText && (
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${isExpired
                                                                ? 'bg-red-50 text-red-600 ring-red-200'
                                                                : 'bg-amber-50 text-amber-700 ring-amber-200'
                                                            }`}
                                                    >
                                                        <Clock className="h-3 w-3" />
                                                        {expirationText}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-rose-50/70 p-3">
                                                <div>
                                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                                        <Eye className="h-3.5 w-3.5 text-sky-600" />
                                                        {t.dashboard.views}
                                                    </div>
                                                    <div className="mt-1 text-lg font-semibold text-gray-900">
                                                        {page.views}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                                                        {t.dashboard.responses}
                                                    </div>
                                                    <div className="mt-1 text-lg font-semibold text-gray-900">
                                                        {page.totalResponses}
                                                    </div>
                                                </div>
                                            </div>

                                            {page.totalResponses > 0 && (
                                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                                        <span className="font-medium text-emerald-900">Resultado</span>
                                                        <span className="text-xs text-emerald-800">
                                                            {page.totalResponses} respuesta{page.totalResponses !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <div className="mb-2 h-2 rounded-full bg-emerald-100">
                                                        <div
                                                            className="h-2 rounded-full bg-emerald-500 transition-all"
                                                            style={{
                                                                width: `${(page.yesCount / page.totalResponses) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-sm text-emerald-900">
                                                        {page.yesCount} si / {page.noCount} no
                                                    </p>
                                                </div>
                                            )}

                                            <div className="text-xs text-gray-500">
                                                Creada {getTimeAgo(page.createdAt)}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 pt-1 sm:flex-nowrap">
                                                <Link href={`/page/${page.shortId}`} className="min-w-0 flex-1 sm:w-[120px] sm:flex-none">
                                                    <Button
                                                        variant="gradient"
                                                        size="sm"
                                                        className="h-10 w-full gap-2 rounded-xl text-sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        {t.common.view}
                                                    </Button>
                                                </Link>

                                                <Button
                                                    onClick={() => handleCopyUrl(page.url)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-10 rounded-xl border-pink-200 px-3 text-sm text-pink-700 hover:bg-pink-50 sm:flex-none"
                                                >
                                                    <Link2 className="mr-1 h-4 w-4" />
                                                    {t.common.copy}
                                                </Button>

                                                <div className="relative flex-shrink-0">
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(openMenuId === page._id ? null : page._id);
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-xl border border-gray-200 bg-white"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                                    </Button>

                                                    {openMenuId === page._id && (
                                                        <div className="absolute right-0 bottom-full z-50 mb-2 min-w-[180px] rounded-2xl border border-gray-200 bg-white py-1 shadow-lg">
                                                            <button
                                                                onClick={() => {
                                                                    handleToggleStatus(page._id, page.isActive);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                                                            >
                                                                {page.isActive ? (
                                                                    <>
                                                                        <ToggleRight className="w-4 h-4 text-green-600" />
                                                                        {t.dashboard.deactivate}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ToggleLeft className="w-4 h-4 text-gray-400" />
                                                                        {t.dashboard.activate}
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDelete(page._id);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                {t.common.delete}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                {pages.length > 0 && (
                    <Link href={createHref} className="fixed bottom-5 right-5 z-40 sm:hidden">
                        <Button
                            variant="gradient"
                            size="icon"
                            className="h-14 w-14 rounded-full shadow-lg shadow-pink-500/30"
                        >
                            <Plus className="w-6 h-6" />
                        </Button>
                    </Link>
                )}
            </main>
        </div>
    );
}
