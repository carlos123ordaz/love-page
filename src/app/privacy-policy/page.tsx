import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Política de Privacidad — Love Pages',
    description:
        'Lee nuestra Política de Privacidad para entender cómo Love Pages recopila, usa y protege tu información personal.',
    alternates: {
        canonical: 'https://lovepages.ink/privacy-policy',
    },
};

export default function PrivacyPolicyPage() {
    const lastUpdated = '9 de abril de 2025';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Header />

            <main className="container max-w-3xl mx-auto px-4 py-10 sm:py-16">
                <div className="mb-8">
                    <h1 className="serif-display" style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: 8, lineHeight: 0.9 }}>
                        <span className="mis-red">política de</span>{' '}
                        <span className="mis-blue">privacidad</span>
                    </h1>
                    <p style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Última actualización: {lastUpdated}</p>
                </div>

                <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

                    <section>
                        <p>
                            En <strong>Love Pages</strong> (<a href="https://lovepages.ink" className="text-pink-600 hover:underline">lovepages.ink</a>), tu privacidad es importante para nosotros.
                            Esta Política de Privacidad explica qué información recopilamos, cómo la usamos y qué derechos tienes sobre ella.
                            Al usar nuestro servicio, aceptas las prácticas descritas en este documento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Información que recopilamos</h2>
                        <p className="mb-3">Recopilamos los siguientes tipos de información:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Información de cuenta:</strong> Cuando te registras mediante Google, recopilamos tu nombre, dirección de correo electrónico y foto de perfil proporcionados por Google.
                            </li>
                            <li>
                                <strong>Contenido generado por el usuario:</strong> Los textos, mensajes, imágenes y configuraciones que agregas a tus páginas personalizadas.
                            </li>
                            <li>
                                <strong>Datos de uso:</strong> Información sobre cómo interactúas con el sitio, como las páginas que visitas y las funciones que usas.
                            </li>
                            <li>
                                <strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo y datos de cookies necesarios para el funcionamiento del servicio.
                            </li>
                            <li>
                                <strong>Información de pago:</strong> Si adquieres el plan PRO mediante PayPal, el procesamiento del pago es gestionado directamente por PayPal. No almacenamos datos de tarjetas de crédito.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Cómo usamos tu información</h2>
                        <p className="mb-3">Usamos la información recopilada para:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Proporcionar, mantener y mejorar el servicio de Love Pages.</li>
                            <li>Crear y gestionar tu cuenta de usuario.</li>
                            <li>Permitirte crear, editar y compartir páginas personalizadas.</li>
                            <li>Procesar pagos y gestionar tu suscripción PRO.</li>
                            <li>Enviarte notificaciones relacionadas con tu cuenta o tus páginas (como cuando alguien responde a tu página).</li>
                            <li>Responder a tus consultas de soporte y mensajes de contacto.</li>
                            <li>Analizar el uso del servicio para mejorar la experiencia de usuario.</li>
                            <li>Cumplir con obligaciones legales aplicables.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Publicidad</h2>
                        <p>
                            Love Pages utiliza <strong>Google AdSense</strong> para mostrar anuncios en el sitio. Google AdSense puede usar cookies y tecnologías similares para mostrar anuncios personalizados basados en tus visitas a este y otros sitios web. Puedes optar por no recibir publicidad personalizada visitando la{' '}
                            <a
                                href="https://www.google.com/settings/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:underline"
                            >
                                Configuración de anuncios de Google
                            </a>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies</h2>
                        <p className="mb-3">
                            Usamos cookies propias y de terceros para:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio (autenticación, sesión de usuario).</li>
                            <li><strong>Cookies analíticas:</strong> Google Analytics para entender cómo se usa el sitio (datos anonimizados).</li>
                            <li><strong>Cookies de publicidad:</strong> Google AdSense para mostrar anuncios relevantes.</li>
                        </ul>
                        <p className="mt-3">
                            Puedes controlar el uso de cookies desde la configuración de tu navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar el funcionamiento del servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Compartir información con terceros</h2>
                        <p className="mb-3">
                            No vendemos tu información personal a terceros. Podemos compartir datos en los siguientes casos:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Proveedores de servicios:</strong> Firebase (Google) para autenticación y almacenamiento de datos; PayPal para procesamiento de pagos.</li>
                            <li><strong>Google Analytics y AdSense:</strong> Para análisis de uso y publicidad, según sus propias políticas de privacidad.</li>
                            <li><strong>Requerimientos legales:</strong> Si la ley nos obliga a divulgar información, lo haremos cumpliendo con los procedimientos legales aplicables.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Seguridad de los datos</h2>
                        <p>
                            Implementamos medidas técnicas y organizativas razonables para proteger tu información contra acceso no autorizado, pérdida o alteración. Sin embargo, ningún sistema de transmisión de datos por Internet es 100% seguro. Te recomendamos usar contraseñas fuertes y mantener segura tu cuenta de Google.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Tus derechos</h2>
                        <p className="mb-3">Tienes derecho a:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Acceder</strong> a la información personal que tenemos sobre ti.</li>
                            <li><strong>Corregir</strong> datos inexactos o incompletos.</li>
                            <li><strong>Eliminar</strong> tu cuenta y los datos asociados.</li>
                            <li><strong>Oponerte</strong> al procesamiento de tus datos para publicidad personalizada.</li>
                            <li><strong>Exportar</strong> tus datos en un formato legible.</li>
                        </ul>
                        <p className="mt-3">
                            Para ejercer cualquiera de estos derechos, contáctanos en{' '}
                            <a href="mailto:soporte@lovepages.app" className="text-pink-600 hover:underline">
                                soporte@lovepages.app
                            </a>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Menores de edad</h2>
                        <p>
                            Love Pages no está dirigido a menores de 13 años. No recopilamos intencionalmente información personal de menores. Si crees que un menor nos ha proporcionado información sin consentimiento, contáctanos para eliminarla.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Cambios en esta política</h2>
                        <p>
                            Podemos actualizar esta Política de Privacidad ocasionalmente. Cuando lo hagamos, actualizaremos la fecha de &quot;Última actualización&quot; en la parte superior. Te recomendamos revisar esta página periódicamente. El uso continuado del servicio tras los cambios implica tu aceptación de la política actualizada.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contacto</h2>
                        <p>
                            Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos en:
                        </p>
                        <div className="mt-3 p-4 bg-white rounded-xl border border-pink-100">
                            <p><strong>Love Pages</strong></p>
                            <p>
                                Email:{' '}
                                <a href="mailto:soporte@lovepages.app" className="text-pink-600 hover:underline">
                                    soporte@lovepages.app
                                </a>
                            </p>
                            <p>
                                Sitio web:{' '}
                                <a href="https://lovepages.ink" className="text-pink-600 hover:underline">
                                    lovepages.ink
                                </a>
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-pink-100 flex flex-wrap gap-4 text-sm text-gray-500">
                    <Link href="/terms" className="text-pink-600 hover:underline">Términos de Uso</Link>
                    <Link href="/about" className="text-pink-600 hover:underline">Acerca de nosotros</Link>
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
