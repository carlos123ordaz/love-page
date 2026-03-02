import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Juegos',
    alternates: {
        canonical: '/games',
    },
};

// Re-export the client component
export { default } from './games-client';   