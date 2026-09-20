import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SITE_URL = 'https://frontchapter.ir';

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderVideoXml(video) {
  if (!video) return '';
  return `
    <video:video>
      <video:thumbnail_loc>${video.thumbnail_loc}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${video.content_loc}</video:content_loc>
      <video:publication_date>${video.publication_date}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>`;
}

function generateSitemap() {
  const entries = [
    {
      loc: `${SITE_URL}/`,
      changefreq: 'weekly',
      priority: '1.0',
      video: {
        thumbnail_loc: `${SITE_URL}/images/banner-app.png`,
        title: 'جامعه‌ی فرانت‌اند فرانت‌چپتر — ویدیوی معرفی',
        description:
          'محلی صمیمی برای گفت‌وگوی تخصصی و اشتراک تجربیات توسعه‌دهندگان وب',
        content_loc: `${SITE_URL}/videos/frontchapter-banner.mp4`,
        publication_date: '2025-02-27T08:00:00+03:30',
      },
    },
    {
      loc: `${SITE_URL}/events/dar-miyan-e-meh/`,
      lastmod: '2026-09-20',
      changefreq: 'daily',
      priority: '0.95',
    },
    {
      loc: `${SITE_URL}/conferences/`,
      changefreq: 'weekly',
      priority: '0.90',
    },
    {
      loc: `${SITE_URL}/events/session-69-ai-and-future/`,
      lastmod: '2026-09-17',
      changefreq: 'monthly',
      priority: '0.85',
    },
    {
      loc: `${SITE_URL}/conferences/1403/`,
      lastmod: '2025-03-07',
      changefreq: 'weekly',
      priority: '0.85',
      video: {
        thumbnail_loc: `${SITE_URL}/images/1403/video_poster.jpg`,
        title: 'تیزر رسمی همایش شیراز ۱۴۰۳ فرانت‌چپتر',
        description:
          'تیزر ویدیویی همایش بزرگ توسعه‌دهندگان فرانت در شیراز با حضور سخنرانان برجسته و کارگاه‌های تخصصی برنامه‌نویسی وب',
        content_loc: `${SITE_URL}/videos/frontchapter-1403.mp4`,
        publication_date: '2025-02-27T08:00:00+03:30',
      },
    },
    {
      loc: `${SITE_URL}/conferences/1402/`,
      lastmod: '2024-03-08',
      changefreq: 'monthly',
      priority: '0.70',
      video: {
        thumbnail_loc: `${SITE_URL}/images/1402/01.webp`,
        title: 'ویدیوی دومین همایش فرانت‌اند ایران در آمل ۱۴۰۲',
        description:
          'مروری بر دومین همایش فرانت‌اند فرانت‌چپتر در آمل، مازندران با حضور برنامه‌نویسان وب',
        content_loc: `${SITE_URL}/videos/frontchapter-banner.mp4`,
        publication_date: '2024-02-28T08:00:00+03:30',
      },
    },
    {
      loc: `${SITE_URL}/conferences/1400/`,
      lastmod: '2022-03-04',
      changefreq: 'monthly',
      priority: '0.70',
      video: {
        thumbnail_loc: `${SITE_URL}/images/1400/video_poster.webp`,
        title: 'ویدیوی اولین همایش فرانت‌اند کشور در بابلسر ۱۴۰۰',
        description:
          'تیزر و لحظات خاطره‌انگیز اولین همایش حضوری فرانت‌چپتر در بابلسر، مازندران',
        content_loc: `${SITE_URL}/videos/FrontChapter1400.mp4`,
        publication_date: '2022-03-01T08:00:00+03:30',
      },
    },
    {
      loc: `${SITE_URL}/speakers/`,
      changefreq: 'weekly',
      priority: '0.80',
    },
  ];

  // Add speakers
  const speakersPath = path.join(ROOT_DIR, 'src/data/speakers.json');
  if (fs.existsSync(speakersPath)) {
    const speakers = JSON.parse(fs.readFileSync(speakersPath, 'utf-8'));
    for (const slug of Object.keys(speakers)) {
      entries.push({
        loc: `${SITE_URL}/speakers/${slug}/`,
        changefreq: 'monthly',
        priority: '0.70',
      });
    }
  }

  // Add blog index
  entries.push({
    loc: `${SITE_URL}/posts/`,
    changefreq: 'weekly',
    priority: '0.80',
  });

  // Add posts
  const postsDir = path.join(ROOT_DIR, 'src/content/posts');
  let postCount = 0;
  if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir).filter(
      (file) => file.endsWith('.md') && !file.startsWith('_')
    );
    postCount = postFiles.length;

    for (const file of postFiles) {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const { data } = matter(content);
      const slug = file.replace('.md', '');
      const lastmod = data.date ? new Date(data.date).toISOString().split('T')[0] : undefined;

      entries.push({
        loc: `${SITE_URL}/posts/${slug}/`,
        ...(lastmod ? { lastmod } : {}),
        changefreq: 'monthly',
        priority: '0.75',
      });
    }
  }

  // Add regular pages (about, contact, terms-policy)
  const contentDir = path.join(ROOT_DIR, 'src/content');
  const regularFiles = ['about.md', 'contact.md', 'terms-policy.md'];
  for (const file of regularFiles) {
    const filePath = path.join(contentDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(content);
      const slug = file.replace('.md', '');
      const lastmod = data.date ? new Date(data.date).toISOString().split('T')[0] : undefined;
      const isAbout = slug === 'about';
      const isContact = slug === 'contact';

      entries.push({
        loc: `${SITE_URL}/${slug}/`,
        ...(lastmod ? { lastmod } : {}),
        changefreq: isAbout ? 'monthly' : 'yearly',
        priority: isAbout ? '0.70' : isContact ? '0.50' : '0.30',
        ...(isAbout
          ? {
              video: {
                thumbnail_loc: `${SITE_URL}/images/1403/video_poster.jpg`,
                title: 'روایت مسیر فرانت‌چپتر — درباره ما',
                description:
                  'داستان شکل‌گیری جامعه‌ی هویجی فرانت‌چپتر و اهداف آن برای توسعه‌دهندگان وب ایران',
                content_loc: `${SITE_URL}/videos/frontchapter-1403.mp4`,
                publication_date: '2025-02-27T08:00:00+03:30',
              },
            }
          : {}),
      });
    }
  }

  // Add pagination pages (12 items per page)
  const pagination = 12;
  const totalPages = Math.ceil(postCount / pagination);
  for (let page = 2; page <= totalPages; page++) {
    entries.push({
      loc: `${SITE_URL}/posts/page/${page}/`,
      changefreq: 'weekly',
      priority: '0.50',
    });
  }

  // Generate XML with Google Video extension
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${renderVideoXml(e.video)}
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const publicSitemapPath = path.join(ROOT_DIR, 'public/sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf-8');
  console.log(`✓ Generated ${entries.length} URLs (including Video sitemap tags) in ${publicSitemapPath}`);
}

generateSitemap();
