'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import {
    ArrowLeft,
    MessageCircle,
    Mail,
    Clock,
    CheckCircle2,
    User,
    AlertCircle,
    Reply,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContactDetail {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    type: string;
    status: string;
    adminReply: string | null;
    adminRepliedAt: string | null;
    createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    in_progress: { label: 'En progreso', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    resolved: { label: 'Respondido', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    closed: { label: 'Cerrado', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
};

const TYPE_MAP: Record<string, string> = {
    comment: 'Comentario',
    custom_page: 'Página personalizada',
    support: 'Soporte',
    other: 'Otro',
};

function timeAgo(date: string) {
    try {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
    } catch {
        return '';
    }
}

function formatDate(date: string) {
    try {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '';
    }
}

export default function ContactDetailPage() {
    const params = useParams();
    const router = useRouter();
    const contactId = params.id as string;
    const { user, loading: authLoading } = useAuthStore();

    const [contact, setContact] = useState<ContactDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (contactId) {
            loadContact();
        }
    }, [contactId]);

    const loadContact = async () => {
        try {
            setLoading(true);
            const { data } = await api.contact.getMyMessage(contactId);
            setContact(data.data);
        } catch (err: any) {
            console.error('Error loading contact:', err);
            setError(true);
            if (err.response?.status === 404) {
                toast.error('Mensaje no encontrado');
            } else if (err.response?.status === 403) {
                toast.error('No tienes permiso para ver este mensaje');
            } else {
                toast.error('Error al cargar el mensaje');
            }
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
                <Header />
                <main className="container px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" />
                    </div>
                </main>
            </div>
        );
    }

    if (error || !contact) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
                <Header />
                <main className="container px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">
                    <div className="text-center py-16">
                        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Mensaje no encontrado
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            El mensaje que buscas no existe o no tienes permiso para verlo.
                        </p>
                        <Link href="/notifications">
                            <Button>Volver a notificaciones</Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const status = STATUS_MAP[contact.status] || STATUS_MAP.pending;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-2xl mx-auto">
                {/* Back + title */}
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/notifications">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Detalle del mensaje
                        </h1>
                        <p className="text-sm text-gray-500">Conversación de soporte</p>
                    </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${status.bg} ${status.color}`}>
                        {contact.status === 'resolved' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                            <Clock className="w-3.5 h-3.5" />
                        )}
                        {status.label}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                        {TYPE_MAP[contact.type] || contact.type}
                    </span>
                </div>

                {/* Conversation */}
                <div className="space-y-4">
                    {/* Tu mensaje original */}
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-pink-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {contact.name}
                                        </span>
                                        <span className="text-xs text-gray-400">(Tú)</span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {timeAgo(contact.createdAt)}
                                    </span>

                                    <h3 className="text-base font-bold text-gray-900 mt-3">
                                        {contact.subject}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">
                                        {contact.message}
                                    </p>

                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">
                                            <Mail className="w-3 h-3 inline mr-1" />
                                            {contact.email} · {formatDate(contact.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Respuesta del admin */}
                    {contact.adminReply ? (
                        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                                        <Reply className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold text-gray-900">
                                                Love Pages — Soporte
                                            </span>
                                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                                                EQUIPO
                                            </span>
                                        </div>
                                        {contact.adminRepliedAt && (
                                            <span className="text-xs text-gray-400">
                                                {timeAgo(contact.adminRepliedAt)}
                                            </span>
                                        )}

                                        <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap leading-relaxed">
                                            {contact.adminReply}
                                        </p>

                                        {contact.adminRepliedAt && (
                                            <div className="mt-3 pt-3 border-t border-green-100">
                                                <p className="text-xs text-gray-400">
                                                    <CheckCircle2 className="w-3 h-3 inline mr-1 text-green-500" />
                                                    Respondido el {formatDate(contact.adminRepliedAt)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border border-dashed border-gray-200 shadow-none">
                            <CardContent className="p-5 text-center">
                                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                    Tu mensaje está siendo revisado. Te notificaremos cuando tengamos una respuesta.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <Link href="/notifications" className="flex-1">
                        <Button variant="ghost" className="w-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Notificaciones
                        </Button>
                    </Link>
                    <Link href="/contact" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Nuevo mensaje
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}