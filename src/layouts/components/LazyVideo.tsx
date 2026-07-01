'use client';

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  label?: string;
  showLiveBadge?: boolean;
  /** Defer loading until the video enters the viewport */
  lazy?: boolean;
  className?: string;
}

const resolveVideoSrc = (src: string) =>
  src.match(/^https?:\/\//) || src.startsWith('/') ? src : `/videos/${src}`;

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  label,
  showLiveBadge = false,
  lazy = true,
  className,
  poster,
  autoPlay,
  loop,
  muted,
  controls,
  playsInline = true,
  preload,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(!lazy);
  const resolvedSrc = resolveVideoSrc(src);

  useEffect(() => {
    if (!lazy || isInView) return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [lazy, isInView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;

    if (autoPlay && muted !== false) {
      video.play().catch(() => {
        /* autoplay may be blocked; controls remain available */
      });
    }
  }, [isInView, autoPlay, muted]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {showLiveBadge && label && (
        <div
          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary rounded-full px-2 py-1 text-xs font-bold text-white z-20 flex items-center"
          aria-hidden="true"
        >
          <span className="me-1 inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
          {label}
        </div>
      )}
      <video
        ref={videoRef}
        className={clsx('w-full h-full object-cover', className)}
        poster={poster}
        playsInline={playsInline}
        preload={preload ?? (lazy ? 'none' : 'metadata')}
        autoPlay={isInView ? autoPlay : false}
        loop={loop}
        muted={muted}
        controls={controls}
        aria-label={label || 'ویدیوی رویداد فرانت‌چپتر'}
        {...rest}
      >
        {isInView && <source src={resolvedSrc} type="video/mp4" />}
        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند
      </video>
    </div>
  );
};

export default LazyVideo;
