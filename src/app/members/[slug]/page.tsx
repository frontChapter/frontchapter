import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import MemberSingle, { buildMemberMetadata } from '@/src/layouts/MemberSingle';
import {
  getMemberActivities,
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
  } catch (e) {
    console.error(
      '[members/[slug]] generateStaticParams failed — production export will omit profiles:',
      e
    );
    // Production export with [] = no member pages. Dev can still hit dynamic routes.
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

  const activities = await getMemberActivities(member.id);

  return (
    <GSAPWrapper>
      <main id="main-content">
        <MemberSingle member={member} activities={activities} />
      </main>
    </GSAPWrapper>
  );
};

export default MemberPage;
