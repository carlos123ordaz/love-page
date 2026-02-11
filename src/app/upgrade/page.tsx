'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Crown, Check, Sparkles, Zap, Heart, Infinity, CreditCard, LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

// Logos (puedes usar imágenes reales o iconos)
const MercadoPagoLogo = () => (
    <div className="flex items-center gap-2 text-blue-600 font-bold">
        <CreditCard className="w-5 h-5" />
        <span>Mercado Pago</span>
    </div>
);

const PayPalLogo = () => (
    <div className="flex items-center gap-2 text-[#0070ba] font-bold">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.129a.773.773 0 0 1 .762-.644h8.37c2.726 0 4.597 1.347 5.017 3.625.357 1.938-.047 3.403-1.198 4.357-1.187 1.054-3.004 1.522-5.392 1.522H8.815l-1.046 5.603a.633.633 0 0 1-.693.745zm13.356-7.666c-.365 2.07-1.354 3.574-3.045 4.484-1.55.834-3.574 1.186-5.975 1.186h-1.76l.786-4.414h1.76c1.83 0 3.278-.407 4.284-1.186 1.005-.778 1.487-1.928 1.487-3.416 0-1.057-.244-1.855-.732-2.393-.488-.539-1.279-.809-2.373-.809h-5.39l-2.35 12.486a.641.641 0 0 1-.633.74H2.47a.641.641 0 0 1-.633-.74L4.944 3.129a.773.773 0 0 1 .762-.644h8.37c2.726 0 4.597 1.347 5.017 3.625.357 1.938-.047 3.403-1.198 4.357z" />
        </svg>
        <span>PayPal</span>
    </div>
);

type PaymentProvider = 'mercadopago' | 'paypal';

export default function UpgradePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('mercadopago');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.isPro) {
            toast.success('¡Ya eres usuario PRO!');
            router.push('/dashboard');
        }
    }, [user, router]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            if (selectedProvider === 'mercadopago') {
                const { data } = await api.payments.createMercadoPagoPayment();

                const checkoutUrl = data.data.initPoint;
                const newWindow = window.open(checkoutUrl, '_blank');
                if (!newWindow) {
                    window.location.href = checkoutUrl;
                }
            } else {
                // PayPal
                const { data } = await api.payments.createPayPalOrder();

                const approvalUrl = data.data.approvalUrl;
                const newWindow = window.open(approvalUrl, '_blank');
                if (!newWindow) {
                    window.location.href = approvalUrl;
                }
            }

            setLoading(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al procesar el pago');
            setLoading(false);
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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
            <Header />

            <main className="container py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full mb-6">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Upgrade a Love Pages PRO
                        </h1>
                        <p className="text-xl text-gray-600">
                            Desbloquea el poder de la IA y crea páginas ilimitadas
                        </p>
                    </div>

                    {/* Pricing Card */}
                    <Card className="border-4 border-amber-400 shadow-2xl mb-8 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white py-3 px-6">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">¡Oferta Especial!</span>
                                <span className="text-sm">Pago único</span>
                            </div>
                        </div>

                        <CardHeader className="text-center pb-4">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <Crown className="w-8 h-8 text-amber-500" />
                                <CardTitle className="text-3xl">Plan PRO</CardTitle>
                            </div>
                            <div className="mb-4">
                                <span className="text-5xl font-bold text-gray-900">$1.39</span>
                                <span className="text-gray-600 text-xl"> USD</span>
                            </div>
                            <CardDescription className="text-lg">
                                Pago único • Acceso permanente
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Features */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Infinity className="w-5 h-5 text-amber-500" />
                                            Páginas Ilimitadas
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Crea tantas páginas como desees, sin restricciones
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-amber-500" />
                                            Diseño con IA
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Sube una imagen y la IA creará un diseño personalizado único
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-amber-500" />
                                            Personalización Total
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            HTML/CSS generado específicamente para tu estilo
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-amber-500" />
                                            Soporte Prioritario
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Atención rápida para usuarios PRO
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <LinkIcon className="w-5 h-5 text-amber-500" />
                                            Enlace con su nombre 💕
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            En lugar de un link aleatorio, será algo como:
                                        </p>
                                        <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1 text-pink-600 font-bold">
                                            lovepages.ink/para-maria
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Es lo primero que verá cuando abra tu detalle 💖
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Payment Method Selection */}
                            <div className="pt-6 border-t">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Selecciona tu método de pago:
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedProvider('mercadopago')}
                                        className={`p-4 border-2 rounded-lg transition-all ${selectedProvider === 'mercadopago'
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <MercadoPagoLogo />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Tarjetas, efectivo y más
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => setSelectedProvider('paypal')}
                                        className={`p-4 border-2 rounded-lg transition-all ${selectedProvider === 'paypal'
                                            ? 'border-[#0070ba] bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <PayPalLogo />
                                        <p className="text-xs text-gray-500 mt-2">
                                            PayPal, tarjetas
                                        </p>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <div className="pt-3 space-y-3">
                                <Button
                                    onClick={handlePayment}
                                    loading={loading}
                                    className="w-full h-14 text-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white shadow-lg"
                                >
                                    <Crown className="w-5 h-5 mr-2" />
                                    Pagar $1.39 USD con {selectedProvider === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}
                                </Button>

                                <p className="text-center text-sm text-gray-500">
                                    Pago seguro procesado por {selectedProvider === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Plan Gratuito</CardTitle>
                                <CardDescription>Lo que tienes actualmente</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check className="w-4 h-4" />
                                    1 página máximo
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check className="w-4 h-4" />
                                    4 temas prediseñados
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check className="w-4 h-4" />
                                    Personalización básica
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    ✗ Sin diseño con IA
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-amber-400 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-sm font-semibold rounded-full">
                                Recomendado
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-amber-500" />
                                    Plan PRO
                                </CardTitle>
                                <CardDescription>Desbloquea todo el potencial</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                    <Check className="w-4 h-4 text-green-600" />
                                    Páginas ilimitadas
                                </div>
                                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                    <Check className="w-4 h-4 text-green-600" />
                                    Diseño con IA
                                </div>
                                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                    <Check className="w-4 h-4 text-green-600" />
                                    Personalización total
                                </div>
                                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                    <Check className="w-4 h-4 text-green-600" />
                                    Soporte prioritario
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}