import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Preguntas Anónimas para Parejas y Amigos',
    description:
        'Recibe preguntas y mensajes anónimos de tus amigos y tu pareja. Comparte tu link y descubre qué te quieren decir sin filtros. Gratis y online.',
    alternates: {
        canonical: '/games',
    },
    openGraph: {
        title: 'Preguntas Anónimas - Love Pages',
        description:
            'Comparte tu link y recibe preguntas anónimas de tus amigos y tu pareja.',
        url: '/games',
    },
};

// Re-export the client component
export { default } from './games-client';
