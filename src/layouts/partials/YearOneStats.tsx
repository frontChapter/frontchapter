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
  images: string[];
  video?: string;
}

const YearOneStats: React.FC<YearOneStatsProps> = ({
  title,
  year,
  stats,
  gatherings,
  conference,
  images,
  video,
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
            تصاویر لحظات ماندگار
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
                <div className="relative w-full h-full md:h-[450px]">
                  <div className="absolute top-3 right-3 bg-primary rounded-full px-2 py-1 text-xs font-bold text-white z-20 flex items-center">
                    <span className="mr-1 inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    ویدیو
                  </div>

                  {/* نمایش مستقیم ویدیو */}
                  <video
                    src={video}
                    controls
                    poster={video.replace('.mp4', '.jpg')}
                    className="w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                  >
                    <source src={video} type="video/mp4" />
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
                      src={img}
                      alt="تصویر همایش فرانت‌چپتر"
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
                        بزرگنمایی تصویر
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                      <span className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M8 3h8l4 4-8 11H8L2 7l6-4Z"></path>
                          <path d="m9 13 6-6"></path>
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
