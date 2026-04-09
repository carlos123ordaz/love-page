import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Heart, Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { getBlogPost, getAllSlugs, blogPosts } from '@/lib/blog';

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = getBlogPost(params.slug);
    if (!post) return {};

    return {
        title: `${post.title} — Love Pages Blog`,
        description: post.description,
        alternates: {
            canonical: `https://lovepages.ink/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            url: `https://lovepages.ink/blog/${post.slug}`,
            type: 'article',
            publishedTime: post.publishedAt,
            siteName: 'Love Pages',
        },
    };
}

const CATEGORY_COLORS: Record<string, string> = {
    'San Valentín': 'bg-red-100 text-red-700',
    'Consejos': 'bg-purple-100 text-purple-700',
    'Juegos': 'bg-blue-100 text-blue-700',
    'Relación a Distancia': 'bg-amber-100 text-amber-700',
    'Aniversario': 'bg-pink-100 text-pink-700',
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPostPage({ params }: Props) {
    const post = getBlogPost(params.slug);
    if (!post) notFound();

    const allPosts = [...blogPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
    const prevPost = allPosts[currentIndex + 1] ?? null;
    const nextPost = allPosts[currentIndex - 1] ?? null;

    const related = allPosts
        .filter((p) => p.slug !== post.slug && p.category === post.category)
        .slice(0, 2);
    const otherRelated = related.length < 2
        ? allPosts.filter((p) => p.slug !== post.slug && !related.includes(p)).slice(0, 2 - related.length)
        : [];
    const relatedPosts = [...related, ...otherRelated].slice(0, 2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            {/* JSON-LD Article structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: post.title,
                        description: post.description,
                        datePublished: post.publishedAt,
                        author: {
                            '@type': 'Organization',
                            name: 'Love Pages',
                            url: 'https://lovepages.ink',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Love Pages',
                            url: 'https://lovepages.ink',
                        },
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `https://lovepages.ink/blog/${post.slug}`,
                        },
                    }),
                }}
            />

            <main className="container max-w-3xl mx-auto px-4 py-10 sm:py-16">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-pink-600 transition-colors">Inicio</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-pink-600 transition-colors">Blog</Link>
                    <span>/</span>
                    <span className="text-gray-700 truncate max-w-[200px]">{post.title}</span>
                </nav>

                {/* Article header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'}`}>
                            {post.category}
                        </span>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readingTime} min de lectura
                        </span>
                        <span className="text-sm text-gray-400">{formatDate(post.publishedAt)}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug mb-4">
                        {post.title}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {post.description}
                    </p>
                </header>

                {/* Article content */}
                <article
                    className="
                        bg-white rounded-2xl border border-pink-100 shadow-sm p-6 sm:p-10 mb-10
                        prose prose-gray max-w-none
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
                        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                        prose-ul:pl-6 prose-ul:space-y-2 prose-li:text-gray-700
                        prose-ol:pl-6 prose-ol:space-y-2
                        prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-4 prose-blockquote:border-pink-300
                        prose-blockquote:bg-pink-50 prose-blockquote:px-5 prose-blockquote:py-3
                        prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                        prose-strong:text-gray-900
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* CTA box */}
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 sm:p-8 text-white text-center mb-10">
                    <Heart className="w-8 h-8 fill-white mx-auto mb-3" />
                    <h2 className="text-xl font-bold mb-2">
                        ¿Listo para crear algo especial?
                    </h2>
                    <p className="text-pink-100 mb-5">
                        Crea una página personalizada gratis para esa persona especial en menos de 5 minutos.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-all"
                    >
                        <Heart className="w-4 h-4" />
                        Crear mi página ahora
                    </Link>
                </div>

                {/* Prev / Next navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {prevPost && (
                        <Link
                            href={`/blog/${prevPost.slug}`}
                            className="flex items-center gap-3 bg-white rounded-xl border border-pink-100 p-4 hover:shadow-sm transition-shadow group"
                        >
                            <ArrowLeft className="w-5 h-5 text-pink-400 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 mb-1">Anterior</p>
                                <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{prevPost.title}</p>
                            </div>
                        </Link>
                    )}
                    {nextPost && (
                        <Link
                            href={`/blog/${nextPost.slug}`}
                            className="flex items-center gap-3 bg-white rounded-xl border border-pink-100 p-4 hover:shadow-sm transition-shadow group sm:ml-auto text-right"
                        >
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 mb-1">Siguiente</p>
                                <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{nextPost.title}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-pink-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {/* Related articles */}
                {relatedPosts.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-pink-500" />
                            Artículos relacionados
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {relatedPosts.map((p) => (
                                <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                                    <article className="bg-white rounded-xl border border-pink-100 p-5 hover:shadow-sm transition-shadow h-full">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[p.category] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {p.category}
                                        </span>
                                        <h3 className="font-semibold text-gray-900 mt-2 mb-1 group-hover:text-pink-600 transition-colors text-sm leading-snug">
                                            {p.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-10 pt-8 border-t border-pink-100 flex flex-wrap gap-4 text-sm text-gray-500">
                    <Link href="/blog" className="text-pink-600 hover:underline">← Ver todos los artículos</Link>
                    <Link href="/" className="text-pink-600 hover:underline">Inicio</Link>
                    <Link href="/create" className="text-pink-600 hover:underline">Crear página</Link>
                </div>
            </main>

            <footer className="py-6 px-4 border-t border-pink-100 bg-white/40 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                    <span>© {new Date().getFullYear()} Love Pages. Hecho con amor.</span>
                </div>
            </footer>
        </div>
    );
}
