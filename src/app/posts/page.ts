import BlogPagination, { generateStaticParams } from './page/[slug]/page';
import config from '@config/config.json';
import { getListPage } from '@lib/contentParser';
import { buildBlogListPageMetadata } from '@lib/seo/blogSeo';
import type { Metadata } from 'next';

const { blog_folder } = config.settings;

export async function generateMetadata(): Promise<Metadata> {
  const postIndex = await getListPage(`src/content/${blog_folder}/_index.md`);

  return buildBlogListPageMetadata(postIndex.frontmatter.title || 'بلاگ', 1);
}

export { generateStaticParams };
export default BlogPagination;
