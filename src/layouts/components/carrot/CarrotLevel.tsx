import clsx from 'clsx';
import { LEVEL_LABELS, type LevelKey } from '@lib/membership/types';
import CarrotPip from './CarrotPip';

/** Maps membership level → filled carrots out of 5 */
export const LEVEL_FILL: Record<LevelKey, number> = {
  badge: 1,
  young: 2,
  whole: 3,
  senior: 4,
  golden: 5,
};

type Props = {
  level: LevelKey;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

/** Visual level: n lit classic carrots + (5−n) outline. */
const CarrotLevel = ({
  level,
  showLabel = true,
  size = 'sm',
  className,
}: Props) => {
  const filled = LEVEL_FILL[level] ?? 1;

  return (
    <div
      className={clsx('carrot-level', `carrot-level--${size}`, className)}
      role="img"
      aria-label={`${filled} از ۵ هویج — ${LEVEL_LABELS[level]}`}
    >
      <div className="carrot-level__row" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <CarrotPip
            key={i}
            lit={i < filled}
            size={size}
            className={clsx(
              'carrot-level__pip',
              i < filled && 'carrot-level__pip--lit'
            )}
          />
        ))}
      </div>
      {showLabel ? (
        <span className="carrot-level__label">{LEVEL_LABELS[level]}</span>
      ) : null}
    </div>
  );
};

export default CarrotLevel;
