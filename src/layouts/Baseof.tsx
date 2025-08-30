import config from '@config/config.json';
import { gsap } from '@lib/gsap';
import { plainify } from '@lib/utils/textConverter';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import Footer from './partials/Footer';
import Header from './partials/Header';

interface BaseProps {
  title?: string;
  meta_title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
  children: React.ReactNode;
}

const Base: React.FC<BaseProps> = ({
  title,
  meta_title,
  description,
  image,
  noindex,
  canonical,
  children,
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url } = config.site;
  const router = useRouter();
  const main = useRef<HTMLElement | null>(null);

  //gsap fade animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      //fade
      const fadeElements = document.querySelectorAll<HTMLElement>('.fade');
      fadeElements.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          scrollTrigger: el,
          duration: 0.3,
        });
      });

      //gsap animation
      const elements = document.querySelectorAll<HTMLElement>('.animate');
      elements.forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            // markers: true,
          },
        });

        if (el.classList.contains('from-left')) {
          tl.from(el, {
            opacity: 0,
            x: -100,
          });
        } else if (el.classList.contains('from-right')) {
          tl.from(el, {
            opacity: 0,
            x: 100,
          });
        } else {
          tl.from(el, {
            opacity: 0,
            y: 100,
          });
        }
      });

      //background animation
      const animatedBgs = document.querySelectorAll<HTMLElement>('.bg-theme');
      animatedBgs.forEach((bg) => {
        gsap.to(bg, {
          scrollTrigger: {
            trigger: bg,
            toggleClass: 'bg-animate',
            once: true,
          },
        });
      });
    }, main);

    return () => ctx.revert();
  }, []);

  // Memoize all plainify results (assume plainify is async, so use state/effect)
  const [plainTitle, setPlainTitle] = React.useState<string>('');
  const [plainDescription, setPlainDescription] = React.useState<string>('');

  useEffect(() => {
    let mounted = true;
    const resolvePlainify = async () => {
      const titleVal = meta_title
        ? meta_title
        : title
          ? title
          : config.site.title;
      const descVal = description ? description : meta_description;
      const [pt, pd] = await Promise.all([
        plainify(titleVal),
        plainify(descVal),
      ]);
      if (mounted) {
        setPlainTitle(pt ?? '');
        setPlainDescription(pd ?? '');
      }
    };
    resolvePlainify();
    return () => {
      mounted = false;
    };
  }, [title, meta_title, description, meta_description]);

  return (
    <>
      <Head>
        {/* title */}
        <title>{plainTitle}</title>

        {/* canonical url */}
        {canonical && <link rel="canonical" href={canonical} itemProp="url" />}

        {/* noindex robots */}
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* meta-description */}
        <meta name="description" content={plainDescription} />

        {/* author from config.json */}
        <meta name="author" content={meta_author} />

        {/* og-title */}
        <meta property="og:title" content={plainTitle} />

        {/* og-description */}
        <meta property="og:description" content={plainDescription} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${base_url}/${router.asPath.replace('/', '')}`}
        />

        {/* twitter-title */}
        <meta name="twitter:title" content={plainTitle} />

        {/* twitter-description */}
        <meta name="twitter:description" content={plainDescription} />

        {/* og-image */}
        <meta
          property="og:image"
          content={`${base_url}${image ? image : meta_image}`}
        />

        {/* twitter-image */}
        <meta
          name="twitter:image"
          content={`${base_url}${image ? image : meta_image}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />
      {/* main site */}
      <main ref={main}>{children}</main>
      <Footer />
    </>
  );
};

export default Base;
