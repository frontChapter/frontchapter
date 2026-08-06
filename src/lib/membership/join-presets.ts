export const EXPERTISE_TOPICS = [
  'مهندسی نرم‌افزار (فرانت/بک/فول‌استک)',
  'توسعه موبایل',
  'DevOps / زیرساخت / کلاد',
  'داده، هوش مصنوعی و تحلیل',
  'QA / تست و تضمین کیفیت',
  'امنیت سایبری',
  'UI/UX و طراحی محصول',
  'طراحی گرافیک و برند',
  'مدیر محصول / پروژه',
  'کارآفرین / صاحب کسب‌وکار / استارتاپ',
  'مارکتینگ و رشد (دیجیتال، SEO، سوشال)',
  'محتوا و رسانه',
  'فروش و توسعه بازار',
  'منابع انسانی و توسعه تیم',
  'آموزش، منتورینگ و کوچینگ',
  'روانشناسی و مشاوره',
  'دانشجو / علاقه‌مند به فناوری',
] as const;

export const EXPERIENCE_LEVELS = [
  { id: 'learning', label: 'تازه‌وارد / در حال یادگیری' },
  { id: 'junior', label: 'ابتدای مسیر (۰–۲ سال)' },
  { id: 'mid', label: 'میانی (۲–۵ سال)' },
  { id: 'senior', label: 'باتجربه (+۵ سال)' },
  { id: 'lead', label: 'لید / مدیر / بنیان‌گذار' },
] as const;

export type ExperienceId = (typeof EXPERIENCE_LEVELS)[number]['id'];

export const BIO_SUGGESTIONS = [
  'تازه‌واردم و مشتاق آشنایی با جامعه و یادگیری از تجربه‌های دیگران.',
  'چند سال در حوزهٔ فناوری کار می‌کنم؛ دوست دارم دانش را به اشتراک بگذارم.',
  'از حوزهٔ دیگری می‌آیم و به دورهمی‌ها و گفتگوهای جامعه علاقه‌مندم.',
] as const;

export const WELCOME_JOURNEY = [
  {
    title: 'ورود با تلگرام',
    body: 'احراز هویت سریع و امن بدون نیاز به تایید دستی.',
  },
  {
    title: 'پذیرش میثاق‌نامه',
    body: 'فضایی امن، محترمانه و حرفه‌ای برای رشد دسته‌جمعی.',
  },
  {
    title: 'تکمیل پروفایل',
    body: 'انتخاب سطح تجربه و حوزهٔ کاری یا علاقه‌مندی (زیر ۲ دقیقه).',
  },
] as const;

export const CHARTER_HIGHLIGHTS = [
  {
    title: 'هوای هم رو داریم (احترام و فراگیری)',
    body: 'جامعه برای همه سطح‌ها و پیش‌زمینه‌ها باز است. با احترام و صمیمیت گفتگو می‌کنیم.',
  },
  {
    title: 'رشد هم‌مسیر (یادگیری جمعی)',
    body: 'سوال بپرس، تجربه به اشتراک بگذار و نقدها را روی ایده متمرکز کن نه شخص.',
  },
  {
    title: 'فضای امن',
    body: 'هرگونه توهین، تبعیض و آزار ممنوع است و بلافاصله پیگیری می‌شود.',
  },
  {
    title: 'مسئولیت‌پذیری',
    body: 'در گروه‌ها، کانال‌ها و رویدادها پاسخگوی رفتار و کلام خود هستیم.',
  },
] as const;

export const JOIN_GALLERY_IMAGES = [
  {
    src: '/images/1402/01.JPG',
    alt: 'دورهمی فرانت‌چپتر — سال ۱۴۰۲',
  },
  {
    src: '/images/1403/negarande_frontchapter.jpg',
    alt: 'همایش فرانت‌چپتر — نگارنده',
  },
  {
    src: '/images/1403/01.jpeg',
    alt: 'همایش فرانت‌چپتر — لحظه‌های جمع',
  },
  {
    src: '/images/1403/02.jpeg',
    alt: 'همایش فرانت‌چپتر — شرکت‌کنندگان',
  },
  {
    src: '/images/1403/03.jpeg',
    alt: 'همایش فرانت‌چپتر — فضای رویداد',
  },
  {
    src: '/images/1403/04.jpeg',
    alt: 'همایش فرانت‌چپتر — دورهمی جامعه',
  },
] as const;

export const TELEGRAM_GROUP_URL = 'https://t.me/frontChapterGroup';

export const JOIN_LEARN_MORE_HREF = '/about/';

export function experienceLabel(id: ExperienceId | ''): string | null {
  if (!id) return null;
  return EXPERIENCE_LEVELS.find((l) => l.id === id)?.label ?? null;
}

export function buildExpertiseString(
  levelId: ExperienceId | '',
  topics: string[],
  custom: string
): string {
  const parts: string[] = [];
  const level = experienceLabel(levelId);
  if (level) parts.push(level);
  for (const t of topics) {
    const trimmed = t.trim();
    if (trimmed) parts.push(trimmed);
  }
  const extra = custom.trim();
  if (extra) parts.push(extra);
  return parts.join(' · ');
}
