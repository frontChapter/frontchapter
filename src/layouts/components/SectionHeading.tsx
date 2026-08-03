import clsx from 'clsx';
import React from 'react';

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h2' | 'h3' | 'h4';
  /** Pass empty string to hide accent. Default: soft brand sprout. */
  icon?: string | false;
  centered?: boolean;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  children,
  as: Tag = 'h2',
  icon,
  centered = false,
  className,
  ...rest
}) => {
  const showAccent = icon !== false && icon !== '';

  return (
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
      {showAccent &&
        (icon ? (
          <span
            className="me-2 text-2xl text-primary/40 md:text-3xl"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : (
          <span
            className="me-2.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary/50 shadow-[0_0_0_3px] shadow-primary/15"
            aria-hidden="true"
          />
        ))}
      {children}
    </Tag>
  );
};

export default SectionHeading;
