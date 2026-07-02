import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = 'src/content/posts';
const SESSIONS_FILE = 'src/data/sessions_list.md';
const OUTPUT = 'src/data/speakers.json';

const NAME_ALIASES = {
  'سید صالح شجاعی': 'صالح شجاعی',
  امید: 'امید حکایتی',
};

const LINKEDIN_OVERRIDES = {
  'صالح شجاعی': 'https://www.linkedin.com/in/salehshojaei/',
  'امیرحسین کریمی': 'https://www.linkedin.com/in/amirhosseinkarimi/',
  'علی گلکار': 'https://www.linkedin.com/in/aligolkarali/',
  'مجتبی افراز': 'https://www.linkedin.com/in/mojtaba-afraz/',
  'سبحان امین‌نژاد': 'https://www.linkedin.com/in/sobhan-aminnejad/',
  'آرمان علی‌قنبری': 'https://www.linkedin.com/in/arman-alighanbari-5b5090150/',
  'امیرعلی قلی': 'https://www.linkedin.com/in/gholi-dev/',
  'بهنیا آزاد': 'https://www.linkedin.com/in/behniya-azad/',
  'پوریا باباعلی': 'https://www.linkedin.com/in/pouriya-babaali/',
  'صدف امینی‌نیا': 'https://www.linkedin.com/in/sadafamininia/',
  'حسین موسوی': 'https://www.linkedin.com/in/hossein13mousavi/',
  'سجاد منشی': 'https://www.linkedin.com/in/sajjad-maneshi-0406b9187/',
  'حسام موسوی': 'https://www.linkedin.com/in/hesam-mousavi-305454ab/',
  'محمدرضا ایرانمنش': 'https://www.linkedin.com/in/mohammadrezairanmanesh/',
};

function canonicalName(name) {
  return NAME_ALIASES[name] || name;
}

function normalizeLinkedin(url) {
  if (!url) return undefined;
  let u = url.split('?')[0];
  if (!u.endsWith('/')) u += '/';
  return u;
}

function slugify(name) {
  const map = {
    'صالح شجاعی': 'saleh-shojaei',
    'فاطمه خسروی': 'fatemeh-khosravi',
    'امید حکایتی': 'omid-hekayati',
    'علی نوروزی': 'ali-norouzi',
    'سینا کریمی': 'sina-karimi',
    'علی گلکار': 'ali-golkar',
    'محمد صالح فدائی': 'mohammad-saleh-fadaei',
    'عبدالله کشتکار': 'abdullah-kashtkar',
    'پوریا باباعلی': 'pouria-babaali',
    'امیرحسین کریمی': 'amirhossein-karimi',
    'مجتبی افراز': 'mojtaba-afraz',
    'عرفان صفری': 'erfan-safari',
    'ارفع مددی': 'arfa-maddi',
    'کامران داور': 'kamran-davar',
    'عرفان یوسفی': 'erfan-yousefi',
    'حسام موسوی': 'hesam-mousavi',
    'علیرضا صفایی‌راد': 'alireza-safaei-rad',
    'سبحان امین‌نژاد': 'sobhan-aminnejad',
    'آرمان علی‌قنبری': 'arman-alighanbari',
    'امیرعلی قلی': 'amirali-gholi',
    'علیرضا صادقی': 'alireza-sadeghi',
    'سجاد منشی': 'sajjad-monshi',
    'بهنیا آزاد': 'behnia-azad',
    'محمدحسن ستاریان': 'mohammadhassan-sataryan',
    'صدف امینی‌نیا': 'sadaf-amininia',
    'آرمین شیخی': 'armin-sheikhi',
    'نیما رحمتی': 'nima-rahmati',
    'مسعود بیگی': 'masoud-beigi',
    'حسین موسوی': 'hossein-mousavi',
    'محمد شیرعلی‌زاده': 'mohammad-shirali-zadeh',
    'وحید محمدی': 'vahid-mohammadi',
    'طاهره فتوحی‌زاده': 'tahereh-fotouhizadeh',
    'شبنم محبوبی': 'shabnam-mahboobi',
    'رامین رضایی': 'ramin-rezaei',
  };
  return map[name] || name.toLowerCase().replace(/\s+/g, '-');
}

