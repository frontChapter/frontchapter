'use client';

import Link from 'next/link';
import React, { useRef } from 'react';
import { useYearStatsAnimations } from '../../hooks/useYearStatsAnimations';
import type { GalleryImage, Stat } from '../../types/content';
import GalleryImageCard from '../components/GalleryImageCard';
import ImageLightbox from '../components/ImageLightbox';
import SectionDecorations from '../components/SectionDecorations';
import SectionHeading from '../components/SectionHeading';
import YearStatsShowcase from '../components/YearStatsShowcase';
import { useImageLightbox } from '../../hooks/useImageLightbox';

export interface YearTwoStatsProps {
  title: string;
  year: string;
  stats: Stat[];
  memories: {
    title: string;
    subtitle: string;
    description: Array<string>;
    link: {
      label: string;
      href: string;
    };
  };
  images: GalleryImage[];
}

const YearTwoStats: React.FC<YearTwoStatsProps> = ({
  title,
  year,
  stats,
  memories,
  images,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLHeadingElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  const lightbox = useImageLightbox(images);

  useYearStatsAnimations({
    yearRef,
    statsRef,
    sectionRef,
  });

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center justify-center gap-6 py-8 md:py-16 relative overflow-hidden px-4 md:px-6"
      aria-labelledby="year-two-heading"
    >
      <SectionDecorations variant="compact" />

      <YearStatsShowcase
        title={title}
        year={year}
        stats={stats}
        yearRef={yearRef}
        statsRef={statsRef}
        headingId="year-two-heading"
      />

      <article className="w-full py-12 px-6 bg-surface rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row items-start justify-between max-w-5xl mx-auto gap-6 md:gap-12">
          <div className="flex-1 md:w-1/2">
            <div
              ref={imagesRef}
              className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-5 w-full"
            >
              {images.map((img, idx) => (
                <GalleryImageCard
                  key={img.alt + idx}
                  image={img}
                  onClick={() => lightbox.openLightbox(idx)}
                  containerClassName="relative w-full aspect-square xs:aspect-[4/3] sm:h-36 md:h-56"
                  sizes="(max-width: 480px) 150px, (max-width: 640px) 300px, (max-width: 1024px) 400px, 600px"
                  showMobileZoom
                />
              ))}
            </div>
          </div>

          <div className="flex-1 md:w-1/2 text-right flex flex-col">
            <p className="text-uppercase text-sm font-bold text-primary mb-4 md:mb-6 tracking-wider">
              {memories.subtitle}
            </p>
            <SectionHeading
              as="h3"
              id="year-two-memories"
              className="text-dark mb-6"
            >
              {memories.title}
            </SectionHeading>

            {memories.description.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-text mb-4 leading-relaxed text-base md:text-lg"
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-8">
              <Link
                href={memories.link.href}
                className="inline-flex min-h-12 items-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                {memories.link.label}
              </Link>
            </div>
          </div>
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

export default YearTwoStats;
