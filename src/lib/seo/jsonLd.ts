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
