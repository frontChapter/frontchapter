'use client';

import GalleryClickOverlay from '@layouts/components/GalleryClickOverlay';
import ImageLightbox from '@layouts/components/ImageLightbox';
import { JOIN_GALLERY_IMAGES } from '@lib/membership/join-presets';
import { useImageLightbox } from '@hooks/useImageLightbox';
import Image from 'next/image';
import { useMemo } from 'react';

const JoinCommunityGallery = () => {
  const images = useMemo(
    () =>
      JOIN_GALLERY_IMAGES.map((img) => ({
        src: img.src,
        alt: img.alt,
      })),
    []
  );
  const lightbox = useImageLightbox(images);

  return (
    <>
      <div className="join-gallery">
        <p className="join-gallery__title">لحظه‌های جامعه</p>
        <p className="join-gallery__lede">
          دورهمی‌ها و همایش‌هایی که هر سال جامعه را دور هم جمع می‌کند.
        </p>
        <ul className="join-gallery__grid list-none p-0">
          {JOIN_GALLERY_IMAGES.map((img, idx) => (
            <li
              key={img.src}
              className={
                idx === 0
                  ? 'join-gallery__item join-gallery__item--lead group'
                  : 'join-gallery__item group'
              }
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 200px"
                unoptimized
              />
              <GalleryClickOverlay
                label={img.alt}
                onClick={() => lightbox.openLightbox(idx)}
              />
            </li>
          ))}
        </ul>
      </div>

      <ImageLightbox
        images={images}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.closeLightbox}
        onPrevious={lightbox.goToPrevious}
        onNext={lightbox.goToNext}
        onGoToImage={lightbox.goToImage}
      />
    </>
  );
};

export default JoinCommunityGallery;
