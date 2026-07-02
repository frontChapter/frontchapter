import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = 'src/content/posts';
const SESSIONS_FILE = 'src/data/sessions_list.md';

const SLUGS = {
  1: 'session-01-javascript-how-it-works',
  2: 'session-02-semantic-html',
  3: 'session-03-webpack-for-everyone',
  4: 'session-04-resume-and-job-hunting',
  5: 'session-05-frontend-testing',
  6: 'session-06-web-components',
  7: 'session-07-project-development-methods',
  8: 'session-08-embrace-fullstack-livewire',
  9: 'session-09-web-news-software-freedom-day',
  10: 'session-10-nuxt-vue-framework',
  11: 'session-11-microfrontend',
  12: 'session-12-nextjs-intro',
  13: 'session-13-react-18',
  14: 'session-14-future-of-software-production-part-1',
  15: 'session-15-web-performance-part-1',
  16: 'session-16-end-of-year-gathering',
  17: 'session-17-webgl-3d-on-web',
  18: 'session-18-svelte-intro',
  19: 'session-19-deno-fresh',
  20: 'session-20-frontend-security',
  21: 'session-21-programmers-day-gathering',
  22: 'session-22-free-gathering',
  23: 'session-23-algorithms-data-structures-interview',
  24: 'session-24-google-io-2023',
  25: 'session-25-nextjs-13',
  26: 'session-26-our-dynamic-community',
  27: 'session-27-server-components',
  28: 'session-28-optimal-software-development-patterns',
  29: 'session-29-frontend-backend-collaboration',
  30: 'session-30-programming-career-path',
  31: 'session-31-ai-programmer-future',
  32: 'session-32-work-culture',
  33: 'session-33-leading-large-frontend-teams',
  34: 'session-34-webassembly-intro',
  35: 'session-35-atomic-design',
  36: 'session-36-domain-driven-design-part-1',
  37: 'session-37-functional-programming-ui',
  38: 'session-38-chrome-extensions',
  39: 'session-39-soft-skills-teamwork',
  40: 'session-40-women-in-engineering',
  41: 'session-41-networking-practical-tips',
  42: 'session-42-domain-driven-design-part-2',
  43: 'session-43-soft-skills-pyramid',
  44: 'session-44-being-a-good-colleague',
  45: 'session-45-successful-landing-in-new-organization',
  46: 'session-46-programming-is-not-just-coding',
  47: 'session-47-career-growth-plan',
  48: 'session-48-software-company-anatomy-part-1',
  49: 'session-49-software-company-anatomy-part-2',
  50: 'session-50-software-company-anatomy-part-3',
  51: 'session-51-answering-common-questions',
  52: 'session-52-reducing-team-costs',
  53: 'session-53-resume-writing-for-programmers',
  54: 'session-54-art-of-resume-writing',
  55: 'session-55-localization-beyond-translation',
  56: 'session-56-twelve-factor-heroku',
  57: 'session-57-javascript-event-loop-coffee',
  58: 'session-58-first-hiring-experience',
  59: 'session-59-first-hiring-experience-part-2',
  60: 'session-60-programmers-day-in-person',
  61: 'session-61-ten-years-of-software-freedom',
  62: 'session-62-hiring-skills',
  63: 'session-63-openapi',
  64: 'session-64-technical-english-for-meetings',
  65: 'session-65-chrome-ai-transformation',
  66: 'session-66-ai-workshop-idea-to-product',
  67: 'session-67-protecting-cookies-from-hackers',
  68: 'session-68-prompt-to-production',
};

const SLUG_TO_SESSION = Object.fromEntries(
  Object.entries(SLUGS).map(([session, slug]) => [slug, Number(session)])
);

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
      sessions[current].push(`https://t.me/FrontChapter/${linkMatch[1]}`);
    }
  }

  return sessions;
}

