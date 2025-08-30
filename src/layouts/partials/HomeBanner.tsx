'use client';

import { gsap } from '@lib/gsap';
import { markdownify } from '@lib/utils/textConverter';
import Link from 'next/link';
import { useEffect } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import React from 'react';
import { useRTL } from '../../hooks/useRTL';
import Circle from '../components/Circle';
import ImageFallback from '../components/ImageFallback';

interface BannerData {
  title: string;
  subtitle: string;
  link: {
    href: string;
    label: string;
  };
  image: string;
}

interface HomeBannerProps {
  banner: BannerData;
  brands: string[];
}

const HomeBanner: React.FC<HomeBannerProps> = ({
  banner: bannerData,
  brands,
}) => {
  // دایره‌های متحرک و تعاملی
  // فقط یکبار تعریف شود
  const circlesRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    // انیمیشن شناوری و حرکت تصادفی اولیه
    circlesRef.current.forEach((circle) => {
      if (!circle) return;
      gsap.to(circle, {
        x: `+=${Math.random() * 18 - 9}`,
        y: `+=${Math.random() * 12 - 6}`,
        repeat: -1,
        yoyo: true,
        duration: 3 + Math.random() * 2.5,
        ease: 'power2.inOut',
        delay: Math.random() * 1.2,
      });
    });

    // واکنش به موس
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const mx = e.clientX / innerWidth - 0.5;
      const my = e.clientY / innerHeight - 0.5;
      circlesRef.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.to(circle, {
          x: mx * (20 + i * 2),
          y: my * (10 + i * 2),
          duration: 1.2,
          ease: 'power2.out',
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // واکنش به اسکرول
    const handleScroll = () => {
      const scrollY = window.scrollY;
      circlesRef.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.to(circle, {
          y: `+=${Math.sin(scrollY / 100 + i) * 10}`,
          duration: 0.8,
          ease: 'power1.out',
        });
      });
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // دایره‌های متحرک و تعاملی
  // حذف تعریف تکراری

  useEffect(() => {
    // انیمیشن شناوری و حرکت تصادفی اولیه
    circlesRef.current.forEach((circle) => {
      if (!circle) return;
      gsap.to(circle, {
        x: `+=${Math.random() * 40 - 20}`,
        y: `+=${Math.random() * 30 - 15}`,
        repeat: -1,
        yoyo: true,
        duration: 2 + Math.random() * 2,
        ease: 'power1.inOut',
        delay: Math.random() * 2,
      });
    });

    // واکنش به موس
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const mx = e.clientX / innerWidth - 0.5;
      const my = e.clientY / innerHeight - 0.5;
      circlesRef.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.to(circle, {
          x: mx * (20 + i * 2),
          y: my * (10 + i * 2),
          duration: 1.2,
          ease: 'power2.out',
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // واکنش به اسکرول
    const handleScroll = () => {
      const scrollY = window.scrollY;
      circlesRef.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.to(circle, {
          y: `+=${Math.sin(scrollY / 100 + i) * 10}`,
          duration: 0.8,
          ease: 'power1.out',
        });
      });
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    const ctx2 = gsap.context(() => {
      const banner = document.querySelector('.banner') as HTMLElement | null;
      const bannerBg = document.querySelector(
        '.banner-bg'
      ) as HTMLElement | null;
      const bannerContent = document.querySelector('.banner-content');
      const header = document.querySelector('.header') as HTMLElement | null;
      const tl = gsap.timeline();

      tl.fromTo(
        '.banner-title',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.5 }
      )
        .fromTo(
          '.banner-btn',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '>-0.4'
        )
        .fromTo(
          '.banner-img',
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          '>-.5'
        );

      //parallax banner
      if (banner && bannerBg && header) {
        const parallaxTl = gsap.timeline({
          ease: 'none',
          scrollTrigger: {
            trigger: banner,
            start: () => `top ${header.clientHeight}`,
            scrub: true,
          },
        });

        const position =
          ((banner.offsetHeight ?? 0) - (bannerBg.offsetHeight ?? 0)) * 0.4;
        parallaxTl
          .fromTo(
            bannerBg,
            {
              y: 0,
            },
            {
              y: -position,
            }
          )
          .fromTo(
            bannerContent,
            {
              y: 0,
            },
            {
              y: position,
            },
            '<'
          )
          .fromTo(
            '.banner-bg .circle',
            {
              y: 0,
            },
            {
              y: position,
            },
            '<'
          );
      }
    });

    return () => ctx2.revert();
  }, []);

  const { isRTL } = useRTL();
  return (
    <section className="section banner pt-0" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-xl">
        <div className="relative">
          <div
            className={`bg-theme banner-bg col-12 absolute top-0 ${isRTL ? 'right-0' : 'left-0'}`}
          >
            {(isRTL
              ? [
                  {
                    className: 'circle right-[10%] top-12',
                    width: 32,
                    height: 32,
                    fill: false,
                  },
                  {
                    className: 'circle right-[2.5%] top-[29%]',
                    width: 85,
                    height: 85,
                  },
                  {
                    className: 'circle bottom-[48%] right-[22%]',
                    width: 20,
                    height: 20,
                  },
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
                  {
                    className: 'circle left-[12%] top-[15%]',
                    width: 20,
                    height: 20,
                  },
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
                  {
                    className: 'circle left-[33%] top-[54%]',
                    width: 20,
                    height: 20,
                  },
                  {
                    className: 'circle bottom-[20%] left-[3%]',
                    width: 65,
                    height: 65,
                  },
                ]
              : [
                  {
                    className: 'circle left-[10%] top-12',
                    width: 32,
                    height: 32,
                    fill: false,
                  },
                  {
                    className: 'circle left-[2.5%] top-[29%]',
                    width: 85,
                    height: 85,
                  },
                  {
                    className: 'circle bottom-[48%] left-[22%]',
                    width: 20,
                    height: 20,
                  },
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
                  {
                    className: 'circle right-[12%] top-[15%]',
                    width: 20,
                    height: 20,
                  },
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
                  {
                    className: 'circle right-[33%] top-[54%]',
                    width: 20,
                    height: 20,
                  },
                  {
                    className: 'circle bottom-[20%] right-[3%]',
                    width: 65,
                    height: 65,
                  },
                ]
            ).map((props, i) => (
              <Circle
                key={i}
                {...props}
                // @ts-ignore
                ref={(el: HTMLDivElement | null) =>
                  (circlesRef.current[i] = el)
                }
              />
            ))}
          </div>
          <div className="row overflow-hidden rounded-2xl">
            <div className="col-12">
              <div className="row relative justify-center pb-10">
                <div className="banner-content col-10 pb-10 pt-20 text-center">
                  {markdownify({
                    content: bannerData.title,
                    tag: 'h1',
                    className: 'mb-8 banner-title opacity-0',
                  })}
                  <div className="banner-subtitle opacity-0">
                    {markdownify({
                      content: bannerData.subtitle,
                      tag: 'h5',
                      className: 'mb-4 banner-subtitle',
                    })}
                  </div>
                  <div className="banner-btn opacity-0">
                    <Link
                      className="btn btn-primary"
                      href={bannerData.link.href}
                    >
                      {bannerData.link.label}
                    </Link>
                  </div>
                </div>
                <div className="col-10">
                  <ImageFallback
                    className="banner-img opacity-0"
                    src={bannerData.image}
                    width={1170}
                    height={666}
                    priority={true}
                    alt=""
                    fallback={''}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row border-y border-border py-5">
            <div
              className={`animate ${isRTL ? 'from-left' : 'from-right'} col-12`}
            >
              <Swiper
                loop={true}
                slidesPerView={3}
                breakpoints={{
                  992: {
                    slidesPerView: 5,
                  },
                }}
                spaceBetween={20}
                modules={[Autoplay]}
                autoplay={{ delay: 3000 }}
                dir="ltr"
              >
                {brands.map((brand: string, index: number) => (
                  <SwiperSlide
                    className=" h-20 cursor-pointer px-6 py-6 grayscale  transition hover:grayscale-0 lg:px-10"
                    key={'brand-' + index}
                  >
                    <div className="relative h-full">
                      <ImageFallback
                        className="object-contain"
                        src={brand}
                        sizes="100vw"
                        alt=""
                        fill={true}
                        priority={true}
                        fallback={''}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
