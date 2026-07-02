import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import ConferencesList from '@/src/layouts/ConferencesList';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'همایش‌های فرانت‌چپتر',
  meta_title: 'همایش‌های فرانت‌چپتر | فرانت‌چپتر',
  description:
    'مرور همایش‌های سالانه فرانت‌چپتر؛ از اولین همایش فرانت‌اند در ۱۴۰۰ تا همایش شیراز ۱۴۰۳.',
  canonical: '/conferences/',
});

const ConferencesIndexPage = () => (
  <GSAPWrapper>
    <ConferencesList />
  </GSAPWrapper>
);

export default ConferencesIndexPage;
