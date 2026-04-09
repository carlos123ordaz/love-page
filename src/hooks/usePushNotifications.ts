'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from(Array.from(rawData).map((c) => c.charCodeAt(0)));
}

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported';

export function usePushNotifications() {
    const [permission, setPermission] = useState<PushPermission>('default');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
            setPermission('unsupported');
            return;
        }
        setPermission(Notification.permission as PushPermission);
    }, []);

    const subscribe = useCallback(async (): Promise<boolean> => {
        if (permission === 'unsupported') return false;
        setLoading(true);

        try {
            // 1. Registrar service worker
            const reg = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            // 2. Pedir permiso
            const result = await Notification.requestPermission();
            setPermission(result as PushPermission);
            if (result !== 'granted') return false;

            // 3. Obtener clave pública VAPID
            const { data } = await api.notifications.getVapidPublicKey();
            const applicationServerKey = urlBase64ToUint8Array(data.data.publicKey);

            // 4. Suscribirse al push manager
            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });

            // 5. Enviar suscripción al backend
            await api.notifications.subscribePush(subscription.toJSON());
            return true;
        } catch (err) {
            console.error('Push subscribe error:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [permission]);

    const unsubscribe = useCallback(async (): Promise<boolean> => {
        setLoading(true);
        try {
            const reg = await navigator.serviceWorker.getRegistration('/sw.js');
            if (!reg) return false;

            const sub = await reg.pushManager.getSubscription();
            if (!sub) return false;

            await api.notifications.unsubscribePush({ endpoint: sub.endpoint });
            await sub.unsubscribe();
            setPermission('default');
            return true;
        } catch (err) {
            console.error('Push unsubscribe error:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { permission, loading, subscribe, unsubscribe };
}
