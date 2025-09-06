'use client';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ImageItem {
  src: string;
  jpgSrc?: string;
  alt: string;
  label?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  className?: string;
  children?: React.ReactNode;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    },
    [isOpen, goToPrevious, goToNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const currentImage = images[currentIndex];

  if (!mounted) return null;

  const lightboxContent =
    isOpen &&
    createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        {/* Close Button */}
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 z-60 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="بستن گالری"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="تصویر قبلی"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="تصویر بعدی"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {/* Main Image */}
        <div className="relative max-w-[90vw] max-h-[90vh] mx-4">
          <div className="relative">
            {currentImage.jpgSrc ? (
              <picture>
                <source srcSet={currentImage.src} type="image/webp" />
                <source srcSet={currentImage.jpgSrc} type="image/jpeg" />
                <Image
                  src={currentImage.jpgSrc}
                  alt={currentImage.alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  priority
                />
              </picture>
            ) : (
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
                priority
              />
            )}
          </div>

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
            <div className="text-center text-white">
              <p className="text-sm font-medium">
                {currentImage.label || currentImage.alt}
              </p>
              {images.length > 1 && (
                <p className="text-xs text-white/70 mt-1">
                  {currentIndex + 1} از {images.length}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-opacity ${
                  index === currentIndex
                    ? 'opacity-100 ring-2 ring-white'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                {img.jpgSrc ? (
                  <picture>
                    <source srcSet={img.src} type="image/webp" />
                    <source srcSet={img.jpgSrc} type="image/jpeg" />
                    <Image
                      src={img.jpgSrc}
                      alt={img.alt}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                ) : (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Background Click to Close */}
        <div
          className="absolute inset-0 -z-10"
          onClick={closeLightbox}
          aria-label="بستن گالری"
        />
      </div>,
      document.body
    );

  return (
    <>
      <div className={className}>
        {children}
        {images.map((img, index) => (
          <div
            key={index}
            className="image-container group relative rounded-xl overflow-hidden shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative w-full h-32 sm:h-36 md:h-56">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              {img.jpgSrc ? (
                <picture>
                  <source srcSet={img.src} type="image/webp" />
                  <source srcSet={img.jpgSrc} type="image/jpeg" />
                  <Image
                    src={img.jpgSrc}
                    alt={img.alt}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    width={600}
                    height={400}
                    loading="lazy"
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 600px"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </picture>
              ) : (
                <Image
                  src={img.src}
                  alt={img.alt}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  width={600}
                  height={400}
                  loading="lazy"
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 600px"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20">
                <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                  {img.label || img.alt}
                </span>
              </div>
              <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
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
            </div>
          </div>
        ))}
      </div>
      {lightboxContent}
    </>
  );
};

export default ImageGallery;
