import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import MemberSingle, {
  buildMemberMetadata,
} from '@/src/layouts/MemberSingle';
import {
  getMemberActivities,
  getMemberTitles,
  getPublicMemberBySlug,
  listPublicMembers,
  staticParamsFromMembers,
} from '@lib/membership/fetch';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = { slug: string };

export async function generateStaticParams() {
  try {
    const members = await listPublicMembers();
    return staticParamsFromMembers(members);
  } catch {
    // ponytail: empty params if Supabase unreachable at build — directory still client-fetches
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const member = await getPublicMemberBySlug(params.slug);
    if (!member) return { title: 'هویجی یافت نشد' };
    return buildMemberMetadata(member);
  } catch {
    return { title: 'هویجی‌ها' };
  }
}

const MemberPage = async ({ params }: { params: Params }) => {
  const member = await getPublicMemberBySlug(params.slug);
  if (!member) notFound();

  const [activities, titles] = await Promise.all([
    getMemberActivities(member.id),
    getMemberTitles(member.id),
  ]);

  return (
    <GSAPWrapper>
      <main id="main-content">
        <MemberSingle
          member={member}
          activities={activities}
          titles={titles}
        />
      </main>
    </GSAPWrapper>
  );
};

export default MemberPage;
