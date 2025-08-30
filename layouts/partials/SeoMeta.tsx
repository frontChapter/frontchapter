"use client";

import config from "@config/config.json";
import { plainify } from "@lib/utils/textConverter";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";


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
  const { base_url } = config.site as { base_url: string; title: string };
  const pathname = usePathname();

  const [plainTitle, setPlainTitle] = useState("");
  const [plainDesc, setPlainDesc] = useState("");

  useEffect(() => {
    const getPlain = async () => {
      setPlainTitle(
        (await plainify(meta_title ? meta_title : title ? title : config.site.title)) || ""
      );
      setPlainDesc(
        (await plainify(description ? description : meta_description)) || ""
      );
    };
    getPlain();
  }, [title, meta_title, description, meta_description]);

  return (
    <>
      {/* title */}
      <title>{plainTitle}</title>

      {/* canonical url */}
      {canonical && <link rel="canonical" href={canonical} itemProp="url" />}

      {/* noindex robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* meta-description */}
      <meta name="description" content={plainDesc} />

      {/* author from config.json */}
      <meta name="author" content={meta_author} />

      {/* og-title */}
      <meta property="og:title" content={plainTitle} />

      {/* og-description */}
      <meta property="og:description" content={plainDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${base_url}/${pathname.replace("/", "")}`} />

      {/* twitter-title */}
      <meta name="twitter:title" content={plainTitle} />

      {/* twitter-description */}
      <meta name="twitter:description" content={plainDesc} />

      {/* og-image */}
      <meta property="og:image" content={`${base_url}${image ? image : meta_image}`} />

      {/* twitter-image */}
      <meta name="twitter:image" content={`${base_url}${image ? image : meta_image}`} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
};

export default SeoMeta;
