import { getAllConferences, conferencePath } from '@lib/conferences';
import dateFormat from '@lib/utils/dateFormat';
import Link from 'next/link';
import React from 'react';
import Banner from './components/Banner';
import Cta from './components/Cta';

const ConferencesList = () => {
  const conferences = getAllConferences();

  return (
    <>
      <section className="section pt-0">
        <Banner title="همایش‌های فرانت‌چپتر" />
        <div className="container">
          <p className="fade mx-auto max-w-2xl text-center text-muted">
            مرور همایش‌های سالانه فرانت‌چپتر از ۱۴۰۰ تا امروز.
          </p>
          <div className="fade mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conferences.map((conference) => (
              <Link
                key={conference.slug}
                href={conferencePath(conference.slug)}
                className="group flex flex-col rounded-2xl border border-border bg-surface-solid p-6 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
              >
                <p className="text-sm font-medium text-primary">
                  سال {conference.year}
                </p>
                <h2 className="mt-2 text-h5 text-dark transition-colors group-hover:text-primary">
                  {conference.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {conference.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded-full border border-border px-3 py-1">
                    {conference.locationName}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1">
                    {dateFormat(conference.startDate)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
};

export default ConferencesList;
