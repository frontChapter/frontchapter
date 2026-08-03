import clsx from 'clsx';
import ZoomIcon from './ZoomIcon';

type Size = 'sm' | 'md' | 'lg';

const SIZE: Record<Size, string> = {
  sm: 'h-8 w-8 p-1.5',
  md: 'h-10 w-10 p-2 sm:h-12 sm:w-12 md:h-14 md:w-14 md:p-3',
  lg: 'h-12 w-12 p-2.5 sm:h-14 sm:w-14 md:h-16 md:w-16 md:p-3.5',
};

type Props = {
  size?: Size;
  className?: string;
};

/** Gallery hover affordance — living white carrot in frosted/primary chip */
const ZoomCarrotChip = ({ size = 'md', className }: Props) => (
  <span className={clsx('zoom-carrot-chip', SIZE[size], className)}>
    <ZoomIcon />
  </span>
);

export default ZoomCarrotChip;
