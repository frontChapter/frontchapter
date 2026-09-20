import config from '@config/config.json';
import {
  getPostsForSpeaker,
  speakerPath,
  type SpeakerProfile,
} from '@lib/speakers';
import { buildPageMetadata } from '@lib/seo/metadata';
import { getSinglePage } from '@lib/contentParser';
import { sortByDate } from '@lib/utils/sortFunctions';
import { IoLogoLinkedin, IoLinkOutline } from 'react-icons/io5';
import Link from 'next/link';
import React from 'react';
import Banner from './components/Banner';
import Cta from './components/Cta';
import ImageFallback from './components/ImageFallback';
import Post, { type PostType } from './partials/Post';
import { plainifySync } from '@lib/seo/plainify';

interface SpeakerSingleProps {
  speaker: SpeakerProfile;
}

const SpeakerSingle = async ({ speaker }: SpeakerSingleProps) => {
  const { blog_folder } = config.settings as { blog_folder: string };
  const allPosts = getSinglePage(`src/content/${blog_folder}`);
  const speakerPosts = sortByDate(
    getPostsForSpeaker(speaker, allPosts)
  ) as PostType[];

  const hasExtraLinks = speaker.links && speaker.links.length > 0;

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

                {(speaker.linkedin || hasExtraLinks) && (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                    {speaker.linkedin && (
                      <Link
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary"
                      >
                        <IoLogoLinkedin
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        پروفایل لینکدین
                      </Link>
                    )}
                    {speaker.links?.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary"
                      >
                        <IoLinkOutline className="h-4 w-4" aria-hidden="true" />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {speaker.quote && (
              <blockquote className="mt-6 rounded-2xl border-r-4 border-primary bg-primary/5 p-5 text-dark">
                <p className="font-medium italic leading-relaxed">
                  «{speaker.quote}»
                </p>
              </blockquote>
            )}

            {speaker.bio && (
              <section className="mt-8 rounded-2xl border border-border bg-surface-solid p-6">
                <h2 className="mb-4 text-h6 font-bold text-dark">
                  درباره {speaker.name}
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-text">
                  {Array.isArray(speaker.bio) ? (
                    speaker.bio.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{speaker.bio}</p>
                  )}
                </div>
              </section>
            )}

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
  const bioText = Array.isArray(speaker.bio)
    ? speaker.bio.join(' ')
    : speaker.bio;
  const metaDescription = bioText
    ? plainifySync(bioText).slice(0, 160)
    : `آرشیو جلسات آنلاین فرانت‌چپتر با حضور ${speaker.name}. مرور ارائه‌ها، موضوعات تخصصی و شبکه‌های اجتماعی.`;

  return buildPageMetadata({
    title: `${speaker.name} | پیشگامان گفت‌وگو`,
    description: metaDescription,
    image: speaker.avatar,
    canonical: speakerPath(speaker.slug),
    keywords: [
      speaker.name,
      'پیشگامان گفتگو',
      'سخنران فرانت‌چپتر',
      'ارائه آنلاین فرانت‌اند',
      'فرانت‌چپتر',
    ],
  });
}

export default SpeakerSingle;
