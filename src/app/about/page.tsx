import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Heart, Sparkles, Users, Globe, Shield, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Acerca de Love Pages — Nuestra Historia',
    description:
        'Conoce la historia detrás de Love Pages: cómo nació la idea de crear páginas personalizadas para ocasiones especiales y quiénes somos.',
    alternates: { canonical: 'https://lovepages.ink/about' },
};

const VALUES = [
    { icon: Heart, title: 'Amor ante todo', desc: 'Cada función que creamos tiene un propósito emocional. Queremos que las personas se sientan amadas.', color: 'var(--ink-red)' },
    { icon: Sparkles, title: 'Creatividad sin límites', desc: 'Te damos las herramientas para que tu imaginación vuele: temas, animaciones, IA, música y más.', color: 'var(--ink-blue)' },
    { icon: Users, title: 'Accesible para todos', desc: 'El plan gratuito siempre existirá. Creemos que el amor no debe tener barreras económicas.', color: 'var(--ink-overlap)' },
    { icon: Shield, title: 'Privacidad y confianza', desc: 'Tus páginas son tuyas. No vendemos tus datos ni compartimos tu contenido sin tu permiso.', color: 'var(--ink-red)' },
    { icon: Globe, title: 'Para el mundo hispanohablante', desc: 'Somos una plataforma creada pensando en Latinoamérica y España, aunque damos la bienvenida a todos.', color: 'var(--ink-blue)' },
    { icon: Star, title: 'Mejora continua', desc: 'Escuchamos a nuestra comunidad constantemente y lanzamos nuevas funciones cada semana.', color: 'var(--ink-overlap)' },
];

