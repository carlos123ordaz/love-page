'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, usePageStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
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
    Gift,
    LayoutTemplate,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getTimeAgo, copyToClipboard } from '@/lib/utils';
import { RewardedAdBanner } from '@/components/ads/RewardedAdBanner';

export default function DashboardPage() {
    const router = useRouter();
    const { user, setUser, loading: authLoading } = useAuthStore();
    const { pages, setPages, removePage, updatePage } = usePageStore();
    const [loadingPages, setLoadingPages] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadPages();
        }
    }, [user]);

    // Cerrar menú al hacer click fuera
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
            toast.error('Error al cargar páginas');
        } finally {
            setLoadingPages(false);
        }
    };

    // Refrescar datos del usuario después de ganar recompensa
    const refreshUser = async () => {
        try {
            const { data } = await api.auth.getMe();
            setUser(data.data);
            await loadPages();
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    const handleCopyUrl = (url: string) => {
        copyToClipboard(url);
        toast.success('¡Enlace copiado!');
    };

    const handleToggleStatus = async (pageId: string, currentStatus: boolean) => {
        try {
            await api.pages.toggleStatus(pageId);
            updatePage(pageId, { isActive: !currentStatus });
            toast.success(currentStatus ? 'Página desactivada' : 'Página activada');
        } catch (error) {
            toast.error('Error al cambiar estado');
        }
    };

    const handleDelete = async (pageId: string) => {
        if (!confirm('¿Estás seguro de eliminar esta página?')) return;

        try {
            await api.pages.delete(pageId);
            removePage(pageId);
            toast.success('Página eliminada');
        } catch (error) {
            toast.error('Error al eliminar página');
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

    const totalViews = pages.reduce((sum, page) => sum + page.views, 0);
    const totalResponses = pages.reduce((sum, page) => sum + page.totalResponses, 0);

    // Calcular páginas disponibles para usuarios free
    const totalAllowed = user.isPro ? Infinity : 1 + (user.bonusPages || 0);
    const pagesRemaining = user.isPro ? Infinity : Math.max(0, totalAllowed - user.pagesCreated);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                            ¡Hola, {user.displayName}! 👋
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            {user.isPro ? (
                                <span className="flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                    Usuario PRO - Páginas ilimitadas
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 flex-wrap">
                                    Has creado {user.pagesCreated} de {totalAllowed} página{totalAllowed !== 1 ? 's' : ''}
                                    {(user.bonusPages || 0) > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                            <Gift className="w-3 h-3" />
                                            +{user.bonusPages} bonus
                                        </span>
                                    )}
                                    {pagesRemaining > 0 && (
                                        <span className="text-green-600 font-medium">
                                            — {pagesRemaining} disponible{pagesRemaining !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        {/* Banner de recompensa cuando NO puede crear páginas */}
                        {!user.isPro && !user.canCreatePage && (
                            <div className="w-full">
                                <RewardedAdBanner
                                    context="dashboard"
                                    compact={true}
                                    onRewardEarned={refreshUser}
                                />
                            </div>
                        )}

                        {user.canCreatePage && (
                            <Link href="/create" className="w-full sm:w-auto">
                                <Button variant="gradient" size="lg" className="gap-2 w-full sm:w-auto">
                                    <Plus className="w-5 h-5" />
                                    Crear Página
                                </Button>
                            </Link>
                        )}

                        <Link href="/templates" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto border-pink-200 text-pink-700 hover:bg-pink-50">
                                <LayoutTemplate className="w-5 h-5" />
                                Ver Plantillas
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-6 pb-1 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
                                Páginas
                            </CardTitle>
                            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600 flex-shrink-0" />
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {user.pagesCreated}
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">
                                {user.isPro ? 'Creadas' : `de ${totalAllowed} disponibles`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-6 pb-1 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
                                Vistas
                            </CardTitle>
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {totalViews}
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">
                                Total
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-6 pb-1 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
                                Respuestas
                            </CardTitle>
                            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {totalResponses}
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">
                                Total
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pages List */}
                <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mis Páginas</h2>

                    {loadingPages ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-pink-600 mx-auto"></div>
                        </div>
                    ) : pages.length === 0 ? (
                        <Card className="text-center py-8 sm:py-12">
                            <CardContent>
                                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    Aún no has creado ninguna página
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                                    Crea tu primera página personalizada para una ocasión especial
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link href="/create">
                                        <Button variant="gradient" size="lg" className="gap-2">
                                            <Plus className="w-5 h-5" />
                                            Crear Mi Primera Página
                                        </Button>
                                    </Link>
                                    <Link href="/templates">
                                        <Button variant="outline" size="lg" className="gap-2 border-pink-200 text-pink-700 hover:bg-pink-50">
                                            <LayoutTemplate className="w-5 h-5" />
                                            Usar una Plantilla
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {pages.map((page) => (
                                <Card key={page._id} className="hover:shadow-lg transition-all">
                                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-base sm:text-lg mb-0.5 sm:mb-1 truncate">
                                                    {page.title}
                                                </CardTitle>
                                                <CardDescription className="truncate text-sm">
                                                    Para: {page.recipientName}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                {page.pageType === 'pro' && (
                                                    <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] sm:text-xs font-semibold rounded-full flex items-center gap-0.5 sm:gap-1">
                                                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        PRO
                                                    </div>
                                                )}
                                                <div
                                                    className={`w-2 h-2 rounded-full flex-shrink-0 ${page.isActive ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}
                                                    title={page.isActive ? 'Activa' : 'Desactivada'}
                                                />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
                                        {/* Stats row */}
                                        <div className="flex items-center justify-between text-xs sm:text-sm">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                <span>{page.views} vistas</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                <span>{page.totalResponses} respuestas</span>
                                            </div>
                                        </div>

                                        {/* Barra de progreso */}
                                        {page.totalResponses > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                                                    <div
                                                        className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${(page.yesCount / page.totalResponses) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
                                                    {page.yesCount} Sí / {page.noCount} No
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-[11px] sm:text-xs text-gray-500">
                                            {getTimeAgo(page.createdAt)}
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
                                            <Button
                                                onClick={() => handleCopyUrl(page.url)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 h-9 text-xs sm:text-sm"
                                            >
                                                <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                                                <span className="sm:inline">Copiar</span>
                                            </Button>

                                            <Link href={`/page/${page.shortId}`} className="flex-shrink-0">
                                                <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm">
                                                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
                                                    <span className="hidden sm:inline">Ver</span>
                                                </Button>
                                            </Link>

                                            {/* Menú móvil */}
                                            <div className="relative flex-shrink-0">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(
                                                            openMenuId === page._id ? null : page._id
                                                        );
                                                    }}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 sm:hidden"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                                </Button>

                                                {openMenuId === page._id && (
                                                    <div className="absolute right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[160px] sm:hidden">
                                                        <button
                                                            onClick={() => {
                                                                handleToggleStatus(page._id, page.isActive);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                                                        >
                                                            {page.isActive ? (
                                                                <>
                                                                    <ToggleRight className="w-4 h-4 text-green-600" />
                                                                    Desactivar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ToggleLeft className="w-4 h-4 text-gray-400" />
                                                                    Activar
                                                                </>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleDelete(page._id);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Botones desktop */}
                                            <Button
                                                onClick={() => handleToggleStatus(page._id, page.isActive)}
                                                variant="ghost"
                                                size="icon"
                                                className="hidden sm:flex h-9 w-9"
                                            >
                                                {page.isActive ? (
                                                    <ToggleRight className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                                                )}
                                            </Button>

                                            <Button
                                                onClick={() => handleDelete(page._id)}
                                                variant="ghost"
                                                size="icon"
                                                className="hidden sm:flex h-9 w-9 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* FAB para crear página en móvil */}
                {user.canCreatePage && pages.length > 0 && (
                    <Link href="/create" className="fixed bottom-6 right-6 sm:hidden z-40">
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