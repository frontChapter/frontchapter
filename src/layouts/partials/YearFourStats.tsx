'use client';

import { externalLinkProps } from '@lib/seo/links';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import { CarrotButton } from '../components/carrot';
import GalleryClickOverlay from '../components/GalleryClickOverlay';
import ImageLightbox from '../components/ImageLightbox';
import LazyVideo from '../components/LazyVideo';
import SectionDecorations from '../components/SectionDecorations';
import SpeakersShowcase, { Speaker } from '../components/SpeakersShowcase';
import YearStatsShowcase from '../components/YearStatsShowcase';
import ConferencePageLink from '../components/ConferencePageLink';
import ZoomCarrotChip from '../components/ZoomCarrotChip';
import { useImageLightbox } from '../../hooks/useImageLightbox';
import { useYearStatsAnimations } from '../../hooks/useYearStatsAnimations';
import type { Stat } from '../../types/content';

export interface YearFourStatsProps {
  title: string;
  year: string;
  stats: Stat[];
  birthday: {
    title: string;
    description: string;
    image: string;
  };
  communityCollaboration?: {
    title: string;
    description: string;
    collaborations: Array<{
      community: string;
      title: string;
      presenter: string;
      image: string;
      link: string;
      color: string;
    }>;
  };
  conference?: {
    title: string;
    description: string;
    images: {
      video: string;
      video_label: string;
      video_poster: string;
      gallery: Array<{
        src: string;
        label: string;
      }>;
    };
  };
  conferenceSlug?: string;
  events: Array<{
    title: string;
    description: string;
    image: string;
    link: {
      label: string;
      href: string;
    };
  }>;
  speakers?: {
    title: string;
    list: Speaker[];
  };
}

