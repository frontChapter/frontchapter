import type { Metadata } from 'next';
import type { ConferenceProfile, ScheduleEvent } from '@lib/conferences';
import { formatConferenceLabel } from '@lib/conferences';
import { conferencePath } from '@lib/conferences.paths';
import type { Stat } from '@/src/types/content';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from './constants';
import { buildPageMetadata } from './metadata';
import { plainifySync } from './plainify';

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

const resolveAbsoluteUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};

const persianDigitsToEnglish = (value: string) =>
  value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));

export const scheduleTimeToIso = (
  date: string,
  time: string
): string | undefined => {
  const normalized = persianDigitsToEnglish(time).replace(/[：٫]/g, ':');
  const match = normalized.match(/(\d{1,2})\s*:\s*(\d{1,2})/);

  if (!match) return undefined;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return undefined;

  return `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+03:30`;
};

const addMinutesToIso = (iso: string, minutes: number): string | undefined => {
  const match = iso.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})\+03:30$/
  );
  if (!match) return undefined;

  const totalMinutes = Number(match[2]) * 60 + Number(match[3]) + minutes;
  const minutesInDay = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(minutesInDay / 60);
  const mins = minutesInDay % 60;

  return `${match[1]}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${match[4]}+03:30`;
};

const resolveScheduleEndDate = (
  schedule: ScheduleEvent[],
  scheduleIndex: number,
  eventDate: string,
  conference: ConferenceProfile
): string | undefined => {
  const event = schedule[scheduleIndex];

  if (event.endTime) {
    return scheduleTimeToIso(eventDate, event.endTime);
  }

  const next = schedule[scheduleIndex + 1];
  if (next) {
    const nextDate = next.date ?? eventDate;
    return scheduleTimeToIso(nextDate, next.time);
  }

  const startDate = scheduleTimeToIso(eventDate, event.time);
  if (startDate) {
    return addMinutesToIso(startDate, 30);
  }

  if (conference.endDate?.includes('T')) {
    return conference.endDate;
  }

  return undefined;
};

const resolveConferenceEventDates = (conference: ConferenceProfile) => {
  const schedule = conference.schedule ?? [];
  let startDate = conference.startDate;
  let endDate = conference.endDate;

  if (!startDate.includes('T') && schedule.length > 0) {
    const first = schedule[0];
    const firstDate = first.date ?? conference.startDate;
    startDate =
      scheduleTimeToIso(firstDate, first.time) ?? conference.startDate;
  }

  if (schedule.length > 0) {
    const lastIndex = schedule.length - 1;
    const last = schedule[lastIndex];
    const lastDate = last.date ?? conference.endDate ?? conference.startDate;
    const resolvedEnd = resolveScheduleEndDate(
      schedule,
      lastIndex,
      lastDate,
      conference
    );

    if (resolvedEnd) {
      endDate = resolvedEnd;
    }
  }

  return { startDate, endDate };
};

export const parseConferenceLocation = (locationName: string) => {
  const [localityPart, venuePart] = locationName
    .split('—')
    .map((part) => part.trim());
  const [locality, region] = (venuePart ? localityPart : locationName)
    .split('،')
    .map((part) => part.trim());

  return {
    venue: venuePart,
    locality: locality || locationName,
    region: region || undefined,
  };
};

const getAttendeeCount = (stats: Stat[]): number | undefined => {
  const inPersonStat = stats.find((stat) => stat.label.includes('حضوری'));

  if (!inPersonStat) return undefined;

  const digits = persianDigitsToEnglish(inPersonStat.value).replace(
    /[^\d]/g,
    ''
  );
  const count = Number(digits);

  return Number.isNaN(count) ? undefined : count;
};

