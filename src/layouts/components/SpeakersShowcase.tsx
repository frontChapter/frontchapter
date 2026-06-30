'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoLogoLinkedin } from 'react-icons/io5';

export interface Speaker {
  name: string;
  talk?: string;
  talkSubtitle?: string;
  role: string;
  company?: string;
  companyLogo?: string;
  image: string;
  linkedin?: string;
}

export interface SpeakersShowcaseProps {
  title: string;
  speakers: Speaker[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  titleIcon?: string;
  centered?: boolean;
}

const SpeakersShowcase: React.FC<SpeakersShowcaseProps> = ({
  title,
  speakers,
  containerRef,
  centered = false,
}) => {
  if (!speakers.length) return null;

  const hasTalks = speakers.some((s) => s.talk);

  return (
    <div ref={containerRef} className="w-full">
      <h3
        className={clsx(
          'mb-10 text-base font-medium text-primary md:mb-12 md:text-lg',
          centered ? 'text-center' : 'text-right'
        )}
      >
        {title}
      </h3>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-8 md:gap-y-12">
        {speakers.map((speaker, idx) => {
          const talkFull = [speaker.talk, speaker.talkSubtitle]
            .filter(Boolean)
            .join(' — ');

          return (
            <li
              key={idx}
              className="speaker-card flex w-full flex-col items-center px-1 text-center"
            >
              <div className="relative mb-3 h-[5.5rem] w-[5.5rem] shrink-0 sm:mb-4 sm:h-24 sm:w-24">
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                {speaker.companyLogo ? (
                  <div
                    className="absolute bottom-0 left-1/2 z-10 flex h-5 min-w-[1.5rem] max-w-[2.5rem] -translate-x-1/2 translate-y-[35%] items-center justify-center rounded-full bg-white px-1.5 shadow-sm ring-2 ring-white sm:h-6 sm:max-w-[2.75rem]"
                    title={speaker.company}
                  >
                    <Image
                      src={speaker.companyLogo}
                      alt={speaker.company ?? ''}
                      width={28}
                      height={28}
                      className="h-3 w-auto max-w-[2rem] object-contain sm:h-3.5 sm:max-w-[2.25rem]"
                    />
                  </div>
                ) : speaker.company ? (
                  <span
                    className="absolute bottom-0 left-1/2 z-10 max-w-[5rem] -translate-x-1/2 translate-y-[35%] truncate rounded-full bg-white px-2 py-0.5 text-[8px] font-medium text-slate-600 shadow-sm ring-2 ring-white sm:max-w-[5.5rem] sm:text-[9px]"
                    title={speaker.company}
                  >
                    {speaker.company}
                  </span>
                ) : null}
              </div>

              <div className="flex w-full min-h-[5.5rem] flex-col items-center justify-start gap-1 sm:min-h-[6rem]">
                <div className="flex items-center justify-center gap-1.5">
                  <p className="text-balance text-sm font-semibold leading-snug text-slate-800 sm:text-base">
                    {speaker.name}
                  </p>
                  {speaker.linkedin && (
                    <Link
                      href={speaker.linkedin}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      aria-label={`لینکدین ${speaker.name}`}
                      className="shrink-0 text-slate-300 transition-colors hover:text-primary"
                    >
                      <IoLogoLinkedin className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>

                <p
                  className="text-balance line-clamp-2 min-h-[2.25rem] w-full text-xs leading-snug text-slate-500 sm:min-h-[2.5rem] sm:text-sm"
                  style={{ textWrap: 'balance' }}
                  title={
                    speaker.company && !speaker.companyLogo
                      ? `${speaker.role} · ${speaker.company}`
                      : speaker.role
                  }
                >
                  {speaker.role}
                  {!speaker.companyLogo && speaker.company && (
                    <span className="text-slate-400"> · {speaker.company}</span>
                  )}
                </p>

                {hasTalks && (
                  <p
                    className={clsx(
                      'mt-0.5 w-full text-balance text-[10px] leading-snug text-primary/75 sm:text-[11px]',
                      speaker.talk
                        ? 'line-clamp-2 min-h-[2.75rem] sm:min-h-[3rem]'
                        : 'invisible min-h-[2.75rem] sm:min-h-[3rem]'
                    )}
                    style={{ textWrap: 'balance' }}
                    title={talkFull || undefined}
                  >
                    {speaker.talk ?? '\u00a0'}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SpeakersShowcase;
