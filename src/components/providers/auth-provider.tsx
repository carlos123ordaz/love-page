'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, Auth } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setFirebaseUser, setUser, setLoading } = useAuthStore();

    useEffect(() => {
        // Verificar que auth esté disponible (puede ser undefined en SSR)
        if (!auth) {
            setLoading(false);
            return;
        }

        // onAuthStateChanged requiere Auth, no Auth | undefined
        // Hacemos type assertion seguro después de verificar
        const authInstance = auth as Auth;

        const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // 1. Primero sincronizar usuario con el backend
                    const syncData = {
                        firebaseUid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                    };

                    await api.auth.syncUser(syncData);

                    // 2. Luego obtener datos completos del usuario (con canCreatePage, isPro, etc)
                    const { data } = await api.auth.getMe();
                    setUser(data.data);
                } catch (error: any) {
                    if (error.response?.status === 401) {
                        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
                        setUser(null);
                    } else {
                        toast.error('Error al cargar datos del usuario');
                    }
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [setFirebaseUser, setUser, setLoading]);

    return <>{children}</>;
}