import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Términos de Uso — Love Pages',
    description:
        'Lee los Términos de Uso de Love Pages: las condiciones que rigen el uso de nuestra plataforma para crear páginas personalizadas.',
    alternates: {
        canonical: 'https://lovepages.ink/terms',
    },
};

export default function TermsPage() {
    const lastUpdated = '9 de abril de 2025';

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container max-w-3xl mx-auto px-4 py-10 sm:py-16">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Términos de Uso
                    </h1>
                    <p className="text-sm text-gray-500">Última actualización: {lastUpdated}</p>
                </div>

                <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

                    <section>
                        <p>
                            Bienvenido a <strong>Love Pages</strong> (<a href="https://lovepages.ink" className="text-pink-600 hover:underline">lovepages.ink</a>).
                            Al acceder o usar nuestro servicio, aceptas estar sujeto a estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no debes usar el servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Descripción del servicio</h2>
                        <p>
                            Love Pages es una plataforma web que permite a los usuarios crear, personalizar y compartir páginas digitales interactivas para ocasiones especiales como San Valentín, aniversarios, cumpleaños y declaraciones de amor. El servicio incluye un plan gratuito y un plan de pago (PRO) con funciones adicionales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Elegibilidad</h2>
                        <p>
                            Para usar Love Pages debes tener al menos 13 años de edad. Al registrarte, confirmas que cumples con este requisito. Los usuarios menores de 18 años deben contar con el consentimiento de un padre o tutor legal para usar el servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Registro y cuenta</h2>
                        <p className="mb-3">
                            El acceso a ciertas funciones requiere crear una cuenta. Al registrarte, aceptas:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Proporcionar información veraz y actualizada.</li>
                            <li>Mantener la seguridad de tu cuenta y no compartir tus credenciales con terceros.</li>
                            <li>Ser responsable de toda actividad que ocurra bajo tu cuenta.</li>
                            <li>Notificarnos inmediatamente si sospechas un acceso no autorizado.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Uso aceptable</h2>
                        <p className="mb-3">
                            Puedes usar Love Pages solo para propósitos legales y de acuerdo con estos términos. Está prohibido:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Publicar contenido que sea ilegal, ofensivo, amenazante, difamatorio, pornográfico o que viole derechos de terceros.</li>
                            <li>Acosar, intimidar o agredir a otras personas a través del servicio.</li>
                            <li>Usar el servicio para enviar spam o comunicaciones no solicitadas.</li>
                            <li>Intentar acceder de manera no autorizada a sistemas o datos del servicio.</li>
                            <li>Usar bots, scrapers u otras herramientas automatizadas para extraer datos del servicio.</li>
                            <li>Suplantar la identidad de otras personas o entidades.</li>
                            <li>Violar cualquier ley o regulación aplicable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contenido del usuario</h2>
                        <p className="mb-3">
                            Al crear contenido en Love Pages (textos, imágenes, mensajes), declaras que:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Eres el propietario del contenido o tienes los derechos necesarios para usarlo.</li>
                            <li>El contenido no infringe derechos de autor, marcas registradas u otros derechos de terceros.</li>
                            <li>El contenido no es ilegal ni viola estos términos.</li>
                        </ul>
                        <p className="mt-3">
                            Nos reservamos el derecho de eliminar cualquier contenido que viole estos términos sin previo aviso.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Planes y pagos</h2>
                        <p className="mb-3">
                            Love Pages ofrece un plan gratuito y un plan PRO de pago:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>El plan gratuito incluye funciones básicas sin costo.</li>
                            <li>El plan PRO requiere el pago de una suscripción. Los precios están disponibles en la página de actualización.</li>
                            <li>Los pagos se procesan a través de PayPal. Al completar el pago, aceptas también los términos de PayPal.</li>
                            <li>Los cargos no son reembolsables salvo que la ley aplicable lo requiera o que expressamente lo indiquemos.</li>
                            <li>Podemos modificar los precios con previo aviso. Los cambios no afectarán los períodos de suscripción ya pagados.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Propiedad intelectual</h2>
                        <p>
                            Todo el diseño, código, logotipos, textos y funciones de Love Pages son propiedad de Love Pages o de sus licenciantes. No puedes copiar, modificar, distribuir o crear obras derivadas de ningún elemento del servicio sin nuestro permiso expreso por escrito. El contenido que tú creas en el servicio sigue siendo tuyo; solo nos concedes una licencia limitada para mostrarlo y almacenarlo mientras usas el servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Privacidad</h2>
                        <p>
                            El uso de tu información personal se rige por nuestra{' '}
                            <Link href="/privacy-policy" className="text-pink-600 hover:underline">
                                Política de Privacidad
                            </Link>
                            , que forma parte integral de estos Términos de Uso.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitación de responsabilidad</h2>
                        <p className="mb-3">
                            Love Pages se proporciona &quot;tal cual&quot; sin garantías de ningún tipo. En la máxima medida permitida por la ley:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>No garantizamos que el servicio sea ininterrumpido, libre de errores o seguro en todo momento.</li>
                            <li>No somos responsables por pérdida de datos, daños indirectos, incidentales o consecuentes derivados del uso del servicio.</li>
                            <li>Nuestra responsabilidad total, en cualquier caso, no superará el monto que hayas pagado por el servicio en los últimos 12 meses.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Terminación</h2>
                        <p>
                            Podemos suspender o eliminar tu cuenta si violas estos términos, sin previo aviso y sin responsabilidad hacia ti. También puedes eliminar tu cuenta en cualquier momento desde la configuración de tu perfil o contactándonos. Al eliminar tu cuenta, tu contenido será borrado de nuestros servidores en un plazo razonable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Cambios en los términos</h2>
                        <p>
                            Podemos actualizar estos Términos de Uso en cualquier momento. Te notificaremos los cambios importantes por correo electrónico o mediante un aviso en el sitio. El uso continuado del servicio tras la publicación de cambios implica tu aceptación de los nuevos términos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contacto</h2>
                        <p>
                            Si tienes preguntas sobre estos Términos de Uso, contáctanos en:
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
                    <Link href="/privacy-policy" className="text-pink-600 hover:underline">Política de Privacidad</Link>
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
