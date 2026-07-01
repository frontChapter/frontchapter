'use client';

import { gsap } from '@lib/gsap';
import { markdownify } from '@lib/utils/textConverter';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import React from 'react';
import { useRTL } from '../../hooks/useRTL';
import Circle from '../components/Circle';
import LazyVideo from '../components/LazyVideo';
import SponsorCarousel, { type Sponsor } from '../components/SponsorCarousel';

interface BannerData {
  title: string;
  subtitle: string;
  link: {
    href: string;
    label: string;
  };
  image: string;
  video: string;
}

interface SponsorsData {
  title: string;
  list: Sponsor[];
}

interface HomeBannerProps {
  banner: BannerData;
  sponsors: SponsorsData;
}

const withFrontChapterReferral = (url: string) => {
  const parsed = new URL(url);
  parsed.searchParams.set('utm_source', 'frontchapter');
  parsed.searchParams.set('utm_medium', 'referral');
  parsed.searchParams.set('utm_campaign', 'sponsors');
  parsed.searchParams.set('ref', 'frontchapter');
  return parsed.toString();
};

const RTL_CIRCLES = [
  {
    className: 'circle right-[10%] top-12',
    width: 32,
    height: 32,
    fill: false,
  },
  { className: 'circle right-[2.5%] top-[29%]', width: 85, height: 85 },
  { className: 'circle bottom-[48%] right-[22%]', width: 20, height: 20 },
  {
    className: 'circle bottom-[37%] right-[15%]',
    width: 47,
    height: 47,
    fill: false,
  },
  {
    className: 'circle bottom-[13%] right-[6%]',
    width: 62,
    height: 62,
    fill: false,
  },
  { className: 'circle left-[12%] top-[15%]', width: 20, height: 20 },
  {
    className: 'circle left-[2%] top-[30%]',
    width: 73,
    height: 73,
    fill: false,
  },
  {
    className: 'circle left-[19%] top-[48%]',
    width: 37,
    height: 37,
    fill: false,
  },
  { className: 'circle left-[33%] top-[54%]', width: 20, height: 20 },
  { className: 'circle bottom-[20%] left-[3%]', width: 65, height: 65 },
] as const;

const LTR_CIRCLES = [
  {
    className: 'circle left-[10%] top-12',
    width: 32,
    height: 32,
    fill: false,
  },
  { className: 'circle left-[2.5%] top-[29%]', width: 85, height: 85 },
  { className: 'circle bottom-[48%] left-[22%]', width: 20, height: 20 },
  {
    className: 'circle bottom-[37%] left-[15%]',
    width: 47,
    height: 47,
    fill: false,
  },
  {
    className: 'circle bottom-[13%] left-[6%]',
    width: 62,
    height: 62,
    fill: false,
  },
  { className: 'circle right-[12%] top-[15%]', width: 20, height: 20 },
  {
    className: 'circle right-[2%] top-[30%]',
    width: 73,
    height: 73,
    fill: false,
  },
  {
    className: 'circle right-[19%] top-[48%]',
    width: 37,
    height: 37,
    fill: false,
  },
  { className: 'circle right-[33%] top-[54%]', width: 20, height: 20 },
  { className: 'circle bottom-[20%] right-[3%]', width: 65, height: 65 },
] as const;

