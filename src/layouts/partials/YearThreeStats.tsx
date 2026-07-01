'use client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import GalleryClickOverlay from '../components/GalleryClickOverlay';
import ImageLightbox from '../components/ImageLightbox';
import LazyVideo from '../components/LazyVideo';
import SectionDecorations from '../components/SectionDecorations';
import SpeakersShowcase from '../components/SpeakersShowcase';
import YearStatsShowcase from '../components/YearStatsShowcase';
import { useImageLightbox } from '../../hooks/useImageLightbox';
import { useYearStatsAnimations } from '../../hooks/useYearStatsAnimations';
import type { Speaker, Stat } from '../../types/content';

export interface YearThreeStatsProps {
  title: string;
  year: string;
  stats: Stat[];
  conference: {
    title: string;
    description: string;
    images: {
      video: string;
      video_label: string;
      gallery: Array<{
        src: string;
        label: string;
      }>;
    };
  };
  magazine: {
    title: string;
    subtitle: string;
    description: string;
    link: {
      label: string;
      href: string;
    };
    images: Array<{
      src: string;
      label: string;
    }>;
  };
  festival: {
    title: string;
    description: string;
    link: {
      label: string;
      href: string;
    };
    images: Array<{
      src: string;
      label: string;
    }>;
  };
  speakers?: {
    title: string;
    list: Speaker[];
  };
}

