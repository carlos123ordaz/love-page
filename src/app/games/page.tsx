import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Juegos para Parejas y Amigos',
    description:
        'Diviértete con juegos interactivos: Tutti Frutti, Quiz de Compatibilidad, Pictionary, Buscaminas y más. Juega gratis online.',
    alternates: {
        canonical: '/games',
    },
    openGraph: {
        title: 'Juegos para Parejas - Love Pages',
        description:
            'Juegos multijugador para parejas y amigos. Tutti Frutti, Quiz, Pictionary y más.',
        url: '/games',
    },
};

// Re-export the client component
export { default } from './games-client';