export default function AboutPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Header />

            <main style={{ maxWidth: 860, margin: '0 auto' }} className="px-5 py-12 sm:px-12 sm:py-16">

                {/* Masthead */}
                <div style={{ borderBottom: '3px double var(--ink-black)', paddingBottom: 10, marginBottom: 48, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-black)' }}>sobre nosotros</span>
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-red)' }}>★ love pages</span>
                </div>

                {/* Hero */}
                <div style={{ marginBottom: 48 }}>
                    <div className="sticker-badge" style={{ marginBottom: 20 }}>✦ historia</div>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', margin: 0, lineHeight: 0.86 }}>
                        <span className="mis-red" style={{ display: 'block' }}>acerca de</span>
                        <span className="mis-blue" style={{ display: 'block' }}>love pages</span>
                    </h1>
                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(14px, 2vw, 17px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 20, maxWidth: 560 }}>
                        Creamos la forma más bonita de decirle a alguien lo que sientes,
                        a través de una página personalizada que nunca olvidará.
                    </p>
                </div>

                {/* Our Story */}
                <section style={{ borderTop: '1.5px solid var(--ink-black)', borderBottom: '1.5px solid var(--ink-black)', padding: '32px 0', marginBottom: 0, position: 'relative' }}>
                    <svg style={{ position: 'absolute', right: 0, top: 0, width: 120, height: 120, mixBlendMode: 'multiply', opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="56" fill="var(--ink-red)" />
                    </svg>
                    <svg style={{ position: 'absolute', right: 20, top: 20, width: 90, height: 90, mixBlendMode: 'multiply', opacity: 0.4, pointerEvents: 'none' }} viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="42" fill="var(--ink-blue)" />
                    </svg>
                    <div className="mono-eyebrow" style={{ marginBottom: 20, color: 'var(--ink-black)' }}>nuestra historia</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13, lineHeight: 1.85, color: 'var(--ink-soft)', maxWidth: 640, position: 'relative', zIndex: 1 }}>
                        <p style={{ margin: 0 }}>Love Pages nació de una idea simple: ¿qué mejor manera de sorprender a alguien especial que con una página web creada solo para ellos? En un mundo donde los mensajes de texto son efímeros, quería crear algo que se sintiera íntimo, especial y memorable.</p>
                        <p style={{ margin: 0 }}>Empezamos con una función que se volvió viral rápidamente: el <strong style={{ color: 'var(--ink-black)', fontFamily: 'var(--sans)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>botón "No" que escapa</strong> cuando intentan presionarlo. Era divertido, era romántico, y la gente lo amaba.</p>
                        <p style={{ margin: 0 }}>Hoy, miles de personas usan Love Pages para declaraciones de amor, sorpresas de San Valentín, aniversarios, cumpleaños y cualquier ocasión que merezca algo más que un simple mensaje de texto.</p>
                    </div>
                </section>

                {/* Mission */}
                <section style={{ border: '1.5px solid var(--ink-black)', borderTop: 'none', background: 'var(--ink-red)', color: 'var(--paper)', padding: '32px 36px', marginBottom: 0, position: 'relative', overflow: 'hidden' }}>
                    <svg style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, mixBlendMode: 'multiply', opacity: 0.4 }} viewBox="0 0 140 140">
                        <circle cx="70" cy="70" r="65" fill="var(--ink-blue)" />
                    </svg>
                    <div className="mono-eyebrow" style={{ color: 'rgba(248,241,222,0.7)', marginBottom: 16 }}>nuestra misión</div>
                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(16px, 2.5vw, 22px)', lineHeight: 1.5, margin: 0, position: 'relative', zIndex: 1 }}>
                        Hacer que expresar el amor sea fácil, bonito y memorable para cualquier persona,
                        sin importar su nivel técnico ni su presupuesto.
                    </p>
                </section>

                {/* Values */}
                <section style={{ marginTop: 48, marginBottom: 0 }}>
                    <div className="mono-eyebrow" style={{ marginBottom: 20, color: 'var(--ink-black)' }}>nuestros valores</div>
                    <div style={{ border: '1.5px solid var(--ink-black)' }}>
                        {VALUES.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '20px 24px', borderBottom: i < VALUES.length - 1 ? '1.5px solid var(--ink-black)' : 'none', background: i % 2 === 0 ? 'var(--paper-soft)' : 'var(--paper)' }}>
                                    <div style={{ width: 32, height: 32, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mixBlendMode: 'multiply' }}>
                                        <Icon style={{ width: 14, height: 14, color: 'var(--paper)' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, color: 'var(--ink-black)' }}>{item.title}</div>
                                        <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{item.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* What we offer */}
                <section style={{ border: '1.5px solid var(--ink-black)', borderTop: 'none', padding: '28px 32px', background: 'var(--paper-soft)', marginBottom: 0 }}>
                    <div className="mono-eyebrow" style={{ marginBottom: 20, color: 'var(--ink-black)' }}>qué ofrecemos</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            'Más de 10 temas visuales con colores y tipografías únicos',
                            'Animaciones interactivas: corazones, confeti, partículas y más',
                            'El famoso botón "No" que escapa al pasar el mouse',
                            'Música de fondo personalizable',
                            'Stickers y emojis para decorar tu página',
                            'Plantillas prediseñadas para San Valentín, aniversarios, cumpleaños y más',
                            'Juegos interactivos para parejas (Quiz, ¿Qué Prefieres?, Pictionary...)',
                            'Plan PRO con diseño por IA, URL personalizada y páginas ilimitadas',
                            'Notificaciones en tiempo real cuando alguien responde tu página',
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-soft)', alignItems: 'baseline' }}>
                                <span style={{ color: i % 2 === 0 ? 'var(--ink-red)' : 'var(--ink-blue)', flexShrink: 0, fontWeight: 700 }}>→</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Contact CTA */}
                <section style={{ border: '1.5px solid var(--ink-black)', borderTop: 'none', padding: '32px', textAlign: 'center', background: 'var(--paper)', marginTop: 48 }}>
                    <h2 className="serif-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 12 }}>
                        <span className="mis-red" style={{ display: 'block' }}>¿tienes alguna</span>
                        <span className="mis-blue" style={{ display: 'block' }}>pregunta?</span>
                    </h2>
                    <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 24 }}>Estamos aquí para ayudarte. Escríbenos y te respondemos a la brevedad.</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/contact">
                            <button className="btn-accent" style={{ padding: '12px 24px', fontSize: 12 }}>contactar →</button>
                        </Link>
                        <Link href="/create">
                            <button className="btn-ink" style={{ padding: '12px 24px', fontSize: 12 }}>crear mi página gratis →</button>
                        </Link>
                    </div>
                </section>

                {/* Footer links */}
                <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1.5px solid var(--rule)', display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                    {[{ href: '/privacy-policy', label: 'Privacidad' }, { href: '/terms', label: 'Términos' }, { href: '/contact', label: 'Contacto' }, { href: '/', label: 'Inicio' }].map(({ href, label }, i, arr) => (
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
