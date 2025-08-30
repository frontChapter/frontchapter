import fs from 'fs';
import matter from 'gray-matter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import path from 'path';
import parseMDX from './utils/mdxParser';

// get list page data, ex: _index.md
export interface Frontmatter {
  [key: string]: any;
}

export interface PageData {
  frontmatter: Frontmatter;
  content: string;
  mdxContent: MDXRemoteSerializeResult;
}

export const getListPage = async (filePath: string): Promise<PageData> => {
  const pageData = fs.readFileSync(filePath, 'utf-8');
  const pageDataParsed = matter(pageData);
  const notFoundPage = fs.readFileSync('src/content/404.md', 'utf-8');
  const notFoundDataParsed = matter(notFoundPage);
  let frontmatter: Frontmatter, content: string;

  if (pageDataParsed) {
    content = pageDataParsed.content;
    frontmatter = pageDataParsed.data;
  } else {
    content = notFoundDataParsed.content;
    frontmatter = notFoundDataParsed.data;
  }
  const mdxContent = await parseMDX(content);

  return {
    frontmatter,
    content,
    mdxContent,
  };
};

// get all single pages, ex: blog/post.md
export interface SinglePageData {
  frontmatter: Frontmatter;
  slug: string;
  content: string;
}

export const getSinglePage = (folder: string): SinglePageData[] => {
  const filesPath: string[] = fs.readdirSync(folder);
  const sanitizeFiles: string[] = filesPath.filter((file: string) =>
    file.includes('.md')
  );
  const filterSingleFiles: string[] = sanitizeFiles.filter((file: string) =>
    file.match(/^(?!_)/)
  );
  const singlePages = filterSingleFiles.map((filename: string) => {
    const slug: string = filename.replace('.md', '');
    const pageData: string = fs.readFileSync(
      path.join(folder, filename),
      'utf-8'
    );
    const pageDataParsed = matter(pageData);
    const frontmatterString: string = JSON.stringify(pageDataParsed.data);
    const frontmatter: Frontmatter = JSON.parse(frontmatterString);
    const content: string = pageDataParsed.content;
    const url: string = frontmatter.url
      ? frontmatter.url.replace('/', '')
      : slug;
    return { frontmatter: frontmatter, slug: url, content: content };
  });

  const publishedPages: SinglePageData[] = singlePages.filter(
    (page: SinglePageData) =>
      !page.frontmatter.draft && page.frontmatter.layout !== '404' && page
  );
  const filterByDate: SinglePageData[] = publishedPages.filter(
    (page: SinglePageData) => {
      const pageDate = page.frontmatter.date;
      const comparisonDate = pageDate ? new Date(pageDate) : new Date();
      return comparisonDate <= new Date();
    }
  );

  return filterByDate;
};

// get a regular page data from many pages, ex: about.md
export interface RegularPageData {
  frontmatter: Frontmatter;
  content: string;
  mdxContent: MDXRemoteSerializeResult;
}

export const getRegularPage = async (
  slug: string
): Promise<RegularPageData> => {
  const publishedPages: SinglePageData[] = getSinglePage('src/content');
  const pageData: SinglePageData[] = publishedPages.filter(
    (data: SinglePageData) => data.slug === slug
  );
  const notFoundPage: string = fs.readFileSync('src/content/404.md', 'utf-8');
  const notFoundDataParsed = matter(notFoundPage);

  let frontmatter: Frontmatter, content: string;
  if (pageData[0]) {
    content = pageData[0].content;
    frontmatter = pageData[0].frontmatter;
  } else {
    content = notFoundDataParsed.content;
    frontmatter = notFoundDataParsed.data;
  }
  const mdxContent: MDXRemoteSerializeResult = await parseMDX(content);

  return {
    frontmatter,
    content,
    mdxContent,
  };
};
