import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blog';

export const metadata: Metadata = {
    title: 'Blog — Love Pages | Consejos de Amor y Relaciones',
    description:
        'Artículos con ideas románticas, consejos para parejas, juegos, aniversarios y más. Todo lo que necesitas para expresar el amor de forma única.',
    alternates: { canonical: 'https://lovepages.ink/blog' },
    openGraph: {
        title: 'Blog — Love Pages | Consejos de Amor y Relaciones',
        description: 'Artículos con ideas románticas, consejos para parejas, juegos y más.',
        url: 'https://lovepages.ink/blog',
        type: 'website',
    },
};

const CATEGORY_STYLE: Record<string, { bg: string; color: string }> = {
    'San Valentín': { bg: 'var(--ink-red)', color: 'var(--paper)' },
    'Consejos': { bg: 'var(--ink-blue)', color: 'var(--paper)' },
    'Juegos': { bg: 'var(--ink-overlap)', color: 'var(--paper)' },
    'Relación a Distancia': { bg: 'var(--paper-2)', color: 'var(--ink-black)' },
    'Aniversario': { bg: 'var(--ink-red)', color: 'var(--paper)' },
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function CategoryBadge({ category }: { category: string }) {
    const style = CATEGORY_STYLE[category] ?? { bg: 'var(--paper-2)', color: 'var(--ink-black)' };
    return (
        <span style={{ display: 'inline-block', padding: '3px 10px', background: style.bg, color: style.color, border: '1.5px solid var(--ink-black)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {category}
        </span>
    );
}

export default function BlogPage() {
    const sorted = [...blogPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    const [featured, ...rest] = sorted;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Header />

            <main style={{ maxWidth: 860, margin: '0 auto' }} className="px-5 py-12 sm:px-12 sm:py-16">

                {/* Masthead */}
                <div style={{ borderBottom: '3px double var(--ink-black)', paddingBottom: 10, marginBottom: 48, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-black)' }}>redacción · amor</span>
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-red)' }}>★ love pages blog</span>
                </div>

                {/* Hero */}
                <div style={{ marginBottom: 48 }}>
                    <div className="sticker-badge" style={{ marginBottom: 20 }}>✦ artículos</div>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', margin: 0, lineHeight: 0.86 }}>
                        <span className="mis-red" style={{ display: 'block' }}>blog de</span>
                        <span className="mis-blue" style={{ display: 'block' }}>love pages</span>
                    </h1>
                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(14px, 2vw, 17px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 20, maxWidth: 560 }}>
                        Ideas románticas, consejos para parejas, juegos y todo lo que necesitas
                        para expresar el amor de forma única.
                    </p>
                </div>

                {/* Featured article */}
                <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 0 }}>
                    <article style={{ border: '1.5px solid var(--ink-black)', overflow: 'hidden', position: 'relative' }}>
                        {/* Red header */}
                        <div style={{ background: 'var(--ink-red)', padding: '32px 36px', position: 'relative', overflow: 'hidden' }}>
                            <svg style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, mixBlendMode: 'multiply', opacity: 0.4 }} viewBox="0 0 140 140">
                                <circle cx="70" cy="70" r="65" fill="var(--ink-blue)" />
                            </svg>
                            <div style={{ display: 'inline-block', padding: '3px 10px', background: 'rgba(248,241,222,0.2)', border: '1.5px solid rgba(248,241,222,0.5)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--paper)', marginBottom: 16 }}>
                                ★ destacado
                            </div>
                            <h2 className="serif-display" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', color: 'var(--paper)', margin: '0 0 12px', lineHeight: 0.92, position: 'relative', zIndex: 1 }}>
                                {featured.title}
                            </h2>
                            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'rgba(248,241,222,0.85)', lineHeight: 1.6, marginBottom: 20, position: 'relative', zIndex: 1, maxWidth: 600 }}>
                                {featured.description}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: 'rgba(248,241,222,0.7)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock style={{ width: 11, height: 11 }} />
                                    {featured.readingTime} min
                                </span>
                                <span>{formatDate(featured.publishedAt)}</span>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--paper-soft)', borderTop: '1.5px solid var(--ink-black)' }}>
                            <CategoryBadge category={featured.category} />
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-black)', fontWeight: 700 }}>
                                leer artículo <ArrowRight style={{ width: 12, height: 12 }} />
                            </span>
                        </div>
                    </article>
                </Link>

                {/* Rest of articles */}
                <div style={{ border: '1.5px solid var(--ink-black)', borderTop: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }} className="sm:grid-cols-2">
                    {rest.map((post, i) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`}
                            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', padding: '20px 24px', borderBottom: '1.5px solid var(--ink-black)', borderRight: i % 2 === 0 ? '1.5px solid var(--ink-black)' : 'none', background: i % 3 === 0 ? 'var(--paper)' : i % 3 === 1 ? 'var(--paper-soft)' : 'var(--paper-2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <CategoryBadge category={post.category} />
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
                                    <Clock style={{ width: 9, height: 9 }} />
                                    {post.readingTime} min
                                </span>
                            </div>
                            <h2 className="serif-display" style={{ fontSize: 18, color: 'var(--ink-black)', margin: '0 0 8px', lineHeight: 0.96 }}>
                                {post.title}
                            </h2>
                            <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7, flex: 1, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
                                {post.description}
                            </p>
                            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>{formatDate(post.publishedAt)}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-black)', fontWeight: 700 }}>
                                    leer <ArrowRight style={{ width: 11, height: 11 }} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <section style={{ border: '1.5px solid var(--ink-black)', borderTop: 'none', padding: '32px', textAlign: 'center', background: 'var(--paper)' }}>
                    <h2 className="serif-display" style={{ fontSize: 'clamp(24px, 4vw, 40px)', marginBottom: 12 }}>
                        <span className="mis-red" style={{ display: 'block' }}>¿listo para</span>
                        <span className="mis-blue" style={{ display: 'block' }}>sorprender?</span>
                    </h2>
                    <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 24 }}>
                        Crea tu página personalizada gratis en menos de 5 minutos.
                    </p>
                    <Link href="/create">
                        <button className="btn-accent" style={{ padding: '12px 24px', fontSize: 12 }}>
                            crear mi página gratis →
                        </button>
                    </Link>
                </section>

                {/* Footer links */}
                <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1.5px solid var(--rule)', display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                    {[{ href: '/', label: 'Inicio' }, { href: '/templates', label: 'Plantillas' }, { href: '/about', label: 'Acerca de' }, { href: '/privacy-policy', label: 'Privacidad' }].map(({ href, label }, i, arr) => (
                        <Link key={href} href={href} style={{ fontSize: 11, color: 'var(--ink-soft)', textDecoration: 'none', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRight: i < arr.length - 1 ? '1px solid var(--rule)' : 'none' }}>{label}</Link>
                    ))}
                </div>
            </main>

            <footer style={{ borderTop: '1.5px solid var(--ink-black)', background: 'var(--paper-soft)', padding: '14px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    © {new Date().getFullYear()} love pages.
                </span>
            </footer>
        </div>
    );
}
