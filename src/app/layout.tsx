import type { Metadata, Viewport } from 'next';
import config from '@config/config.json';
import NextTopLoader from 'nextjs-toploader';
import type { ReactNode } from 'react';
import {
  Ga4Head,
  GtmBodyNoscript,
  GtmHead,
} from '../layouts/components/AnalyticsScripts';
import SiteVerification from '../layouts/components/SiteVerification';
import TwSizeIndicator from '../layouts/components/TwSizeIndicator';
import Footer from '../layouts/partials/Footer';
import Header from '../layouts/partials/Header';
import '../styles/style.scss';
import { RTLProvider } from '../hooks/useRTL';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from '../lib/seo/constants';

interface RootLayoutProps {
  children: ReactNode;
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1419' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | جامعه و کامیونتی فرانت‌اند ایران`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
    languages: {
      'fa-IR': SITE_URL,
    },
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    url: SITE_URL,
    title: `${SITE_NAME} | جامعه و کامیونتی فرانت‌اند ایران`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | جامعه و کامیونتی فرانت‌اند ایران`,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
  icons: {
    icon: config.site.favicon,
    shortcut: config.site.favicon,
    apple: config.site.favicon,
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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <GtmHead />
        <Ga4Head />
        <SiteVerification />

        {/* DanaVF local font preload */}
        <link
          rel="preload"
          href="/fonts/DanaVF.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        <meta name="theme-name" content="andromeda-light-nextjs" />
        <meta name="msapplication-TileColor" content="#000000" />
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden">
        <GtmBodyNoscript />
        <NextTopLoader color="#fe6019" height={3} showSpinner={false} />
        <a
          href="#main-content"
          className="absolute -top-16 start-4 z-[100] rounded-lg bg-primary px-4 py-3 text-sm text-white transition-[top] focus:top-4"
        >
          رفتن به محتوای اصلی
        </a>
        <TwSizeIndicator />
        <RTLProvider>
          <Header />
          {children}
          <Footer />
        </RTLProvider>
      </body>
    </html>
  );
}
