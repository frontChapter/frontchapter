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

export interface ArticleSeoInput {
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

export interface PageSeoInput {
  title?: string;
  meta_title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  authors?: { name: string; url?: string }[];
  type?: 'website' | 'article';
  article?: ArticleSeoInput;
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
  authors,
  type = 'website',
  article,
}: PageSeoInput = {}): Metadata => {
  const { meta_description } = config.metadata as { meta_description: string };

  const pageTitle = plainifySync(meta_title || title || DEFAULT_TITLE);
  const pageDescription = plainifySync(
    description || meta_description || DEFAULT_DESCRIPTION
  );
  const ogImage = resolveAbsoluteUrl(image || DEFAULT_OG_IMAGE);
  const canonicalUrl = canonical ? resolveAbsoluteUrl(canonical) : SITE_URL;
  const pageAuthors = authors ?? [{ name: SITE_NAME }];

  const openGraph: Metadata['openGraph'] = {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type,
    images: [
      {
        url: ogImage,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: pageTitle,
      },
    ],
    ...(type === 'article' && article
      ? {
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: article.authors,
          tags: article.tags,
        }
      : {}),
  };

  return {
    title: pageTitle,
    description: pageDescription,
    authors: pageAuthors,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph,
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
