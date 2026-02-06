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
    ExternalLink,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Crown,
    Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getTimeAgo, copyToClipboard } from '@/lib/utils';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    console.log(user);
    const { pages, setPages, loading: pagesLoading, removePage, updatePage } = usePageStore();
    const [loadingPages, setLoadingPages] = useState(true);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ¡Hola, {user.displayName}! 👋
                        </h1>
                        <p className="text-gray-600">
                            {user.isPro ? (
                                <span className="flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                    Usuario PRO - Páginas ilimitadas
                                </span>
                            ) : (
                                `Has creado ${user.pagesCreated} de 5 páginas gratuitas`
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!user.isPro && user.pagesCreated >= 5 && (
                            <Link href="/upgrade">
                                <Button variant="gradient" className="gap-2">
                                    <Crown className="w-4 h-4" />
                                    Upgrade a PRO
                                </Button>
                            </Link>
                        )}

                        {user.canCreatePage && (
                            <Link href="/create">
                                <Button variant="gradient" size="lg" className="gap-2">
                                    <Plus className="w-5 h-5" />
                                    Crear Página
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Páginas Creadas
                            </CardTitle>
                            <Heart className="w-4 h-4 text-pink-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{pages.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total de Vistas
                            </CardTitle>
                            <Eye className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {pages.reduce((sum, page) => sum + page.views, 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total de Respuestas
                            </CardTitle>
                            <MessageCircle className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {pages.reduce((sum, page) => sum + page.totalResponses, 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pages List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Mis Páginas</h2>

                    {loadingPages ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                        </div>
                    ) : pages.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aún no has creado ninguna página
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Crea tu primera página personalizada para una ocasión especial
                                </p>
                                <Link href="/create">
                                    <Button variant="gradient" size="lg" className="gap-2">
                                        <Plus className="w-5 h-5" />
                                        Crear Mi Primera Página
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pages.map((page) => (
                                <Card key={page._id} className="hover:shadow-lg transition-all">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-1 line-clamp-1">
                                                    {page.title}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-1">
                                                    Para: {page.recipientName}
                                                </CardDescription>
                                            </div>
                                            {page.pageType === 'pro' && (
                                                <div className="flex-shrink-0 px-2 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    PRO
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Eye className="w-4 h-4" />
                                                {page.views} vistas
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <MessageCircle className="w-4 h-4" />
                                                {page.totalResponses} respuestas
                                            </div>
                                        </div>

                                        {page.totalResponses > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${(page.yesCount / page.totalResponses) * 100}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-600">
                                                    {page.yesCount} Sí / {page.noCount} No
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500">{getTimeAgo(page.createdAt)}</div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => handleCopyUrl(page.url)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                Copiar
                                            </Button>

                                            <Link href={`/page/${page.shortId}`}>
                                                <Button variant="outline" size="sm">
                                                    Ver
                                                </Button>
                                            </Link>

                                            <Button
                                                onClick={() => handleToggleStatus(page._id, page.isActive)}
                                                variant="ghost"
                                                size="icon"
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
                                                className="text-red-600 hover:text-red-700"
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
            </main>
        </div>
    );
}