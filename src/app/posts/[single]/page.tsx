import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import JsonLd from '@/src/layouts/partials/JsonLd';
import PostSingle from '@/src/layouts/PostSingle';
import config from '@config/config.json';
import { getSinglePage } from '@lib/contentParser';
import { buildPostJsonLd, buildPostPageMetadata } from '@lib/seo/blogSeo';
import { buildPageMetadata } from '@lib/seo/metadata';
import { sortByDate } from '@lib/utils/sortFunctions';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const { blog_folder } = config.settings;

export async function generateMetadata({
  params,
}: {
  params: { single: string };
}): Promise<Metadata> {
  const posts = await getSinglePage(`src/content/${blog_folder}`);
  const post = posts.find((p) => p.slug === params.single);

  if (!post) {
    return buildPageMetadata({ title: 'مقاله یافت نشد', noindex: true });
  }

  return buildPostPageMetadata(post);
}

const Article = async ({ params }: { params: { single: string } }) => {
  const { single } = params;
  const posts = await getSinglePage(`src/content/${blog_folder}`);
  const post = posts.find((p) => p.slug === single);
  if (!post) {
    notFound();
  }
  const recentPosts = sortByDate(posts).filter((post) => post.slug !== single);
  const { frontmatter, content } = post;
  const jsonLd = buildPostJsonLd(post);

  return (
    <>
      <JsonLd data={jsonLd} />
      <GSAPWrapper>
        <PostSingle
          slug={single}
          frontmatter={{
            title: frontmatter.title,
            date: frontmatter.date,
            author: frontmatter.author,
            description: frontmatter.description,
            image: frontmatter.image,
            image_alt: frontmatter.image_alt,
            session_datetime: frontmatter.session_datetime,
            registration_deadline: frontmatter.registration_deadline,
            meet_link: frontmatter.meet_link,
            social: frontmatter.social,
            speaker: frontmatter.speaker,
          }}
          content={content}
          recentPosts={recentPosts}
        />
      </GSAPWrapper>
    </>
  );
};

export async function generateStaticParams() {
  const allSlug = await getSinglePage(`src/content/${blog_folder}`);
  return allSlug.map((item) => ({
    single: item.slug,
  }));
}

export default Article;
