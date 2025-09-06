'use client';
import Image from 'next/image';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ImageItem {
  src: string;
  jpgSrc?: string;
  alt: string;
  label?: string;
}

interface ImageLightboxProps {
  images: ImageItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  // eslint-disable-next-line no-unused-vars
  onGoToImage: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  onGoToImage,
}) => {
  const [mounted, setMounted] = useState(false);
  const scrollPositionRef = useRef<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when lightbox is open while preserving scroll position
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position in ref
      scrollPositionRef.current = window.scrollY;

      // Apply styles to prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollPositionRef.current}px`;
    } else {
      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';

      // Restore scroll position using the ref value
      if (scrollPositionRef.current > 0) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          window.scrollTo(0, scrollPositionRef.current);
        }, 0);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const goToPrevious = useCallback(() => {
    onPrevious();
  }, [onPrevious]);

  const goToNext = useCallback(() => {
    onNext();
  }, [onNext]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    },
    [isOpen, onClose, goToPrevious, goToNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Touch handling for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !images.length || currentIndex >= images.length)
    return null;

  const currentImage = images[currentIndex];

  return createPortal(
    <div
      className="lightbox-container fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-60 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
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
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-60 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
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
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-60 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
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
      <div
        className="relative max-w-[95vw] max-h-[90vh] mx-2 sm:mx-4 w-full h-full flex items-center justify-center"
        style={{ maxWidth: '95vw', maxHeight: '90vh' }}
      >
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
                style={{ maxWidth: '100%', maxHeight: '100%' }}
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
              style={{ maxWidth: '100%', maxHeight: '100%' }}
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
        <div
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 max-w-[95vw] overflow-x-auto px-2 sm:px-4"
          style={{ maxWidth: '95vw' }}
        >
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => onGoToImage(index)}
              className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 transition-opacity ${
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
                    sizes="48px"
                  />
                </picture>
              ) : (
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  sizes="48px"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Background Click to Close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="بستن گالری"
      />
    </div>,
    document.body
  );
};

export default ImageLightbox;
