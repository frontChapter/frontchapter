'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';
import { useEffect } from 'react';

interface AnimationRefs {
  yearRef: RefObject<HTMLHeadingElement | null>;
  statsRef: RefObject<HTMLDivElement | null>;
  sectionRef?: RefObject<HTMLElement | null>;
  blockRefs?: RefObject<HTMLElement | null>[];
  cardSelectors?: Array<{
    containerRef: RefObject<HTMLElement | null>;
    selector: string;
  }>;
}

export function useYearStatsAnimations({
  yearRef,
  statsRef,
  sectionRef,
  blockRefs = [],
  cardSelectors = [],
}: AnimationRefs) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    if (yearRef.current) {
      gsap.fromTo(
        yearRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: yearRef.current,
            start: 'top bottom',
            end: 'bottom center',
          },
        }
      );
    }

    const statItems = statsRef.current?.querySelectorAll('.stat-item');
    if (statItems?.length) {
      gsap.fromTo(
        statItems,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top bottom',
          },
        }
      );
    }

    blockRefs.forEach((ref) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
          },
        }
      );
    });

    cardSelectors.forEach(({ containerRef, selector }) => {
      const cards = containerRef.current?.querySelectorAll(selector);
      if (!cards?.length) return;
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
          },
        }
      );
    });

    if (sectionRef?.current) {
      const imageContainers =
        sectionRef.current.querySelectorAll('.image-container');
      if (imageContainers.length) {
        gsap.fromTo(
          imageContainers,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
              trigger: imageContainers[0],
              start: 'top bottom',
            },
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable; run once on mount
  }, []);
}
