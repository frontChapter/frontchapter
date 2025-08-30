import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface YearTwoStatsProps {
  title: string;
  year: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  memories: {
    title: string;
    subtitle: string;
    description: Array<string>;
    link: {
      label: string;
      href: string;
    };
  };
  images: Array<{
    src: string;
    alt: string;
  }>;
}

const YearTwoStats: React.FC<YearTwoStatsProps> = ({
  title,
  year,
  stats,
  memories,
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

      {/* Memories Section */}
      <div className="w-full py-12 px-6 bg-white">
        <div className="flex flex-col md:flex-row items-start justify-between max-w-5xl mx-auto gap-6 md:gap-12">
          {/* Images Grid */}
          <div className="flex-1 md:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-[620px] relative">
              {images.map((image, index) => (
                <figure
                  key={index}
                  className={`relative ${index % 2 === 0 ? 'top-0 left-0' : 'top-0 right-0'} ${index >= 2 ? 'top-[310px]' : ''}`}
                  style={{
                    position: 'absolute',
                    width: 'calc(50% - 9px)',
                    top: index >= 2 ? '310px' : '0',
                    left: index % 2 === 0 ? '0' : 'calc(50% + 9px)',
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-cover rounded-lg"
                    width={300}
                    height={300}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 md:w-1/2 text-right flex flex-col">
            <p className="text-uppercase text-sm font-bold mb-6">
              {memories.subtitle}
            </p>
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-6">
              {memories.title}
            </h2>

            {memories.description.map((paragraph, idx) => (
              <p key={idx} className="text-slate-600 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="mt-6">
              <Link
                href={memories.link.href}
                className="px-8 py-4 bg-[#ea7847] text-white font-semibold rounded inline-block hover:opacity-90 transition-opacity"
              >
                {memories.link.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YearTwoStats;