export const getConferenceImages = (
  conference: ConferenceProfile
): string[] => {
  const images = new Set<string>();

  const addImage = (path?: string) => {
    if (path) images.add(resolveAbsoluteUrl(path));
  };

  addImage(conference.seo?.og_image);
  conference.seo?.images?.forEach((image) => addImage(image));
  addImage(conference.video?.poster);
  conference.images?.forEach((image) => {
    addImage(image.jpgSrc ?? image.src);
  });
  conference.media?.gallery.forEach((image) => addImage(image.src));

  if (images.size === 0) {
    addImage(DEFAULT_OG_IMAGE);
  }

  return Array.from(images);
};

export const getConferenceOgImage = (conference: ConferenceProfile): string => {
  if (conference.seo?.og_image) {
    return resolveAbsoluteUrl(conference.seo.og_image);
  }

  if (conference.video?.poster) {
    return resolveAbsoluteUrl(conference.video.poster);
  }

  const firstImage = conference.images?.[0];
  if (firstImage) {
    return resolveAbsoluteUrl(firstImage.jpgSrc ?? firstImage.src);
  }

  const firstGalleryImage = conference.media?.gallery[0];
  if (firstGalleryImage) {
    return resolveAbsoluteUrl(firstGalleryImage.src);
  }

  return resolveAbsoluteUrl(DEFAULT_OG_IMAGE);
};

export const buildConferenceKeywords = (
  conference: ConferenceProfile
): string[] => {
  if (conference.seo?.keywords?.length) {
    return conference.seo.keywords;
  }

  const keywords = new Set<string>([
    'همایش فرانت‌اند',
    'فرانت‌چپتر',
    'Front Chapter',
    `همایش ${conference.year}`,
    conference.title,
    'کنفرانس فرانت‌اند ایران',
    'جامعه فرانت‌اند',
  ]);

  const { locality, venue } = parseConferenceLocation(conference.locationName);

  if (locality) keywords.add(locality);
  if (venue) keywords.add(venue);

  conference.speakers?.list.forEach((speaker) => {
    if (speaker.talk) keywords.add(speaker.talk);
    if (speaker.company) keywords.add(speaker.company);
  });

  return Array.from(keywords);
};

export const buildConferenceMetaDescription = (
  conference: ConferenceProfile
): string => {
  if (conference.seo?.meta_description) {
    return plainifySync(conference.seo.meta_description);
  }

  const { locality, venue } = parseConferenceLocation(conference.locationName);
  const speakerCount = conference.speakers?.list.length ?? 0;
  const talkSample =
    conference.speakers?.list
      .filter((speaker) => speaker.talk)
      .slice(0, 3)
      .map((speaker) => speaker.talk)
      .join('، ') ?? '';

  const locationLabel = [locality, venue].filter(Boolean).join('، ');
  const description = [
    `${formatConferenceLabel(conference.title, conference.year)}`,
    locationLabel ? `در ${locationLabel}` : '',
    speakerCount > 0 ? `با ${speakerCount} سخنران` : '',
    talkSample ? `؛ ${talkSample}` : '',
    'رویداد تخصصی فرانت‌چپتر.',
  ]
    .filter(Boolean)
    .join(' ');

  return plainifySync(description).slice(0, 160);
};

export const buildConferenceMetadata = (
  conference: ConferenceProfile
): Metadata => {
  const pageTitle =
    conference.seo?.meta_title ??
    `${formatConferenceLabel(conference.title, conference.year)} | فرانت‌چپتر`;
  const description = buildConferenceMetaDescription(conference);
  const ogImage = getConferenceOgImage(conference);
  const keywords = buildConferenceKeywords(conference);

  return buildPageMetadata({
    title: conference.title,
    meta_title: pageTitle,
    description,
    image: ogImage,
    canonical: conferencePath(conference.slug),
    keywords,
    type: 'article',
    article: {
      publishedTime: conference.startDate,
      modifiedTime: conference.endDate ?? conference.startDate,
      tags: keywords.slice(0, 8),
    },
  });
};

