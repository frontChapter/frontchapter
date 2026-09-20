import config from '@config/config.json';
import social from '@config/social.json';
import { conferencePath } from '@lib/conferences.paths';
import { speakerPath, type SpeakerProfile } from '@lib/speakers';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from './constants';
import { plainifySync } from './plainify';

export {
  buildConferenceJsonLd,
  buildConferencesListJsonLd,
} from './conferenceSeo';

export interface CommunityEventInput {
  name: string;
  description?: string;
  year?: string;
  startDate: string;
  endDate?: string;
  locationName?: string;
  performers?: string[];
  offersUrl?: string;
  eventAttendanceMode?: 'offline' | 'online' | 'mixed';
  slug?: string;
}

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

const resolveAbsoluteUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};

export interface BlogPostInput {
  title: string;
  description: string;
  slug: string;
  image?: string;
  date: string;
  author: { name: string; avatar?: string };
}

export interface BlogListInput {
  title: string;
  page?: number;
}

export const buildBlogPostJsonLd = ({
  title,
  description,
  slug,
  image,
  date,
  author,
}: BlogPostInput) => {
  const postUrl = `${SITE_URL}/posts/${slug}/`;
  const blogUrl = `${SITE_URL}/posts/`;
  const imageUrl = image ? resolveAbsoluteUrl(image) : undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${postUrl}#breadcrumb`,
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
            name: 'بلاگ',
            item: blogUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: plainifySync(title),
            item: postUrl,
          },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#article`,
        headline: plainifySync(title),
        description: plainifySync(description),
        url: postUrl,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': postUrl,
        },
        datePublished: date,
        dateModified: date,
        inLanguage: 'fa-IR',
        author: {
          '@type': 'Person',
          name: author.name,
          ...(author.avatar
            ? { image: resolveAbsoluteUrl(author.avatar) }
            : {}),
        },
        publisher: {
          '@id': organizationId,
        },
        ...(imageUrl
          ? {
              image: {
                '@type': 'ImageObject',
                url: imageUrl,
              },
            }
          : {}),
      },
    ],
  };
};

export const buildBlogListJsonLd = ({ title, page = 1 }: BlogListInput) => {
  const listUrl =
    page <= 1 ? `${SITE_URL}/posts/` : `${SITE_URL}/posts/page/${page}/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${listUrl}#breadcrumb`,
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
            name: plainifySync(title),
            item: listUrl,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${listUrl}#webpage`,
        name: plainifySync(title),
        url: listUrl,
        inLanguage: 'fa-IR',
        isPartOf: {
          '@id': websiteId,
        },
        publisher: {
          '@id': organizationId,
        },
      },
    ],
  };
};

export interface HomeVideoInput {
  name?: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  contentUrl?: string;
  embedUrl?: string;
}

