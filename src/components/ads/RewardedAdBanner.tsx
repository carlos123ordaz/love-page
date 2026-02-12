// ================================================================
// components/ads/RewardedAdBanner.tsx
// Banner que aparece cuando el usuario se queda sin páginas
// Usa AdSense Offerwall en producción, simulación en localhost
// ================================================================

'use client';

import { useState, useEffect } from 'react';
import { Crown, Play, Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

// ================================================================
// Tipos para Google Funding Choices (googlefc)
// ================================================================
declare global {
    interface Window {
        googlefc: {
            callbackQueue: Array<Record<string, () => void> | (() => void)>;
            showRevocationMessage: () => void;
            getAdBlockerStatus?: () => number;
            AdBlockerStatusEnum?: {
                NO_AD_BLOCKER: number;
                AD_BLOCKER_DETECTED: number;
            };
        };
    }
}

interface RewardedAdBannerProps {
    context: 'dashboard' | 'create';
    onRewardEarned?: () => void;
    compact?: boolean;
}

// Detectar si estamos en desarrollo/localhost
const isDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export function RewardedAdBanner({ context, onRewardEarned, compact = false }: RewardedAdBannerProps) {
    const { user, setUser } = useAuthStore();
    const [showingAd, setShowingAd] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [rewardEarned, setRewardEarned] = useState(false);

    // Inicializar googlefc solo en producción
    useEffect(() => {
        if (typeof window === 'undefined' || isDev) return;

        window.googlefc = window.googlefc || {
            callbackQueue: [],
            showRevocationMessage: () => { },
        };
        window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    }, []);

    // No mostrar si ya es PRO, puede crear páginas, o fue cerrado
    if (!user || user.isPro || user.canCreatePage || dismissed) return null;

    const dailyAdViews = user.dailyAdViews || 0;
    const MAX_DAILY_ADS = 3;

    if (dailyAdViews >= MAX_DAILY_ADS && !rewardEarned) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">
                    Ya usaste tus {MAX_DAILY_ADS} recompensas de hoy. Vuelve mañana o{' '}
                    <a href="/upgrade" className="text-amber-600 font-semibold hover:underline">
                        pasa a PRO
                    </a>{' '}
                    para páginas ilimitadas.
                </p>
            </div>
        );
    }

    const handleWatchAd = async () => {
        setShowingAd(true);

        try {
            // 1. Solicitar token de recompensa al backend
            const { data } = await api.rewards.requestReward();
            const rewardToken = data.data.token;

            // 2. Mostrar el anuncio (simulado en dev, real en producción)
            const adCompleted = isDev
                ? await showSimulatedAd()
                : await showAdSenseOfferwall();

            if (adCompleted) {
                // 3. Confirmar la recompensa en el backend
                const { data: rewardData } = await api.rewards.confirmReward(rewardToken);
                const updatedUser = rewardData.data.user;

                // 4. Actualizar estado del usuario
                setUser(updatedUser);
                setRewardEarned(true);

                toast.success('🎉 ¡Ganaste 1 página extra!', { duration: 4000 });
                onRewardEarned?.();
            } else {
                toast('Necesitas completar el anuncio para ganar la recompensa', {
                    icon: '⏭️',
                });
            }
        } catch (error: any) {
            console.error('Error en anuncio recompensado:', error);
            toast.error(error.response?.data?.message || 'Error al procesar recompensa');
        } finally {
            setShowingAd(false);
        }
    };

    // Ya ganó la recompensa
    if (rewardEarned) {
        return (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 text-center animate-fadeIn">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-bold text-green-800">¡Página extra desbloqueada!</p>
                <p className="text-sm text-green-600 mt-1">Ya puedes crear una nueva página</p>
            </div>
        );
    }

    // ---- Versión compacta (inline en el dashboard) ----
    // if (compact) {
    //     return (
    //         <div className="relative bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 flex items-center gap-3">
    //             <button
    //                 onClick={() => setDismissed(true)}
    //                 className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
    //             >
    //                 <X className="w-4 h-4" />
    //             </button>
    //             <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
    //                 <Gift className="w-5 h-5 text-purple-600" />
    //             </div>
    //             <div className="flex-1 min-w-0">
    //                 <p className="text-sm font-semibold text-gray-900">
    //                     ¿Quieres otra página gratis?
    //                 </p>
    //                 <p className="text-xs text-gray-600">
    //                     Mira un breve anuncio y gana 1 página extra ({MAX_DAILY_ADS - dailyAdViews}{' '}
    //                     restantes hoy)
    //                 </p>
    //             </div>
    //             <Button
    //                 onClick={handleWatchAd}
    //                 disabled={showingAd}
    //                 size="sm"
    //                 className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white gap-1"
    //             >
    //                 <Play className="w-3.5 h-3.5" />
    //                 {showingAd ? 'Cargando...' : 'Ver anuncio'}
    //             </Button>
    //         </div>
    //     );
    // }

    // ---- Versión completa (en la página de crear) ----
    // return (
    //     <div className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-300 rounded-2xl p-6 sm:p-8 text-center overflow-hidden">
    //         <button
    //             onClick={() => setDismissed(true)}
    //             className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
    //         >
    //             <X className="w-5 h-5" />
    //         </button>

    //         <div className="absolute inset-0 pointer-events-none overflow-hidden">
    //             <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl" />
    //             <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl" />
    //         </div>

    //         <div className="relative z-10">
    //             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
    //                 <Gift className="w-8 h-8 text-white" />
    //             </div>

    //             <h3 className="text-xl font-bold text-gray-900 mb-2">
    //                 ¡Gana una página extra gratis! 🎁
    //             </h3>

    //             <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
    //                 Has usado tu página gratuita. Mira un breve anuncio y desbloquea
    //                 <strong> 1 página adicional</strong> al instante.
    //             </p>

    //             <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
    //                 <Button
    //                     onClick={handleWatchAd}
    //                     disabled={showingAd}
    //                     className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 px-6 py-3 text-base shadow-lg shadow-purple-500/20"
    //                 >
    //                     <Play className="w-5 h-5" />
    //                     {showingAd ? 'Mostrando anuncio...' : 'Ver anuncio (~15 seg)'}
    //                 </Button>
    //             </div>

    //             <p className="text-xs text-gray-500">
    //                 {MAX_DAILY_ADS - dailyAdViews} de {MAX_DAILY_ADS} recompensas disponibles hoy
    //             </p>

    //             <div className="mt-5 pt-5 border-t border-purple-200">
    //                 <p className="text-xs text-gray-500 mb-2">¿Prefieres no ver anuncios?</p>
    //                 <a
    //                     href="/upgrade"
    //                     className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
    //                 >
    //                     <Crown className="w-4 h-4" />
    //                     Pasa a PRO por $1.75 — Páginas ilimitadas
    //                 </a>
    //             </div>
    //         </div>
    //     </div>
    // );
}

