import config from '@config/config.json';
import { getPostsForSpeaker, type SpeakerProfile } from '@lib/speakers';
import { buildPageMetadata } from '@lib/seo/metadata';
import { getSinglePage } from '@lib/contentParser';
import { sortByDate } from '@lib/utils/sortFunctions';
import { IoLogoLinkedin } from 'react-icons/io5';
import Link from 'next/link';
import React from 'react';
import Banner from './components/Banner';
import Cta from './components/Cta';
import ImageFallback from './components/ImageFallback';
import Post, { type PostType } from './partials/Post';

interface SpeakerSingleProps {
  speaker: SpeakerProfile;
}

const SpeakerSingle = async ({ speaker }: SpeakerSingleProps) => {
  const { blog_folder } = config.settings as { blog_folder: string };
  const allPosts = getSinglePage(`src/content/${blog_folder}`);
  const speakerPosts = sortByDate(
    getPostsForSpeaker(speaker, allPosts)
  ) as PostType[];

  return (
    <>
      <section className="section pt-0">
        <Banner title={speaker.name} />
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="fade flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface-solid p-6 text-center sm:flex-row sm:text-start">
              <div className="shrink-0 overflow-hidden rounded-full border-2 border-border shadow-[0_0_0_2px] shadow-primary">
                <ImageFallback
                  src={speaker.avatar}
                  width={96}
                  height={96}
                  alt={speaker.name}
                  fallback="/images/author/saleh.jpg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted">
                  پیشگام گفت‌وگو در فرانت‌چپتر
                </p>
                <h1 className="mt-1 text-h4 text-dark">{speaker.name}</h1>
                <p className="mt-2 text-sm text-muted">
                  {speakerPosts.length} جلسه آنلاین در آرشیو فرانت‌چپتر
                </p>
                {speaker.linkedin && (
                  <Link
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary"
                  >
                    <IoLogoLinkedin className="h-4 w-4" aria-hidden="true" />
                    پروفایل لینکدین
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="section-title text-h5">جلسات آنلاین</h2>
              {speakerPosts.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {speakerPosts.map((post) => (
                    <Post key={post.slug} post={post} compact />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-muted">
                  هنوز جلسه‌ای برای این سخنران ثبت نشده است.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
};

export async function buildSpeakerMetadata(speaker: SpeakerProfile) {
  return buildPageMetadata({
    title: `${speaker.name} | پیشگامان گفت‌وگو`,
    meta_title: `${speaker.name} | پیشگامان گفت‌وگو | فرانت‌چپتر`,
    description: `آرشیو جلسات آنلاین فرانت‌چپتر با ${speaker.name} به عنوان پیشگام گفت‌وگو. مرور موضوعات، ضبط‌ها و لینک لینکدین.`,
    image: speaker.avatar,
  });
}

export default SpeakerSingle;
