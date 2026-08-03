import clsx from 'clsx';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  accent?: boolean;
};

/** Quiet label chip — no carrot icon */
const CarrotBadge = ({ children, className, accent = false }: Props) => (
  <span
    className={clsx(
      'carrot-badge',
      accent && 'carrot-badge--accent',
      className
    )}
  >
    {children}
  </span>
);

export default CarrotBadge;
