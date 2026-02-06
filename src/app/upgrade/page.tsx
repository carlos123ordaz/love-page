'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Crown, Check, Sparkles, Zap, Heart, Infinity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UpgradePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const [loading, setLoading] = useState(false);

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

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const { data } = await api.payments.createProPayment();
            console.log('✅ Preferencia creada:', data.data);
            console.log('🔗 Init Point:', data.data.initPoint);

            // Abrir en nueva ventana para evitar problemas con tarjetas guardadas
            const checkoutUrl = data.data.sandboxInitPoint || data.data.initPoint;
            const newWindow = window.open(checkoutUrl, '_blank');
            if (!newWindow) {
                window.location.href = checkoutUrl;
            }
            setLoading(false);
        } catch (error: any) {
            console.error('❌ Error creating payment:', error);
            toast.error(error.response?.data?.message || 'Error al procesar el pago');
            setLoading(false);
        }
    };

    // SOLO PARA DESARROLLO - Simular pago exitoso
    const handleSimulatePayment = async () => {
        setLoading(true);
        try {
            await api.payments.simulateSuccess();
            toast.success('¡Pago simulado exitosamente!');
            setTimeout(() => {
                router.push('/payment/success');
            }, 500);
        } catch (error: any) {
            console.error('Error simulating payment:', error);
            toast.error('Error al simular pago');
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
                    <Card className="border-4 border-amber-400 shadow-2xl mb-12 overflow-hidden">
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
                                <span className="text-5xl font-bold text-gray-900">$3</span>
                                <span className="text-gray-600 text-xl"> USD</span>
                            </div>
                            <CardDescription className="text-lg">
                                Pago único • Acceso permanente
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
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
                                            Diseño con IA (Gemini 2.0)
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
                            </div>

                            <div className="pt-6 border-t space-y-3">
                                <Button
                                    onClick={handleUpgrade}
                                    loading={loading}
                                    className="w-full h-14 text-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white shadow-lg"
                                >
                                    <Crown className="w-5 h-5 mr-2" />
                                    Actualizar a PRO por $3 USD
                                </Button>


                                <p className="text-center text-sm text-gray-500 mt-4">
                                    Pago seguro procesado por Mercado Pago
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
                                    5 páginas máximo
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
                                    Diseño con IA Gemini 2.0
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

                    {/* FAQ */}
                    <div className="mt-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
                        <div className="grid gap-4 text-left">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">¿Es un pago único o suscripción?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Es un pago único de $3 USD. Una vez que pagas, tienes acceso PRO para
                                        siempre, sin renovaciones ni cargos adicionales.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">¿Cómo funciona el diseño con IA?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Subes una imagen de referencia (ej: una tarjeta que te guste) y nuestra
                                        IA analiza el estilo y genera HTML/CSS personalizado manteniendo tu
                                        contenido.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">¿Métodos de pago aceptados?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Aceptamos todos los métodos disponibles en Mercado Pago Perú: tarjetas
                                        de crédito, débito, y pagos en efectivo.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}