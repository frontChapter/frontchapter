import dateFormat from '@lib/utils/dateFormat';
import type { ConferenceProfile } from '@lib/conferences';
import { formatConferenceLabel } from '@lib/conferences';
import { buildConferenceMetadata } from '@lib/seo/conferenceSeo';
import MDXContent from '../app/helper/MDXContent';
import Banner from './components/Banner';
import Cta from './components/Cta';
import ConferenceGallery from './components/ConferenceGallery';
import ConferenceTimeline from './components/ConferenceTimeline';
import SpeakersShowcase from './components/SpeakersShowcase';
import TeamShowcase from './components/TeamShowcase';
import { StatItem } from './components/YearStatsShowcase';

interface ConferenceSingleProps {
  conference: ConferenceProfile;
}

export { buildConferenceMetadata };

const ConferenceSingle = ({ conference }: ConferenceSingleProps) => {
  const speakersFirst = conference.design === 'classic';

  const dateLabel =
    conference.endDate && conference.endDate !== conference.startDate
      ? `${dateFormat(conference.startDate)} تا ${dateFormat(conference.endDate)}`
      : dateFormat(conference.startDate);

  const speakersBlock =
    conference.speakers && conference.speakers.list.length > 0 ? (
      <div className="fade mt-12">
        <SpeakersShowcase
          title={conference.speakers.title}
          speakers={conference.speakers.list}
          centered
        />
      </div>
    ) : null;

  const pageLabel = formatConferenceLabel(conference.title, conference.year);

  return (
    <>
      <article
        className="section pt-0"
        aria-label={pageLabel}
      >
        <Banner
          title={pageLabel}
          parent={{ label: 'همایش‌ها', href: '/conferences/' }}
        />
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="fade flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
              <span className="rounded-full border border-border px-4 py-1.5">
                {conference.locationName}
              </span>
              <time
                dateTime={conference.startDate}
                className="rounded-full border border-border px-4 py-1.5"
              >
                {dateLabel}
              </time>
            </div>

            {conference.stats.length > 0 && (
              <div className="fade mt-10">
                <h2 className="section-title text-h5 text-center">
                  آمار همایش
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 md:flex md:flex-row md:items-center md:justify-center">
                  {conference.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex min-w-0 flex-1 justify-center"
                    >
                      <StatItem value={stat.value} label={stat.label} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="fade mt-10 rounded-2xl border border-border bg-surface-solid p-6 md:p-8">
              <p className="text-base leading-relaxed text-text md:text-lg">
                {conference.description}
              </p>
            </div>

            {speakersFirst && speakersBlock}

            {conference.extraContent && (
              <div className="fade content mt-12 text-start">
                <MDXContent
                  content={conference.extraContent}
                  components={{
                    ConferenceTimeline: () => (
                      <ConferenceTimeline events={conference.schedule ?? []} />
                    ),
                  }}
                />
              </div>
            )}

            {!speakersFirst && speakersBlock}

            {conference.team && conference.team.list.length > 0 && (
              <section className="fade my-8 rounded-2xl border border-border-secondary bg-theme-light p-6 md:my-10 md:p-8">
                <TeamShowcase
                  title={conference.team.title}
                  members={conference.team.list}
                  titleAs="h2"
                  titleId="conference-team-heading"
                  titleIcon="✯"
                  centered
                />
              </section>
            )}

            <ConferenceGallery conference={conference} />
          </div>
        </div>
      </article>
      <Cta />
    </>
  );
};

export default ConferenceSingle;
