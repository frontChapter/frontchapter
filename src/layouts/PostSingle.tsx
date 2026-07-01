import config from '@config/config.json';
import FormattedDate from './components/FormattedDate';
import { markdownify } from '@lib/utils/textConverter';
import Image from 'next/image';
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
  frontmatter: Frontmatter;
  content: string;
  recentPosts: RecentPost[];
}

const PostSingle: React.FC<PostSingleProps> = ({
  frontmatter,
  content,
  recentPosts,
}) => {
  let { title, date, image, author } = frontmatter;
  const { disqus } = config as { disqus: { enable: boolean } };

  return (
    <>
      <section className="section pt-0">
        <div className="container">
          <article>
            <div className="row justify-center">
              <div className="lg:col-8">
                {image && (
                  <Image
                    src={image}
                    height={700}
                    width={1120}
                    alt={title}
                    priority={true}
                    className="fade w-full rounded-lg max-h-[500px] object-cover"
                  />
                )}
              </div>
              <div className="lg:col-8">
                {markdownify({
                  content: title,
                  tag: 'h1',
                  className: 'h2 mt-6',
                })}
                <div className="mt-6 flex items-center">
                  <div className="overflow-hidden rounded-full border-2 border-white shadow-[0_0_0_2px] shadow-primary">
                    <ImageFallback
                      src={author.avatar}
                      width={50}
                      height={50}
                      alt="author"
                      fallback="/images/author/abdullah.jpg"
                    />
                  </div>
                  <div className="ps-5">
                    <p className="font-medium text-dark">{author.name}</p>
                    <p>
                      <FormattedDate date={date} />
                    </p>
                  </div>
                </div>
                <div className="content mb-16 mt-16 text-start">
                  <MDXContent content={content} />
                </div>
              </div>
              {disqus.enable && (
                <div className="fade row justify-center ">
                  <div className="lg:col-8">
                    <DisqussEmbed />
                  </div>
                </div>
              )}
            </div>
          </article>

          <div className="section mt-16">
            <h2 className="section-title text-center">Recent Articles</h2>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.slice(0, 3).map((post, index) => {
                const isPostType =
                  post &&
                  typeof post === 'object' &&
                  'frontmatter' in post &&
                  'content' in post &&
                  'slug' in post;
                if (!isPostType) return null;
                return (
                  <Post key={'post-' + index} post={post as unknown as PostType} />
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
