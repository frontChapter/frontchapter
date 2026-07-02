import config from '@config/config.json';
import { splitPostTitle } from '@lib/utils/splitPostTitle';
import {
  getSpeakerBySlug,
  getSpeakerSlugByName,
  parseAuthorNames,
  speakerPath,
} from '@lib/speakers';
import FormattedDate from './components/FormattedDate';
import { AuthorNames } from './components/AuthorLink';
import { markdownify } from '@lib/utils/textConverter';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MDXContent from '../app/helper/MDXContent';
import Cta from './components/Cta';
import ImageFallback from './components/ImageFallback';
import DisqussEmbed from './partials/DisqussEmbed';
import type { PostType } from './partials/Post';
import Post from './partials/Post';

interface Author {
  name: string;
  avatar: string;
}

interface Frontmatter {
  description?: string;
  title: string;
  date: string;
  image?: string;
  author: Author;
}

interface RecentPost {
  // Adjust fields as needed based on Post component props
  [key: string]: unknown;
}

interface PostSingleProps {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  recentPosts: RecentPost[];
}

const PostSingle: React.FC<PostSingleProps> = ({
  slug,
  frontmatter,
  content,
  recentPosts,
}) => {
  let { title, date, image, author } = frontmatter;
  const { disqus } = config as { disqus: { enable: boolean } };
  const titleLines = splitPostTitle(title, 'full');
  const authorParts = parseAuthorNames(author.name);
  const primarySpeakerSlug =
    authorParts.length === 1 ? getSpeakerSlugByName(authorParts[0]) : null;
  const primarySpeaker = primarySpeakerSlug
    ? getSpeakerBySlug(primarySpeakerSlug)
    : undefined;

  const avatar = primarySpeakerSlug ? (
    <Link
      href={speakerPath(primarySpeakerSlug)}
      className="overflow-hidden rounded-full border-2 border-border shadow-[0_0_0_2px] shadow-primary"
      aria-label={`صفحه ${author.name}`}
    >
      <ImageFallback
        src={author.avatar}
        width={44}
        height={44}
        alt={author.name}
        fallback="/images/author/abdullah.jpg"
      />
    </Link>
  ) : (
    <div className="overflow-hidden rounded-full border-2 border-border shadow-[0_0_0_2px] shadow-primary">
      <ImageFallback
        src={author.avatar}
        width={44}
        height={44}
        alt={author.name}
        fallback="/images/author/abdullah.jpg"
      />
    </div>
  );

  return (
    <>
      <section className="section pt-0">
        <div className="container">
          <article>
            <div className="row justify-center">
              <div className="lg:col-10">
                <header className="fade flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
                  {image && (
                    <div className="mx-auto shrink-0 sm:mx-0">
                      <div className="relative h-64 w-64 overflow-hidden rounded-xl border border-border bg-theme-light sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                        <Image
                          src={image}
                          height={600}
                          width={600}
                          alt={title}
                          priority={true}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-center sm:text-start">
                    {titleLines.length > 1 ? (
                      <h1 className="h2 text-balance leading-snug">
                        {titleLines.map((line, index) => (
                          <span
                            key={index}
                            className={index > 0 ? 'mt-1 block' : 'block'}
                          >
                            {line}
                          </span>
                        ))}
                      </h1>
                    ) : (
                      markdownify({
                        content: title,
                        tag: 'h1',
                        className: 'h2 text-balance leading-snug',
                      })
                    )}
                    <div className="mt-5 flex items-center justify-center sm:justify-start">
                      {avatar}
                      <div className="ps-4">
                        <p className="font-medium text-dark">
                          <AuthorNames name={author.name} />
                        </p>
                        <p className="text-sm text-muted">
                          <FormattedDate date={date} />
                        </p>
                        {primarySpeaker?.linkedin && (
                          <a
                            href={primarySpeaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="mt-1 inline-block text-sm text-primary hover:underline"
                          >
                            لینکدین
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </header>
                <div className="content mb-16 mt-10 text-start">
                  <MDXContent content={content} />
                </div>
              </div>
              {disqus.enable && (
                <div className="fade row justify-center ">
                  <div className="lg:col-8">
                    <DisqussEmbed slug={slug} title={title} />
                  </div>
                </div>
              )}
            </div>
          </article>

          <div className="mt-12 py-8">
            <h2 className="section-title text-center text-h4">مطالب مرتبط</h2>
            <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3.5 xs:grid-cols-2 sm:grid-cols-3">
              {recentPosts.slice(0, 3).map((post, index) => {
                const isPostType =
                  post &&
                  typeof post === 'object' &&
                  'frontmatter' in post &&
                  'content' in post &&
                  'slug' in post;
                if (!isPostType) return null;
                return (
                  <Post
                    key={'post-' + index}
                    post={post as unknown as PostType}
                    compact
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
};

export default PostSingle;
