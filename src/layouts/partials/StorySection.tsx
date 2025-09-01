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
    <section className="section">
      <div className="container">
        <div className="animate text-center">
          <p>{subtitle}</p>
          {markdownify({
            content: title,
            tag: 'h2',
            className: 'mt-4 section-title',
          })}
          {markdownify({
            content: description,
            tag: 'p',
            className: 'mt-10 max-w-2xl mx-auto !leading-loose text-base',
          })}
        </div>
      </div>
    </section>
  );
};

export default StorySection;
