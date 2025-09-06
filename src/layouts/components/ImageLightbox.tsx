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

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !images.length || currentIndex >= images.length)
    return null;

  const currentImage = images[currentIndex];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
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
              onClick={() => onGoToImage(index)}
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
        onClick={onClose}
        aria-label="بستن گالری"
      />
    </div>,
    document.body
  );
};

export default ImageLightbox;