const buildSpeakerPerformers = (conference: ConferenceProfile) =>
  conference.speakers?.list.map((speaker) => ({
    '@type': 'Person',
    name: speaker.name,
    ...(speaker.role ? { jobTitle: speaker.role } : {}),
    ...(speaker.image ? { image: resolveAbsoluteUrl(speaker.image) } : {}),
    ...(speaker.company
      ? {
          worksFor: {
            '@type': 'Organization',
            name: speaker.company,
          },
        }
      : {}),
    ...(speaker.linkedin ? { sameAs: [speaker.linkedin] } : {}),
  })) ?? [];

const buildEventLocation = (
  conference: ConferenceProfile,
  locality: string,
  region?: string,
  venue?: string
) => ({
  '@type': 'Place',
  name: venue ?? conference.locationName,
  ...(venue
    ? {
        containedInPlace: {
          '@type': 'City',
          name: locality,
          ...(region
            ? {
                containedInPlace: {
                  '@type': 'AdministrativeArea',
                  name: region,
                },
              }
            : {}),
        },
      }
    : {}),
  address: {
    '@type': 'PostalAddress',
    addressLocality: locality,
    ...(region ? { addressRegion: region } : {}),
    addressCountry: 'IR',
  },
});

const buildEventOffers = (
  url: string,
  startDate: string,
  endDate: string | undefined,
  isPastEvent: boolean
) => ({
  '@type': 'Offer',
  url,
  price: '0',
  priceCurrency: 'IRR',
  availability: isPastEvent
    ? 'https://schema.org/SoldOut'
    : 'https://schema.org/InStock',
  validFrom: startDate,
  ...(endDate ? { validThrough: endDate } : {}),
});

const buildScheduleEventDescription = (
  event: ScheduleEvent,
  conferenceLabel: string
) => {
  if (event.description) {
    return plainifySync(event.description);
  }

  const title = event.subtitle
    ? `${event.title} — ${event.subtitle}`
    : event.title;
  const parts = [`${title}، بخشی از ${conferenceLabel}`];

  if (event.speaker) {
    parts.push(`با ${event.speaker}`);
  }

  return plainifySync(parts.join(' — '));
};

const buildScheduleSubEvents = (
  conference: ConferenceProfile,
  {
    eventUrl,
    conferenceLabel,
    images,
    isPastEvent,
    locality,
    region,
    venue,
  }: {
    eventUrl: string;
    conferenceLabel: string;
    images: string[];
    isPastEvent: boolean;
    locality: string;
    region?: string;
    venue?: string;
  }
): Record<string, unknown>[] => {
  if (!conference.schedule?.length) return [];

  const schedule = conference.schedule;
  let sessionIndex = 0;

  return schedule
    .map((event, scheduleIndex) => ({ event, scheduleIndex }))
    .filter(({ event }) =>
      ['talk', 'panel', 'competition', 'workshop'].includes(event.type)
    )
    .map(({ event, scheduleIndex }) => {
      sessionIndex += 1;
      const eventDate = event.date ?? conference.startDate;
      const startDate = scheduleTimeToIso(eventDate, event.time);
      const endDate = resolveScheduleEndDate(
        schedule,
        scheduleIndex,
        eventDate,
        conference
      );
      const sessionUrl = `${eventUrl}#session-${sessionIndex}`;
      const sessionStartDate = startDate ?? conference.startDate;

      return {
        '@type': 'Event',
        '@id': sessionUrl,
        url: sessionUrl,
        name: event.subtitle
          ? `${event.title} — ${event.subtitle}`
          : event.title,
        description: buildScheduleEventDescription(event, conferenceLabel),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        isAccessibleForFree: true,
        organizer: {
          '@id': organizationId,
        },
        image: images,
        location: buildEventLocation(conference, locality, region, venue),
        offers: buildEventOffers(
          sessionUrl,
          sessionStartDate,
          endDate,
          isPastEvent
        ),
        ...(event.speaker
          ? {
              performer: {
                '@type': 'Person',
                name: event.speaker,
              },
            }
          : event.type === 'panel' && conference.speakers?.list.length
            ? {
                performer: conference.speakers.list.map((speaker) => ({
                  '@type': 'Person',
                  name: speaker.name,
                })),
              }
            : event.type === 'competition'
              ? {
                  performer: {
                    '@id': organizationId,
                  },
                }
              : {}),
        superEvent: {
          '@id': `${eventUrl}#event`,
        },
      };
    });
};

