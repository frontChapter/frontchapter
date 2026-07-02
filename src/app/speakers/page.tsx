import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import SpeakersList from '@/src/layouts/SpeakersList';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'پیشگامان گفت‌وگو',
  meta_title: 'پیشگامان گفت‌وگو | فرانت‌چپتر',
  description:
    'فهرست ارائه‌دهندگان جلسات آنلاین فرانت‌چپتر. مرور آرشیو جلسات هر پیشگام گفت‌وگو و لینک لینکدین.',
});

const SpeakersIndexPage = () => (
  <GSAPWrapper>
    <SpeakersList />
  </GSAPWrapper>
);

export default SpeakersIndexPage;
