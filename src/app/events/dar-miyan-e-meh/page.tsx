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
const googlePhotosUrl = 'https://photos.app.goo.gl/oZY9Y2vzwqm4cPpY8';
const yasinArticleUrl = 'https://yasiin.me/expertise-to-opportunity/';

const eventTitle = 'گزارش رویداد حضوری «در میان مِه» | فرانت‌چپتر';
const eventDescription =
  'گزارش کامل رویداد حضوری در میان مِه فرانت‌چپتر؛ هم‌اندیشی در روزهای عدم‌قطعیت، کارگاه تعاملی دکتر پویامهر، ارائه کارخانه هوش مصنوعی ایران، معرفی کدمیت و ویجتیفای و پنل تخصصی بازار کار با دانلود آلبوم تصاویر.';

const eventOgImage = '/images/events/dar-miyan-e-meh-banner.jpg';

export const metadata: Metadata = buildPageMetadata({
  title: eventTitle,
  meta_title:
    'گزارش کامل رویداد در میان مِه؛ هم‌اندیشی در روزهای عدم‌قطعیت | فرانت‌چپتر',
  description: eventDescription,
  image: eventOgImage,
  canonical: eventCanonical,
  keywords: [
    'در میان مه',
    'گزارش رویداد در میان مه',
    'رویداد در میان مه',
    'رویداد حضوری فرانت‌چپتر',
    'هوش مصنوعی و بازار کار',
    'مهیار پویامهر',
    'کارگاه از مه تا وضوح',
    'کدمیت',
    'CodeMeet',
    'ویجتیفای',
    'Widgetify',
    'لیارا',
    'کارخانه هوش مصنوعی ایران',
    'یاسین همتی',
    'پویا صبرآموز',
    'فضای کار اشتراکی زاویه',
    'کارخانه نوآوری آزادی',
    'فرانت‌چپتر',
    'FrontChapter',
  ],
  type: 'article',
  article: {
    publishedTime: '2026-09-24T15:00:00+03:30',
    modifiedTime: '2026-09-30T09:30:00+03:30',
    tags: [
      'گزارش رویداد',
      'رویداد حضوری',
      'در میان مه',
      'فرانت‌چپتر',
      'هوش مصنوعی',
      'سلامت روان',
      'مهیار پویامهر',
      'کارخانه هوش مصنوعی ایران',
      'لیارا',
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
            name: 'گزارش رویداد حضوری در میان مِه',
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
        '@type': 'Article',
        '@id': `${eventUrl}#article`,
        isPartOf: {
          '@id': `${eventUrl}#webpage`,
        },
        headline:
          'گزارش رویداد حضوری «در میان مِه»؛ هم‌اندیشی در روزهای عدم‌قطعیت',
        description: eventDescription,
        datePublished: '2026-09-24T15:00:00+03:30',
        dateModified: '2026-09-30T09:30:00+03:30',
        mainEntityOfPage: eventUrl,
        publisher: {
          '@id': organizationId,
        },
        image: [`${SITE_URL}${eventOgImage}`],
        inLanguage: 'fa-IR',
        author: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'Event',
        '@id': `${eventUrl}#event`,
        url: eventUrl,
        name: 'رویداد حضوری در میان مِه',
        alternateName: [
          'Through the Fog',
          'در میان مه فرانت‌چپتر',
          'FrontChapter In-person Event',
        ],
        description: eventDescription,
        sameAs: [externalEventUrl, googlePhotosUrl],
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
        sponsor: [
          {
            '@type': 'Organization',
            name: 'پلتفرم ابری لیارا (Liara)',
            url: 'https://liara.ir/',
          },
          {
            '@type': 'Organization',
            name: 'کارخانه هوش مصنوعی ایران',
          },
        ],
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
        performer: [
          {
            '@type': 'Person',
            name: 'صالح شجاعی',
            jobTitle: 'بنیان‌گذار فرانت‌چپتر',
          },
          {
            '@type': 'Person',
            name: 'اتابک آکسون',
            jobTitle: 'کارخانه هوش مصنوعی ایران',
          },
          {
            '@type': 'Person',
            name: 'دکتر مهیار پویامهر',
            jobTitle: 'روان‌شناس بالینی و مدرس دانشگاه',
          },
          {
            '@type': 'Person',
            name: 'شایان حیدری',
            jobTitle: 'بنیان‌گذار CodeMeet',
          },
          {
            '@type': 'Person',
            name: 'حسین جوان',
            jobTitle: 'توسعه‌دهنده Widgetify',
          },
          {
            '@type': 'Person',
            name: 'امیرحسین کریمی',
            jobTitle: 'مهندس ارشد نرم‌افزار و مدیر فناوری InteliCraft',
          },
          {
            '@type': 'Person',
            name: 'یاسین همتی',
            jobTitle: 'رئیس هیئت‌مدیره شرکت تأمین آلیاژ کارا صنعت',
            url: yasinArticleUrl,
          },
          {
            '@type': 'Person',
            name: 'پویا صبرآموز',
            jobTitle: 'مدیرعامل سابق و مترجم کتاب «برنامه‌نویس عملگرا»',
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
