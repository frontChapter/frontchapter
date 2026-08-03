'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import type { GalleryImage } from '../../types/content';
import GalleryClickOverlay from './GalleryClickOverlay';
import ZoomCarrotChip from './ZoomCarrotChip';

export interface GalleryImageCardProps {
  image: GalleryImage;
  onClick?: () => void;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  width?: number;
  height?: number;
  showZoomIcon?: boolean;
  showMobileZoom?: boolean;
}

const DEFAULT_SIZES =
  '(max-width: 640px) 300px, (max-width: 1024px) 400px, 600px';

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({
  image,
  onClick,
  className,
  containerClassName = 'relative w-full h-32 sm:h-36 md:h-56',
  sizes = DEFAULT_SIZES,
  width = 600,
  height = 400,
  showZoomIcon = true,
  showMobileZoom = false,
}) => {
  const label = image.label || image.alt;

  return (
    <figure
      className={clsx(
        'image-container group relative rounded-xl overflow-hidden',
        'shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20',
        'transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className={containerClassName}>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"
          aria-hidden="true"
        />
        {image.jpgSrc ? (
          <picture>
            <source srcSet={image.src} type="image/webp" />
            <source srcSet={image.jpgSrc} type="image/jpeg" />
            <Image
              src={image.jpgSrc}
              alt={image.alt}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              width={width}
              height={height}
              loading="lazy"
              sizes={sizes}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </picture>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            width={width}
            height={height}
            loading="lazy"
            sizes={sizes}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {label && (
          <figcaption className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
            <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
              {label}
            </span>
          </figcaption>
        )}
        {showZoomIcon && onClick && (
          <>
            <div
              className="absolute inset-0 z-30 hidden items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 md:flex"
              aria-hidden="true"
            >
              <ZoomCarrotChip />
            </div>
            {showMobileZoom && (
              <div
                className="absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none active:opacity-100 md:hidden"
                aria-hidden="true"
              >
                <ZoomCarrotChip size="sm" />
              </div>
            )}
          </>
        )}
        {onClick && <GalleryClickOverlay label={label} onClick={onClick} />}
      </div>
    </figure>
  );
};

export default GalleryImageCard;
