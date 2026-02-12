import type { Metadata } from 'next';

// Dynamic canonical for public pages /p/[shortId]
export async function generateMetadata({
    params,
}: {
    params: { shortId: string };
}): Promise<Metadata> {
    const { shortId } = params;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovepages.ink';

    return {
        title: 'Love Pages 💕',
        alternates: {
            canonical: `/p/${shortId}`,
        },
        openGraph: {
            title: 'Alguien te envió algo especial 💕',
            description: 'Abre este enlace para ver tu página personalizada',
            url: `${siteUrl}/p/${shortId}`,
            type: 'website',
        },
    };
}

export { default } from './public-page-client';