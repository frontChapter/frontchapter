import React from 'react';

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
    <section className="w-full bg-white shadow-sm px-4 md:px-12 py-24 md:py-32 flex justify-center items-center">
      <div className="w-full max-w-4xl flex flex-col items-center gap-10">
        <div className="w-full text-center">
          <p className="uppercase font-medium text-lg md:text-xl text-slate-800 mb-7">
            {subtitle}
          </p>
          <h2 className="font-semibold text-3xl md:text-4xl lg:text-5xl text-slate-800 mb-7 leading-tight font-estedad">
            {title}
          </h2>
          <p className="text-slate-700 text-lg md:text-xl mx-0 md:mx-16 !leading-loose">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
