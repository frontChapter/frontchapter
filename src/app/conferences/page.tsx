import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import ConferencesList from '@/src/layouts/ConferencesList';
import JsonLd from '@/src/layouts/partials/JsonLd';
import { getAllConferences } from '@lib/conferences';
import { buildConferencesListJsonLd } from '@lib/seo/conferenceSeo';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'همایش‌های فرانت‌چپتر',
  meta_title: 'همایش‌های فرانت‌چپتر | فرانت‌چپتر',
  description:
    'مرور همایش‌های سالانه فرانت‌چپتر؛ از اولین همایش فرانت‌اند در ۱۴۰۰ تا همایش شیراز ۱۴۰۳.',
  canonical: '/conferences/',
  keywords: [
    'همایش فرانت‌اند',
    'فرانت‌چپتر',
    'کنفرانس فرانت‌اند ایران',
    'همایش ۱۴۰۰',
    'همایش ۱۴۰۲',
    'همایش ۱۴۰۳',
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
