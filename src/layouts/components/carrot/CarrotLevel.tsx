import clsx from 'clsx';
import { TierLevel } from '../../../types/gamification';
import CarrotPip from './CarrotPip';

export type LegacyLevelKey = 'badge' | 'young' | 'whole' | 'senior' | 'golden';
export type LevelKey = LegacyLevelKey | TierLevel;

export const LEVEL_LABELS: Record<LevelKey, string> = {
  badge: 'نشان هویجی',
  young: 'هویج جوان',
  whole: 'هویج کامل',
  senior: 'هویج پیشکسوت',
  golden: 'هویج طلایی',
  havij_neshan: 'هویج‌نشان',
  havij_doost: 'هویج‌دوست',
  havij_joo: 'هویج‌جو',
  havij_baz: 'هویج‌باز',
  havij_khah: 'هویج‌خواه',
  havij_tala: 'هویج‌طلا',
};

/** Maps membership level → filled carrots out of 5 */
export const LEVEL_FILL: Record<LevelKey, number> = {
  badge: 1,
  young: 2,
  whole: 3,
  senior: 4,
  golden: 5,
  havij_neshan: 1,
  havij_doost: 2,
  havij_joo: 3,
  havij_baz: 4,
  havij_khah: 5,
  havij_tala: 5,
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
  const label = LEVEL_LABELS[level] || 'هویج‌نشان';

  return (
    <div
      className={clsx('carrot-level', `carrot-level--${size}`, className)}
      role="img"
      aria-label={`${filled} از ۵ هویج — ${label}`}
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
      {showLabel ? <span className="carrot-level__label">{label}</span> : null}
    </div>
  );
};

export default CarrotLevel;
