import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Crear Página Personalizada',
    description:
        'Diseña una página personalizada con animaciones, stickers, música y el botón que escapa. Gratis y sin tarjeta de crédito.',
    alternates: {
        canonical: '/create',
    },
    openGraph: {
        title: 'Crear Página Personalizada - Love Pages',
        description:
            'Diseña tu página de amor con temas, animaciones y stickers. Comparte un link único.',
        url: '/create',
    },
};

export { default } from './create-client';
