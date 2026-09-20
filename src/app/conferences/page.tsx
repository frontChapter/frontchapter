import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import ConferencesList from '@/src/layouts/ConferencesList';
import JsonLd from '@/src/layouts/partials/JsonLd';
import { getAllConferences } from '@lib/conferences';
import { buildConferencesListJsonLd } from '@lib/seo/conferenceSeo';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'رویدادهای حضوری فرانت‌چپتر',
  meta_title: 'رویدادهای حضوری فرانت‌چپتر | فرانت‌چپتر',
  description:
    'مرور رویدادهای حضوری و همایش‌های سالانه فرانت‌چپتر؛ از دورهمی‌ها و نشست‌های تخصصی تا کنفرانس‌های بزرگ فرانت‌اند.',
  canonical: '/conferences/',
  keywords: [
    'رویدادهای حضوری فرانت‌چپتر',
    'در میان مه',
    'همایش فرانت‌اند',
    'فرانت‌چپتر',
    'کنفرانس فرانت‌اند ایران',
    'رویداد حضوری',
  ],
});

const ConferencesIndexPage = () => {
  const jsonLd = buildConferencesListJsonLd(getAllConferences());

  return (
    <GSAPWrapper>
      <JsonLd data={jsonLd} />
      <ConferencesList />
    </GSAPWrapper>
  );
};

export default ConferencesIndexPage;
