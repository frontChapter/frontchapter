import clsx from 'clsx';
import type { ReactNode } from 'react';
import CarrotButton from './CarrotButton';
import CarrotMark from './CarrotMark';

type Props = {
  title?: string;
  description?: string;
  action?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  /** error tone for 404 / lost paths */
  tone?: 'empty' | 'error';
  children?: ReactNode;
  className?: string;
};

const PRESETS = {
  empty: {
    title: 'هنوز چیزی اینجا نروییده',
    description:
      'این بخش خالی‌ست. به خانه برگرد یا کمی بعد دوباره سر بزن — جامعه همیشه در حال رشد است.',
    markTitle: 'باغ خالی',
  },
  error: {
    title: 'هویج گم شد',
    description:
      'چیزی در باغ به‌هم ریخت یا این صفحه پیدا نشد. نگران نباش — از مسیرهای آشنا دوباره شروع کن.',
    markTitle: 'هویج گم‌شده',
  },
} as const;

/** Empty / lost — one purposeful mascot moment */
const CarrotEmptyState = ({
  title,
  description,
  action,
  actionLabel = 'بازگشت به خانه',
  actionHref = '/',
  tone = 'empty',
  children,
  className,
}: Props) => {
  const preset = PRESETS[tone];

  return (
    <div
      className={clsx(
        'carrot-state',
        tone === 'error' && 'carrot-state--error',
        className
      )}
    >
      <div className="carrot-state__mark">
        <CarrotMark
          size="xl"
          pose={tone === 'error' ? 'wiggle' : 'grow'}
          title={preset.markTitle}
        />
      </div>
      <h1 className="carrot-state__title">{title ?? preset.title}</h1>
      <p className="carrot-state__desc">{description ?? preset.description}</p>
      {children}
      {action ?? (
        <CarrotButton href={actionHref} variant="primary">
          {actionLabel}
        </CarrotButton>
      )}
    </div>
  );
};

export default CarrotEmptyState;