export const buildHomeJsonLd = (
  events: CommunityEventInput[] = [],
  video?: HomeVideoInput
) => {
  const { logo } = config.site as { logo: string };
  const { email, location } = config.contact_info as {
    email: string;
    location: string;
  };

  const sameAs = Object.values(social).filter(
    (url) => typeof url === 'string' && url.startsWith('http')
  );

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      alternateName: 'Front Chapter',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${logo}`,
      },
      description: plainifySync(DEFAULT_DESCRIPTION),
      email,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IR',
        streetAddress: location,
      },
      sameAs,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: SITE_URL,
      name: SITE_NAME,
      description: plainifySync(DEFAULT_DESCRIPTION),
      inLanguage: 'fa-IR',
      publisher: {
        '@id': organizationId,
      },
    },
  ];

  const attendanceModeMap = {
    offline: 'https://schema.org/OfflineEventAttendanceMode',
    online: 'https://schema.org/OnlineEventAttendanceMode',
    mixed: 'https://schema.org/MixedEventAttendanceMode',
  } as const;

  if (events.length > 0) {
    graph.push({
      '@type': 'EventSeries',
      '@id': `${SITE_URL}/#event-series`,
      name: 'رویدادهای سالانه فرانت‌چپتر',
      description:
        'مجموعه همایش‌ها، دورهمی‌ها و رویدادهای تخصصی فرانت‌اند برگزارشده توسط جامعه فرانت‌چپتر',
      organizer: {
        '@id': organizationId,
      },
      image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      subEvent: events.map((event, index) => {
        const isPastEvent = new Date(event.startDate).getTime() < Date.now();
        const attendanceMode =
          attendanceModeMap[event.eventAttendanceMode ?? 'offline'];
        const eventUrl = event.slug
          ? `${SITE_URL}${conferencePath(event.slug)}`
          : `${SITE_URL}/#event-${index + 1}`;

        return {
          '@type': 'Event',
          '@id': event.slug
            ? `${eventUrl}#event`
            : `${SITE_URL}/#event-${index + 1}`,
          url: eventUrl,
          name: event.year ? `${event.name} (${event.year})` : event.name,
          description: event.description
            ? plainifySync(event.description)
            : undefined,
          startDate: event.startDate,
          ...(event.endDate ? { endDate: event.endDate } : {}),
          eventAttendanceMode: attendanceMode,
          eventStatus: 'https://schema.org/EventScheduled',
          organizer: {
            '@id': organizationId,
          },
          image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
          location: {
            '@type': 'Place',
            name: event.locationName ?? 'ایران',
            address: {
              '@type': 'PostalAddress',
              addressLocality: event.locationName ?? 'ایران',
              addressCountry: 'IR',
            },
          },
          ...(event.performers?.length
            ? {
                performer: event.performers.map((name) => ({
                  '@type': 'Person',
                  name,
                })),
              }
            : {}),
          offers: {
            '@type': 'Offer',
            url: event.offersUrl ?? eventUrl,
            price: '0',
            priceCurrency: 'IRR',
            availability: isPastEvent
              ? 'https://schema.org/SoldOut'
              : 'https://schema.org/InStock',
            validFrom: event.startDate,
            ...(event.endDate ? { validThrough: event.endDate } : {}),
          },
        };
      }),
    });
  }

  if (video?.contentUrl || video?.embedUrl) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${SITE_URL}/#hero-video`,
      name: video.name ?? 'جامعه‌ی فرانت‌اند فرانت‌چپتر — ویدیوی معرفی',
      description: plainifySync(
        video.description ??
          'معرفی جامعه‌ی فرانت‌چپتر؛ محلی صمیمی برای گفت‌وگوی تخصصی و اشتراک تجربیات توسعه‌دهندگان فرانت‌اند'
      ),
      thumbnailUrl: video.thumbnailUrl
        ? resolveAbsoluteUrl(video.thumbnailUrl)
        : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      ...(video.contentUrl
        ? { contentUrl: resolveAbsoluteUrl(video.contentUrl) }
        : {}),
      ...(video.embedUrl ? { embedUrl: video.embedUrl } : {}),
      uploadDate: video.uploadDate ?? '2025-02-27',
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

export interface AboutPersonInput {
  name: string;
  role: string;
  image?: string;
  sameAs?: string[];
}

export interface AboutJsonLdInput {
  title: string;
  description: string;
  image?: string;
  people?: AboutPersonInput[];
  video?: {
    src?: string;
    title?: string;
    description?: string;
    poster?: string;
    uploadDate?: string;
  };
}

