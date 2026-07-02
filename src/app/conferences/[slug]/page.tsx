import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import ConferenceSingle from '@/src/layouts/ConferenceSingle';
import JsonLd from '@/src/layouts/partials/JsonLd';
import { getAllConferences, getConferenceBySlug } from '@lib/conferences';
import {
  buildConferenceJsonLd,
  buildConferenceMetadata,
} from '@lib/seo/conferenceSeo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const conference = getConferenceBySlug(params.slug);
  if (!conference) {
    return { title: 'همایش یافت نشد' };
  }
  return buildConferenceMetadata(conference);
}

const ConferencePage = ({ params }: { params: { slug: string } }) => {
  const conference = getConferenceBySlug(params.slug);
  if (!conference) notFound();

  const jsonLd = buildConferenceJsonLd(conference);

  return (
    <GSAPWrapper>
      <JsonLd data={jsonLd} />
      <ConferenceSingle conference={conference} />
    </GSAPWrapper>
  );
};

export function generateStaticParams() {
  return getAllConferences().map((conference) => ({ slug: conference.slug }));
}

export default ConferencePage;
