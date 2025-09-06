import React, { useState, useCallback } from 'react';

export interface ImageItem {
  src: string;
  jpgSrc?: string;
  alt: string;
  label?: string;
}

export const useImageLightbox = (images: ImageItem[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure currentIndex is valid when images change
  React.useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  const openLightbox = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
      setIsOpen(true);
    },
    [images.length]
  );

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToPrevious = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const goToImage = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
    },
    [images.length]
  );

  return {
    isOpen,
    currentIndex,
    openLightbox,
    closeLightbox,
    goToPrevious,
    goToNext,
    goToImage,
  };
};
