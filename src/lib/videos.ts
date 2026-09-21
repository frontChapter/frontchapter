export interface VideoItem {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  src: string;
  poster: string;
  uploadDate: string; // ISO 8601 with timezone: YYYY-MM-DDTHH:mm:ss+03:30
  category: 'conference' | 'community';
  categoryLabel: string;
  conferenceSlug?: string;
  conferenceTitle?: string;
  location?: string;
}

export const SITE_VIDEOS: VideoItem[] = [
  {
    slug: 'shiraz-1403',
    title: 'تیزر رسمی همایش شیراز ۱۴۰۳ فرانت‌چپتر',
    subtitle: 'بزرگ‌ترین دورهمی توسعه‌دهندگان فرانت در شیراز',
    description:
      'تیزر ویدیویی رسمی همایش بزرگ توسعه‌دهندگان فرانت‌چپتر در سالن سینما فرهنگ شیراز با حضور بیش از ۲۰۰ شرکت‌کننده از سراسر کشور، ۶ سخنرانی تخصصی، ۳ کارگاه آموزشی و پنل گفت‌وگوی چالش‌های شغلی مهندسی وب.',
    src: '/videos/frontchapter-1403.mp4',
    poster: '/images/1403/video_poster.jpg',
    uploadDate: '2025-02-27T08:00:00+03:30',
    category: 'conference',
    categoryLabel: 'همایش حضوری',
    conferenceSlug: '1403',
    conferenceTitle: 'همایش شیراز ۱۴۰۳',
    location: 'شیراز، فارس — سالن سینما فرهنگ',
  },
  {
    slug: 'amol-1402',
    title: 'ویدیوی دومین همایش فرانت‌اند ایران در آمل ۱۴۰۲',
    subtitle: 'دومین همایش فرانت‌چپتر در مجموعه اریکه آریایی آمل',
    description:
      'مستند ویدیویی دومین همایش کشوری فرانت‌اند ایران در اسفند ۱۴۰۲ با حضور بیش از ۴۰۰ شرکت‌کننده حضوری، سخنرانی متخصصان ارشد شرکت‌های مطرح فناوری و دورهمی صمیمی ساحلی در مازندران.',
    src: '/videos/frontchapter-banner.mp4',
    poster: '/images/1402/01.webp',
    uploadDate: '2024-02-28T08:00:00+03:30',
    category: 'conference',
    categoryLabel: 'همایش حضوری',
    conferenceSlug: '1402',
    conferenceTitle: 'همایش آمل ۱۴۰۲',
    location: 'آمل، مازندران — مجموعه اریکه آریایی',
  },
  {
    slug: 'babolsar-1400',
    title: 'ویدیوی اولین همایش فرانت‌اند کشور در بابلسر ۱۴۰۰',
    subtitle: 'نقطه آغاز رویدادهای حضوری فرانت‌چپتر',
    description:
      'خاطرات ویدیویی نخستین همایش حضوری فرانت‌اند ایران در اسفند ۱۴۰۰ در هتل میزبان بابلسر؛ ترکیبی متفاوت از سفر ساحلی، کارگاه‌های فنی، مسابقه برنامه‌نویسی و تولد رسمی جامعه فرانت‌چپتر.',
    src: '/videos/FrontChapter1400.mp4',
    poster: '/images/1400/video_poster.webp',
    uploadDate: '2022-03-01T08:00:00+03:30',
    category: 'conference',
    categoryLabel: 'همایش حضوری',
    conferenceSlug: '1400',
    conferenceTitle: 'همایش بابلسر ۱۴۰۰',
    location: 'بابلسر، مازندران — هتل میزبان',
  },
  {
    slug: 'intro',
    title: 'ویدیوی معرفی و رسالت جامعه فرانت‌چپتر',
    subtitle: 'محلی صمیمی برای گفت‌وگوی تخصصی و رشد برنامه‌نویسان وب',
    description:
      'معرفی اهداف، چشم‌انداز و فرهنگ جامعه‌ی فرانت‌چپتر؛ فضایی باز و دوستانه برای تبادل تجربه، آموزش مفاهیم عمیق جاوااسکریپت و فرانت‌اند، و شبکه‌سازی حرفه‌ای بین توسعه‌دهندگان وب ایران.',
    src: '/videos/frontchapter-banner.mp4',
    poster: '/images/banner-app.png',
    uploadDate: '2025-02-27T08:00:00+03:30',
    category: 'community',
    categoryLabel: 'معرفی جامعه',
  },
];

export const getAllVideos = (): VideoItem[] => SITE_VIDEOS;

export const getVideoBySlug = (slug: string): VideoItem | undefined =>
  SITE_VIDEOS.find((v) => v.slug === slug);

export const watchPath = (slug: string): string => `/watch/${slug}/`;
