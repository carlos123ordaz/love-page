import type { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: { shortId: string };
}): Promise<Metadata> {
    return {
        title: 'Detalle de Página',
        alternates: {
            canonical: `/page/${params.shortId}`,
        },
    };
}

export { default } from './page-detail-client';