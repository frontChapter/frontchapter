import React from 'react';
import { markdownify } from '../../lib/utils/textConverter';

interface StorySectionProps {
  subtitle: string;
  title: string;
  description: string;
}

const StorySection: React.FC<StorySectionProps> = ({
  subtitle,
  title,
  description,
}) => {
  return (
    <section className="section" aria-labelledby="story-heading">
      <div className="container">
        <header className="animate text-center">
          <p className="text-sm font-medium tracking-wider text-primary">
            {subtitle}
          </p>
          {markdownify({
            content: title,
            tag: 'h2',
            className: 'mt-4 section-title',
            id: 'story-heading',
          })}
          {markdownify({
            content: description,
            tag: 'p',
            className: 'mt-10 max-w-2xl mx-auto !leading-loose text-base',
          })}
        </header>
      </div>
    </section>
  );
};

export default StorySection;
