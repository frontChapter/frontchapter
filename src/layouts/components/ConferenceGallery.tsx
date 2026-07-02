'use client';

import clsx from 'clsx';
import Image from 'next/image';
import type { ConferenceProfile } from '@lib/conferences';
import { useImageLightbox } from '../../hooks/useImageLightbox';
import GalleryClickOverlay from './GalleryClickOverlay';
import GalleryImageCard from './GalleryImageCard';
import ImageLightbox from './ImageLightbox';
import LazyVideo from './LazyVideo';
import SectionDecorations from './SectionDecorations';
import ZoomIcon from './ZoomIcon';

interface ConferenceGalleryProps {
  conference: ConferenceProfile;
}

interface GalleryItem {
  src: string;
  jpgSrc?: string;
  alt: string;
  label?: string;
}

const ConferenceGalleryImage = ({
  image,
  idx,
  onClick,
}: {
  image: GalleryItem;
  idx: number;
  onClick: () => void;
}) => {
  const label = image.label ?? image.alt;

  return (
    <figure
      className={clsx(
        'conference-gallery-image image-container group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl',
        'shadow-lg shadow-primary/10 transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/25',
        idx % 2 !== 0 ? 'md:mt-8' : ''
      )}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-80" />
      {image.jpgSrc ? (
        <picture className="absolute inset-0">
          <source srcSet={image.src} type="image/webp" />
          <source srcSet={image.jpgSrc} type="image/jpeg" />
          <Image
            src={image.jpgSrc}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 350px"
            loading="lazy"
          />
        </picture>
      ) : (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 350px"
          loading="lazy"
        />
      )}
      {label && (
        <figcaption className="absolute bottom-0 left-0 right-0 z-20 p-3 text-white">
          <span className="inline-block rounded-full bg-black/35 px-3 py-1 text-xs font-medium backdrop-blur-sm md:text-sm">
            {label}
          </span>
        </figcaption>
      )}
      <div className="absolute inset-0 z-30 hidden items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 p-3 backdrop-blur-md">
          <ZoomIcon />
        </span>
      </div>
      <GalleryClickOverlay label={label} onClick={onClick} />
    </figure>
  );
};

const ConferenceGallery = ({ conference }: ConferenceGalleryProps) => {
  const galleryImages: GalleryItem[] =
    conference.images?.map((image) => ({
      src: image.src,
      jpgSrc: image.jpgSrc,
      alt: image.alt,
      label: image.label,
    })) ??
    conference.media?.gallery.map((image) => ({
      src: image.src,
      alt: `${image.label} — ${conference.title}`,
      label: image.label,
    })) ??
    [];

  const lightbox = useImageLightbox(galleryImages);

  if (
    !conference.video &&
    !conference.media?.video &&
    galleryImages.length === 0
  ) {
    return null;
  }

  const videoSrc = conference.video?.src ?? conference.media?.video;
  const videoLabel =
    conference.video?.label ?? conference.media?.video_label ?? 'ویدیو';
  const videoPoster =
    conference.video?.poster ?? conference.media?.video_poster;
  const hasFeaturedLayout = Boolean(videoSrc) && galleryImages.length > 0;

  return (
    <div className="conference-gallery fade relative mt-16 overflow-hidden rounded-3xl border border-[#ffece4]/70 bg-gradient-to-b from-[#fff9f6] via-surface-solid to-[#fff5ef] px-4 py-10 sm:px-6 md:px-8 md:py-14">
      <SectionDecorations variant="compact" />

      <div
        className="pointer-events-none absolute -left-8 top-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-6 bottom-8 h-40 w-40 rounded-full bg-[#ffece4]/50 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-4 top-4 opacity-30 md:inset-x-8"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 800 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M4 60C80 20 160 70 280 35C400 0 520 55 640 28C720 10 780 40 796 48"
            stroke="#FFE4D1"
            strokeWidth="3"
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      <header className="relative mb-8 text-center md:mb-10">
        <span
          className="mb-2 inline-block text-xl text-primary/35"
          aria-hidden="true"
        >
          ✯
        </span>
        <h2 className="section-title text-h5">
          {conference.galleryTitle ?? 'گالری همایش'}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted md:text-base">
          ویدیو و تصاویر لحظات ماندگار همایش {conference.year} فرانت‌چپتر
        </p>
      </header>

      {hasFeaturedLayout ? (
        <div className="relative grid grid-cols-1 place-items-center gap-8 md:grid-cols-2 md:gap-10">
          <div className="conference-video-frame relative w-full">
            <figure className="image-container group relative aspect-square w-full overflow-hidden rounded-[1.15rem] bg-dark shadow-2xl shadow-primary/20">
              <LazyVideo
                src={videoSrc!}
                label={videoLabel}
                showLiveBadge
                controls
                poster={videoPoster}
                playsInline
              />
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2">
                <span className="rounded-full bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {videoLabel}
                </span>
                <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-white">
                  {conference.year}
                </span>
              </div>
            </figure>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 md:gap-7">
            {galleryImages.map((image, idx) => (
              <ConferenceGalleryImage
                key={`${image.src}-${idx}`}
                image={image}
                idx={idx}
                onClick={() => lightbox.openLightbox(idx)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative grid auto-rows-fr grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
          {videoSrc && (
            <div className="conference-video-frame relative col-span-2 md:row-span-2">
              <figure className="image-container group relative h-full overflow-hidden rounded-[1.15rem] shadow-2xl shadow-primary/15">
                <div className="relative aspect-video w-full md:aspect-auto md:h-full md:min-h-[18rem]">
                  <LazyVideo
                    src={videoSrc}
                    label={videoLabel}
                    showLiveBadge
                    controls
                    poster={videoPoster}
                    playsInline
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
              </figure>
            </div>
          )}

          {galleryImages.map((image, idx) => (
            <GalleryImageCard
              key={`${image.src}-${idx}`}
              image={image}
              onClick={() => lightbox.openLightbox(idx)}
              containerClassName="relative w-full aspect-square"
            />
          ))}
        </div>
      )}

      {galleryImages.length > 0 && (
        <p
          className="relative mt-6 text-center text-xs text-muted/80"
          aria-hidden="true"
        >
          {galleryImages.length} تصویر · برای بزرگ‌نمایی کلیک کنید
        </p>
      )}

      <ImageLightbox
        images={galleryImages}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.closeLightbox}
        onPrevious={lightbox.goToPrevious}
        onNext={lightbox.goToNext}
        onGoToImage={lightbox.goToImage}
      />
    </div>
  );
};

export default ConferenceGallery;
