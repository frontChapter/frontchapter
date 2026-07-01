'use client';

import clsx from 'clsx';
import React from 'react';
import type { Stat } from '../../types/content';

export type { Stat };

export interface YearStatsShowcaseProps {
  title: string;
  year: string;
  stats: Stat[];
  yearRef?: React.RefObject<HTMLHeadingElement | null>;
  statsRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

interface StatItemProps {
  value: string;
  label: string;
  className?: string;
}

export const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  className,
}) => (
  <div
    className={clsx(
      'stat-item flex flex-1 flex-col items-center justify-center text-center',
      'px-4 py-2 sm:px-6 md:px-6 lg:px-8',
      className
    )}
  >
    <p className="mb-1.5 font-bold text-2xl text-primary transition-transform duration-300 hover:scale-105 sm:text-3xl md:mb-2 md:text-4xl tabular-nums">
      {value}
    </p>
    <p className="max-w-[9rem] text-balance text-text text-sm leading-snug sm:max-w-none sm:text-base md:text-lg md:leading-relaxed">
      {label}
    </p>
  </div>
);

const StatDivider = () => (
  <div
    className="hidden md:block mx-4 lg:mx-6 w-px shrink-0 self-center h-14 bg-primary/20"
    aria-hidden="true"
  />
);

const YearStatsShowcase: React.FC<YearStatsShowcaseProps> = ({
  title,
  year,
  stats,
  yearRef,
  statsRef,
  className,
}) => (
  <header className={clsx('w-full max-w-5xl', className)}>
    <div className="mb-6 flex flex-col items-center justify-center gap-2 text-center md:mb-8 md:gap-3">
      <p className="font-medium text-sm tracking-wider text-primary sm:text-base">
        {title}
      </p>
      <h2
        ref={yearRef}
        className="bg-gradient-to-r from-slate-800 to-primary bg-clip-text font-bold text-4xl leading-tight text-transparent dark:from-slate-200 sm:text-5xl md:text-7xl"
      >
        {year}
      </h2>
    </div>

    <div ref={statsRef} className="py-4 md:py-8" role="list">
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 md:flex md:flex-row md:items-center md:justify-center">
        {stats.map((stat, idx) => (
          <React.Fragment key={stat.label}>
            {idx > 0 && <StatDivider />}
            <div role="listitem" className="flex min-w-0 flex-1 justify-center">
              <StatItem value={stat.value} label={stat.label} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  </header>
);

export default YearStatsShowcase;
