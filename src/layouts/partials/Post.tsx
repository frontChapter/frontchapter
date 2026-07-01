import config from '@config/config.json';
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
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { blog_folder } = config.settings as {
    blog_folder: string;
  };
  const href = `/${blog_folder}/${post.slug}`;

  return (
    <article className="h-full">
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface-solid transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
      >
        {post.frontmatter.image && (
          <div className="relative aspect-square overflow-hidden bg-theme-light">
            <ImageFallback
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              width={400}
              height={400}
              fallback={''}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="p-3.5 sm:p-4">
          <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-dark transition-colors group-hover:text-primary sm:text-[0.95rem]">
            {post.frontmatter.title}
          </h2>

          <div className="mt-3 flex items-center gap-2.5">
            <div className="shrink-0 overflow-hidden rounded-full">
              <ImageFallback
                src={post.frontmatter.author.avatar}
                width={28}
                height={28}
                alt={post.frontmatter.author.name}
                fallback={''}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-dark">
                {post.frontmatter.author.name}
              </p>
              <p className="mt-0.5 truncate text-2xs text-muted sm:text-xs">
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
