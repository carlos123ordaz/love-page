import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Heart, Sparkles, Users, Globe, Shield, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Acerca de Love Pages — Nuestra Historia',
    description:
        'Conoce la historia detrás de Love Pages: cómo nació la idea de crear páginas personalizadas para ocasiones especiales y quiénes somos.',
    alternates: {
        canonical: 'https://lovepages.ink/about',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container max-w-3xl mx-auto px-4 py-10 sm:py-16">

                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4 shadow-lg">
                        <Heart className="w-9 h-9 text-white fill-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Acerca de Love Pages
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Creamos la forma más bonita de decirle a alguien lo que sientes,
                        a través de una página personalizada que nunca olvidará.
                    </p>
                </div>

                {/* Our Story */}
                <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-pink-100 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra historia</h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            Love Pages nació de una idea simple: ¿qué mejor manera de sorprender a alguien especial que con una página web creada solo para ellos?
                            En un mundo donde los mensajes de texto son efímeros y las redes sociales están llenas de ruido, quería crear algo que se sintiera íntimo, especial y memorable.
                        </p>
                        <p>
                            Empezamos con una función que se volvió viral rápidamente: el <strong>botón &quot;No&quot; que escapa</strong> cuando intentan presionarlo. Era divertido, era romántico, y la gente lo amaba. Desde entonces hemos añadido animaciones, música de fondo, stickers, temas personalizables, diseño con inteligencia artificial y mucho más.
                        </p>
                        <p>
                            Hoy, miles de personas usan Love Pages para declaraciones de amor, sorpresas de San Valentín, aniversarios, cumpleaños y cualquier ocasión que merezca algo más que un simple mensaje de texto.
                        </p>
                    </div>
                </section>

                {/* Mission */}
                <section className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 sm:p-8 text-white mb-8">
                    <h2 className="text-2xl font-bold mb-4">Nuestra misión</h2>
                    <p className="text-pink-100 leading-relaxed text-lg">
                        Hacer que expresar el amor sea fácil, bonito y memorable para cualquier persona,
                        sin importar su nivel técnico ni su presupuesto.
                    </p>
                </section>

                {/* Values */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestros valores</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                icon: Heart,
                                title: 'Amor ante todo',
                                desc: 'Cada función que creamos tiene un propósito emocional. Queremos que las personas se sientan amadas.',
                            },
                            {
                                icon: Sparkles,
                                title: 'Creatividad sin límites',
                                desc: 'Te damos las herramientas para que tu imaginación vuele: temas, animaciones, IA, música y más.',
                            },
                            {
                                icon: Users,
                                title: 'Accesible para todos',
                                desc: 'El plan gratuito siempre existirá. Creemos que el amor no debe tener barreras económicas.',
                            },
                            {
                                icon: Shield,
                                title: 'Privacidad y confianza',
                                desc: 'Tus páginas son tuyas. No vendemos tus datos ni compartimos tu contenido sin tu permiso.',
                            },
                            {
                                icon: Globe,
                                title: 'Para el mundo hispanohablante',
                                desc: 'Somos una plataforma creada pensando en Latinoamérica y España, aunque damos la bienvenida a todos.',
                            },
                            {
                                icon: Star,
                                title: 'Mejora continua',
                                desc: 'Escuchamos a nuestra comunidad constantemente y lanzamos nuevas funciones cada semana.',
                            },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white rounded-xl p-5 border border-pink-100 shadow-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* What we offer */}
                <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-pink-100 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué ofrecemos?</h2>
                    <div className="space-y-4 text-gray-700">
                        <p>
                            <strong>Love Pages</strong> es una plataforma web que te permite crear páginas personalizadas en minutos,
                            sin saber programar ni diseñar. Solo eliges un tema, escribes tu mensaje, y listo: tienes un enlace único para compartir.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Más de 10 temas visuales con colores y tipografías únicos</li>
                            <li>Animaciones interactivas: corazones, confeti, partículas y más</li>
                            <li>El famoso botón &quot;No&quot; que escapa al pasar el mouse</li>
                            <li>Música de fondo personalizable</li>
                            <li>Stickers y emojis para decorar tu página</li>
                            <li>Plantillas prediseñadas para San Valentín, aniversarios, cumpleaños y más</li>
                            <li>Juegos interactivos para parejas (Quiz, ¿Qué Prefieres?, Pictionary...)</li>
                            <li>Plan PRO con diseño por IA, URL personalizada y páginas ilimitadas</li>
                            <li>Notificaciones en tiempo real cuando alguien responde tu página</li>
                        </ul>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="text-center bg-white rounded-2xl p-6 sm:p-8 border border-pink-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">¿Tienes alguna pregunta?</h2>
                    <p className="text-gray-600 mb-4">
                        Estamos aquí para ayudarte. Escríbenos y te respondemos a la brevedad.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
                        >
                            <Heart className="w-4 h-4" />
                            Contáctanos
                        </Link>
                        <Link
                            href="/create"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-pink-300 text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-all"
                        >
                            <Sparkles className="w-4 h-4" />
                            Crear mi página gratis
                        </Link>
                    </div>
                </section>

                <div className="mt-10 pt-8 border-t border-pink-100 flex flex-wrap gap-4 text-sm text-gray-500">
                    <Link href="/privacy-policy" className="text-pink-600 hover:underline">Política de Privacidad</Link>
                    <Link href="/terms" className="text-pink-600 hover:underline">Términos de Uso</Link>
                    <Link href="/contact" className="text-pink-600 hover:underline">Contacto</Link>
                    <Link href="/" className="text-pink-600 hover:underline">Inicio</Link>
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
