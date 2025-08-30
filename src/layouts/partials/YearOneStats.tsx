import React from 'react';

export interface YearOneStatsProps {
  title: string;
  year: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  gatherings: {
    title: string;
    description: string;
  };
  conference: {
    title: string;
    description: string;
  };
  images: string[];
}

const YearOneStats: React.FC<YearOneStatsProps> = ({
  title,
  year,
  stats,
  gatherings,
  conference,
  images,
}) => {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-6 py-6 md:py-12">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-4 text-center">
        <p className="uppercase font-medium text-base text-slate-800 mb-2">
          {title}
        </p>
        <h1 className="font-bold text-5xl md:text-6xl text-slate-800 leading-tight">
          {year}
        </h1>
      </div>
      {/* Stats */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row items-stretch justify-start gap-4 bg-white rounded-xl shadow-sm py-8 px-4 md:px-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex-1 text-right px-4">
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-2">
              {stat.value}
            </h2>
            <p className="text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>
      {/* Details */}
      <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-8 bg-white rounded-xl shadow-sm py-12 px-4 md:px-10">
        <div className="flex flex-col gap-8 max-w-xl w-full">
          <div>
            <h4 className="font-bold text-xl md:text-2xl text-slate-800 mb-2">
              {gatherings.title}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {gatherings.description}
            </p>
            <div className="border-t border-slate-300 mt-4" />
          </div>
          <div>
            <h4 className="font-bold text-xl md:text-2xl text-slate-800 mb-2">
              {conference.title}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {conference.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 max-w-xl w-full">
          {images.map((img, idx) => (
            <figure key={idx} className="rounded-lg overflow-hidden shadow-sm">
              <img
                src={img}
                alt="همایش فرانت‌چپتر ۱۴۰۱"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YearOneStats;
