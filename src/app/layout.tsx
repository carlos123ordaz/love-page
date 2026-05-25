import type { Metadata } from 'next';
import { Fraunces, Caveat, Anton, Antonio, DM_Mono, Newsreader } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LanguageProvider } from '@/i18n';
import './globals.css';
import Script from 'next/script';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['italic'],
});
const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});
const anton = Anton({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
  weight: '400',
});
const antonio = Antonio({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-antonio',
  weight: ['400', '500', '600', '700'],
});
const dmMono = DM_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
});
const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
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
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Love Pages — cartas de amor que responden',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Love Pages - Dile lo que sientes de forma única',
    description:
      'Crea páginas personalizadas con animaciones, stickers y el botón que escapa.',
    images: ['/opengraph-image'],
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
    <html lang="es" suppressHydrationWarning className={`${fraunces.variable} ${caveat.variable} ${anton.variable} ${antonio.variable} ${dmMono.variable} ${newsreader.variable}`}>
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
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
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
