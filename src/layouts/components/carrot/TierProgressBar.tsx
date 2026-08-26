import clsx from 'clsx';
import React from 'react';
import { getNextTierProgress } from '../../../types/gamification';
import TierBadge from './TierBadge';

interface TierProgressBarProps {
  coins: number;
  className?: string;
  showDetails?: boolean;
}

export const TierProgressBar: React.FC<TierProgressBarProps> = ({
  coins,
  className,
  showDetails = true,
}) => {
  const { currentTier, nextTier, coinsNeeded, progressPct } =
    getNextTierProgress(coins);

  return (
    <div
      className={clsx(
        'w-full rounded-2xl border border-border bg-surface-solid p-4 md:p-5',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TierBadge tier={currentTier.key} size="sm" />
          <span className="text-sm font-medium text-dark">
            {coins} <span className="text-xs text-muted">هویج</span>
          </span>
        </div>
        {nextTier ? (
          <div className="text-left text-xs text-muted">
            <span className="font-semibold text-primary">{coinsNeeded}</span>{' '}
            هویج تا{' '}
            <span className="font-medium text-dark">{nextTier.title}</span>
          </div>
        ) : (
          <div className="text-xs font-bold text-amber-500">
            👑 بالاترین سطح هویجی!
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full border border-border/50 bg-surface-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 shadow-sm transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {showDetails && (
        <div className="mt-3 flex items-center justify-between text-2xs text-muted">
          <span>
            سطح فعلی: {currentTier.title} ({currentTier.minCoins} هویج)
          </span>
          {nextTier && (
            <span>
              سطح بعدی: {nextTier.title} ({nextTier.minCoins} هویج)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TierProgressBar;
