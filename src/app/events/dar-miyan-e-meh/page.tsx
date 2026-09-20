import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import DarMiyanEMehSingle from '@/src/layouts/DarMiyanEMehSingle';
import JsonLd from '@/src/layouts/partials/JsonLd';
import { SITE_NAME, SITE_URL } from '@/src/lib/seo/constants';
import { buildPageMetadata } from '@/src/lib/seo/metadata';
import type { Metadata } from 'next';

const eventSlug = 'dar-miyan-e-meh';
const eventCanonical = `/events/${eventSlug}/`;
const eventUrl = `${SITE_URL}${eventCanonical}`;
const externalEventUrl = 'https://mist.frontchapter.ir/';

const eventTitle = 'در میان مه | رویداد حضوری فرانت‌چپتر';
const eventDescription =
  'رویدادی تعاملی برای طراحان، برنامه‌نویسان و متخصصان محصول؛ مواجهه با بحران هوش مصنوعی و عدم‌قطعیت، نشست تخصصی روانشناختی «از مِه تا وضوح» با حضور دکتر مهیار پویامهر و پنل گفت‌وگوی تخصصی در کارخانه نوآوری آزادی.';

const eventOgImage = '/images/events/dar-miyan-e-meh-banner.jpg';

export const metadata: Metadata = buildPageMetadata({
  title: 'در میان مه | رویداد حضوری فرانت‌چپتر',
  meta_title: eventTitle,
  description: eventDescription,
  image: eventOgImage,
  canonical: eventCanonical,
  keywords: [
    'در میان مه',
    'رویداد در میان مه',
    'رویداد حضوری فرانت‌چپتر',
    'هوش مصنوعی و بازار کار',
    'مهیار پویامهر',
    'کارگاه تعاملی برنامه‌نویسان',
    'فضای کار اشتراکی زاویه',
    'کارخانه نوآوری آزادی',
    'فرانت‌چپتر',
    'FrontChapter',
  ],
  type: 'article',
  article: {
    publishedTime: '2026-09-20T12:00:00+03:30',
    modifiedTime: '2026-09-20T12:00:00+03:30',
    tags: [
      'رویداد حضوری',
      'در میان مه',
      'فرانت‌چپتر',
      'هوش مصنوعی',
      'مهیار پویامهر',
    ],
  },
});

const buildDarMiyanEMehJsonLd = () => {
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
            name: 'رویدادهای حضوری',
            item: `${SITE_URL}/conferences/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'رویداد حضوری در میان مِه',
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
        url: externalEventUrl,
        name: eventTitle,
        alternateName: [
          'رویداد حضوری در میان مه',
          'Through the Fog',
          'FrontChapter In-person Event',
        ],
        description: eventDescription,
        startDate: '2026-09-24T15:00:00+03:30',
        endDate: '2026-09-24T19:30:00+03:30',
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
          name: 'فضای کار اشتراکی زاویه • کارخانه نوآوری آزادی',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'تهران',
            streetAddress:
              'کارخانه نوآوری آزادی، روبه‌روی ایستگاه مترو بیمه، فضای کار اشتراکی زاویه',
            addressCountry: 'IR',
          },
        },
        offers: {
          '@type': 'Offer',
          url: externalEventUrl,
          price: '455000',
          priceCurrency: 'IRR',
          availability: 'https://schema.org/InStock',
        },
        performer: [
          {
            '@type': 'Person',
            name: 'دکتر مهیار پویامهر',
            jobTitle: 'روان‌شناس بالینی و مدرس دانشگاه',
          },
          {
            '@type': 'Person',
            name: 'یاسین همتی',
            jobTitle: 'رئیس هیئت‌مدیره شرکت تأمین آلیاژ کارا صنعت',
          },
          {
            '@type': 'Person',
            name: 'امیر کریمی',
            jobTitle: 'مهندس ارشد نرم‌افزار و مدیر فناوری InteliCraft',
          },
          {
            '@type': 'Person',
            name: 'پویا صبرآموز',
            jobTitle: 'مدیرعامل و مدیر فناوری سابق',
          },
        ],
      },
    ],
  };
};

const DarMiyanEMehPage = () => {
  const jsonLd = buildDarMiyanEMehJsonLd();

  return (
    <GSAPWrapper>
      <JsonLd data={jsonLd} />
      <DarMiyanEMehSingle />
    </GSAPWrapper>
  );
};

export default DarMiyanEMehPage;
