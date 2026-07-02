import { getAllSpeakers, speakerPath } from '@lib/speakers';
import { IoLogoLinkedin } from 'react-icons/io5';
import Link from 'next/link';
import React from 'react';
import Banner from './components/Banner';
import Cta from './components/Cta';
import ImageFallback from './components/ImageFallback';

const SpeakersList = () => {
  const speakers = getAllSpeakers();

  return (
    <>
      <section className="section pt-0">
        <Banner title="پیشگامان گفت‌وگو" />
        <div className="container">
          <p className="fade mx-auto max-w-2xl text-center text-muted">
            ارائه‌دهندگان جلسات آنلاین فرانت‌چپتر. روی هر نام کلیک کنید تا آرشیو
            جلسات آن‌ها را ببینید.
          </p>
          <div className="fade mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker) => (
              <Link
                key={speaker.slug}
                href={speakerPath(speaker.slug)}
                className="group flex items-center gap-4 rounded-xl border border-border bg-surface-solid p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="shrink-0 overflow-hidden rounded-full border border-border">
                  <ImageFallback
                    src={speaker.avatar}
                    width={56}
                    height={56}
                    alt={speaker.name}
                    fallback="/images/author/saleh.jpg"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-dark transition-colors group-hover:text-primary">
                    {speaker.name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {speaker.sessions.length} جلسه
                  </p>
                </div>
                {speaker.linkedin && (
                  <IoLogoLinkedin
                    className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
};

export default SpeakersList;
