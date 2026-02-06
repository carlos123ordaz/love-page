'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const { width, height } = useWindowSize();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={500}
            />
            <Header />

            <main className="container py-12">
                <div className="max-w-2xl mx-auto">
                    <Card className="text-center border-2 border-green-200">
                        <CardContent className="pt-12 pb-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                ¡Pago Exitoso! 🎉
                            </h1>

                            <p className="text-lg text-gray-600 mb-8">
                                Ahora eres miembro <span className="font-bold text-amber-600">PRO</span>
                            </p>

                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-8">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Crown className="w-6 h-6 text-amber-600" />
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Beneficios Activados
                                    </h2>
                                </div>
                                <ul className="space-y-3 text-left max-w-md mx-auto">
                                    <li className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                        <span>Páginas ilimitadas disponibles</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                        <span>Diseño con IA activado</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                        <span>Personalización total desbloqueada</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/create">
                                    <Button variant="gradient" size="lg">
                                        <Crown className="w-5 h-5 mr-2" />
                                        Crear Página PRO
                                    </Button>
                                </Link>
                                <Link href="/dashboard">
                                    <Button variant="outline" size="lg">
                                        Ir al Dashboard
                                    </Button>
                                </Link>
                            </div>

                            <p className="text-sm text-gray-500 mt-8">
                                Puedes cerrar esta ventana o continuar explorando
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}