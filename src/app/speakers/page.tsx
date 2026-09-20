import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import SpeakersList from '@/src/layouts/SpeakersList';
import JsonLd from '@/src/layouts/partials/JsonLd';
import { getAllSpeakers } from '@lib/speakers';
import { buildSpeakersListJsonLd } from '@lib/seo/jsonLd';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'پیشگامان گفت‌وگو',
  meta_title: 'پیشگامان گفت‌وگو | فرانت‌چپتر',
  description:
    'فهرست ارائه‌دهندگان جلسات آنلاین فرانت‌چپتر. مرور آرشیو جلسات هر پیشگام گفت‌وگو و لینک لینکدین.',
  canonical: '/speakers/',
  keywords: [
    'پیشگامان گفتگو',
    'سخنرانان فرانت‌چپتر',
    'ارائه‌دهندگان فرانت‌اند',
    'متخصصان وب ایران',
    'فرانت‌چپتر',
  ],
});

const SpeakersIndexPage = () => {
  const speakers = getAllSpeakers();
  const jsonLd = buildSpeakersListJsonLd(speakers);

  return (
    <GSAPWrapper>
      <JsonLd data={jsonLd} />
      <SpeakersList />
    </GSAPWrapper>
  );
};

export default SpeakersIndexPage;
