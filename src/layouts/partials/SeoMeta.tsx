'use client';

import config from '@config/config.json';
import { plainify } from '@lib/utils/textConverter';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface SeoMetaProps {
  title?: string;
  meta_title?: string;
  image?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

const SeoMeta: React.FC<SeoMetaProps> = ({
  title,
  meta_title,
  image,
  description,
  canonical,
  noindex,
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata as {
    meta_image: string;
    meta_author: string;
    meta_description: string;
  };
  const { base_url, title: siteTitle } = config.site as {
    base_url: string;
    title: string;
  };
  const pathname = usePathname();

  const [plainTitle, setPlainTitle] = useState('');
  const [plainDesc, setPlainDesc] = useState('');

  useEffect(() => {
    const getPlain = async () => {
      setPlainTitle(
        (await plainify(meta_title ? meta_title : title ? title : siteTitle)) ||
          ''
      );
      setPlainDesc(
        (await plainify(description ? description : meta_description)) || ''
      );
    };
    getPlain();
  }, [title, meta_title, description, meta_description, siteTitle]);

  const ogImage = `${base_url === '/' ? '' : base_url}${image ? image : meta_image}`;
  const pagePath = pathname === '/' ? '' : pathname.replace(/^\//, '');
  const ogUrl =
    canonical ??
    `${base_url === '/' ? 'https://frontchapter.ir' : base_url}${pagePath ? `/${pagePath}` : ''}`;

  return (
    <>
      <title>{plainTitle}</title>

      {canonical && <link rel="canonical" href={canonical} />}

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta name="description" content={plainDesc} />
      <meta name="author" content={meta_author} />

      {/* Open Graph */}
      <meta property="og:title" content={plainTitle} />
      <meta property="og:description" content={plainDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={plainTitle} />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:site_name" content="فرانت‌چپتر" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={plainTitle} />
      <meta name="twitter:description" content={plainDesc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={plainTitle} />
    </>
  );
};

export default SeoMeta;
