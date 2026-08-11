'use client';

import { useState } from 'react';
import { signInWithPopup, Auth, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Pide la sesión sin sacar al usuario de donde está.
 *
 * El editor deja diseñar sin cuenta, así que la sesión se pide al publicar.
 * Mandar a /login en ese momento significaría abandonar el borrador a medio
 * hacer: por eso el popup de Google se abre sobre el propio editor y, al
 * volver, la acción que lo disparó continúa sola.
 */
export function LoginGateModal({
    isOpen,
    onClose,
    onSuccess,
    title,
    description,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    title: string;
    description: string;
}) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        if (!auth || !googleProvider) {
            toast.error('Error: Firebase no está inicializado');
            return;
        }
        setLoading(true);
        try {
            await signInWithPopup(auth as Auth, googleProvider as GoogleAuthProvider);
            onSuccess?.();
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error('No se pudo iniciar sesión. Inténtalo otra vez.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={loading ? undefined : onClose} />

            <div
                className="relative w-full max-w-sm"
                style={{ background: 'var(--paper-soft)', border: '2px solid var(--ink-black)', boxShadow: '6px 6px 0 var(--ink-black)' }}
            >
                <button
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Cerrar"
                    style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', color: 'var(--ink-soft)', padding: 4, lineHeight: 0 }}
                >
                    <X style={{ width: 16, height: 16 }} />
                </button>

                <div style={{ padding: '32px 28px 28px' }}>
                    <span
                        className="mono-eyebrow"
                        style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--ink-red)', display: 'block', marginBottom: 12 }}
                    >
                        —— último paso
                    </span>

                    <h3
                        className="serif-display"
                        style={{ fontSize: 30, lineHeight: 0.95, margin: 0, color: 'var(--ink-black)' }}
                    >
                        {title}
                    </h3>

                    <p style={{ marginTop: 14, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, lineHeight: 1.5, color: 'var(--ink-black)' }}>
                        {description}
                    </p>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{
                            marginTop: 24, width: '100%',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            padding: '13px 18px',
                            background: 'var(--paper)',
                            border: '1.5px solid var(--ink-black)',
                            boxShadow: '3px 3px 0 var(--ink-black)',
                            color: 'var(--ink-black)',
                            fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {!loading && (
                            <svg style={{ width: 15, height: 15 }} viewBox="0 0 24 24" aria-hidden="true">
                                <path fill="var(--ink-red)" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="var(--ink-blue)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="var(--ink-soft)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="var(--ink-red)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {loading ? 'entrando…' : 'Continuar con Google'}
                    </button>

                    <p style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 10.5, lineHeight: 1.5, color: 'var(--ink-soft)', textAlign: 'center' }}>
                        Tu carta se queda como está mientras entras.
                    </p>
                </div>
            </div>
        </div>
    );
}