// ================================================================
// SIMULACIÓN para desarrollo en localhost
// ================================================================
async function showSimulatedAd(): Promise<boolean> {
    return new Promise((resolve) => {
        console.log('[Offerwall] 🧪 Modo desarrollo - simulando anuncio...');
        const confirmed = window.confirm(
            '🎬 [SIMULACIÓN DE ANUNCIO]\n\n' +
            'En producción aquí aparecería el Offerwall de AdSense.\n\n' +
            '¿Simular que completaste el anuncio?'
        );
        setTimeout(() => resolve(confirmed), 300);
    });
}

// ================================================================
// PRODUCCIÓN: Offerwall de AdSense (googlefc)
// ================================================================
async function showAdSenseOfferwall(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(false);
            return;
        }

        if (!window.googlefc) {
            console.error('[Offerwall] googlefc no disponible.');
            resolve(false);
            return;
        }

        let resolved = false;

        const handleResult = (success: boolean) => {
            if (!resolved) {
                resolved = true;
                resolve(success);
            }
        };

        try {
            window.googlefc.showRevocationMessage();

            const observer = new MutationObserver(() => {
                const offerwallFrame = document.querySelector(
                    'iframe[src*="fundingchoices"], ' +
                    'iframe[src*="googlefc"], ' +
                    'div[class*="fc-dialog"], ' +
                    '.fc-consent-root, ' +
                    'div[id*="googlefc"]'
                );

                if (!offerwallFrame) {
                    observer.disconnect();
                    // El Offerwall se cerró — la validación real es el token del backend
                    console.log('[Offerwall] Cerrado - otorgando recompensa');
                    handleResult(true);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            // Timeout: 60 segundos
            setTimeout(() => {
                observer.disconnect();
                handleResult(false);
            }, 60000);
        } catch (error) {
            console.error('[Offerwall] Error:', error);
            handleResult(false);
        }
    });
}