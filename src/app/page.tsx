import type { Metadata } from 'next';
import LandingPage from '@/components/landing/landing-page';

export const metadata: Metadata = {
  title: 'Love Pages - Crea Páginas Personalizadas para Ocasiones Especiales',
  description:
    'Crea páginas personalizadas gratis para San Valentín, declaraciones de amor y ocasiones especiales. Diseña con animaciones, stickers, música y el botón que escapa. Comparte un link único.',
  alternates: {
    canonical: 'https://lovepages.ink',
  },
};

export default function HomePage() {
  return (
    <>
      {/* SEO: contenido estático visible para crawlers antes de la hidratación */}
      <div className="sr-only" aria-hidden="false">
        <h1>Love Pages - Páginas Personalizadas para Ocasiones Especiales</h1>
        <p>
          Crea páginas personalizadas gratis para San Valentín, declaraciones de amor,
          aniversarios y cualquier ocasión especial. Diseña con animaciones, stickers,
          música de fondo y el famoso botón que escapa.
        </p>
        <h2>Funcionalidades</h2>
        <ul>
          <li>Crea páginas personalizadas con mensajes de amor</li>
          <li>Elige entre múltiples temas y animaciones</li>
          <li>Agrega stickers, imágenes y música de fondo</li>
          <li>El botón "No" que escapa cuando intentan presionarlo</li>
          <li>Comparte un link único y ve la respuesta en tiempo real</li>
          <li>Plantillas prediseñadas para inspirarte</li>
          <li>Plan gratuito disponible - sin tarjeta de crédito</li>
          <li>Plan PRO con diseño IA, URL personalizada y páginas ilimitadas</li>
        </ul>
        <h2>Juegos para Parejas</h2>
        <p>
          Diviértete con juegos interactivos: Tutti Frutti, Quiz de Compatibilidad,
          ¿Qué Prefieres?, Pictionary y más.
        </p>
        <h2>Plantillas</h2>
        <p>
          Explora plantillas prediseñadas para San Valentín, aniversarios, declaraciones
          y más. Personalízalas con tus propios mensajes e imágenes.
        </p>
      </div>
      <LandingPage />
    </>
  );
}
