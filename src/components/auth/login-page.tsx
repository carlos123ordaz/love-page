'use client';

import { useState } from 'react';
import { signInWithPopup, Auth, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';

export function LoginButton() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        // Validar que Firebase esté inicializado
        if (!auth || !googleProvider) {
            toast.error('Error: Firebase no está inicializado');
            console.error('Firebase auth or googleProvider is undefined');
            return;
        }

        setLoading(true);
        try {
            // Type assertion seguro después de verificar
            await signInWithPopup(auth as Auth, googleProvider as GoogleAuthProvider);
            toast.success('¡Bienvenido!');
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error('Error al iniciar sesión');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleGoogleLogin}
            loading={loading}
            variant="gradient"
            size="lg"
            className="gap-2"
        >
            {!loading && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
            )}
            Continuar con Google
        </Button>
    );
}

export function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-6 animate-heart-beat">
                        <Heart className="w-10 h-10 text-white fill-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Love Pages</h1>
                    <p className="text-lg text-gray-600">
                        Crea páginas personalizadas para ocasiones especiales
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <span className="text-pink-600 font-semibold text-sm">1</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Crea tu página</h3>
                                <p className="text-sm text-gray-600">
                                    Personaliza el título, mensaje y diseño
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <span className="text-pink-600 font-semibold text-sm">2</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Comparte el enlace</h3>
                                <p className="text-sm text-gray-600">
                                    Envía la URL única a esa persona especial
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <span className="text-pink-600 font-semibold text-sm">3</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Recibe la respuesta</h3>
                                <p className="text-sm text-gray-600">
                                    Ve en tiempo real cuando respondan
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t text-center">
                        <LoginButton />
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Al continuar, aceptas nuestros términos y condiciones
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-pink-500" />
                            <span>2 páginas gratis</span>
                        </div>
                        <span>•</span>
                        <div>
                            <span>PRO por solo $3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}