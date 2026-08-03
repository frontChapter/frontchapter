import clsx from 'clsx';
import type { ReactNode } from 'react';
import CarrotPattern from './CarrotPattern';

type Props = {
  children: ReactNode;
  className?: string;
  pattern?: boolean;
};

/** Cream brand surface — pattern only, no watermark carrot */
const CarrotBackground = ({ children, className, pattern = true }: Props) => (
  <div className={clsx('carrot-bg', className)}>
    {pattern ? <CarrotPattern /> : null}
    <div className="carrot-bg__content">{children}</div>
  </div>
);

export default CarrotBackground;
