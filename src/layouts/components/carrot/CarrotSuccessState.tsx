import clsx from 'clsx';
import type { ReactNode } from 'react';
import CarrotMark from './CarrotMark';

type Props = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Harvest success — one purposeful mascot moment */
const CarrotSuccessState = ({
  title = 'رسید به باغ!',
  description = 'پیامت رسید. به‌زودی از سمت جامعه فرانت‌چپتر خبر می‌گیری.',
  action,
  children,
  className,
}: Props) => (
  <div className={clsx('carrot-state', 'carrot-state--success', className)}>
    <div className="carrot-state__mark">
      <CarrotMark size="xl" pose="idle" title="برداشت موفق" />
    </div>
    <h1 className="carrot-state__title">{title}</h1>
    <p className="carrot-state__desc">{description}</p>
    {children}
    {action}
  </div>
);

export default CarrotSuccessState;
