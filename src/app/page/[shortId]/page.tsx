import type { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: { shortId: string };
}): Promise<Metadata> {
    return {
        title: 'Page Detail',
        alternates: {
            canonical: `/page/${params.shortId}`,
        },
    };
}

export { default } from './page-detail-client';