// Poster filename per session (from نشست number on each blog image)
const SESSION_COVER_FILES = {
  1: '08',
  2: '09',
  3: '10',
  4: '11',
  5: '12',
  6: '13',
  7: '14',
  8: '15',
  9: '16',
  10: '17',
  11: '18',
  12: '19',
  13: '20',
  14: '21',
  15: '22',
  16: '23',
  17: '24',
  18: '25',
  19: '26',
  20: '27',
  21: '28',
  22: '02', // developers meetup banner from telegram
  23: '29',
  24: '30',
  25: '31',
  26: '32',
  27: '33',
  28: '34',
  29: '35',
  30: '36',
  31: '37',
  32: '38',
  33: '39',
  34: '40',
  35: '41',
  36: '42', // restored from telegram post 246
  37: '43',
  38: '44',
  39: '45',
  40: '46',
  41: '47',
  42: '48',
  43: '03', // event photo from telegram post 284
  44: '50',
  45: '51',
  46: '52',
  47: '53',
  48: '54',
  49: '55',
  50: '56',
  51: '57',
  52: '49', // restored from telegram post 308
  53: '58',
  54: '59',
  55: '60',
  56: '61',
  57: '62',
  58: '63',
  59: '01', // restored from telegram post 327
  60: '68',
  61: '65',
  62: '66',
  63: '67',
  64: '69',
  65: '70',
  66: '71',
  67: '72',
  68: '73',
};

function coverImage(session) {
  const file = SESSION_COVER_FILES[session];
  if (!file) {
    throw new Error(`Missing cover image mapping for session ${session}`);
  }
  return `/images/blog/${file}.jpg`;
}

function topicFromTitle(title) {
  const parts = title.split(':');
  return parts.length > 1 ? parts.slice(1).join(':').trim() : title.trim();
}

function sessionLabel(title) {
  const parts = title.split(':');
  return parts[0]?.trim() || title;
}

function buildDescription(title, authorName) {
  const topic = topicFromTitle(title);
  const label = sessionLabel(title);
  const speaker =
    authorName === 'فرانت چپتر' ? 'اعضای جامعه فرانت‌چپتر' : authorName;
  return `${label} فرانت‌چپتر با ${speaker} درباره «${topic}» برگزار شد. مرور کامل موضوعات، نکات کلیدی و لینک ضبط صوتی یا ویدیوی جلسه آنلاین.`;
}

function buildTags(title, authorName) {
  const topic = topicFromTitle(title);
  const tags = ['جلسات آنلاین', 'فرانت‌چپتر', topic];
  if (authorName && authorName !== 'فرانت چپتر') {
    tags.push(authorName);
  }
  return tags;
}

function extractYoutubeLinks(content) {
  const links = [];
  const regex =
    /href="(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^"]+)"/g;
  let match;
  while ((match = regex.exec(content))) {
    if (!links.includes(match[1])) links.push(match[1]);
  }
  return links;
}

function stripAllMediaSections(content) {
  let result = content;

  result = result.replace(
    /<div dir="rtl">\s*\n\s*(?:ویدیوی|فایل صوتی|ضبط)[\s\S]*?<\/div>\s*/g,
    ''
  );

  result = result.replace(
    /\n?\s*(?:ویدیوی|فایل صوتی|ضبط)[^\n]*\n<a href="[^"]+"[^>]*>[^<]*<\/a>\s*/g,
    '\n'
  );

  result = result.replace(/\n<\/div>\s*(?=<\/div>|\n*$)/g, '\n');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trimEnd();
}

function fixContentTypos(content) {
  return content
    .replace(/语义/g, 'معنایی')
    .replace(/HTML语义/g, 'HTML معنایی')
    .replace(/غیر语义/g, 'غیرمعنایی')
    .replace(/نسخه语义/g, 'نسخه معنایی')
    .replace(/تگ‌هایمعنایی/g, 'تگ‌های معنایی')
    .replace(/HTMLمعنایی/g, 'HTML معنایی')
    .replace(/نسخهمعنایی/g, 'نسخه معنایی')
    .replace(/تفاوت‌هایزمان اجرا/g, 'تفاوت‌های زمان اجرا')
    .replace(/运行时/g, 'زمان اجرا')
    .replace(/مثلExecution/g, 'مثل Execution')
    .replace(/  +/g, ' ');
}

function buildMediaSection(session, title, telegramLinks, youtubeLinks) {
  const lines = [];
  const label = sessionLabel(title);

  if (youtubeLinks.length > 0) {
    lines.push(
      'ویدیوی این جلسه را می‌توانید از طریق لینک‌های زیر مشاهده کنید:'
    );
    youtubeLinks.forEach((url, index) => {
      const suffix = youtubeLinks.length > 1 ? ` (بخش ${index + 1})` : '';
      lines.push(
        `<a href="${url}" target="_blank" rel="noopener">🎥 ویدیوی ${label}${suffix} - فرانت‌چپتر</a>`
      );
    });
  }

  if (telegramLinks.length === 1) {
    lines.push(
      'فایل صوتی ضبط‌شده این جلسه را می‌توانید از طریق لینک زیر گوش دهید:'
    );
    lines.push(
      `<a href="${telegramLinks[0]}" target="_blank" rel="noopener">🎧 ضبط صوتی ${label} - فرانت‌چپتر</a>`
    );
  } else if (telegramLinks.length > 1) {
    lines.push('ضبط صوتی این جلسه در چند بخش در دسترس است:');
    telegramLinks.forEach((url, index) => {
      lines.push(
        `<a href="${url}" target="_blank" rel="noopener">🎧 بخش ${index + 1} - ${label}</a>`
      );
    });
  }

  if (lines.length === 0) return '';

  return `\n\n<div dir="rtl">\n\n${lines.join('\n')}\n\n</div>\n`;
}

