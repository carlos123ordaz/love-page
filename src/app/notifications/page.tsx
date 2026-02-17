'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import {
    Bell,
    BellOff,
    Check,
    CheckCheck,
    ExternalLink,
    Filter,
    Loader2,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    type: string;
    icon: string;
    actionUrl: string | null;
    actionText: string | null;
    isRead: boolean;
    createdAt: string;
}

const TYPE_STYLES: Record<string, { bg: string; border: string; label: string }> = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', label: 'Info' },
    success: { bg: 'bg-green-50', border: 'border-green-200', label: 'Éxito' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', label: 'Aviso' },
    promo: { bg: 'bg-purple-50', border: 'border-purple-200', label: 'Promo' },
    update: { bg: 'bg-cyan-50', border: 'border-cyan-200', label: 'Update' },
    response: { bg: 'bg-pink-50', border: 'border-pink-200', label: 'Respuesta' },
    system: { bg: 'bg-gray-50', border: 'border-gray-200', label: 'Sistema' },
};

const FILTERS = [
    { id: 'all', label: 'Todas' },
    { id: 'unread', label: 'No leídas' },
    { id: 'promo', label: 'Promos' },
    { id: 'update', label: 'Updates' },
    { id: 'response', label: 'Respuestas' },
];

export default function NotificationsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(
        async (pageNum: number, reset = false) => {
            try {
                if (reset) setLoading(true);
                else setLoadingMore(true);

                const { data } = await api.notifications.getAll({
                    page: pageNum,
                    limit: 20,
                });

                const newNotifications = data.data.notifications;

                if (reset) {
                    setNotifications(newNotifications);
                } else {
                    setNotifications((prev) => [...prev, ...newNotifications]);
                }

                setHasMore(pageNum < data.data.totalPages);
                setPage(pageNum);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                toast.error('Error al cargar notificaciones');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        []
    );

    const fetchUnreadCount = useCallback(async () => {
        try {
            const { data } = await api.notifications.getUnreadCount();
            setUnreadCount(data.data.count);
        } catch (error) {
            // Silenciar
        }
    }, []);

    useEffect(() => {
        fetchNotifications(1, true);
        fetchUnreadCount();
    }, [fetchNotifications, fetchUnreadCount]);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await api.notifications.markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            toast.error('Error al marcar notificación');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.notifications.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('Todas marcadas como leídas');
        } catch (error) {
            toast.error('Error al marcar notificaciones');
        }
    };

    const handleNotificationClick = async (notification: NotificationItem) => {
        if (!notification.isRead) {
            await handleMarkAsRead(notification._id);
        }
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchNotifications(page + 1);
        }
    };

    const timeAgo = (date: string) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
        } catch {
            return '';
        }
    };

    // Filtrar notificaciones
    const filteredNotifications = notifications.filter((n) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unread') return !n.isRead;
        return n.type === activeFilter;
    });

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Bell className="w-6 h-6 text-pink-600" />
                                Notificaciones
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-sm font-bold rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </h1>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            onClick={handleMarkAllAsRead}
                            variant="ghost"
                            size="sm"
                            className="text-pink-600 hover:text-pink-700 gap-1"
                        >
                            <CheckCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">Marcar todas como leídas</span>
                            <span className="sm:hidden">Leer todas</span>
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === filter.id
                                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                                    : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
                                }`}
                        >
                            {filter.label}
                            {filter.id === 'unread' && unreadCount > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notification list */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-16">
                        <BellOff className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {activeFilter === 'unread'
                                ? '¡Todo al día!'
                                : 'Sin notificaciones'}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {activeFilter === 'unread'
                                ? 'No tienes notificaciones pendientes'
                                : 'Aquí aparecerán tus notificaciones'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => {
                            const style =
                                TYPE_STYLES[notification.type] || TYPE_STYLES.info;
                            return (
                                <Card
                                    key={notification._id}
                                    className={`overflow-hidden cursor-pointer transition-all hover:shadow-md border ${!notification.isRead
                                            ? 'bg-white border-pink-200 shadow-sm'
                                            : 'bg-white/70 border-gray-100'
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div
                                                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border text-xl ${style.bg} ${style.border}`}
                                            >
                                                {notification.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p
                                                                className={`text-sm leading-snug ${!notification.isRead
                                                                        ? 'font-bold text-gray-900'
                                                                        : 'font-medium text-gray-700'
                                                                    }`}
                                                            >
                                                                {notification.title}
                                                            </p>
                                                            <span
                                                                className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${style.bg} ${style.border} border`}
                                                            >
                                                                {style.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">
                                                            {notification.message}
                                                        </p>
                                                    </div>

                                                    {/* Unread indicator */}
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMarkAsRead(notification._id);
                                                            }}
                                                            className="flex-shrink-0 p-1 rounded-full hover:bg-pink-100 transition-colors group"
                                                            title="Marcar como leída"
                                                        >
                                                            <div className="w-2.5 h-2.5 bg-pink-500 rounded-full group-hover:hidden" />
                                                            <Check className="w-3.5 h-3.5 text-pink-500 hidden group-hover:block" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-400">
                                                        {timeAgo(notification.createdAt)}
                                                    </span>
                                                    {notification.actionUrl &&
                                                        notification.actionText && (
                                                            <span className="text-xs text-pink-500 font-medium flex items-center gap-1 hover:text-pink-600">
                                                                {notification.actionText}
                                                                <ExternalLink className="w-3 h-3" />
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Load more */}
                        {hasMore && activeFilter === 'all' && (
                            <div className="text-center pt-4">
                                <Button
                                    onClick={handleLoadMore}
                                    variant="ghost"
                                    disabled={loadingMore}
                                    className="text-pink-600"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Cargando...
                                        </>
                                    ) : (
                                        'Cargar más'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}