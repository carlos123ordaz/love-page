'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Heart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProPageRenderer } from '@/components/ProPageRenderer';

export default function PublicPageView() {
    const params = useParams();
    const shortId = params.shortId as string;
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        loadPage();
    }, [shortId]);

    const loadPage = async () => {
        try {
            const { data } = await api.pages.getByShortId(shortId);
            setPage(data.data);
        } catch (error) {
            toast.error('Página no encontrada');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (answer: 'yes' | 'no') => {
        if (answered) return;

        try {
            await api.pages.respond(shortId, answer);
            setAnswered(true);
            setSelectedAnswer(answer);

            if (answer === 'yes') {
                toast.success('¡Qué alegría! 💕', {
                    duration: 4000,
                    icon: '💖',
                });
            } else {
                toast('Respuesta registrada', {
                    duration: 3000,
                    icon: '😊',
                });
            }
        } catch (error) {
            toast.error('Error al enviar respuesta');
        }
    };

    const handleNoButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!page?.noButtonEscapes || answered) return;

        const button = e.currentTarget;
        const maxX = window.innerWidth - button.offsetWidth - 20;
        const maxY = window.innerHeight - button.offsetHeight - 20;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        button.style.position = 'fixed';
        button.style.left = `${randomX}px`;
        button.style.top = `${randomY}px`;
        button.style.transition = 'all 0.3s ease';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Página no encontrada</h1>
                    <p className="text-gray-600">Esta página no existe o ha sido eliminada</p>
                </div>
            </div>
        );
    }

    // Si es página PRO con HTML personalizado - USAR EL NUEVO COMPONENTE
    if (page.pageType === 'pro' && page.customHTML && page.customCSS) {
        return (
            <>
                {answered && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-bounce-soft">
                            <div className="text-6xl mb-4">
                                {selectedAnswer === 'yes' ? '💕' : '😊'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {selectedAnswer === 'yes' ? '¡Gracias!' : 'Entendido'}
                            </h2>
                            <p className="text-gray-600">
                                Tu respuesta ha sido registrada
                            </p>
                        </div>
                    </div>
                )}

                <ProPageRenderer
                    html={page.customHTML}
                    css={page.customCSS}
                    noButtonEscapes={page.noButtonEscapes && !answered}
                    onYesClick={() => handleAnswer('yes')}
                    onNoClick={() => handleAnswer('no')}
                />
            </>
        );
    }

    // Página FREE con diseño predefinido
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 transition-all"
            style={{ backgroundColor: page.backgroundColor, color: page.textColor }}
        >
            <div className="max-w-2xl w-full text-center animate-fade-in">
                <div className="mb-8">
                    <Heart className="w-20 h-20 mx-auto mb-6 animate-heart-beat" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-bounce-soft">
                    {page.title}
                </h1>

                <div className="text-2xl md:text-3xl mb-4">
                    <span className="font-semibold">{page.recipientName}</span>
                </div>

                {page.message && (
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-xl mx-auto">
                        {page.message}
                    </p>
                )}

                {!answered ? (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                        <button
                            onClick={() => handleAnswer('yes')}
                            className="px-8 py-4 text-lg font-semibold bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-all hover:scale-105 min-w-[150px]"
                            style={{ color: page.textColor }}
                        >
                            {page.yesButtonText}
                        </button>

                        <button
                            ref={noButtonRef}
                            onMouseEnter={handleNoButtonMouseEnter}
                            onClick={() => !page.noButtonEscapes && handleAnswer('no')}
                            className="px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all min-w-[150px]"
                            style={{ color: page.textColor }}
                        >
                            {page.noButtonText}
                        </button>
                    </div>
                ) : (
                    <div className="mt-12 p-6 bg-white/20 backdrop-blur rounded-xl inline-block">
                        <div className="text-2xl font-semibold mb-2">
                            {selectedAnswer === 'yes' ? '¡Gracias! 💕' : 'Entendido 😊'}
                        </div>
                        <p className="text-sm opacity-90">Tu respuesta ha sido registrada</p>
                    </div>
                )}
            </div>
        </div>
    );
}