const HomeBanner: React.FC<HomeBannerProps> = ({
  banner: bannerData,
  sponsors,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const handleMouseMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      circlesRef.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.to(circle, {
          x: mx * (10 + i * 1.2),
          y: my * (6 + i * 0.8),
          duration: 1.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };

    const ctx = gsap.context(() => {
      const entranceTargets = [
        headingRef.current,
        subtitleRef.current,
        btnRef.current,
        videoRef.current,
      ].filter(Boolean);

      if (prefersReducedMotion) {
        gsap.set(entranceTargets, { opacity: 1, y: 0, scale: 1 });
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          headingRef.current,
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, delay: 0.2 }
        )
          .fromTo(
            subtitleRef.current,
            { y: 32, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75 },
            '-=0.55'
          )
          .fromTo(
            btnRef.current,
            { y: 24, opacity: 0, scale: 0.94 },
            { y: 0, opacity: 1, scale: 1, duration: 0.65 },
            '-=0.45'
          )
          .fromTo(
            videoRef.current,
            { y: 56, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1, duration: 1 },
            '-=0.35'
          );

        circlesRef.current.forEach((circle, i) => {
          if (!circle) return;
          gsap.to(circle, {
            x: `random(-10, 10)`,
            y: `random(-7, 7)`,
            repeat: -1,
            yoyo: true,
            duration: 3.2 + i * 0.25,
            ease: 'sine.inOut',
            delay: i * 0.12,
          });
        });

        window.addEventListener('mousemove', handleMouseMove, {
          passive: true,
        });
      }

      const banner = sectionRef.current;
      const bannerBg = banner?.querySelector(
        '.banner-bg'
      ) as HTMLElement | null;
      const bannerContent = banner?.querySelector('.banner-content');
      const header = document.querySelector('.header') as HTMLElement | null;

      if (
        banner &&
        bannerBg &&
        bannerContent &&
        header &&
        !prefersReducedMotion
      ) {
        const position =
          ((banner.offsetHeight ?? 0) - bannerBg.offsetHeight) * 0.35;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: banner,
              start: () => `top ${header.clientHeight}`,
              end: 'bottom top',
              scrub: 0.6,
            },
          })
          .fromTo(bannerBg, { y: 0 }, { y: -position, ease: 'none' })
          .fromTo(
            bannerContent,
            { y: 0 },
            { y: position * 0.45, ease: 'none' },
            '<'
          )
          .fromTo(
            '.banner-bg .circle',
            { y: 0 },
            { y: position * 0.25, ease: 'none' },
            '<'
          );
      }
    }, sectionRef);

    return () => {
      if (!prefersReducedMotion) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      ctx.revert();
    };
  }, []);

  const { isRTL } = useRTL();
  const circleConfigs = isRTL ? RTL_CIRCLES : LTR_CIRCLES;
  return (
    <section
      ref={sectionRef}
      className="section banner overflow-hidden pt-0"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label="معرفی فرانت‌چپتر"
    >
      <div className="container-xl">
        <div className="relative">
          <div
            className={`bg-theme banner-bg col-12 absolute top-0 ${isRTL ? 'right-0' : 'left-0'}`}
            aria-hidden="true"
          >
            {circleConfigs.map((props, i) => (
              <Circle
                key={props.className}
                {...props}
                ref={(el: HTMLDivElement | null) => {
                  circlesRef.current[i] = el;
                }}
              />
            ))}
          </div>
          <div className="row overflow-hidden rounded-2xl">
            <div className="col-12">
              <div className="row relative justify-center pb-6 pb-md-8 pb-lg-10">
                <header className="banner-content col-12 col-md-11 col-lg-10 px-4 pb-8 pb-md-10 pb-lg-12 pt-14 pt-md-20 pt-lg-24 text-center md:px-6">
                  <div ref={headingRef} className="banner-heading opacity-0">
                    {markdownify({
                      content: bannerData.title,
                      tag: 'h1',
                      className:
                        'mb-3 mb-md-4 mb-lg-5 text-h1-sm leading-tight md:text-h1 lg:text-[3.25rem]',
                    })}
                  </div>
                  <div
                    ref={subtitleRef}
                    className="banner-subtitle opacity-0 pb-5 pb-md-6 pb-lg-8"
                  >
                    {markdownify({
                      content: bannerData.subtitle,
                      tag: 'p',
                      className:
                        'mx-auto max-w-2xl text-base font-light text-muted md:text-lg',
                    })}
                  </div>
                  <div ref={btnRef} className="banner-btn opacity-0">
                    <Link
                      className="btn btn-primary inline-flex min-h-12 items-center px-6 py-3 text-sm transition-transform duration-300 hover:scale-105 md:px-8 md:text-base"
                      href={bannerData.link.href}
                    >
                      {bannerData.link.label}
                    </Link>
                  </div>
                </header>
                <div className="col-12 col-md-11 col-lg-10 px-3 md:px-5 lg:px-6">
                  <figure
                    ref={videoRef}
                    className="banner-video mx-auto w-full max-w-4xl opacity-0 lg:max-w-5xl xl:max-w-[1070px]"
                  >
                    <div className="banner-video-frame aspect-video overflow-hidden rounded-2xl border-[6px] border-white md:rounded-3xl md:border-[12px] lg:border-[16px]">
                      <LazyVideo
                        className="block h-auto w-full"
                        src={bannerData.video}
                        label="ویدیوی معرفی فرانت‌چپتر"
                        lazy={false}
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
          <aside
            className="row border-y border-border py-5"
            aria-labelledby="sponsors-heading"
          >
            <div
              className={`animate ${isRTL ? 'from-left' : 'from-right'} col-12`}
            >
              <p
                id="sponsors-heading"
                className="mb-5 text-center text-sm font-medium text-muted md:text-base"
              >
                {sponsors.title}
              </p>
              <SponsorCarousel
                sponsors={sponsors.list}
                isRTL={isRTL}
                withReferral={withFrontChapterReferral}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
