import clsx from 'clsx';
import React from 'react';
import SectionHeading from '../components/SectionHeading';

interface ConferenceSectionProps {
  variant?: 'soft' | 'solid' | 'panel';
  title?: string;
  children: React.ReactNode;
}

const variantClasses: Record<
  NonNullable<ConferenceSectionProps['variant']>,
  string
> = {
  soft: 'border-border-secondary bg-theme-light',
  solid: 'border-border bg-surface-solid',
  panel: 'border-border-secondary bg-theme-light',
};

const ConferenceSection = ({
  variant = 'solid',
  title,
  children,
}: ConferenceSectionProps) => (
  <section
    className={clsx(
      'conference-section not-prose my-8 rounded-2xl border p-6 md:my-10 md:p-8',
      variantClasses[variant]
    )}
  >
    {title && (
      <SectionHeading as="h2" className="mb-6 md:mb-8">
        {title}
      </SectionHeading>
    )}
    <div
      className={clsx(
        variant === 'panel' &&
          '[&_ul]:mt-4 [&_ul]:grid [&_ul]:list-none [&_ul]:grid-cols-1 [&_ul]:gap-4 [&_ul]:p-0 [&_ul]:sm:grid-cols-2 [&_li]:rounded-xl [&_li]:border [&_li]:border-border [&_li]:bg-surface-solid [&_li]:p-4 [&_li]:shadow-sm'
      )}
    >
      {children}
    </div>
  </section>
);

export default ConferenceSection;