export const buildAboutJsonLd = ({
  title,
  description,
  image,
  people = [],
  video,
}: AboutJsonLdInput) => {
  const aboutUrl = `${SITE_URL}/about/`;
  const pageDescription = plainifySync(description || DEFAULT_DESCRIPTION);
  const pageTitle = plainifySync(title);
  const imageUrl = image
    ? resolveAbsoluteUrl(image)
    : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  const employee = people.map((person) => {
    const sameAs = person.sameAs?.filter(Boolean) ?? [];
    return {
      '@type': 'Person',
      name: person.name,
      jobTitle: person.role,
      worksFor: { '@id': organizationId },
      ...(person.image ? { image: resolveAbsoluteUrl(person.image) } : {}),
      ...(sameAs.length ? { sameAs } : {}),
    };
  });

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      '@id': `${aboutUrl}#breadcrumb`,
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
          name: pageTitle,
          item: aboutUrl,
        },
      ],
    },
    {
      '@type': 'AboutPage',
      '@id': `${aboutUrl}#webpage`,
      url: aboutUrl,
      name: pageTitle,
      description: pageDescription,
      inLanguage: 'fa-IR',
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
      publisher: { '@id': organizationId },
    },
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      alternateName: 'Front Chapter',
      url: SITE_URL,
      description: pageDescription,
      ...(employee.length ? { employee } : {}),
    },
  ];

  if (video?.src) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${aboutUrl}#video`,
      name: video.title ? plainifySync(video.title) : 'معرفی فرانت‌چپتر',
      description: plainifySync(video.description || pageDescription),
      thumbnailUrl: video.poster ? resolveAbsoluteUrl(video.poster) : imageUrl,
      contentUrl: resolveAbsoluteUrl(video.src),
      uploadDate: video.uploadDate ?? '2025-02-27',
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

export interface SpeakerJsonLdInput {
  speaker: SpeakerProfile;
}

export const buildSpeakerJsonLd = ({ speaker }: SpeakerJsonLdInput) => {
  const profileUrl = `${SITE_URL}${speakerPath(speaker.slug)}`;
  const speakersUrl = `${SITE_URL}/speakers/`;
  const avatarUrl = speaker.avatar
    ? resolveAbsoluteUrl(speaker.avatar)
    : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  const bioText = Array.isArray(speaker.bio)
    ? speaker.bio.join(' ')
    : speaker.bio;
  const description = bioText
    ? plainifySync(bioText)
    : `پروفایل و آرشیو جلسات ${speaker.name} در فرانت‌چپتر`;

  const speakerLinks = [
    speaker.linkedin,
    ...(speaker.links?.map((l) => l.url) || []),
  ].filter(Boolean) as string[];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${profileUrl}#breadcrumb`,
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
            name: 'پیشگامان گفت‌وگو',
            item: speakersUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: speaker.name,
            item: profileUrl,
          },
        ],
      },
      {
        '@type': 'ProfilePage',
        '@id': `${profileUrl}#webpage`,
        url: profileUrl,
        name: `${speaker.name} | پیشگامان گفت‌وگو`,
        description,
        inLanguage: 'fa-IR',
        isPartOf: {
          '@id': websiteId,
        },
        mainEntity: {
          '@id': `${profileUrl}#person`,
        },
      },
      {
        '@type': 'Person',
        '@id': `${profileUrl}#person`,
        name: speaker.name,
        description,
        jobTitle: 'پیشگام گفت‌وگو در فرانت‌چپتر',
        image: avatarUrl,
        url: profileUrl,
        ...(speakerLinks.length > 0 ? { sameAs: speakerLinks } : {}),
        worksFor: {
          '@id': organizationId,
        },
      },
    ],
  };
};

export const buildSpeakersListJsonLd = (speakers: SpeakerProfile[]) => {
  const speakersUrl = `${SITE_URL}/speakers/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${speakersUrl}#breadcrumb`,
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
            name: 'پیشگامان گفت‌وگو',
            item: speakersUrl,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${speakersUrl}#webpage`,
        url: speakersUrl,
        name: 'پیشگامان گفت‌وگو در فرانت‌چپتر',
        description: 'فهرست سخنرانان و ارائه‌دهندگان جلسات آنلاین فرانت‌چپتر',
        inLanguage: 'fa-IR',
        isPartOf: {
          '@id': websiteId,
        },
        publisher: {
          '@id': organizationId,
        },
        hasPart: speakers.map((speaker) => {
          const speakerLinks = [
            speaker.linkedin,
            ...(speaker.links?.map((l) => l.url) || []),
          ].filter(Boolean) as string[];

          return {
            '@type': 'Person',
            name: speaker.name,
            url: `${SITE_URL}${speakerPath(speaker.slug)}`,
            ...(speaker.avatar
              ? { image: resolveAbsoluteUrl(speaker.avatar) }
              : {}),
            ...(speakerLinks.length > 0 ? { sameAs: speakerLinks } : {}),
          };
        }),
      },
    ],
  };
};