const YearThreeStats: React.FC<YearThreeStatsProps> = ({
  title,
  year,
  stats,
  conference,
  magazine,
  festival,
  speakers,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLHeadingElement>(null);
  const conferenceRef = useRef<HTMLDivElement>(null);
  const speakersRef = useRef<HTMLDivElement>(null);
  const magazineRef = useRef<HTMLDivElement>(null);
  const festivalRef = useRef<HTMLDivElement>(null);

  // Create lightbox for conference images
  const conferenceImages = conference.images.gallery.map((img) => ({
    src: img.src,
    alt: `همایش ${year} فرانت‌چپتر`,
    label: img.label,
  }));
  const conferenceLightbox = useImageLightbox(conferenceImages);

  // Create lightbox for magazine images
  const magazineImages = magazine.images.map((img) => ({
    src: img.src,
    alt: magazine.title,
    label: img.label,
  }));
  const magazineLightbox = useImageLightbox(magazineImages);

  useYearStatsAnimations({
    yearRef,
    statsRef,
    sectionRef,
    blockRefs: [conferenceRef, magazineRef, festivalRef],
    cardSelectors: speakers
      ? [{ containerRef: speakersRef, selector: '.speaker-card' }]
      : [],
  });

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center justify-center gap-8 md:gap-14 py-10 md:py-20 relative overflow-hidden px-4 md:px-6"
    >
      <SectionDecorations />

      <YearStatsShowcase
        title={title}
        year={year}
        stats={stats}
        yearRef={yearRef}
        statsRef={statsRef}
      />

      {/* Conference Section */}
      <div
        ref={conferenceRef}
        className="w-full py-12 md:py-24 px-6 md:px-10 bg-surface rounded-2xl backdrop-blur-sm shadow-sm"
      >
        <div className="flex flex-col max-w-5xl mx-auto gap-12">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-bold text-2xl md:text-3xl text-primary mb-5 inline-flex items-center flex-wrap justify-center">
              <span className="text-2xl md:text-3xl text-primary/40 me-2">
                ✯
              </span>
              {conference.title}
            </h2>
            <p className="text-text !leading-loose text-base md:text-lg">
              {conference.description}
            </p>
          </div>

          {/* Media Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
            {/* Video */}
            <figure className="image-container group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 aspect-square w-full">
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary rounded-full px-2 py-1 text-xs font-bold text-white z-20 flex items-center">
                <span className="me-1 inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {conference.images.video_label}
              </div>
              <LazyVideo
                src={conference.images.video}
                label={conference.images.video_label}
                showLiveBadge
                autoPlay
                loop
                muted
                playsInline
              />
            </figure>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 w-full">
              {conference.images.gallery.map((image, idx) => (
                <figure
                  key={idx}
                  className={clsx(
                    'image-container group relative rounded-xl overflow-hidden',
                    'shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20',
                    'transition-all duration-300 cursor-pointer',
                    'aspect-square w-full',
                    idx % 2 !== 0 ? 'mt-6' : ''
                  )}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                    <Image
                      src={image.src}
                      alt={`${image.label} — همایش ${year} فرانت‌چپتر`}
                      width={350}
                      height={350}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 350px"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
                      <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                        {image.label}
                      </span>
                    </div>
                    <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none">
                      <span className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-3 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
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
                    <GalleryClickOverlay
                      label={image.label}
                      onClick={() => conferenceLightbox.openLightbox(idx)}
                    />
                  </div>
                </figure>
              ))}
            </div>
          </div>

          {speakers && speakers.list.length > 0 && (
            <SpeakersShowcase
              title={speakers.title}
              speakers={speakers.list}
              containerRef={speakersRef}
              centered
            />
          )}
        </div>
      </div>

      {/* Magazine Section */}
      <div
        ref={magazineRef}
        className="w-full py-6 md:py-12 px-3 md:px-10 bg-surface rounded-2xl backdrop-blur-sm shadow-sm mt-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-12">
          {/* Images */}
          <div className="flex flex-1 gap-3 md:gap-5 w-full md:w-3/5">
            {magazine.images.map((image, idx) => (
              <figure
                key={idx}
                className={clsx(
                  'image-container group relative rounded-xl overflow-hidden',
                  'shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20',
                  'transition-all duration-300 cursor-pointer',
                  'min-h-[450px] md:min-h-[600px] w-full',
                  idx === 1 ? 'mt-12 md:mt-16' : ''
                )}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                  <Image
                    src={image.src}
                    alt={magazine.title}
                    width={480}
                    height={700}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
                    <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                      {image.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-2 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
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
                  <GalleryClickOverlay
                    label={image.label}
                    onClick={() => magazineLightbox.openLightbox(idx)}
                  />
                </div>
              </figure>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 md:w-2/5 text-right">
            <p className="uppercase font-medium text-base text-primary mb-6 tracking-wider">
              {magazine.subtitle}
            </p>
            <h2 className="font-bold text-2xl md:text-3xl text-primary mb-5 inline-flex items-center flex-wrap">
              <span className="text-2xl md:text-3xl text-primary/40 me-2">
                ✯
              </span>
              {magazine.title}
            </h2>
            <p className="text-text mb-8 leading-relaxed text-base md:text-lg">
              {magazine.description}
            </p>
            <Link
              href={magazine.link.href}
              className="inline-flex min-h-12 items-center px-8 py-4 bg-primary text-white font-semibold rounded hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              {magazine.link.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Festival Section */}
      <div
        ref={festivalRef}
        className="w-full py-12 md:py-24 px-6 md:px-10 bg-surface rounded-2xl backdrop-blur-sm shadow-sm mt-8"
      >
        <div className="flex flex-col max-w-5xl mx-auto gap-8">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-bold text-3xl md:text-5xl text-primary mb-5 inline-flex items-center flex-wrap justify-center">
              <span className="text-3xl md:text-4xl text-primary/40 me-3">
                ✯
              </span>
              {festival.title}
              <span className="text-3xl md:text-4xl text-primary/40 ms-3">
                ✯
              </span>
            </h2>
            <p className="text-text leading-relaxed mb-8 text-base md:text-lg">
              {festival.description}
            </p>
            <Link
              href={festival.link.href}
              className="inline-flex min-h-12 items-center px-8 py-4 bg-primary text-white font-semibold rounded hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              {festival.link.label}
            </Link>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-3 sm:gap-4 md:gap-5 w-full mt-8">
            {festival.images.map((ـ, idx) => (
              <figure
                key={idx}
                className={clsx(
                  'image-container group relative rounded-xl overflow-hidden',
                  'shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/20',
                  'transition-all duration-300 bg-black',
                  idx % 2 !== 0 ? 'mt-6 md:mt-0' : ''
                )}
              >
                <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px]">
                  {/* Decorative curved line on top */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 w-full ${
                      idx === 0
                        ? 'bg-orange-500'
                        : idx === 1
                          ? 'bg-green-500'
                          : idx === 2
                            ? 'bg-yellow-500'
                            : 'bg-primary'
                    }`}
                  ></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    {idx === 0 && (
                      <div className="mb-4">
                        <div className="w-20 h-20 mx-auto mb-2">
                          <Image
                            src="/images/white-logo.svg"
                            alt="جام قهرمانی"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                          مرحله چهارم
                        </h3>
                        <p className="text-sm text-white/70">
                          برای گرفتن هدیه ات بیا روی استیج فرانت چپتر
                        </p>
                      </div>
                    )}

                    {idx === 1 && (
                      <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                          این درونتو کشف کن!
                        </h3>
                        <p className="text-sm text-white/70">
                          ما همیشه تلاش می‌کنیم در کارگاه‌ها و پروژه‌ها طرز فکر
                          خاصی رو پیاده کنیم...
                        </p>
                      </div>
                    )}

                    {idx === 2 && (
                      <div className="mb-4 flex flex-col items-center">
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-400 text-3xl me-2">
                            ★
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            تو هم می‌تونی برنده باشی!
                          </h3>
                        </div>
                        <p className="text-sm text-white/70 mt-2">
                          بیش از ۲۰ میلیون تومان جایزه برای نفرات برتر
                        </p>
                      </div>
                    )}

                    {idx === 3 && (
                      <div className="mb-4 flex flex-col items-center">
                        <div className="bg-green-600/80 px-3 py-1 rounded-lg mb-4">
                          <span className="text-white text-sm font-bold">
                            جشنواره، مسابقه
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                          #من_قهرمانم
                        </h3>
                        <p className="text-sm text-white/70 mt-2">
                          مسابقه بهترین سایت شخصی فارسی
                        </p>
                        <div className="flex items-center mt-4 space-x-3 rtl:space-x-reverse">
                          <Image
                            src="/images/white-logo.svg"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {conferenceImages.length > 0 && (
        <ImageLightbox
          images={conferenceImages}
          currentIndex={conferenceLightbox.currentIndex}
          isOpen={conferenceLightbox.isOpen}
          onClose={conferenceLightbox.closeLightbox}
          onPrevious={conferenceLightbox.goToPrevious}
          onNext={conferenceLightbox.goToNext}
          onGoToImage={conferenceLightbox.goToImage}
        />
      )}

      {magazineImages.length > 0 && (
        <ImageLightbox
          images={magazineImages}
          currentIndex={magazineLightbox.currentIndex}
          isOpen={magazineLightbox.isOpen}
          onClose={magazineLightbox.closeLightbox}
          onPrevious={magazineLightbox.goToPrevious}
          onNext={magazineLightbox.goToNext}
          onGoToImage={magazineLightbox.goToImage}
        />
      )}
    </section>
  );
};

export default YearThreeStats;
