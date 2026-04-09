import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Heart, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { blogPosts } from '@/lib/blog';

export const metadata: Metadata = {
    title: 'Blog — Love Pages | Consejos de Amor y Relaciones',
    description:
        'Artículos con ideas románticas, consejos para parejas, juegos, aniversarios y más. Todo lo que necesitas para expresar el amor de forma única.',
    alternates: {
        canonical: 'https://lovepages.ink/blog',
    },
    openGraph: {
        title: 'Blog — Love Pages | Consejos de Amor y Relaciones',
        description:
            'Artículos con ideas románticas, consejos para parejas, juegos y más.',
        url: 'https://lovepages.ink/blog',
        type: 'website',
    },
};

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

export default function BlogPage() {
    const sorted = [...blogPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    const [featured, ...rest] = sorted;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container max-w-4xl mx-auto px-4 py-10 sm:py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4 shadow-lg">
                        <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Blog de Love Pages
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Ideas románticas, consejos para parejas, juegos y todo lo que necesitas
                        para expresar el amor de forma única.
                    </p>
                </div>

                {/* Featured article */}
                <Link href={`/blog/${featured.slug}`} className="block mb-10 group">
                    <article className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-br from-pink-500 to-rose-500 px-6 py-10 sm:py-14 text-white">
                            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                Destacado
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:underline underline-offset-2">
                                {featured.title}
                            </h2>
                            <p className="text-pink-100 text-base sm:text-lg leading-relaxed mb-4">
                                {featured.description}
                            </p>
                            <div className="flex items-center gap-4 text-pink-200 text-sm">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {featured.readingTime} min de lectura
                                </span>
                                <span>{formatDate(featured.publishedAt)}</span>
                            </div>
                        </div>
                        <div className="px-6 py-4 flex items-center justify-between">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[featured.category] ?? 'bg-gray-100 text-gray-700'}`}>
                                {featured.category}
                            </span>
                            <span className="flex items-center gap-1 text-pink-600 text-sm font-medium group-hover:gap-2 transition-all">
                                Leer artículo <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </article>
                </Link>

                {/* Rest of articles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {rest.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                            <article className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6 h-full flex flex-col hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'}`}>
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {post.readingTime} min
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors leading-snug">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                                    {post.description}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
                                    <span className="flex items-center gap-1 text-pink-600 text-sm font-medium group-hover:gap-2 transition-all">
                                        Leer <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-14 text-center bg-white rounded-2xl border border-pink-100 p-8 shadow-sm">
                    <Heart className="w-8 h-8 text-pink-500 fill-pink-500 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        ¿Listo para sorprender a alguien especial?
                    </h2>
                    <p className="text-gray-600 mb-5">
                        Crea tu página personalizada gratis en menos de 5 minutos.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
                    >
                        <Heart className="w-4 h-4" />
                        Crear mi página ahora
                    </Link>
                </div>

                <div className="mt-10 pt-8 border-t border-pink-100 flex flex-wrap gap-4 text-sm text-gray-500">
                    <Link href="/" className="text-pink-600 hover:underline">Inicio</Link>
                    <Link href="/templates" className="text-pink-600 hover:underline">Plantillas</Link>
                    <Link href="/about" className="text-pink-600 hover:underline">Acerca de</Link>
                    <Link href="/privacy-policy" className="text-pink-600 hover:underline">Privacidad</Link>
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