function enhanceIntro(content, authorName, title) {
  if (authorName === 'فرانت چپتر') return content;
  if (content.includes('به عنوان سخنران')) return content;

  const topic = topicFromTitle(title);
  const speaker = authorName.replace(/^سید\s+/, '');

  if (content.includes(authorName) || content.includes(speaker)) {
    return content;
  }

  return content.replace(
    /(<div dir="rtl">\s*\n\s*\n)(در )/,
    `$1در این جلسه آنلاین فرانت‌چپتر، ${authorName} به عنوان سخنران درباره «${topic}» صحبت کرد. $2`
  );
}

function fixStructure(content) {
  let result = content.replace(
    /<\/Blockquote>\s*\n<\/div>\s*\n/g,
    '</Blockquote>\n\n'
  );

  let openDivs = (result.match(/<div dir="rtl">/g) || []).length;
  let closeDivs = (result.match(/<\/div>/g) || []).length;

  while (closeDivs > openDivs) {
    const replaced = result.replace(/\n<\/div>\s*$/, '');
    if (replaced === result) {
      result = result.replace(/<\/div>\s*\n(?=<div dir="rtl">)/, '\n');
    } else {
      result = replaced;
    }
    openDivs = (result.match(/<div dir="rtl">/g) || []).length;
    closeDivs = (result.match(/<\/div>/g) || []).length;
    if (closeDivs <= openDivs) break;
  }

  openDivs = (result.match(/<div dir="rtl">/g) || []).length;
  closeDivs = (result.match(/<\/div>/g) || []).length;

  if (openDivs > closeDivs) {
    result += `\n${'</div>\n'.repeat(openDivs - closeDivs)}`;
  }

  return result.trimEnd();
}

function processContent(content, session, title, telegramLinks) {
  const youtubeLinks = extractYoutubeLinks(content);
  let body = fixContentTypos(stripAllMediaSections(content));
  body = fixStructure(body);
  const media = buildMediaSection(session, title, telegramLinks, youtubeLinks);
  return `${body}${media}`;
}

function updateFrontmatter(data, session, title, authorName) {
  const topic = topicFromTitle(title);
  data.url = SLUGS[session];
  data.categories = ['جلسات آنلاین'];
  data.description = buildDescription(title, authorName);
  data.tags = buildTags(title, authorName);
  data.image = coverImage(session);
  if (!data.meta_title) {
    data.meta_title = `${sessionLabel(title)} | ${topic} | فرانت‌چپتر`;
  }
}

function processFile(filePath, session) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(raw);
  const title = parsed.data.title;
  const authorName =
    typeof parsed.data.author === 'object' ? parsed.data.author?.name : '';

  updateFrontmatter(parsed.data, session, title, authorName);

  let content = processContent(
    parsed.content,
    session,
    title,
    SESSION_LINKS[session] || []
  );
  content = enhanceIntro(content, authorName, title);

  const slug = SLUGS[session];
  const output = matter.stringify(content, parsed.data);
  const newPath = path.join(POSTS_DIR, `${slug}.md`);

  return { oldPath: filePath, newPath, output };
}

const SESSION_LINKS = parseSessionsList();
const files = fs
  .readdirSync(POSTS_DIR)
  .filter((file) => file.endsWith('.md') && !file.startsWith('_'));

const results = [];

for (const file of files) {
  const slug = file.replace('.md', '');
  const session = SLUG_TO_SESSION[slug];
  if (!session) continue;
  results.push(processFile(path.join(POSTS_DIR, file), session));
}

for (const { oldPath, newPath, output } of results) {
  fs.writeFileSync(newPath, output, 'utf-8');
  if (
    path.resolve(oldPath) !== path.resolve(newPath) &&
    fs.existsSync(oldPath)
  ) {
    fs.unlinkSync(oldPath);
  }
}

console.log(`Updated ${results.length} session posts.`);
