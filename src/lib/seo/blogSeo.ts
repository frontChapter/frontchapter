import config from '@config/config.json';
import type { SinglePageData } from '@lib/contentParser';
import { buildExcerpt } from './excerpt';
import { buildBlogListJsonLd, buildBlogPostJsonLd } from './jsonLd';
import { buildPageMetadata } from './metadata';
import { DEFAULT_DESCRIPTION, SITE_NAME } from './constants';

const { blog_folder } = config.settings as { blog_folder: string };

export const postPath = (slug: string) => `/${blog_folder}/${slug}/`;

export const blogListPath = (page = 1) =>
  page <= 1 ? `/${blog_folder}/` : `/${blog_folder}/page/${page}/`;

export const resolvePostDescription = (post: SinglePageData) => {
  const { frontmatter, content } = post;
  return frontmatter.description || buildExcerpt(content);
};

export const buildPostPageMetadata = (post: SinglePageData) => {
  const { frontmatter, slug } = post;
  const description = resolvePostDescription(post).slice(0, 158);
  const authorName =
    typeof frontmatter.author === 'object' && frontmatter.author?.name
      ? frontmatter.author.name
      : undefined;

  const metaTitle =
    frontmatter.meta_title || `${frontmatter.title} | ${SITE_NAME}`;

  return buildPageMetadata({
    title: frontmatter.title,
    meta_title: metaTitle,
    description,
    image: frontmatter.image,
    canonical: postPath(slug),
    noindex: frontmatter.noindex,
    authors: authorName ? [{ name: authorName }] : undefined,
    type: 'article',
    article: {
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.date,
      authors: authorName ? [authorName] : undefined,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : undefined,
    },
  });
};

export const buildBlogListPageMetadata = (
  title: string,
  page = 1,
  description?: string
) => {
  const pageTitle =
    page > 1
      ? `${title} — صفحه ${page} | ${SITE_NAME}`
      : `${title} | ${SITE_NAME}`;
  const pageDescription =
    description ||
    (page > 1
      ? `${title} — صفحه ${page}؛ آرشیو دورهمی‌ها، جلسات آنلاین و مقالات تخصصی جامعه فرانت‌چپتر.`
      : DEFAULT_DESCRIPTION);

  return buildPageMetadata({
    title: pageTitle,
    meta_title: pageTitle,
    description: pageDescription,
    canonical: blogListPath(page),
  });
};

export const buildPostJsonLd = (post: SinglePageData) => {
  const { frontmatter, slug } = post;
  const authorName =
    typeof frontmatter.author === 'object' && frontmatter.author?.name
      ? frontmatter.author.name
      : 'فرانت‌چپتر';
  const authorAvatar =
    typeof frontmatter.author === 'object' && frontmatter.author?.avatar
      ? frontmatter.author.avatar
      : undefined;

  return buildBlogPostJsonLd({
    title: frontmatter.title,
    description: resolvePostDescription(post),
    slug,
    image: frontmatter.image,
    date: frontmatter.date,
    author: { name: authorName, avatar: authorAvatar },
  });
};

export const buildBlogIndexJsonLd = (title: string, page = 1) =>
  buildBlogListJsonLd({ title, page });
