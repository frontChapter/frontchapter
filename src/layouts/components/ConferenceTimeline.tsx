import clsx from 'clsx';
import { Fragment } from 'react';
import type { ScheduleEvent, ScheduleEventType } from '@lib/conferences';
import {
  IoBookOutline,
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
    dot: 'bg-primary',
    iconColor: 'text-primary',
  },
  break: {
    icon: IoCafeOutline,
    dot: 'bg-amber-500',
    iconColor: 'text-amber-500',
  },
  general: {
    icon: IoPeopleOutline,
    dot: 'bg-blue-500',
    iconColor: 'text-blue-500',
  },
  panel: {
    icon: IoChatbubblesOutline,
    dot: 'bg-purple-500',
    iconColor: 'text-purple-500',
  },
  competition: {
    icon: IoTrophyOutline,
    dot: 'bg-primary',
    iconColor: 'text-primary',
  },
  workshop: {
    icon: IoBookOutline,
    dot: 'bg-emerald-500',
    iconColor: 'text-emerald-500',
  },
  closing: {
    icon: IoFlagOutline,
    dot: 'bg-primary',
    iconColor: 'text-primary',
  },
};

const typeLabels: Record<ScheduleEventType, string> = {
  talk: 'سخنرانی',
  break: 'استراحت و پذیرایی',
  general: 'عمومی و پذیرش',
  panel: 'پنل گفتگو',
  competition: 'مسابقه',
  workshop: 'کارگاه و گروه تراپی',
  closing: 'اختتامیه و شبکه‌سازی',
};

const ConferenceTimeline = ({ events }: ConferenceTimelineProps) => {
  if (!events.length) return null;

  return (
    <div className="conference-timeline not-prose">
      <div className="relative">
        <ol className="relative space-y-4 md:space-y-5">
          {events.map((event, index) => {
            const style = typeStyles[event.type] ?? typeStyles.general;
            const showDayHeader =
              Boolean(event.day) && event.day !== events[index - 1]?.day;
            const timeLabel = event.endTime
              ? `${event.time} الی ${event.endTime}`
              : event.time;

            return (
              <Fragment key={`${event.day ?? ''}-${event.time}-${event.title}`}>
                {showDayHeader && (
                  <li className="list-none pb-2 pt-4 first:pt-0 md:pt-6">
                    <h3 className="rounded-xl border border-primary/20 bg-primary/5 py-2 text-center text-xs font-bold text-primary sm:text-sm md:text-base">
                      {event.day}
                    </h3>
                  </li>
                )}

                <li className="relative flex flex-col items-start gap-2.5 sm:flex-row sm:items-start sm:gap-4 md:gap-5">
                  {/* Timeline Badge for Time - Clear & Un-broken */}
                  <div className="flex shrink-0 items-center sm:w-36 sm:flex-col sm:items-stretch sm:pt-3">
                    <time
                      dateTime={event.time}
                      className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-black tabular-nums text-primary shadow-sm sm:text-sm"
                    >
                      <span
                        className={clsx(
                          'h-2 w-2 shrink-0 rounded-full',
                          style.dot
                        )}
                        aria-hidden="true"
                      />
                      <span>{timeLabel}</span>
                    </time>
                  </div>

                  {/* Content Card */}
                  <article className="w-full flex-1 rounded-2xl border border-border bg-surface-solid p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold leading-snug text-dark sm:text-base">
                        {event.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 rounded-full bg-theme-light px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                        {typeLabels[event.type] ?? 'عمومی'}
                      </span>
                    </div>

                    {event.subtitle && (
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-primary">
                        {event.subtitle}
                      </p>
                    )}

                    {event.speaker && (
                      <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-muted sm:text-sm">
                        <IoMegaphoneOutline
                          className="h-3.5 w-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        {event.speaker}
                      </p>
                    )}

                    {event.description && (
                      <p className="mt-2 text-xs leading-relaxed text-text sm:text-sm">
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

      <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
        {(Object.keys(typeStyles) as ScheduleEventType[]).map((type) => {
          const style = typeStyles[type];
          const Icon = style.icon;

          return (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-3.5 py-1 text-xs text-muted shadow-sm"
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
