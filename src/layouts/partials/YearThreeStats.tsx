import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface YearThreeStatsProps {
  title: string;
  year: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  conference: {
    title: string;
    description: string;
    images: {
      video: string;
      gallery: string[];
    };
  };
  magazine: {
    title: string;
    subtitle: string;
    description: string;
    link: {
      label: string;
      href: string;
    };
    images: string[];
  };
  festival: {
    title: string;
    description: string;
    link: {
      label: string;
      href: string;
    };
    images: string[];
  };
}

const YearThreeStats: React.FC<YearThreeStatsProps> = ({
  title,
  year,
  stats,
  conference,
  magazine,
  festival,
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
      <div className="w-full max-w-3xl flex flex-wrap md:flex-row items-stretch justify-start gap-4 bg-white rounded-xl shadow-sm py-8 px-4 md:px-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex-1 text-right px-4 min-w-[140px]">
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-2">
              {stat.value}
            </h2>
            <p className="text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Conference Section */}
      <div className="w-full py-12 md:py-24 px-6 md:px-10 bg-white">
        <div className="flex flex-col max-w-5xl mx-auto gap-12">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-5">
              {conference.title}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {conference.description}
            </p>
          </div>

          {/* Media Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video */}
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={conference.images.video} type="video/mp4" />
                مرورگر شما از ویدیو پشتیبانی نمی‌کند.
              </video>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-6">
              {conference.images.gallery.map((image, idx) => (
                <div
                  key={idx}
                  className={`relative ${idx % 2 !== 0 ? 'mt-6' : ''}`}
                >
                  <Image
                    src={image}
                    alt={`همایش ${year} فرانت‌چپتر`}
                    width={282}
                    height={282}
                    className="rounded-lg w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Magazine Section */}
      <div className="w-full py-12 md:py-24 px-6 md:px-10 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-12">
          {/* Images */}
          <div className="flex flex-1 gap-6">
            {magazine.images.map((image, idx) => (
              <div key={idx} className={`relative ${idx === 1 ? 'mt-12' : ''}`}>
                <Image
                  src={image}
                  alt={magazine.title}
                  width={320}
                  height={420}
                  className="rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 text-right">
            <p className="uppercase font-medium text-base text-slate-800 mb-6">
              {magazine.subtitle}
            </p>
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-5">
              {magazine.title}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {magazine.description}
            </p>
            <Link
              href={magazine.link.href}
              className="px-8 py-4 bg-[#ea7847] text-white font-semibold rounded inline-block hover:opacity-90 transition-opacity"
            >
              {magazine.link.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Festival Section */}
      <div className="w-full py-12 md:py-24 px-6 md:px-10 bg-white">
        <div className="flex flex-col max-w-5xl mx-auto gap-8">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-bold text-3xl md:text-5xl text-slate-800 mb-5">
              {festival.title}
            </h1>
            <p className="text-slate-600 leading-relaxed mb-8">
              {festival.description}
            </p>
            <Link
              href={festival.link.href}
              className="px-8 py-4 bg-[#ea7847] text-white font-semibold rounded inline-block hover:opacity-90 transition-opacity"
            >
              {festival.link.label}
            </Link>
          </div>

          {/* Images */}
          <div className="flex flex-wrap gap-6 justify-center mt-8">
            {festival.images.map((image, idx) => (
              <div
                key={idx}
                className={`relative ${idx % 2 !== 0 ? 'mt-6' : ''}`}
              >
                <Image
                  src={image}
                  alt={`جشنواره ${festival.title}`}
                  width={282}
                  height={idx % 2 === 0 ? 370 : 420}
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default YearThreeStats;
