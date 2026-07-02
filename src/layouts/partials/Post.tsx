import config from '@config/config.json';
import { splitPostTitle } from '@lib/utils/splitPostTitle';
import Link from 'next/link';
import React from 'react';
import FormattedDate from '../components/FormattedDate';
import ImageFallback from '../components/ImageFallback';
import { AuthorNames } from '../components/AuthorLink';
import { getSpeakerSlugByName, speakerPath } from '@lib/speakers';

interface Author {
  name: string;
  avatar: string;
}

interface Frontmatter {
  title: string;
  image?: string;
  author: Author;
  date: string;
}

export interface PostType {
  frontmatter: Frontmatter;
  content: string;
  slug: string;
}

interface PostProps {
  post: PostType;
  compact?: boolean;
}

const Post: React.FC<PostProps> = ({ post, compact = false }) => {
  const { blog_folder } = config.settings as {
    blog_folder: string;
  };
  const href = `/${blog_folder}/${post.slug}`;
  const titleLines = compact
    ? splitPostTitle(post.frontmatter.title, 'compact')
    : null;
  const authorSlug = getSpeakerSlugByName(post.frontmatter.author.name);

  return (
    <article className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface-solid transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
        <Link href={href} className="block">
          {post.frontmatter.image && (
            <div
              className={`relative overflow-hidden bg-theme-light ${compact ? 'aspect-[4/3]' : 'aspect-square'}`}
            >
              <ImageFallback
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                width={compact ? 280 : 400}
                height={compact ? 210 : 400}
                fallback={''}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
          )}

          <div className={compact ? 'p-2.5' : 'p-3.5 sm:p-4'}>
            <h2
              className={`font-semibold leading-snug text-dark transition-colors group-hover:text-primary ${
                compact
                  ? 'text-xs text-balance'
                  : 'line-clamp-2 text-sm sm:text-[0.95rem]'
              }`}
            >
              {titleLines && titleLines.length > 1
                ? titleLines.map((line, index) => (
                    <span
                      key={index}
                      className={index > 0 ? 'mt-0.5 block' : 'block'}
                    >
                      {line}
                    </span>
                  ))
                : post.frontmatter.title}
            </h2>
          </div>
        </Link>

        <div
          className={`flex items-center ${compact ? 'px-2.5 pb-2.5 gap-2' : 'px-3.5 pb-3.5 sm:px-4 sm:pb-4 gap-2.5'}`}
        >
          {authorSlug ? (
            <Link
              href={speakerPath(authorSlug)}
              className="shrink-0 overflow-hidden rounded-full"
              aria-label={`صفحه ${post.frontmatter.author.name}`}
            >
              <ImageFallback
                src={post.frontmatter.author.avatar}
                width={compact ? 22 : 28}
                height={compact ? 22 : 28}
                alt={post.frontmatter.author.name}
                fallback={''}
              />
            </Link>
          ) : (
            <div className="shrink-0 overflow-hidden rounded-full">
              <ImageFallback
                src={post.frontmatter.author.avatar}
                width={compact ? 22 : 28}
                height={compact ? 22 : 28}
                alt={post.frontmatter.author.name}
                fallback={''}
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p
              className={`truncate font-medium text-dark ${compact ? 'text-2xs' : 'text-xs'}`}
            >
              <AuthorNames name={post.frontmatter.author.name} />
            </p>
            <p
              className={`mt-0.5 truncate text-muted ${compact ? 'text-2xs' : 'text-2xs sm:text-xs'}`}
            >
              <FormattedDate date={post.frontmatter.date} />
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;
