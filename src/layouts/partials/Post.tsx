import config from '@config/config.json';
import dateFormat from '@lib/utils/dateFormat';
import readingTime from '@lib/utils/readingTime';
import Link from 'next/link';
import React from 'react';
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
  const { summary_length, blog_folder } = config.settings as {
    summary_length: number | string;
    blog_folder: string;
  };
  return (
    <div className="overflow-hidden rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,.05)]">
      {post.frontmatter.image && (
        <Link href={`/${blog_folder}/${post.slug}`}>
          <ImageFallback
            className="w-full object-cover"
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            width={570}
            height={335}
            fallback={''}
          />
        </Link>
      )}
      <div className="p-8">
        <h2 className="h4">
          <Link
            href={`/${blog_folder}/${post.slug}`}
            className="block hover:text-primary hover:underline"
          >
            {post.frontmatter.title}
          </Link>
        </h2>
        <p className="mt-4">
          {post.content.slice(0, Number(summary_length))}...
        </p>
        <div className="mt-6 flex items-center">
          <div className="overflow-hidden rounded-full border-2 border-white shadow-[0_0_0_2px] shadow-primary">
            <ImageFallback
              src={post.frontmatter.author.avatar}
              width={50}
              height={50}
              alt="author"
              fallback={''}
            />
          </div>
          <div className="ps-5">
            <p className="font-medium text-dark">
              {post.frontmatter.author.name}
            </p>
            <p>
              {dateFormat(post.frontmatter.date)} - {readingTime(post.content)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
