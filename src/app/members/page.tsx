import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import Members from '@/src/layouts/Members';
import { listPublicMembers } from '@lib/membership/fetch';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'هویجی‌ها',
  meta_title: 'هویجی‌ها | اعضای جامعه فرانت‌چپتر',
  description:
    'فهرست عمومی اعضای جامعه فرانت‌چپتر؛ تخصص، سطح هویج و لینک‌های حرفه‌ای.',
  canonical: '/members/',
});

const MembersPage = async () => {
  let members: Awaited<ReturnType<typeof listPublicMembers>> = [];
  try {
    members = await listPublicMembers();
  } catch (e) {
    console.error('[members] listPublicMembers failed:', e);
  }

  return (
    <GSAPWrapper>
      <main id="main-content">
        <Members members={members} />
      </main>
    </GSAPWrapper>
  );
};

export default MembersPage;
