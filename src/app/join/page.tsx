import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import Join from '@/src/layouts/Join';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'هویجی شو!',
  meta_title: 'هویجی شو! | عضویت در جامعه فرانت‌چپتر',
  description:
    'به جامعه فرانت‌چپتر خوش آمدی — ورود با تلگرام، پذیرش میثاق‌نامه و تکمیل پروفایل کوتاه.',
  canonical: '/join/',
});

const JoinPage = () => (
  <GSAPWrapper>
    <main id="main-content">
      <Join />
    </main>
  </GSAPWrapper>
);

export default JoinPage;
