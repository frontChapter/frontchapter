import type { MetadataRoute } from 'next';
import config from '@config/config.json';
import { getSinglePage } from '@lib/contentParser';
import { blogListPath, postPath } from '@lib/seo/blogSeo';
import { SITE_URL } from '@lib/seo/constants';
import { getAllSpeakers, speakerPath } from '@lib/speakers';
import { sortByDate } from '@lib/utils/sortFunctions';

export default function sitemap(): MetadataRoute.Sitemap {
  const { blog_folder, pagination } = config.settings as {
    blog_folder: string;
    pagination: number;
  };

  const posts = sortByDate(getSinglePage(`src/content/${blog_folder}`));
  const totalPages = Math.ceil(posts.length / pagination);
  const regularPages = getSinglePage('src/content');

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}${blogListPath(1)}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  for (let page = 2; page <= totalPages; page++) {
    entries.push({
      url: `${SITE_URL}${blogListPath(page)}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  for (const post of posts) {
    entries.push({
      url: `${SITE_URL}${postPath(post.slug)}`,
      lastModified: post.frontmatter.date
        ? new Date(post.frontmatter.date)
        : undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const page of regularPages) {
    entries.push({
      url: `${SITE_URL}/${page.slug}/`,
      lastModified: page.frontmatter.date
        ? new Date(page.frontmatter.date)
        : undefined,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  entries.push({
    url: `${SITE_URL}/speakers/`,
    changeFrequency: 'monthly',
    priority: 0.6,
  });

  for (const speaker of getAllSpeakers()) {
    entries.push({
      url: `${SITE_URL}${speakerPath(speaker.slug)}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
