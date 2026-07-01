import React from 'react';

interface SectionDecorationsProps {
  variant?: 'default' | 'compact';
}

const SectionDecorations: React.FC<SectionDecorationsProps> = ({
  variant = 'default',
}) => (
  <>
    <div
      className="absolute -left-12 sm:-left-24 top-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-gradient-to-b from-[#ffece4]/20 to-[#ffe6db]/30 opacity-40 blur-3xl -z-10"
      aria-hidden="true"
    />
    <div
      className="absolute -right-12 sm:-right-24 bottom-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-gradient-to-t from-[#ffece4]/20 to-[#ffe6db]/30 opacity-40 blur-3xl -z-10"
      aria-hidden="true"
    />
    {variant === 'default' && (
      <div
        className="absolute left-1/4 top-1/3 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 opacity-30 blur-3xl -z-10"
        aria-hidden="true"
      />
    )}
  </>
);

export default SectionDecorations;
