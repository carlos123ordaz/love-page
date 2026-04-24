import type { Metadata } from 'next';
import { Inter, Dancing_Script } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LanguageProvider } from '@/i18n';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });
const dancingScript = Dancing_Script({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lovepages.ink'),
  title: {
    default: 'Love Pages - Páginas Personalizadas para Ocasiones Especiales',
    template: '%s | Love Pages',
  },
  description:
    'Crea páginas personalizadas para San Valentín, declaraciones, y ocasiones especiales. Diseño con IA y páginas ilimitadas.',
  keywords: ['san valentín', 'declaración', 'amor', 'páginas personalizadas', 'love pages', 'regalos románticos'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://lovepages.ink',
    siteName: 'Love Pages',
    title: 'Love Pages - Dile lo que sientes de forma única',
    description:
      'Crea páginas personalizadas con animaciones, stickers y el botón que escapa. Comparte un link único y ve su respuesta en tiempo real.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Love Pages - Páginas Personalizadas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Love Pages - Dile lo que sientes de forma única',
    description:
      'Crea páginas personalizadas con animaciones, stickers y el botón que escapa.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'mwNvWu95tNqWX41s2W-JVajup-JpiaR2wafataOmMdE',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fundingchoicesmessages.google.com" />
        <link rel="dns-prefetch" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://lovepage-304fb.firebaseapp.com" />

        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Love Pages',
              url: 'https://lovepages.ink',
              description:
                'Crea páginas personalizadas para San Valentín, declaraciones y ocasiones especiales con animaciones, stickers y el botón que escapa.',
              applicationCategory: 'EntertainmentApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Plan gratuito disponible',
              },
              author: {
                '@type': 'Organization',
                name: 'Love Pages',
                url: 'https://lovepages.ink',
              },
              inLanguage: 'es',
            }),
          }}
        />
      </head>
      <body className={`${inter.className} ${dancingScript.variable}`}>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
              <div className="w-full max-w-3xl rounded-[2rem] border border-white/20 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 p-8 text-center text-white shadow-2xl md:p-12">
                <span className="mb-4 inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em]">
                  Mantenimiento
                </span>
                <h1 className="text-4xl font-black leading-tight md:text-6xl">
                  Esta pagina esta en mantenimiento
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/90 md:text-xl">
                  El backend estara apagado por unos dias mientras realizo ajustes.
                  Algunas funciones pueden no responder o no estar disponibles temporalmente.
                </p>
                <p className="mt-4 text-sm text-white/80 md:text-base">
                  Vuelve a intentarlo mas tarde.
                </p>
              </div>
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: { background: '#fff', color: '#363636' },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </AuthProvider>
        </LanguageProvider>

        {/* AdSense — deferred to not block initial render */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1738334012076528"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* Funding Choices (Offerwall) — deferred */}
        <Script id="google-fc" strategy="afterInteractive">
          {`window.googlefc=window.googlefc||{callbackQueue:[],showRevocationMessage:function(){}};`}
        </Script>

        {/* Google Analytics — deferred */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZE75X1X5E2"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZE75X1X5E2');
          `}
        </Script>
      </body>
    </html>
  );
}
