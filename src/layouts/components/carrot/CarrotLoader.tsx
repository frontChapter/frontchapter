import clsx from 'clsx';
import CarrotMark from './CarrotMark';

export type CarrotLoaderVariant = 'grow' | 'bounce' | 'leaves';

type Props = {
  variant?: CarrotLoaderVariant;
  label?: string;
  className?: string;
};

/** Wait state — mark only, no soil box (that read as a broken image). */
const CarrotLoader = ({
  variant = 'bounce',
  label = 'در حال بارگذاری…',
  className,
}: Props) => {
  return (
    <div
      className={clsx('carrot-loader', `carrot-loader--${variant}`, className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="carrot-loader__mark" aria-hidden="true">
        <CarrotMark size="lg" pose="idle" />
      </div>
      <span className="carrot-loader__label">{label}</span>
    </div>
  );
};

export default CarrotLoader;
