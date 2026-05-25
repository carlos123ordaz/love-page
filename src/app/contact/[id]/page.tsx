'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
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

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: 'Pendiente', bg: 'var(--paper-2)', color: 'var(--ink-black)' },
    in_progress: { label: 'En progreso', bg: 'var(--lila-2)', color: 'var(--ink-black)' },
    resolved: { label: 'Respondido', bg: 'var(--ink-blue)', color: 'var(--paper)' },
    closed: { label: 'Cerrado', bg: 'var(--ink-black)', color: 'var(--paper)' },
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
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
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

    useEffect(() => { if (contactId) loadContact(); }, [contactId]);

    const loadContact = async () => {
        try {
            setLoading(true);
            const { data } = await api.contact.getMyMessage(contactId);
            setContact(data.data);
        } catch (err: any) {
            setError(true);
            if (err.response?.status === 404) toast.error('Mensaje no encontrado');
            else if (err.response?.status === 403) toast.error('No tienes permiso para ver este mensaje');
            else toast.error('Error al cargar el mensaje');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
                <Header />
                <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid var(--lila)', borderTopColor: 'var(--ink-red)', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </main>
            </div>
        );
    }

    if (error || !contact) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
                <Header />
                <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <AlertCircle style={{ width: 48, height: 48, color: 'var(--ink-soft)', margin: '0 auto 16px' }} />
                    <h2 className="serif-display" style={{ fontSize: 28, marginBottom: 8 }}>mensaje no encontrado</h2>
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>
                        El mensaje que buscas no existe o no tienes permiso para verlo.
                    </p>
                    <Link href="/notifications">
                        <button className="btn-ink" style={{ padding: '10px 20px', fontSize: 12 }}>volver a notificaciones</button>
                    </Link>
                </main>
            </div>
        );
    }

    const statusStyle = STATUS_STYLE[contact.status] || STATUS_STYLE.pending;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Header />

            <main style={{ maxWidth: 640, margin: '0 auto' }} className="px-5 py-10 sm:px-10">

                {/* Masthead */}
                <div style={{ borderBottom: '3px double var(--ink-black)', paddingBottom: 10, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <Link href="/notifications" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)', textDecoration: 'none', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        <ArrowLeft style={{ width: 12, height: 12 }} /> notificaciones
                    </Link>
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-red)' }}>★ soporte</span>
                </div>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(24px, 4vw, 40px)', margin: '0 0 12px', lineHeight: 0.9 }}>
                        <span className="mis-red">detalle del</span>{' '}
                        <span className="mis-blue">mensaje</span>
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: statusStyle.bg, color: statusStyle.color, border: '1.5px solid var(--ink-black)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {contact.status === 'resolved' ? <CheckCircle2 style={{ width: 10, height: 10 }} /> : <Clock style={{ width: 10, height: 10 }} />}
                            {statusStyle.label}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{TYPE_MAP[contact.type] || contact.type}</span>
                    </div>
                </div>

                {/* Tu mensaje */}
                <div style={{ border: '1.5px solid var(--ink-black)', background: 'var(--paper-soft)', marginBottom: 0 }}>
                    <div style={{ padding: '10px 16px', borderBottom: '1.5px solid var(--ink-black)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--paper-2)' }}>
                        <User style={{ width: 12, height: 12, color: 'var(--ink-red)' }} />
                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{contact.name}</span>
                        <span style={{ fontSize: 10, color: 'var(--ink-soft)' }}>(tú) · {timeAgo(contact.createdAt)}</span>
                    </div>
                    <div style={{ padding: '20px 24px' }}>
                        <h3 style={{ fontFamily: 'var(--display)', fontSize: 18, textTransform: 'uppercase', color: 'var(--ink-black)', marginBottom: 12, letterSpacing: '0.02em' }}>
                            {contact.subject}
                        </h3>
                        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                            {contact.message}
                        </p>
                        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--rule)', fontSize: 11, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Mail style={{ width: 11, height: 11 }} />
                            {contact.email} · {formatDate(contact.createdAt)}
                        </div>
                    </div>
                </div>

                {/* Respuesta del admin */}
                {contact.adminReply ? (
                    <div style={{ border: '1.5px solid var(--ink-black)', borderTop: 'none', background: 'var(--paper)', marginBottom: 32 }}>
                        <div style={{ padding: '10px 16px', borderBottom: '1.5px solid var(--ink-black)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ink-blue)' }}>
                            <Reply style={{ width: 12, height: 12, color: 'var(--paper)' }} />
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--paper)' }}>Love Pages — Soporte</span>
                            <span style={{ padding: '1px 6px', background: 'rgba(248,241,222,0.2)', border: '1px solid rgba(248,241,222,0.4)', fontSize: 9, fontWeight: 700, color: 'var(--paper)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>EQUIPO</span>
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            {contact.adminRepliedAt && (
                                <p style={{ fontSize: 10, color: 'var(--ink-soft)', marginBottom: 12, fontFamily: 'var(--mono)' }}>{timeAgo(contact.adminRepliedAt)}</p>
                            )}
                            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                                {contact.adminReply}
                            </p>
                            {contact.adminRepliedAt && (
                                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--rule)', fontSize: 11, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <CheckCircle2 style={{ width: 11, height: 11, color: 'var(--ink-blue)' }} />
                                    Respondido el {formatDate(contact.adminRepliedAt)}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ border: '1.5px dashed var(--ink-black)', borderTop: 'none', padding: '24px', textAlign: 'center', background: 'var(--paper-soft)', marginBottom: 32 }}>
                        <Clock style={{ width: 24, height: 24, color: 'var(--ink-soft)', margin: '0 auto 10px' }} />
                        <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                            Tu mensaje está siendo revisado. Te notificaremos cuando tengamos una respuesta.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link href="/notifications" style={{ flex: 1 }}>
                        <button className="btn-ink" style={{ width: '100%', padding: '12px 16px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <ArrowLeft style={{ width: 13, height: 13 }} /> notificaciones
                        </button>
                    </Link>
                    <Link href="/contact" style={{ flex: 1 }}>
                        <button className="btn-accent" style={{ width: '100%', padding: '12px 16px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <MessageCircle style={{ width: 13, height: 13 }} /> nuevo mensaje
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
