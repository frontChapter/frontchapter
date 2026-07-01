'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoLogoLinkedin } from 'react-icons/io5';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
}

export interface TeamShowcaseProps {
  title: string;
  members: TeamMember[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  titleIcon?: string;
  centered?: boolean;
  titleAs?: 'h2' | 'h3';
  titleId?: string;
}

const TeamShowcase: React.FC<TeamShowcaseProps> = ({
  title,
  members,
  containerRef,
  titleIcon = '✫',
  centered = false,
  titleAs: TitleTag = 'h3',
  titleId,
}) => {
  if (!members.length) return null;

  return (
    <div ref={containerRef} className="relative w-full">
      <TitleTag
        id={titleId}
        className={`font-bold text-lg sm:text-xl md:text-2xl text-primary mb-5 md:mb-6 inline-flex items-center flex-wrap ${
          centered ? 'justify-center w-full' : ''
        }`}
      >
        <span className="text-2xl md:text-3xl text-primary/40 me-2">
          {titleIcon}
        </span>
        {title}
      </TitleTag>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {members.map((member) => (
          <div
            key={member.name}
            className="team-card group flex flex-col items-center text-center bg-surface rounded-xl p-3 sm:p-4 shadow-sm shadow-primary/5 hover:shadow-md hover:shadow-primary/10 transition-shadow duration-300"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 rounded-full overflow-hidden ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
              <Image
                src={member.image}
                alt={`عکس ${member.name} — تیم اجرایی فرانت‌چپتر`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 80px, 112px"
                loading="lazy"
              />
            </div>
            <p className="font-bold text-sm sm:text-base text-dark mb-1">
              {member.name}
            </p>
            <p className="text-xs sm:text-sm text-text leading-relaxed">
              {member.role}
            </p>
            {member.linkedin && (
              <Link
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={`صفحه لینکدین ${member.name}`}
                className="mt-2 inline-flex min-h-12 min-w-12 items-center justify-center text-primary/60 hover:text-primary transition-colors duration-200"
              >
                <IoLogoLinkedin className="w-5 h-5" aria-hidden="true" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamShowcase;
