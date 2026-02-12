'use client';

import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '@/lib/utils';

export default function PageDetailView() {
    const params = useParams();
    const router = useRouter();
    const shortId = params.shortId as string;
    const { user, loading: authLoading } = useAuthStore();
    const [pageData, setPageData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            // First get the page list to find the _id from shortId
            const { data: pagesData } = await api.pages.getMyPages();
            const page = pagesData.data.find((p: any) => p.shortId === shortId);
            console.log('page', page);
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
        console.log(pageData);
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        window.open(`/p/${identifier}`, '_blank');
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

            <main className="container py-8 max-w-4xl mx-auto">
                {/* Back button & Title */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {pageData.title}
                            {pageData.pageType === 'pro' && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    PRO
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-600">Para: {pageData.recipientName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar enlace
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleOpenPublic}>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Ver página
                        </Button>
                    </div>
                </div>

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
        </div>
    );
}