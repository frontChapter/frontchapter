'use client';
import clsx from 'clsx';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

export interface YearOneStatsProps {
  title: string;
  year: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  gatherings: {
    title: string;
    description: string;
  };
  conference: {
    title: string;
    description: string;
  };
  images: Array<{
    src: string;
    alt: string;
    label: string;
  }>;
  video?: {
    src: string;
    label: string;
  };
  galleryTitle?: string; // عنوان بخش گالری تصاویر
}

const YearOneStats: React.FC<YearOneStatsProps> = ({
  title,
  year,
  stats,
  gatherings,
  conference,
  images,
  video,
  galleryTitle = 'تصاویر لحظات ماندگار', // مقدار پیش‌فرض برای سازگاری با کد قبلی
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // مطمئن شویم که GSAP و ScrollTrigger فقط در سمت کلاینت اجرا شوند
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // انیمیشن سال به هنگام اسکرول
      gsap.fromTo(
        yearRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: yearRef.current,
            start: 'top bottom',
            end: 'bottom center',
          },
        }
      );

      // انیمیشن آیتم‌های آمار یکی پس از دیگری
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems && statItems.length) {
        gsap.fromTo(
          statItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top bottom',
            },
          }
        );
      }

      // انیمیشن بخش جزئیات
      gsap.fromTo(
        detailsRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: detailsRef.current,
            start: 'top bottom',
          },
        }
      );

      // انیمیشن گالری تصاویر
      const imageContainers =
        detailsRef.current?.querySelectorAll('.image-container');
      if (imageContainers && imageContainers.length) {
        gsap.fromTo(
          imageContainers,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
              trigger: imageContainers[0],
              start: 'top bottom',
            },
          }
        );
      }
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center justify-center gap-14 py-14 md:py-20 relative overflow-visible"
    >
      {/* Background decorations */}
      <div className="absolute -left-24 top-10 w-72 h-72 rounded-full bg-gradient-to-b from-[#ffece4]/20 to-[#ffe6db]/30 opacity-40 blur-3xl -z-10"></div>
      <div className="absolute -right-24 bottom-10 w-72 h-72 rounded-full bg-gradient-to-t from-[#ffece4]/20 to-[#ffe6db]/30 opacity-40 blur-3xl -z-10"></div>
      <div className="absolute left-1/4 top-1/3 w-48 h-48 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 opacity-30 blur-3xl -z-10"></div>

      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-4 text-center relative">
        <p className="uppercase font-medium text-base text-primary mb-2 tracking-wider">
          {title}
        </p>
        <h1
          ref={yearRef}
          className="font-bold text-5xl md:text-7xl text-slate-800 leading-tight bg-gradient-to-r from-slate-800 to-primary bg-clip-text text-transparent"
        >
          {year}
        </h1>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        className="w-full max-w-4xl flex flex-col md:flex-row items-stretch justify-start gap-10 py-10"
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-item flex-1 text-right px-4 relative">
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 w-[1px] h-12 bg-[#ffe6db]/30 last:hidden first:hidden"></div>
            <h2 className="font-bold text-3xl md:text-4xl text-primary mb-3 transition-all hover:scale-110 origin-right">
              {stat.value}
            </h2>
            <p className="text-slate-600 text-lg">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div
        ref={detailsRef}
        className="w-full max-w-4xl flex flex-col items-stretch justify-center gap-10 py-8"
      >
        {/* Conference Gallery */}
        <div>
          <h3 className="text-xl font-bold text-primary mb-5">
            {galleryTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-4 md:gap-5 w-full">
            {/* Video Item */}
            {video && (
              <figure
                className={clsx(
                  'image-container group relative rounded-xl overflow-hidden',
                  'shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20',
                  'transition-all duration-300 md:col-span-2 md:row-span-2'
                )}
              >
                <div className="relative w-full h-full">
                  <div className="absolute top-3 right-3 bg-primary rounded-full px-2 py-1 text-xs font-bold text-white z-20 flex items-center">
                    <span className="me-1 inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    {video.label}
                  </div>

                  {/* نمایش مستقیم ویدیو */}
                  <video
                    src={video.src}
                    controls
                    poster={video.src.replace('.mp4', '.jpg')}
                    className="w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                  >
                    <source src={video.src} type="video/mp4" />
                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند
                  </video>
                </div>
              </figure>
            )}

            {/* Image Items */}
            {images.map((img, idx) => {
              return (
                <figure
                  key={idx}
                  className={clsx(
                    'image-container group relative rounded-xl overflow-hidden',
                    'shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20',
                    'transition-all duration-300'
                  )}
                >
                  <div className="relative w-full h-44 md:h-56">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      width={1200}
                      height={800}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
                      <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full inline-block">
                        {img.label}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                      <span className="w-12 h-12 p-2 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
                        <svg
                          width="256"
                          height="256"
                          viewBox="0 0 256 256"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M151.14 72H102.86C72.3666 72 57.12 72 50.6194 82.2645C44.1187 92.529 50.3074 106.831 62.685 135.435L92.8515 205.149C107.521 239.05 114.855 256 127 256C132.269 256 136.632 252.81 141.082 246.43C143.496 242.968 143.502 238.377 141.58 234.604L131.217 214.257C128.961 209.83 127.834 207.616 128.796 205.985C129.758 204.354 132.192 204.354 137.06 204.354H153.635C158.413 204.354 162.743 201.465 164.683 196.982L175.788 171.318C178.493 165.067 175.759 157.748 169.676 154.955L128.787 136.182C123.376 133.697 125.103 125.393 131.031 125.393H187.731C192.535 125.393 196.906 122.478 198.759 117.929C205.86 100.5 208.394 90.1812 203.381 82.2645C196.88 72 181.633 72 151.14 72Z"
                            fill="#FAFAFA"
                          />
                          <path
                            d="M128.075 63.9808C116.95 64.0307 107.637 61.5 99.3718 55.2065C92.264 49.7941 88.0122 42.4149 85.6601 33.7213C84.5315 29.5505 83.7994 25.3028 84.0488 20.917C84.1246 19.5817 84.5379 18.8738 85.896 18.9084C94.5134 19.1222 102.673 20.9438 109.749 26.4512C110.534 27.063 110.716 26.6816 110.901 26.0735C111.245 24.9521 111.497 23.7999 111.823 22.6721C113.621 16.4709 117.097 11.3016 120.964 6.37032C122.624 4.25418 124.441 2.29552 126.33 0.403418C126.864 -0.131696 127.207 -0.138099 127.734 0.405976C134.215 7.11538 139.978 14.3177 142.516 23.7603C142.599 24.0688 142.652 24.385 142.714 24.6986C143.155 27.0004 143.39 27.0657 145.159 25.7151C148.885 22.8705 153.161 21.342 157.592 20.259C161.065 19.4089 164.558 18.6754 168.171 18.8904C169.4 18.9634 169.993 19.4409 169.999 20.7531C170.065 33.0096 166.479 43.8297 157.923 52.371C152.203 58.0817 145.239 61.5446 137.381 62.9799C133.947 63.6097 130.524 64.1051 128.075 63.9808Z"
                            fill="#FAFAFA"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>

        {/* Text Content Row */}
        <div className="flex flex-col gap-10 w-full mt-6">
          <div className="relative">
            <h4 className="font-bold text-xl md:text-2xl text-primary mb-3 inline-flex items-center">
              <span className="text-3xl text-primary/40 me-2">✫</span>
              {gatherings.title}
            </h4>
            <p className="text-slate-600 leading-relaxed text-lg">
              {gatherings.description}
            </p>
            <div className="border-t border-[#ffece4]/30 mt-8 mb-8" />
          </div>
          <div className="relative">
            <h4 className="font-bold text-xl md:text-2xl text-primary mb-3 inline-flex items-center">
              <span className="text-3xl text-primary/40 me-2">✫</span>
              {conference.title}
            </h4>
            <p className="text-slate-600 leading-relaxed text-lg">
              {conference.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YearOneStats;