const YearFourStats: React.FC<YearFourStatsProps> = ({
  title,
  year,
  stats,
  birthday,
  communityCollaboration,
  conference,
  conferenceSlug,
  events,
  speakers,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLHeadingElement>(null);
  const birthdayRef = useRef<HTMLDivElement>(null);
  const conferenceRef = useRef<HTMLDivElement>(null);
  const speakersRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  // Create lightbox for conference images
  const conferenceImages =
    conference?.images.gallery.map((img) => ({
      src: img.src,
      alt: `همایش ${year} فرانت‌چپتر`,
      label: img.label,
    })) || [];
  const conferenceLightbox = useImageLightbox(conferenceImages);

  // Create lightbox for birthday image
  const birthdayImages = [
    {
      src: birthday.image,
      alt: `${birthday.title} — فرانت‌چپتر سال ${year}`,
      label: birthday.title,
    },
  ];
  const birthdayLightbox = useImageLightbox(birthdayImages);

  // Create lightbox for events images
  const eventsImages = events.map((event) => ({
    src: event.image,
    alt: `${event.title} — رویداد فرانت‌چپتر سال ${year}`,
    label: event.title,
  }));
  const eventsLightbox = useImageLightbox(eventsImages);

  useYearStatsAnimations({
    yearRef,
    statsRef,
    sectionRef,
    blockRefs: [birthdayRef, ...(conference ? [conferenceRef] : []), eventsRef],
    cardSelectors: speakers
      ? [{ containerRef: speakersRef, selector: '.speaker-card' }]
      : [],
  });

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center justify-center gap-5 md:gap-8 py-6 md:py-12 relative overflow-hidden px-4 md:px-6"
      aria-labelledby="year-four-heading"
    >
      <SectionDecorations />
      <YearStatsShowcase
        title={title}
        year={year}
        stats={stats}
        yearRef={yearRef}
        statsRef={statsRef}
        headingId="year-four-heading"
      />
      {/* Conference Section */}
      {conference && (
        <div
          ref={conferenceRef}
          className="w-full py-12 md:py-24 px-6 md:px-10 bg-surface rounded-2xl backdrop-blur-sm shadow-sm"
        >
          <div className="flex flex-col max-w-5xl mx-auto gap-12">
            {/* Title and Description */}
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="font-bold text-2xl md:text-3xl text-primary mb-5 inline-flex items-center flex-wrap justify-center">
                <span
                  className="me-2.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary/50 shadow-[0_0_0_3px] shadow-primary/15"
                  aria-hidden="true"
                />
                {conference.title}
              </h3>
              <p className="text-text leading-relaxed text-base md:text-lg">
                {conference.description}
              </p>
              {conferenceSlug && (
                <ConferencePageLink slug={conferenceSlug} className="mt-5" />
              )}
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
                  controls
                  loop
                  playsInline
                  poster={conference.images.video_poster}
                />
              </figure>

              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-6 md:gap-8 w-full">
                {conference.images.gallery.map((image, idx) => (
                  <figure
                    key={idx}
                    className={`image-container group relative rounded-xl overflow-hidden
                      shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20
                      transition-all duration-300 cursor-pointer
                      aspect-square w-full
                      ${idx % 2 !== 0 ? 'mt-6' : ''}`}
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
                      <div
                        className="absolute inset-0 z-30 hidden items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 md:flex"
                        aria-hidden="true"
                      >
                        <ZoomCarrotChip />
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
      )}
      {/* Community Collaboration Section */}
      {communityCollaboration && (
        <div className="w-full py-10 md:py-14 px-4 md:px-6 mt-12 mb-12 rounded-3xl">
          <div className="max-w-6xl mx-auto relative">
            {/* Title Section */}
            <div className="text-center mb-12 md:mb-16 pt-4">
              <h3 className="text-2xl font-bold text-primary md:text-3xl">
                {communityCollaboration.title}
              </h3>
              <p className="text-text text-sm md:text-base max-w-2xl mx-auto mt-5 leading-loose">
                {communityCollaboration.description}
              </p>
            </div>

            {/* Modern Card Layout */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
              {communityCollaboration.collaborations.map((collab) => (
                <article
                  key={`${collab.community}-${collab.title}`}
                  className="collab-card group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={collab.image}
                      alt={`رویداد مشترک فرانت‌چپتر و ${collab.community}`}
                      width={600}
                      height={450}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-0 right-0">
                      <div
                        className="rounded-bl-xl px-4 py-2 font-medium"
                        style={{
                          backgroundColor: collab.color,
                          color:
                            collab.color === '#FFCE31' ? '#1f2937' : 'white',
                        }}
                      >
                        {collab.community}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-grow flex-col p-6">
                    <h3 className="mb-4 flex items-start text-right text-xl font-bold text-dark transition-colors group-hover:text-primary">
                      <span
                        className="collab-card__accent mt-2"
                        style={{ backgroundColor: collab.color }}
                        aria-hidden="true"
                      />
                      {collab.title}
                    </h3>

                    <div className="mb-4 mt-auto flex items-center">
                      <div className="mr-3 flex-grow text-right">
                        <span className="text-sm text-muted">ارائه‌دهنده</span>
                        <p className="font-medium text-dark">
                          {collab.presenter}
                        </p>
                      </div>
                      <div className="rounded-full bg-theme-light p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={collab.color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <Link
                        href={collab.link}
                        {...externalLinkProps(collab.link)}
                        className="carrot-text-link"
                        style={{ color: collab.color }}
                      >
                        <span>مشاهده گزارش کامل</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M19 12H5M12 19l-7-7 7-7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Birthday Section */}
      <div
        ref={birthdayRef}
        className="w-full py-8 md:py-14 px-6 md:px-10 bg-surface rounded-2xl backdrop-blur-sm shadow-sm"
      >
        <div className="flex flex-col max-w-5xl mx-auto gap-6">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="mb-3 inline-flex flex-wrap items-center justify-center text-2xl font-bold text-primary md:text-3xl">
              <span
                className="me-2.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary/50 shadow-[0_0_0_3px] shadow-primary/15"
                aria-hidden="true"
              />
              {birthday.title}
            </h3>
            <p className="text-text leading-relaxed text-base md:text-lg py-4">
              {birthday.description}
            </p>
          </div>

          {/* Birthday Image */}
          <figure className="image-container group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer w-full max-w-4xl mx-auto">
            <div className="relative w-full h-full aspect-[16/9]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
              <Image
                src={birthday.image}
                alt={`${birthday.title} — فرانت‌چپتر سال ${year}`}
                width={900}
                height={506}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div
                className="absolute inset-0 z-30 hidden items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 md:flex"
                aria-hidden="true"
              >
                <ZoomCarrotChip />
              </div>
              <GalleryClickOverlay
                label={birthday.title}
                onClick={() => birthdayLightbox.openLightbox(0)}
              />
            </div>
          </figure>
        </div>
      </div>
      {/* Events Section */}
      <div
        ref={eventsRef}
        className="w-full py-8 md:py-14 px-6 md:px-10 bg-surface rounded-2xl backdrop-blur-sm shadow-sm mt-5"
      >
        <div className="flex flex-col max-w-5xl mx-auto gap-6">
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-12">
            {events.map((event, idx) => (
              <React.Fragment key={idx}>
                {idx % 2 === 0 ? (
                  <>
                    {/* Image (Left) */}
                    <figure className="image-container group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer aspect-video w-full">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                        <Image
                          src={event.image}
                          alt={`${event.title} — رویداد فرانت‌چپتر سال ${year}`}
                          width={600}
                          height={450}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
                          <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                            {event.title}
                          </span>
                        </div>
                        <div
                          className="absolute inset-0 z-30 hidden items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 md:flex"
                          aria-hidden="true"
                        >
                          <ZoomCarrotChip />
                        </div>
                        <GalleryClickOverlay
                          label={event.title}
                          onClick={() => eventsLightbox.openLightbox(idx)}
                        />
                      </div>
                    </figure>
                    {/* Content (Right) */}
                    <div className="flex flex-col justify-center gap-5 px-0 md:px-8">
                      <div className="text-right">
                        <h3 className="font-bold text-xl md:text-2xl text-primary mb-5">
                          {event.title}
                        </h3>
                        <p className="text-text text-base md:text-lg">
                          {event.description}
                        </p>
                      </div>
                      <div>
                        <CarrotButton
                          href={event.link.href}
                          variant="primary"
                          {...externalLinkProps(event.link.href)}
                        >
                          {event.link.label}
                        </CarrotButton>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Content (Left) */}
                    <div className="flex flex-col justify-center gap-5 px-0 md:px-8">
                      <div className="text-right">
                        <h3 className="font-bold text-xl md:text-2xl text-primary mb-5">
                          {event.title}
                        </h3>
                        <p className="text-text text-base md:text-lg">
                          {event.description}
                        </p>
                      </div>
                      <div>
                        <CarrotButton
                          href={event.link.href}
                          variant="primary"
                          {...externalLinkProps(event.link.href)}
                        >
                          {event.link.label}
                        </CarrotButton>
                      </div>
                    </div>
                    {/* Image (Right) */}
                    <figure className="image-container group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer aspect-video w-full">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                        <Image
                          src={event.image}
                          alt={`${event.title} — رویداد فرانت‌چپتر سال ${year}`}
                          width={600}
                          height={450}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
                          <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                            {event.title}
                          </span>
                        </div>
                        <div
                          className="absolute inset-0 z-30 hidden items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 md:flex"
                          aria-hidden="true"
                        >
                          <ZoomCarrotChip />
                        </div>
                        <GalleryClickOverlay
                          label={event.title}
                          onClick={() => eventsLightbox.openLightbox(idx)}
                        />
                      </div>
                    </figure>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {conference && conferenceImages.length > 0 && (
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

      <ImageLightbox
        images={birthdayImages}
        currentIndex={birthdayLightbox.currentIndex}
        isOpen={birthdayLightbox.isOpen}
        onClose={birthdayLightbox.closeLightbox}
        onPrevious={birthdayLightbox.goToPrevious}
        onNext={birthdayLightbox.goToNext}
        onGoToImage={birthdayLightbox.goToImage}
      />

      <ImageLightbox
        images={eventsImages}
        currentIndex={eventsLightbox.currentIndex}
        isOpen={eventsLightbox.isOpen}
        onClose={eventsLightbox.closeLightbox}
        onPrevious={eventsLightbox.goToPrevious}
        onNext={eventsLightbox.goToNext}
        onGoToImage={eventsLightbox.goToImage}
      />
    </section>
  );
};

export default YearFourStats;
