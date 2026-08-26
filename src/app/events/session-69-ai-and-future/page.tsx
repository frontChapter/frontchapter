import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import JsonLd from '@/src/layouts/partials/JsonLd';
import Session69Single from '@/src/layouts/Session69Single';
import { SITE_NAME, SITE_URL } from '@/src/lib/seo/constants';
import { buildPageMetadata } from '@/src/lib/seo/metadata';
import type { Metadata } from 'next';

const eventSlug = 'session-69-ai-and-future';
const eventCanonical = `/events/${eventSlug}/`;
const eventUrl = `${SITE_URL}${eventCanonical}`;

const eventTitle = 'بقا: هوش‌مصنوعی و آینده | جلسه ۶۹ فرانت‌چپتر';
const eventDescription =
  'جلسه‌ی حضوری شماره‌ی ۶۹ فرانت‌چپتر با موضوع بقا: هوش‌مصنوعی و آینده. ۲۶ شهریور ۱۴۰۵، فضای کار اشتراکی زاویه، تهران. دو سخنرانی، گروه تراپی و پذیرایی.';

const eventOgImage = '/images/session-69/event-birthday.jpg';

export const metadata: Metadata = buildPageMetadata({
  title: 'بقا: هوش‌مصنوعی و آینده',
  meta_title: eventTitle,
  description: eventDescription,
  image: eventOgImage,
  canonical: eventCanonical,
  keywords: [
    'جلسه ۶۹ فرانت‌چپتر',
    'بقا هوش مصنوعی و آینده',
    'رویداد فرانت‌چپتر',
    'روانشناسی بحران برنامه‌نویسان',
    'گروه تراپی توسعه‌دهندگان',
    'فضای کار اشتراکی زاویه',
    'کارخانه نوآوری آزادی',
    'فرانت‌چپتر',
    'FrontChapter',
  ],
  type: 'article',
  article: {
    publishedTime: '2026-09-17T16:00:00+03:30',
    modifiedTime: '2026-09-17T19:30:00+03:30',
    tags: [
      'جلسه ۶۹',
      'هوش مصنوعی',
      'بقا',
      'فرانت‌چپتر',
      'روانشناسی',
      'گروه تراپی',
    ],
  },
});

const buildSession69JsonLd = () => {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
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
            name: 'رویدادها',
            item: `${SITE_URL}/conferences/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'بقا: هوش‌مصنوعی و آینده (جلسه ۶۹)',
            item: eventUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${eventUrl}#webpage`,
        url: eventUrl,
        name: eventTitle,
        description: eventDescription,
        inLanguage: 'fa-IR',
        isPartOf: {
          '@id': websiteId,
        },
        about: {
          '@id': `${eventUrl}#event`,
        },
        publisher: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'Event',
        '@id': `${eventUrl}#event`,
        url: eventUrl,
        name: eventTitle,
        alternateName: [
          'جلسه ۶۹ فرانت‌چپتر',
          'بقا: هوش‌مصنوعی و آینده',
          'FrontChapter Session 69',
        ],
        description: eventDescription,
        startDate: '2026-09-17T16:00:00+03:30',
        endDate: '2026-09-17T19:30:00+03:30',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        inLanguage: 'fa-IR',
        isAccessibleForFree: false,
        maximumAttendeeCapacity: 50,
        organizer: {
          '@id': organizationId,
        },
        image: [`${SITE_URL}${eventOgImage}`],
        location: {
          '@type': 'Place',
          name: 'فضای کار اشتراکی زاویه — کارخانه نوآوری آزادی',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'تهران',
            streetAddress:
              'میدان آزادی، اتوبان شهید لشگری، کارخانه نوآوری آزادی، فضای کار اشتراکی زاویه',
            addressCountry: 'IR',
          },
        },
        offers: {
          '@type': 'Offer',
          url: eventUrl,
          price: '445000',
          priceCurrency: 'IRR',
          availability: 'https://schema.org/InStock',
          validFrom: '2026-08-26T00:00:00+03:30',
        },
        performer: [
          {
            '@type': 'Person',
            name: 'مهیار پویامهر',
            jobTitle: 'روانشناس',
          },
          {
            '@type': 'Person',
            name: 'صالح شجاعی',
            jobTitle: 'برنامه‌نویس ارشد',
            sameAs: ['https://www.linkedin.com/in/salehshojaei/'],
          },
        ],
      },
    ],
  };
};

const Session69Page = () => {
  const jsonLd = buildSession69JsonLd();

  return (
    <GSAPWrapper>
      <JsonLd data={jsonLd} />
      <Session69Single />
    </GSAPWrapper>
  );
};

export default Session69Page;
