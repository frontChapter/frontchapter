'use client';
import { gsap } from '@lib/gsap';
import { markdownify } from '@lib/utils/textConverter';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Circle from './Circle';
import ImageFallback from './ImageFallback';

interface BannerProps {
  title: string;
}

const Banner = ({ title }: BannerProps) => {
  const banner = useRef<HTMLDivElement>(null);

  //banner animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = document.querySelector('.header') as HTMLElement | null;
      const tl = gsap.timeline();
      tl.fromTo(
        '.banner-regular-title',
        {
          y: 20,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        }
      ).fromTo(
        '.breadcrumb',
        {
          y: 20,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        },
        '>-.3'
      );
      //parallax banner
      const parallaxTl = gsap.timeline({
        ease: 'none',
        scrollTrigger: {
          trigger: banner.current,
          start: () => `top ${header?.clientHeight ?? 0}`,
          end: () => `+=${banner.current?.offsetHeight ?? 0}`,
          scrub: true,
        },
      });

      const position = (banner.current?.offsetHeight ?? 0) * 0.15;
      parallaxTl.fromTo(
        '.banner-single .circle',
        {
          y: 0,
        },
        {
          y: position,
        },
        '<'
      );
    }, banner);

    return () => ctx.revert();
  }, []);

  return (
    <div className="banner banner-single " ref={banner}>
      <div className="container-xl ">
        <div className="banner-wrapper relative text-center">
          {markdownify({
            content: title,
            tag: 'h1',
            className: 'mb-8 banner-regular-title opacity-0',
          })}
          <ul className="breadcrumb flex items-center justify-center opacity-0">
            <li>
              <Link className="text-primary" href="/">
                خانه
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="capitalize">{title}</li>
          </ul>
          <div className="bg-theme banner-bg col-12 absolute left-0 top-0 bg-theme-light before:hidden after:hidden">
            <ImageFallback
              priority={true}
              fill={true}
              src="/images/vectors/single-banner-wave-1.svg"
              sizes="100vw"
              alt=""
              fallback={''}
            />
            <ImageFallback
              priority={true}
              fill={true}
              src="/images/vectors/single-banner-wave-2.svg"
              sizes="100vw"
              alt=""
              fallback={''}
            />
            <Circle
              className="circle left-[15%] top-[18%]"
              width={32}
              height={32}
              fill={false}
            />
            <Circle
              className="circle bottom-[27%] left-[4%]"
              width={73}
              height={73}
            />
            <Circle
              className="circle bottom-[27%] left-[39.5%]"
              width={20}
              height={20}
            />
            <Circle
              className="circle bottom-[24%] left-[22%]"
              width={47}
              height={47}
              fill={false}
            />
            <Circle
              className="circle left-[31%] top-[10%]"
              width={62}
              height={62}
              fill={false}
            />
            <Circle
              className="circle right-[27%] top-[15%]"
              width={20}
              height={20}
              fill={false}
            />
            <Circle
              className="circle bottom-[17%] right-[3%]"
              width={73}
              height={73}
              fill={false}
            />
            <Circle
              className="circle bottom-[50%] right-[38%]"
              width={20}
              height={20}
              fill={false}
            />
            <Circle
              className="circle right-[13%] top-[30%]"
              width={20}
              height={20}
            />
            <Circle
              className="circle bottom-[29%] right-[20%]"
              width={65}
              height={65}
            />
            <Circle
              className="circle bottom-[12%] right-[35%]"
              width={37}
              height={37}
              fill={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
