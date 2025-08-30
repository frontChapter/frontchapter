import Banner from '@/src/layouts/components/Banner';
import Cta from '@/src/layouts/components/Cta';
import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import Pagination from '@/src/layouts/components/Pagination';
import Post from '@/src/layouts/partials/Post';
import SeoMeta from '@/src/layouts/partials/SeoMeta';
import config from '@config/config.json';
import { getListPage, getSinglePage } from '@lib/contentParser';
import { JSX } from 'react';

const { blog_folder } = config.settings as {
  blog_folder: string;
  pagination: number;
};

// Types for params and posts
interface BlogPaginationParams {
  params: {
    slug?: string;
  };
}

interface PostType {
  slug: string;
  frontmatter: {
    title: string;
    image?: string;
    author: {
      name: string;
      avatar: string;
    };
    date: string;
    [key: string]: unknown;
  };
  content: string;
  [key: string]: any;
}

interface ListPageType {
  frontmatter: {
    title?: string;
    [key: string]: unknown;
  };
}

const BlogPagination = async ({
  params,
}: BlogPaginationParams): Promise<JSX.Element> => {
  const currentPage = parseInt(params?.slug ?? '1', 10);
  const { pagination } = config.settings as { pagination: number };
  // getSinglePage returns SinglePageData[], need to map to PostType
  const rawPosts = await getSinglePage(`src/content/${blog_folder}`);
  const posts: PostType[] = rawPosts
    .map((post): PostType | null => {
      // Type guard: ensure required fields exist
      if (
        typeof post.frontmatter.title === 'string' &&
        typeof post.frontmatter.author === 'object' &&
        typeof post.frontmatter.author.name === 'string' &&
        typeof post.frontmatter.author.avatar === 'string' &&
        typeof post.frontmatter.date === 'string'
      ) {
        return {
          frontmatter: {
            title: post.frontmatter.title,
            image: post.frontmatter.image,
            author: {
              name: post.frontmatter.author.name,
              avatar: post.frontmatter.author.avatar,
            },
            date: post.frontmatter.date,
            ...post.frontmatter,
          },
          content: post.content,
          slug: post.slug,
        };
      }
      return null;
    })
    .filter((p): p is PostType => p !== null);
  const postIndex: ListPageType = await getListPage(
    `src/content/${blog_folder}/_index.md`
  );
  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const totalPages = Math.ceil(posts.length / pagination);
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const { frontmatter } = postIndex;
  const { title } = frontmatter;

  return (
    <GSAPWrapper>
      <SeoMeta title={title} />
      <section className="section pt-0">
        <Banner title={title || 'Blog'} />
        <div className="container">
          <div className="row justify-center pb-16 pt-20 ">
            {currentPosts.map((post, i) => (
              <div key={`key-${i}`} className="mb-8 lg:col-5">
                <Post post={post} />
              </div>
            ))}
          </div>
          <Pagination
            section={blog_folder}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
      {/* CTA */}
      <Cta />
    </GSAPWrapper>
  );
};

export default BlogPagination;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const rawPosts = await getSinglePage(`src/content/${blog_folder}`);
  const posts: PostType[] = rawPosts
    .map((post): PostType | null => {
      if (
        typeof post.frontmatter.title === 'string' &&
        typeof post.frontmatter.author === 'object' &&
        typeof post.frontmatter.author.name === 'string' &&
        typeof post.frontmatter.author.avatar === 'string' &&
        typeof post.frontmatter.date === 'string'
      ) {
        return {
          frontmatter: {
            title: post.frontmatter.title,
            image: post.frontmatter.image,
            author: {
              name: post.frontmatter.author.name,
              avatar: post.frontmatter.author.avatar,
            },
            date: post.frontmatter.date,
            ...post.frontmatter,
          },
          content: post.content,
          slug: post.slug,
        };
      }
      return null;
    })
    .filter((p): p is PostType => p !== null);
  const allSlug = posts.map((item) => item.slug);
  const { pagination } = config.settings as { pagination: number };
  const totalPages = Math.ceil(allSlug.length / pagination);
  const paths: { slug: string }[] = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      slug: (i + 1).toString(),
    });
  }

  return paths;
}
