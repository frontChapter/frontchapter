import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import Members from '@/src/layouts/Members';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'هویجی‌ها',
  meta_title: 'هویجی‌ها | اعضای جامعه فرانت‌چپتر',
  description:
    'فهرست عمومی اعضای جامعه فرانت‌چپتر؛ تخصص، سطح هویج و لینک‌های حرفه‌ای.',
  canonical: '/members/',
});

const MembersPage = () => (
  <GSAPWrapper>
    <main id="main-content">
      <Members />
    </main>
  </GSAPWrapper>
);

export default MembersPage;
