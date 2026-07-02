'use client';

import clsx from 'clsx';
import Image from 'next/image';
import type { ConferenceProfile } from '@lib/conferences';
import { useImageLightbox } from '../../hooks/useImageLightbox';
import GalleryImageCard from './GalleryImageCard';
import GalleryClickOverlay from './GalleryClickOverlay';
import ImageLightbox from './ImageLightbox';
import LazyVideo from './LazyVideo';

interface ConferenceGalleryProps {
  conference: ConferenceProfile;
}

const ConferenceGallery = ({ conference }: ConferenceGalleryProps) => {
  const galleryImages =
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

  return (
    <div className="fade mt-12">
      <h2 className="section-title text-h5 text-center">
        {conference.galleryTitle ?? 'گالری همایش'}
      </h2>

      {conference.media && galleryImages.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 place-items-center gap-8 md:grid-cols-2">
          {videoSrc && (
            <figure className="image-container group relative aspect-square w-full overflow-hidden rounded-xl shadow-lg shadow-primary/10">
              <LazyVideo
                src={videoSrc}
                label={videoLabel}
                showLiveBadge
                autoPlay
                loop
                muted
                playsInline
                poster={videoPoster}
              />
            </figure>
          )}

          <div className="grid w-full grid-cols-2 gap-6 md:gap-8">
            {galleryImages.map((image, idx) => (
              <figure
                key={`${image.src}-${idx}`}
                className={clsx(
                  'image-container group relative aspect-square w-full overflow-hidden rounded-xl shadow-lg shadow-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20',
                  idx % 2 !== 0 ? 'mt-6' : ''
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {image.label && (
                  <figcaption className="absolute bottom-0 left-0 right-0 z-20 p-3 text-xs font-medium text-white md:text-sm">
                    <span className="inline-block rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
                      {image.label}
                    </span>
                  </figcaption>
                )}
                <GalleryClickOverlay
                  label={image.label ?? image.alt}
                  onClick={() => lightbox.openLightbox(idx)}
                />
              </figure>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 auto-rows-fr items-stretch gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
          {videoSrc && (
            <figure className="image-container group relative col-span-2 overflow-hidden rounded-xl shadow-lg shadow-primary/10 md:row-span-2 md:h-full">
              <div className="relative aspect-video w-full md:aspect-auto md:h-full">
                <LazyVideo
                  src={videoSrc}
                  label={videoLabel}
                  showLiveBadge
                  controls
                  poster={videoPoster}
                  playsInline
                />
              </div>
            </figure>
          )}

          {galleryImages.map((image, idx) => (
            <GalleryImageCard
              key={`${image.src}-${idx}`}
              image={image}
              onClick={() => lightbox.openLightbox(idx)}
            />
          ))}
        </div>
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