export const buildConferenceJsonLd = (conference: ConferenceProfile) => {
  const eventUrl = `${SITE_URL}${conferencePath(conference.slug)}`;
  const { startDate: eventStartDate, endDate: eventEndDate } =
    resolveConferenceEventDates(conference);
  const isPastEvent = new Date(eventStartDate).getTime() < Date.now();
  const { locality, region, venue } = parseConferenceLocation(
    conference.locationName
  );
  const images = getConferenceImages(conference);
  const attendeeCount = getAttendeeCount(conference.stats);
  const keywords = buildConferenceKeywords(conference);
  const performers = buildSpeakerPerformers(conference);
  const pageName = plainifySync(
    formatConferenceLabel(conference.title, conference.year)
  );
  const subEvents = buildScheduleSubEvents(conference, {
    eventUrl,
    conferenceLabel: pageName,
    images,
    isPastEvent,
    locality,
    region,
    venue,
  });

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      '@id': `${eventUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_NAME,
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'همایش‌ها',
          item: `${SITE_URL}/conferences/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: pageName,
          item: eventUrl,
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${eventUrl}#webpage`,
      url: eventUrl,
      name: pageName,
      description: buildConferenceMetaDescription(conference),
      inLanguage: 'fa-IR',
      isPartOf: {
        '@id': websiteId,
      },
      about: {
        '@id': `${eventUrl}#event`,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: images[0],
      },
      publisher: {
        '@id': organizationId,
      },
    },
    {
      '@type': 'Event',
      '@id': `${eventUrl}#event`,
      url: eventUrl,
      name: pageName,
      alternateName: [`همایش فرانت‌چپتر ${conference.year}`, conference.title],
      description: plainifySync(conference.description),
      startDate: eventStartDate,
      ...(eventEndDate ? { endDate: eventEndDate } : {}),
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      inLanguage: 'fa-IR',
      isAccessibleForFree: true,
      keywords: keywords.join(', '),
      organizer: {
        '@id': organizationId,
      },
      image: images,
      location: buildEventLocation(conference, locality, region, venue),
      ...(performers.length ? { performer: performers } : {}),
      ...(attendeeCount ? { maximumAttendeeCapacity: attendeeCount } : {}),
      offers: buildEventOffers(
        eventUrl,
        eventStartDate,
        eventEndDate,
        isPastEvent
      ),
      ...(subEvents.length ? { subEvent: subEvents } : {}),
    },
  ];

  if (conference.video?.src) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${eventUrl}#video`,
      name: `${pageName} — ${conference.video.label}`,
      description: buildConferenceMetaDescription(conference),
      thumbnailUrl: conference.video.poster
        ? resolveAbsoluteUrl(conference.video.poster)
        : images[0],
      contentUrl: resolveAbsoluteUrl(conference.video.src),
      uploadDate: conference.startDate,
      inLanguage: 'fa-IR',
      publisher: {
        '@id': organizationId,
      },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};

export const buildConferencesListJsonLd = (
  conferences: ConferenceProfile[]
) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/conferences/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_NAME,
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'همایش‌ها',
          item: `${SITE_URL}/conferences/`,
        },
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/conferences/#webpage`,
      url: `${SITE_URL}/conferences/`,
      name: 'همایش‌های فرانت‌چپتر',
      description: plainifySync(DEFAULT_DESCRIPTION),
      inLanguage: 'fa-IR',
      isPartOf: {
        '@id': websiteId,
      },
      publisher: {
        '@id': organizationId,
      },
      hasPart: conferences.map((conference) => ({
        '@type': 'Event',
        '@id': `${SITE_URL}${conferencePath(conference.slug)}#event`,
        name: formatConferenceLabel(conference.title, conference.year),
        url: `${SITE_URL}${conferencePath(conference.slug)}`,
        startDate: conference.startDate,
      })),
    },
  ],
});
