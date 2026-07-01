import clsx from 'clsx';
import React from 'react';

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h2' | 'h3' | 'h4';
  icon?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  children,
  as: Tag = 'h2',
  icon = '✯',
  centered = false,
  className,
  ...rest
}) => (
  <Tag
    className={clsx(
      'font-bold text-primary inline-flex items-center flex-wrap',
      Tag === 'h2' && 'text-2xl md:text-3xl mb-5',
      Tag === 'h3' && 'text-lg sm:text-xl md:text-2xl mb-2 md:mb-3',
      Tag === 'h4' && 'text-lg sm:text-xl md:text-2xl mb-2 md:mb-3',
      centered && 'justify-center',
      className
    )}
    {...rest}
  >
    {icon && (
      <span
        className={clsx(
          'text-primary/40 me-2',
          Tag === 'h2' ? 'text-2xl md:text-3xl' : 'text-2xl md:text-3xl'
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
    )}
    {children}
  </Tag>
);

export default SectionHeading;
