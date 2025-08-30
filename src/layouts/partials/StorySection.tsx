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
    <section className="w-full bg-white shadow-sm px-4 md:px-10 py-20 md:py-28 flex justify-center items-center">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="w-full text-center">
          <p className="uppercase font-medium text-base text-slate-800 mb-6">
            {subtitle}
          </p>
          <h2 className="font-semibold text-2xl md:text-3xl text-slate-800 mb-5 leading-tight font-estedad">
            {title}
          </h2>
          <p className="text-slate-700 mx-0 md:mx-20 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
