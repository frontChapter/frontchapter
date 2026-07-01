'use client';

import config from '@config/config.json';
import TwSizeIndicator from '../layouts/components/TwSizeIndicator';
import Footer from '../layouts/partials/Footer';
import Header from '../layouts/partials/Header';
import '../styles/style.scss';

import type { ReactNode } from 'react';
import { RTLProvider } from '../hooks/useRTL';

interface RootLayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning={true} lang="fa-IR" dir="rtl">
      <head>
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* favicon */}
        <link rel="shortcut icon" href={config.site.favicon} />
        {/* theme meta */}
        <meta name="theme-name" content="andromeda-light-nextjs" />

        {/* google font css */}
        {/* DanaVF local font */}
        <link
          rel="preload"
          href="/fonts/DanaVF.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* theme meta */}
        <meta name="theme-name" content="andromeda-light-nextjs" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0f1419"
        />
      </head>
      <body suppressHydrationWarning={true} className="overflow-x-hidden">
        <a
          href="#main-content"
          className="absolute -top-16 start-4 z-[100] rounded-lg bg-primary px-4 py-3 text-sm text-white transition-[top] focus:top-4"
        >
          رفتن به محتوای اصلی
        </a>
        <TwSizeIndicator />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <RTLProvider>
      <LayoutContent>{children}</LayoutContent>
    </RTLProvider>
  );
}
