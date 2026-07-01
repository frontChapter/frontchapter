import config from '@config/config.json';
import { splitPostTitle } from '@lib/utils/splitPostTitle';
import Link from 'next/link';
import React from 'react';
import FormattedDate from '../components/FormattedDate';
import ImageFallback from '../components/ImageFallback';

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

  return (
    <article className="h-full">
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface-solid transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
      >
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

          <div className={`flex items-center ${compact ? 'mt-2 gap-2' : 'mt-3 gap-2.5'}`}>
            <div className="shrink-0 overflow-hidden rounded-full">
              <ImageFallback
                src={post.frontmatter.author.avatar}
                width={compact ? 22 : 28}
                height={compact ? 22 : 28}
                alt={post.frontmatter.author.name}
                fallback={''}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-medium text-dark ${compact ? 'text-2xs' : 'text-xs'}`}
              >
                {post.frontmatter.author.name}
              </p>
              <p
                className={`mt-0.5 truncate text-muted ${compact ? 'text-2xs' : 'text-2xs sm:text-xs'}`}
              >
                <FormattedDate date={post.frontmatter.date} />
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Post;
