import type { Metadata } from 'next';
import config from '@config/config.json';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from './constants';
import { plainifySync } from './plainify';

export interface PageSeoInput {
  title?: string;
  meta_title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
}

const resolveAbsoluteUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};

export const buildPageMetadata = ({
  title,
  meta_title,
  description,
  image,
  canonical,
  noindex,
}: PageSeoInput = {}): Metadata => {
  const { meta_description } = config.metadata as { meta_description: string };

  const pageTitle = plainifySync(meta_title || title || DEFAULT_TITLE);
  const pageDescription = plainifySync(
    description || meta_description || DEFAULT_DESCRIPTION
  );
  const ogImage = resolveAbsoluteUrl(image || DEFAULT_OG_IMAGE);
  const canonicalUrl = canonical ? resolveAbsoluteUrl(canonical) : SITE_URL;

  return {
    title: pageTitle,
    description: pageDescription,
    authors: [{ name: SITE_NAME }],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'fa_IR',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
  };
};

export const homeMetadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  image: DEFAULT_OG_IMAGE,
});
