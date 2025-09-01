import React from 'react';

interface ContinuedStoryProps {
  subtitle: string;
  title: string;
  description: string;
}

const ContinuedStory: React.FC<ContinuedStoryProps> = ({
  subtitle,
  title,
  description,
}) => {
  return (
    <section className="w-full py-16 md:py-24 flex justify-center items-center">
      <div className="w-full max-w-3xl flex flex-col items-center gap-6 px-4 md:px-0">
        <div className="w-full text-center">
          <p className="font-estedad font-medium text-base text-primary mb-4">
            {subtitle}
          </p>
          <h2 className="font-estedad font-bold text-3xl md:text-4xl text-slate-800 mb-4 leading-tight">
            {title}
          </h2>
          <p className="font-estedad text-slate-700 md:px-16 leading-relaxed text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContinuedStory;
