import clsx from 'clsx';
import type { ScheduleEvent, ScheduleEventType } from '@lib/conferences';
import {
  IoCafeOutline,
  IoChatbubblesOutline,
  IoFlagOutline,
  IoMegaphoneOutline,
  IoMicOutline,
  IoPeopleOutline,
  IoTrophyOutline,
} from 'react-icons/io5';
import type { IconType } from 'react-icons';

interface ConferenceTimelineProps {
  events: ScheduleEvent[];
}

const typeStyles: Record<
  ScheduleEventType,
  { icon: IconType; card: string; dot: string; iconColor: string }
> = {
  talk: {
    icon: IoMicOutline,
    card: 'border-primary/25 bg-gradient-to-l from-primary/[0.06] to-surface-solid',
    dot: 'bg-primary shadow-[0_0_0_4px_rgba(254,96,25,0.15)]',
    iconColor: 'text-primary',
  },
  break: {
    icon: IoCafeOutline,
    card: 'border-border/80 bg-theme-light/40',
    dot: 'bg-muted/60 shadow-[0_0_0_4px_rgba(0,0,0,0.04)]',
    iconColor: 'text-muted',
  },
  general: {
    icon: IoPeopleOutline,
    card: 'border-border bg-surface-solid',
    dot: 'bg-subtle shadow-[0_0_0_4px_rgba(0,0,0,0.04)]',
    iconColor: 'text-subtle',
  },
  panel: {
    icon: IoChatbubblesOutline,
    card: 'border-[#c4b5fd]/40 bg-gradient-to-l from-[#8b5cf6]/[0.06] to-surface-solid',
    dot: 'bg-[#8b5cf6] shadow-[0_0_0_4px_rgba(139,92,246,0.15)]',
    iconColor: 'text-[#7c3aed]',
  },
  competition: {
    icon: IoTrophyOutline,
    card: 'border-[#fbbf24]/40 bg-gradient-to-l from-[#f59e0b]/[0.07] to-surface-solid',
    dot: 'bg-[#f59e0b] shadow-[0_0_0_4px_rgba(245,158,11,0.15)]',
    iconColor: 'text-[#d97706]',
  },
  closing: {
    icon: IoFlagOutline,
    card: 'border-[#34d399]/35 bg-gradient-to-l from-[#10b981]/[0.07] to-surface-solid',
    dot: 'bg-[#10b981] shadow-[0_0_0_4px_rgba(16,185,129,0.15)]',
    iconColor: 'text-[#059669]',
  },
};

const typeLabels: Record<ScheduleEventType, string> = {
  talk: 'سخنرانی',
  break: 'استراحت',
  general: 'عمومی',
  panel: 'پنل',
  competition: 'مسابقه',
  closing: 'اختتامیه',
};

const ConferenceTimeline = ({ events }: ConferenceTimelineProps) => {
  if (!events.length) return null;

  return (
    <div className="conference-timeline not-prose my-8">
      <div className="relative">
        <div
          className="pointer-events-none absolute bottom-4 right-[1.65rem] top-4 w-px bg-gradient-to-b from-primary/10 via-primary/35 to-primary/10 md:right-[1.85rem]"
          aria-hidden="true"
        />

        <ol className="relative space-y-5 md:space-y-6">
          {events.map((event, index) => {
            const style = typeStyles[event.type] ?? typeStyles.general;
            const Icon = style.icon;

            return (
              <li
                key={`${event.time}-${event.title}`}
                className="relative grid grid-cols-[auto_1fr] items-start gap-3 md:gap-5"
              >
                <div className="relative z-10 flex w-14 shrink-0 flex-col items-center md:w-16">
                  <time
                    dateTime={event.time}
                    className="mb-2 text-xs font-bold tabular-nums text-primary md:text-sm"
                  >
                    {event.time}
                  </time>
                  <span
                    className={clsx(
                      'flex h-3.5 w-3.5 items-center justify-center rounded-full md:h-4 md:w-4',
                      style.dot
                    )}
                    aria-hidden="true"
                  />
                </div>

                <article
                  className={clsx(
                    'min-w-0 rounded-2xl border p-4 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-5',
                    style.card,
                    index === 0 && 'md:-mt-1'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={clsx(
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 shadow-sm',
                        style.iconColor
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <div className="min-w-0 flex-1 text-right">
                      <h4 className="text-base font-semibold leading-snug text-dark md:text-lg">
                        {event.title}
                      </h4>

                      {event.subtitle && (
                        <p className="mt-1 text-sm leading-relaxed text-primary/80">
                          {event.subtitle}
                        </p>
                      )}

                      {event.speaker && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted">
                          <IoMegaphoneOutline
                            className="h-3.5 w-3.5 shrink-0 text-primary/70"
                            aria-hidden="true"
                          />
                          {event.speaker}
                        </p>
                      )}

                      {event.description && (
                        <p className="mt-3 text-sm leading-relaxed text-text/85">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
        {(Object.keys(typeStyles) as ScheduleEventType[]).map((type) => {
          const style = typeStyles[type];
          const Icon = style.icon;

          return (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-3 py-1 text-xs text-muted"
            >
              <Icon className={clsx('h-3.5 w-3.5', style.iconColor)} />
              {typeLabels[type]}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ConferenceTimeline;
