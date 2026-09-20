import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/src/lib/seo/constants';

interface RedirectProps {
  targetPath: string;
  targetTitle?: string;
}

export function buildRedirectMetadata(
  targetPath: string,
  targetTitle?: string
): Metadata {
  const normalizedPath = targetPath.startsWith('/')
    ? targetPath
    : `/${targetPath}`;
  const targetUrl = `${SITE_URL}${normalizedPath}`;
  const pageTitle = targetTitle
    ? `در حال انتقال به ${targetTitle} | ${SITE_NAME}`
    : `در حال انتقال... | ${SITE_NAME}`;

  return {
    title: pageTitle,
    description: `در حال انتقال خودکار به صفحه ${targetTitle || 'مقصد'} در فرانت‌چپتر...`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: targetUrl,
    },
    other: {
      refresh: `0; url=${targetUrl}`,
    },
  };
}

const StaticRedirect: React.FC<RedirectProps> = ({
  targetPath,
  targetTitle,
}) => {
  const normalizedPath = targetPath.startsWith('/')
    ? targetPath
    : `/${targetPath}`;
  const targetUrl = `${SITE_URL}${normalizedPath}`;

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <meta httpEquiv="refresh" content={`0; url=${targetUrl}`} />
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface-solid p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg
            className="h-6 w-6 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-dark">
          در حال انتقال به صفحه مقصد
        </h1>
        <p className="mt-2 text-sm text-muted">
          {targetTitle
            ? `در حال هدایت به «${targetTitle}»`
            : 'چند لحظه صبر کنید...'}
        </p>
        <p className="mt-4 text-xs text-muted">
          اگر به صورت خودکار منتقل نشدید،{' '}
          <a
            href={targetUrl}
            className="font-medium text-primary underline transition-colors hover:text-primary-dark"
          >
            اینجا کلیک کنید
          </a>
          .
        </p>
      </div>
      <Script id="static-redirect-script" strategy="afterInteractive">
        {`window.location.replace("${targetUrl}");`}
      </Script>
    </div>
  );
};

export default StaticRedirect;