function parseSessionsList() {
  const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
  const sessions = {};
  let current = null;
  for (const line of raw.split('\n')) {
    const sessionMatch = line.match(/^(\d+):$/);
    if (sessionMatch) {
      current = Number(sessionMatch[1]);
      sessions[current] = [];
      continue;
    }
    const linkMatch = line.match(/https:\/\/t\.me\/FrontChapter\/(\d+)/);
    if (current && linkMatch) {
      sessions[current].push(Number(linkMatch[1]));
    }
  }
  return sessions;
}

async function scrapeLinkedinBySession(sessions) {
  const linkedinBySession = {};
  for (let s = 1; s <= 68; s++) {
    const ids = sessions[s] || [];
    for (const id of ids) {
      try {
        const res = await fetch(`https://t.me/FrontChapter/${id}?embed=1`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const html = await res.text();
        const matches = [
          ...html.matchAll(
            /href="(https:\/\/www\.linkedin\.com\/in\/[^"?]+)/gi
          ),
        ].map((m) => normalizeLinkedin(m[1]));
        const unique = [...new Set(matches)];
        if (unique.length) {
          linkedinBySession[s] = unique;
          break;
        }
      } catch {
        // skip failed fetch
      }
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  return linkedinBySession;
}

function collectAuthorsFromPosts() {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.startsWith('session-') && f.endsWith('.md'));
  const sessionAuthors = {};

  for (const file of files) {
    const session = Number(file.match(/session-(\d+)/)[1]);
    const data = matter(
      fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
    ).data;
    sessionAuthors[session] = {
      name: data.author?.name,
      avatar: data.author?.avatar,
      postSlug: data.url || file.replace('.md', ''),
    };
  }
  return sessionAuthors;
}

function splitAuthorNames(name) {
  if (!name || name === 'فرانت چپتر') return [];
  if (name.includes(' و ')) {
    return name.split(' و ').map((n) => canonicalName(n.trim()));
  }
  return [canonicalName(name)];
}

async function main() {
  const sessions = parseSessionsList();
  const sessionAuthors = collectAuthorsFromPosts();
  const linkedinBySession = await scrapeLinkedinBySession(sessions);

  const speakers = {};

  for (let session = 1; session <= 68; session++) {
    const author = sessionAuthors[session];
    if (!author?.name || author.name === 'فرانت چپتر') continue;

    const names = splitAuthorNames(author.name);
    const sessionLinkedins = linkedinBySession[session] || [];

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const slug = slugify(name);
      const linkedin =
        sessionLinkedins[i] ||
        (names.length === 1 ? sessionLinkedins[0] : undefined) ||
        LINKEDIN_OVERRIDES[name];

      if (!speakers[slug]) {
        speakers[slug] = {
          slug,
          name,
          avatar: author.avatar,
          linkedin: linkedin ? normalizeLinkedin(linkedin) : undefined,
          aliases: [],
          sessions: [],
        };
      }
      if (!speakers[slug].sessions.includes(session)) {
        speakers[slug].sessions.push(session);
      }
      if (linkedin && !speakers[slug].linkedin) {
        speakers[slug].linkedin = normalizeLinkedin(linkedin);
      }
    }
  }

  for (const [alias, canonical] of Object.entries(NAME_ALIASES)) {
    const canonicalSlug = slugify(canonical);
    if (
      speakers[canonicalSlug] &&
      !speakers[canonicalSlug].aliases.includes(alias)
    ) {
      speakers[canonicalSlug].aliases.push(alias);
    }
  }

  for (const speaker of Object.values(speakers)) {
    speaker.sessions.sort((a, b) => a - b);
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(speakers, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${Object.keys(speakers).length} speakers to ${OUTPUT}`);
}

main();
