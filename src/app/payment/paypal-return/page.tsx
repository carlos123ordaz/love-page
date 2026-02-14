'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

// Componente interno que usa useSearchParams
function PayPalReturnContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const token = searchParams.get('token'); // Order ID de PayPal
    const captureAttempted = useRef(false);

    useEffect(() => {
        // ✅ FIX: Esperar a que la autenticación se resuelva
        // El token de auth es necesario para el endpoint de captura
        if (authLoading) return;

        if (!user) {
            // Si no hay usuario autenticado, no podemos capturar
            // Redirigir al login o mostrar error
            router.push('/payment/failure?provider=paypal&reason=not_authenticated');
            return;
        }

        if (!token) {
            router.push('/payment/failure?provider=paypal&reason=no_token');
            return;
        }

        // ✅ FIX: Evitar doble ejecución con StrictMode de React
        if (captureAttempted.current) return;
        captureAttempted.current = true;

        // Capturar el pago de PayPal
        api.payments.capturePayPalPayment(token)
            .then((response) => {
                // Verificar que la respuesta indica éxito
                if (response.data?.success) {
                    router.push('/payment/success?provider=paypal');
                } else {
                    router.push('/payment/failure?provider=paypal&reason=capture_failed');
                }
            })
            .catch((error) => {
                console.error('Error capturing PayPal payment:', error);
                const reason = error.response?.data?.message || 'capture_failed';
                router.push(`/payment/failure?provider=paypal&reason=${encodeURIComponent(reason)}`);
            });
    }, [token, router, user, authLoading]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <div className="text-center space-y-4">
                <Loader2 className="w-16 h-16 text-pink-600 animate-spin mx-auto" />
                <h1 className="text-2xl font-bold text-gray-900">
                    Procesando tu pago...
                </h1>
                <p className="text-gray-600">
                    Estamos confirmando tu pago con PayPal
                </p>
                <p className="text-sm text-gray-500">
                    No cierres esta ventana
                </p>
            </div>
        </div>
    );
}

// Componente principal con Suspense
export default function PayPalReturnPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
                <Loader2 className="w-16 h-16 text-pink-600 animate-spin" />
            </div>
        }>
            <PayPalReturnContent />
        </Suspense>
    );
}