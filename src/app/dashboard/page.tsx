import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard',
    alternates: {
        canonical: '/dashboard',
    },
};

// Re-export the client component
export { default } from './dashboard-client';