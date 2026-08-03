import clsx from 'clsx';
import CarrotMark from './CarrotMark';

export type CarrotDividerVariant = 'carrot' | 'growth';

type Props = {
  variant?: CarrotDividerVariant;
  className?: string;
};

/** Section rhythm — single small mark only when variant=carrot */
const CarrotDivider = ({ variant = 'growth', className }: Props) => (
  <div
    className={clsx(
      'carrot-divider',
      `carrot-divider--${variant}`,
      className
    )}
    role="separator"
    aria-hidden="true"
  >
    <span className="carrot-divider__line" />
    {variant === 'carrot' ? (
      <CarrotMark size="sm" pose="idle" />
    ) : (
      <span className="carrot-divider__dot" />
    )}
    <span className="carrot-divider__line" />
  </div>
);

export default CarrotDivider;
