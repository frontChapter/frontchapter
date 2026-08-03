import clsx from 'clsx';
import CarrotMark from './CarrotMark';

export type CarrotLoaderVariant = 'grow' | 'bounce' | 'leaves';

type Props = {
  variant?: CarrotLoaderVariant;
  label?: string;
  className?: string;
};

const CarrotLoader = ({
  variant = 'grow',
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
      {variant === 'grow' ? (
        <div className="carrot-loader__soil" aria-hidden="true">
          <div className="carrot-loader__mark">
            <CarrotMark size="md" pose="idle" />
          </div>
        </div>
      ) : (
        <CarrotMark size="md" pose="idle" />
      )}
      <span className="carrot-loader__label">{label}</span>
    </div>
  );
};

export default CarrotLoader;
