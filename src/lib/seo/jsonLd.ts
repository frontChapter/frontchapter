import config from '@config/config.json';
import social from '@config/social.json';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from './constants';
import { plainifySync } from './plainify';

export interface CommunityEventInput {
  name: string;
  description?: string;
  year?: string;
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

export const buildHomeJsonLd = (events: CommunityEventInput[] = []) => {
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
      subEvent: events.map((event, index) => ({
        '@type': 'Event',
        '@id': `${SITE_URL}/#event-${index + 1}`,
        name: event.year ? `${event.name} (${event.year})` : event.name,
        description: event.description
          ? plainifySync(event.description)
          : undefined,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        organizer: {
          '@id': organizationId,
        },
        image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        location: {
          '@type': 'Place',
          name: 'ایران',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IR',
          },
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};
