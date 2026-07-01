'use client';

import { useEffect, useState } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageFallback from './ImageFallback';

export interface Sponsor {
  name: string;
  url: string;
  logo: string;
}

interface SponsorCarouselProps {
  sponsors: Sponsor[];
  isRTL: boolean;
  // eslint-disable-next-line no-unused-vars
  withReferral: (url: string) => string;
}

const SponsorLink = ({
  sponsor,
  sponsorUrl,
  priority,
}: {
  sponsor: Sponsor;
  sponsorUrl: string;
  priority?: boolean;
}) => {
  const isRoundedLogo =
    sponsor.url.includes('liara.ir') || sponsor.url.includes('winatalent.com');
  const showName = sponsor.name !== 'XWORK';

  return (
    <a
      href={sponsorUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-12 h-full items-center justify-center gap-2.5"
      aria-label={`وب‌سایت ${sponsor.name}`}
    >
      <div
        className={`relative h-10 w-12 shrink-0 md:h-11 md:w-14${
          isRoundedLogo ? ' overflow-hidden rounded-xl' : ''
        }`}
      >
        <ImageFallback
          className={`object-contain${isRoundedLogo ? ' rounded-xl' : ''}`}
          src={sponsor.logo}
          sizes="56px"
          alt={`لوگوی ${sponsor.name}`}
          fill={true}
          priority={priority}
          fallback=""
        />
      </div>
      {showName && (
        <span className="max-w-[5rem] text-center text-xs font-medium leading-tight text-text sm:max-w-none sm:text-sm">
          {sponsor.name}
        </span>
      )}
    </a>
  );
};

const SponsorCarousel = ({
  sponsors,
  isRTL,
  withReferral,
}: SponsorCarouselProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 px-4">
        {sponsors.map((sponsor, index) => (
          <li key={sponsor.name} className="px-2 py-2">
            <SponsorLink
              sponsor={sponsor}
              sponsorUrl={withReferral(sponsor.url)}
              priority={index < 5}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Swiper
      loop={sponsors.length > 4}
      slidesPerView={2}
      breakpoints={{
        576: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 5 },
      }}
      spaceBetween={20}
      modules={[Autoplay]}
      autoplay={{ delay: 3000 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {sponsors.map((sponsor, index) => (
        <SwiperSlide
          className="cursor-pointer px-4 py-4 lg:px-6"
          key={sponsor.name}
        >
          <SponsorLink
            sponsor={sponsor}
            sponsorUrl={withReferral(sponsor.url)}
            priority={index < 5}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SponsorCarousel;
