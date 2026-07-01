import React from 'react';
import { TfiQuoteLeft } from 'react-icons/tfi';

const Blockquote = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <blockquote className="rounded-xl border border-border-secondary bg-theme-light px-8 py-3 not-italic text-text">
      <span className="text-5xl text-muted">
        <TfiQuoteLeft />
      </span>
      {children}
      <span className="m-0 block border-t border-border-secondary pt-3 text-base font-normal text-text after:hidden">
        {name}
      </span>
    </blockquote>
  );
};

export default Blockquote;
