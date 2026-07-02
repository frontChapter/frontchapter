import clsx from 'clsx';
import { Fragment } from 'react';
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
  { icon: IconType; dot: string; iconColor: string }
> = {
  talk: {
    icon: IoMicOutline,
    dot: 'bg-primary shadow-[0_0_0_4px_rgba(254,96,25,0.12)]',
    iconColor: 'text-primary',
  },
  break: {
    icon: IoCafeOutline,
    dot: 'bg-muted/70 shadow-[0_0_0_4px_rgba(0,0,0,0.04)]',
    iconColor: 'text-muted',
  },
  general: {
    icon: IoPeopleOutline,
    dot: 'bg-subtle shadow-[0_0_0_4px_rgba(0,0,0,0.04)]',
    iconColor: 'text-subtle',
  },
  panel: {
    icon: IoChatbubblesOutline,
    dot: 'bg-primary/60 shadow-[0_0_0_4px_rgba(254,96,25,0.1)]',
    iconColor: 'text-primary',
  },
  competition: {
    icon: IoTrophyOutline,
    dot: 'bg-primary shadow-[0_0_0_4px_rgba(254,96,25,0.12)]',
    iconColor: 'text-primary',
  },
  closing: {
    icon: IoFlagOutline,
    dot: 'bg-primary shadow-[0_0_0_4px_rgba(254,96,25,0.12)]',
    iconColor: 'text-primary',
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
    <div className="conference-timeline not-prose">
      <div className="relative">
        <div
          className="pointer-events-none absolute bottom-4 right-[1.6rem] top-4 w-px bg-gradient-to-b from-primary/15 via-primary/30 to-primary/15 md:right-[1.75rem]"
          aria-hidden="true"
        />

        <ol className="relative space-y-3 md:space-y-4">
          {events.map((event, index) => {
            const style = typeStyles[event.type] ?? typeStyles.general;
            const showDayHeader =
              Boolean(event.day) && event.day !== events[index - 1]?.day;
            const timeLabel = event.endTime
              ? `${event.time} — ${event.endTime}`
              : event.time;

            return (
              <Fragment
                key={`${event.day ?? ''}-${event.time}-${event.title}`}
              >
                {showDayHeader && (
                  <li className="list-none pt-4 first:pt-0 md:pt-6">
                    <h3 className="text-center text-sm font-bold text-primary md:text-base">
                      {event.day}
                    </h3>
                  </li>
                )}

                <li className="relative grid grid-cols-[auto_1fr] items-stretch gap-3 md:gap-5">
                  <div className="relative z-10 flex w-14 shrink-0 flex-col items-center pt-1 md:w-16">
                    <time
                      dateTime={event.time}
                      className="mb-2 text-center text-[0.7rem] font-bold leading-tight tabular-nums text-primary md:text-xs"
                    >
                      {timeLabel}
                    </time>
                    <span
                      className={clsx(
                        'h-3 w-3 rounded-full md:h-3.5 md:w-3.5',
                        style.dot
                      )}
                      aria-hidden="true"
                    />
                  </div>

                  <article className="min-w-0 rounded-xl border border-border bg-surface-solid px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md md:px-5 md:py-4">
                  <h4 className="text-sm font-semibold leading-snug text-dark md:text-base">
                    {event.title}
                  </h4>

                  {event.subtitle && (
                    <p className="mt-1 text-xs leading-relaxed text-primary/85 md:text-sm">
                      {event.subtitle}
                    </p>
                  )}

                  {event.speaker && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted md:text-sm">
                      <IoMegaphoneOutline
                        className="h-3.5 w-3.5 shrink-0 text-primary/70"
                        aria-hidden="true"
                      />
                      {event.speaker}
                    </p>
                  )}

                  {event.description && (
                    <p className="mt-2 text-xs leading-relaxed text-text/85 md:text-sm">
                      {event.description}
                    </p>
                  )}
                  </article>
                </li>
              </Fragment>
            );
          })}
        </ol>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2 md:mt-8 md:gap-3">
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
