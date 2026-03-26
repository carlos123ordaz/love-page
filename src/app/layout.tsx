import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LanguageProvider } from '@/i18n';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

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
        {/* AdSense — raw script para evitar data-nscript y crossorigin issues */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1738334012076528"
        />
      </head>
      <body className={inter.className}>
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

        {/* Funding Choices (Offerwall) */}
        <Script id="google-fc" strategy="beforeInteractive">
          {`window.googlefc=window.googlefc||{callbackQueue:[],showRevocationMessage:function(){}};`}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZE75X1X5E2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
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