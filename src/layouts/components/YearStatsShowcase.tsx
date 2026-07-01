'use client';

import clsx from 'clsx';
import React from 'react';

export interface Stat {
  value: string;
  label: string;
}

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
  showDivider?: boolean;
  className?: string;
}

export const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  showDivider = false,
  className,
}) => (
  <div
    className={clsx(
      'stat-item relative flex flex-1 flex-col items-center text-center',
      className
    )}
  >
    {showDivider && (
      <div
        className="absolute start-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-primary/20 md:block"
        aria-hidden
      />
    )}

    <p className="mb-1.5 font-bold text-2xl text-primary transition-transform duration-300 hover:scale-105 sm:text-3xl md:mb-2 md:text-4xl md:origin-center tabular-nums">
      {value}
    </p>
    <p className="text-text text-sm leading-relaxed sm:text-base md:text-lg">
      {label}
    </p>
  </div>
);

const YearStatsShowcase: React.FC<YearStatsShowcaseProps> = ({
  title,
  year,
  stats,
  yearRef,
  statsRef,
  className,
}) => (
  <div className={clsx('w-full max-w-4xl', className)}>
    <div className="mb-6 flex flex-col items-center justify-center gap-2 text-center md:mb-8 md:gap-3">
      <p className="font-medium text-sm tracking-wider text-primary sm:text-base">
        {title}
      </p>
      <h1
        ref={yearRef}
        className="bg-gradient-to-r from-slate-800 to-primary bg-clip-text font-bold text-4xl leading-tight text-transparent dark:from-slate-200 sm:text-5xl md:text-7xl"
      >
        {year}
      </h1>
    </div>

    <div ref={statsRef} className="py-4 md:py-8">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:flex md:flex-row md:justify-center md:gap-10">
        {stats.map((stat, idx) => (
          <StatItem
            key={idx}
            value={stat.value}
            label={stat.label}
            showDivider={idx > 0}
          />
        ))}
      </div>
    </div>
  </div>
);

export default YearStatsShowcase;
