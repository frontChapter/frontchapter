import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import SpeakerSingle, {
  buildSpeakerMetadata,
} from '@/src/layouts/SpeakerSingle';
import { getAllSpeakers, getSpeakerBySlug } from '@lib/speakers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const speaker = getSpeakerBySlug(params.slug);
  if (!speaker) {
    return { title: 'سخنران یافت نشد' };
  }
  return buildSpeakerMetadata(speaker);
}

const SpeakerPage = async ({ params }: { params: { slug: string } }) => {
  const speaker = getSpeakerBySlug(params.slug);
  if (!speaker) notFound();

  return (
    <GSAPWrapper>
      <SpeakerSingle speaker={speaker} />
    </GSAPWrapper>
  );
};

export async function generateStaticParams() {
  return getAllSpeakers().map((speaker) => ({ slug: speaker.slug }));
}

export default SpeakerPage;
