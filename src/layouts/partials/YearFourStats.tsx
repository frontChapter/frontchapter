import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface YearFourStatsProps {
  title: string;
  year: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  birthday: {
    title: string;
    description: string;
    image: string;
  };
  events: Array<{
    title: string;
    description: string;
    image: string;
    link: {
      label: string;
      href: string;
    };
  }>;
}

const YearFourStats: React.FC<YearFourStatsProps> = ({
  title,
  year,
  stats,
  birthday,
  events,
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

      {/* Birthday Section */}
      <div className="w-full py-12 md:py-24 px-6 md:px-10 bg-white">
        <div className="flex flex-col max-w-5xl mx-auto gap-12">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-5">
              {birthday.title}
            </h2>
            <p className="text-slate-600 leading-relaxed mx-auto max-w-2xl">
              {birthday.description}
            </p>
          </div>

          {/* Birthday Image */}
          <div className="w-full">
            <Image
              src={birthday.image}
              alt={birthday.title}
              width={1200}
              height={450}
              className="w-full h-auto object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="w-full py-12 md:py-24 px-6 md:px-10 bg-white">
        <div className="flex flex-col max-w-5xl mx-auto gap-12">
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, idx) => (
              <React.Fragment key={idx}>
                {idx % 2 === 0 ? (
                  <>
                    {/* Image (Left) */}
                    <div className="w-full">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={600}
                        height={450}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Content (Right) */}
                    <div className="flex flex-col justify-center gap-8 px-0 md:px-8">
                      <div className="text-right">
                        <h3 className="font-bold text-xl md:text-2xl text-slate-800 mb-5">
                          {event.title}
                        </h3>
                        <p className="text-slate-600">{event.description}</p>
                      </div>
                      <div>
                        <Link
                          href={event.link.href}
                          className="text-[#ea7847] font-semibold text-lg inline-block hover:underline"
                        >
                          {event.link.label}
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Content (Left) */}
                    <div className="flex flex-col justify-center gap-8 px-0 md:px-8">
                      <div className="text-right">
                        <h3 className="font-bold text-xl md:text-2xl text-slate-800 mb-5">
                          {event.title}
                        </h3>
                        <p className="text-slate-600">{event.description}</p>
                      </div>
                      <div>
                        <Link
                          href={event.link.href}
                          className="text-[#ea7847] font-semibold text-lg inline-block hover:underline"
                        >
                          {event.link.label}
                        </Link>
                      </div>
                    </div>
                    {/* Image (Right) */}
                    <div className="w-full">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={600}
                        height={450}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default YearFourStats;
