'use client';

import clsx from 'clsx';
import React, { useRef } from 'react';
import { useYearStatsAnimations } from '../../hooks/useYearStatsAnimations';
import type { GalleryImage, Speaker, Stat } from '../../types/content';
import GalleryImageCard from '../components/GalleryImageCard';
import ImageLightbox from '../components/ImageLightbox';
import LazyVideo from '../components/LazyVideo';
import SectionDecorations from '../components/SectionDecorations';
import SectionHeading from '../components/SectionHeading';
import SpeakersShowcase from '../components/SpeakersShowcase';
import YearStatsShowcase from '../components/YearStatsShowcase';
import { useImageLightbox } from '../../hooks/useImageLightbox';

export interface YearOneStatsProps {
  title: string;
  year: string;
  stats: Stat[];
  gatherings: {
    title: string;
    description: string;
  };
  conference: {
    title: string;
    description: string;
  };
  images: GalleryImage[];
  video?: {
    src: string;
    label: string;
    poster?: string;
  };
  galleryTitle?: string;
  speakers?: {
    title: string;
    list: Speaker[];
  };
}

const YearOneStats: React.FC<YearOneStatsProps> = ({
  title,
  year,
  stats,
  gatherings,
  conference,
  images,
  video,
  galleryTitle = 'تصاویر لحظات ماندگار',
  speakers,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const speakersRef = useRef<HTMLDivElement>(null);

  const lightbox = useImageLightbox(images);

  useYearStatsAnimations({
    yearRef,
    statsRef,
    sectionRef,
    blockRefs: [detailsRef],
    cardSelectors: speakers
      ? [{ containerRef: speakersRef, selector: '.speaker-card' }]
      : [],
  });

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center justify-center gap-8 md:gap-14 py-10 md:py-20 relative overflow-hidden px-4 md:px-6"
      aria-labelledby={`year-one-heading`}
    >
      <SectionDecorations />

      <YearStatsShowcase
        title={title}
        year={year}
        stats={stats}
        yearRef={yearRef}
        statsRef={statsRef}
        headingId="year-one-heading"
      />

      <article
        ref={detailsRef}
        className="w-full max-w-4xl flex flex-col items-stretch justify-center gap-8 md:gap-10 py-6 md:py-8"
      >
        <div>
          <h3 className="text-lg md:text-xl font-bold text-primary mb-4 md:mb-5">
            {galleryTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-3 sm:gap-4 md:gap-5 w-full">
            {video && (
              <figure
                className={clsx(
                  'image-container group relative rounded-xl overflow-hidden',
                  'shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20',
                  'transition-all duration-300 col-span-2 row-span-2 md:col-span-2 md:row-span-2'
                )}
              >
                <div className="relative w-full aspect-video min-h-[180px] sm:min-h-[220px]">
                  <LazyVideo
                    src={video.src}
                    label={video.label}
                    showLiveBadge
                    controls
                    poster={video.poster}
                    playsInline
                  />
                </div>
              </figure>
            )}

            {images.map((img, idx) => (
              <GalleryImageCard
                key={img.alt + idx}
                image={img}
                onClick={() => lightbox.openLightbox(idx)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-10 w-full mt-4 md:mt-6">
          <article className="relative bg-surface-muted p-4 sm:p-6 rounded-xl md:bg-transparent md:p-0">
            <SectionHeading as="h3">{gatherings.title}</SectionHeading>
            <p className="text-text leading-relaxed text-base md:text-lg">
              {gatherings.description}
            </p>
            <div
              className="border-t border-[#ffece4]/30 mt-6 mb-6 md:mt-8 md:mb-8"
              aria-hidden="true"
            />
          </article>
          <article className="relative bg-surface-muted p-4 sm:p-6 rounded-xl md:bg-transparent md:p-0">
            <SectionHeading as="h3">{conference.title}</SectionHeading>
            <p className="text-text leading-relaxed text-base md:text-lg">
              {conference.description}
            </p>
          </article>

          {speakers && speakers.list.length > 0 && (
            <SpeakersShowcase
              title={speakers.title}
              speakers={speakers.list}
              containerRef={speakersRef}
            />
          )}
        </div>
      </article>

      <ImageLightbox
        images={images}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.closeLightbox}
        onPrevious={lightbox.goToPrevious}
        onNext={lightbox.goToNext}
        onGoToImage={lightbox.goToImage}
      />
    </section>
  );
};

export default YearOneStats;
