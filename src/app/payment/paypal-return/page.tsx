// app/payment/paypal-return/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useEffect } from 'react';

export default function PayPalReturnPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token'); // Order ID

    useEffect(() => {
        if (token) {
            api.payments.capturePayPalPayment(token)
                .then(() => {
                    router.push('/payment/success?provider=paypal');
                })
                .catch(() => {
                    router.push('/payment/failure?provider=paypal');
                });
        }
    }, [token, router]);

    return <div>Procesando pago...</div>;
}