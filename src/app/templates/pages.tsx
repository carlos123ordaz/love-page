import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plantillas — Love Pages 💕',
    description:
        'Elige entre decenas de plantillas profesionales para San Valentín, cumpleaños, aniversarios y más. Personaliza y comparte en segundos.',
    alternates: {
        canonical: '/templates',
    },
    openGraph: {
        title: 'Plantillas — Love Pages 💕',
        description:
            'Diseños únicos creados a mano para sorprender a esa persona especial.',
        url: '/templates',
        type: 'website',
    },
};

export { default } from './templates-client';