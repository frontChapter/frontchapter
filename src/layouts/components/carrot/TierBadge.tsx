import React from 'react';
import clsx from 'clsx';
import { TierLevel, TIERS_CONFIG } from '../../../types/gamification';

interface TierBadgeProps {
  tier: TierLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showEmoji?: boolean;
  className?: string;
}

const TIER_STYLES: Record<
  TierLevel,
  { bg: string; text: string; border: string; glow?: string }
> = {
  havij_neshan: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/15',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/30',
  },
  havij_doost: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
  },
  havij_joo: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
  },
  havij_baz: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
  },
  havij_khah: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
  },
  havij_tala: {
    bg: 'bg-amber-500/20 dark:bg-amber-500/25',
    text: 'text-amber-600 dark:text-amber-300 font-bold',
    border: 'border-amber-500/50',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.35)]',
  },
};

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  showEmoji = true,
  className,
}) => {
  const tierKey = (tier in TIERS_CONFIG ? tier : 'havij_neshan') as TierLevel;
  const config = TIERS_CONFIG[tierKey];
  const style = TIER_STYLES[tierKey];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs md:text-sm gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm md:text-base font-semibold gap-2',
  }[size];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border transition-all duration-200 select-none',
        style.bg,
        style.text,
        style.border,
        style.glow,
        sizeClasses,
        className
      )}
      title={config.perks}
    >
      {showEmoji && <span className="shrink-0">{config.badgeEmoji}</span>}
      <span>{config.title}</span>
    </span>
  );
};

export default TierBadge;
