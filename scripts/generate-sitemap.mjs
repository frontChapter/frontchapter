import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SITE_URL = 'https://frontchapter.ir';

function generateSitemap() {
  const entries = [
    {
      loc: `${SITE_URL}/`,
      changefreq: 'weekly',
      priority: '1.0',
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
    },
    {
      loc: `${SITE_URL}/conferences/1402/`,
      lastmod: '2024-03-08',
      changefreq: 'monthly',
      priority: '0.70',
    },
    {
      loc: `${SITE_URL}/conferences/1400/`,
      lastmod: '2022-03-04',
      changefreq: 'monthly',
      priority: '0.70',
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

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const publicSitemapPath = path.join(ROOT_DIR, 'public/sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf-8');
  console.log(`✓ Generated ${entries.length} URLs in ${publicSitemapPath}`);
}

generateSitemap();
