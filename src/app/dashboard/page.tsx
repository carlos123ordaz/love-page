import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mis Páginas - Dashboard',
    description:
        'Administra tus páginas personalizadas de amor. Ve estadísticas, respuestas y comparte tus creaciones.',
    alternates: {
        canonical: '/dashboard',
    },
    openGraph: {
        title: 'Mis Páginas - Love Pages',
        description:
            'Crea y administra páginas personalizadas para ocasiones especiales.',
        url: '/dashboard',
    },
};

// Re-export the client component
export { default } from './dashboard-client';
