'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoOpenOutline,
  IoSparklesOutline,
  IoTimeOutline,
  IoRibbonOutline,
  IoShieldCheckmarkOutline,
  IoImagesOutline,
  IoBookOutline,
  IoCloudOutline,
  IoHeartOutline,
  IoCheckmarkCircleOutline,
  IoArrowBackOutline,
  IoRocketOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import Banner from './components/Banner';
import Cta from './components/Cta';

const withEventUtm = (
  url: string,
  medium = 'event_report',
  campaign = 'dar-miyan-e-meh'
): string => {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('utm_source', 'frontchapter');
    parsed.searchParams.set('utm_medium', medium);
    parsed.searchParams.set('utm_campaign', campaign);
    return parsed.toString();
  } catch {
    return url;
  }
};

const REGISTRATION_ARCHIVE_URL = withEventUtm('https://mist.frontchapter.ir/');
const GOOGLE_PHOTOS_URL = 'https://photos.app.goo.gl/oZY9Y2vzwqm4cPpY8';
const YASIN_ARTICLE_URL = withEventUtm(
  'https://yasiin.me/expertise-to-opportunity/'
);
const CODEMEET_URL = withEventUtm('https://codemeet.chat/');
const WIDGETIFY_URL = withEventUtm('https://widgetify.ir/');
const LIARA_URL = withEventUtm('https://liara.ir/');

interface SpeakerItem {
  name: string;
  role: string;
  topic: string;
  avatarText: string;
  image?: string;
  link?: string;
  linkLabel?: string;
}

const speakers: SpeakerItem[] = [
  {
    name: 'صالح شجاعی',
    role: 'بنیان‌گذار فرانت‌چپتر',
    topic: 'افتتاحیه: رویارویی با پارادایم‌شیفت‌ها و مهارت‌های پایدار انسانی',
    avatarText: 'ص.ش',
    image: '/images/events/dar-miyan-e-meh/speakers/saleh_shojaei.webp',
    link: withEventUtm(
      'https://www.linkedin.com/in/salehshojaei/',
      'speaker_card'
    ),
    linkLabel: 'پروفایل لینکدین صالح',
  },
  {
    name: 'اتابک آکسون',
    role: 'کارخانه هوش مصنوعی ایران',
    topic: 'هوش مصنوعی در صنعت؛ ساختن یا انتظار در عصر تحولات AI؟',
    avatarText: 'ا.آ',
    image: '/images/events/dar-miyan-e-meh/speakers/atabak_axon.webp',
    link: withEventUtm(
      'https://www.linkedin.com/in/atabakakson/',
      'speaker_card'
    ),
    linkLabel: 'پروفایل لینکدین اتابک',
  },
  {
    name: 'دکتر مهیار پویامهر',
    role: 'روان‌شناس بالینی و مدرس دانشگاه',
    topic: 'کارگاه تعاملی ۹۰ دقیقه‌ای «از مِه تا وضوح» و مدیریت عدم‌قطعیت',
    avatarText: 'م.پ',
    image: '/images/events/dar-miyan-e-meh/speakers/mahyar_pouyamehr.webp',
    link: withEventUtm(
      'https://www.instagram.com/mahyar.pouyamehr/',
      'speaker_card'
    ),
    linkLabel: 'صفحه اینستاگرام دکتر پویامهر',
  },
  {
    name: 'شایان حیدری',
    role: 'بنیان‌گذار CodeMeet',
    topic: 'داستان کدمیت؛ از یک ایده آخرهفته‌ای تا محصول زنده جامعه',
    avatarText: 'ش.ح',
    image: '/images/events/dar-miyan-e-meh/speakers/shayan_heidari.webp',
    link: CODEMEET_URL,
    linkLabel: 'وب‌سایت کدمیت (CodeMeet)',
  },
  {
    name: 'حسین جوان',
    role: 'توسعه‌دهنده و هم‌بنیان‌گذار Widgetify',
    topic: 'تجربه بازمتن ویجتیفای؛ شکست‌ها، پیوت‌ها و ثبات در دیزاین محصول',
    avatarText: 'ح.ج',
    image: '/images/events/dar-miyan-e-meh/speakers/hossein_javan.webp',
    link: WIDGETIFY_URL,
    linkLabel: 'وب‌سایت ویجتیفای (Widgetify)',
  },
  {
    name: 'امیرحسین کریمی',
    role: 'مهندس ارشد نرم‌افزار و مدیر فناوری InteliCraft',
    topic: 'مدیر و مجری پنل گفت‌وگوی صریح و پرسش‌وپاسخ',
    avatarText: 'ا.ک',
    image: '/images/events/dar-miyan-e-meh/speakers/amirhossein_karimi.webp',
    link: withEventUtm(
      'https://www.linkedin.com/in/amirhosseinkarimi/',
      'speaker_card'
    ),
    linkLabel: 'پروفایل لینکدین امیرحسین',
  },
  {
    name: 'یاسین همتی',
    role: 'رئیس هیئت‌مدیره شرکت تأمین آلیاژ کارا صنعت',
    topic: 'عضو پنل تخصصی؛ اتصال فناوری و AI به نیازهای واقعی صنایع',
    avatarText: 'ی.ه',
    image: '/images/events/dar-miyan-e-meh/speakers/yasin_hemmati.webp',
    link: YASIN_ARTICLE_URL,
    linkLabel: 'مطالعه مقاله «از تخصص تا فرصت»',
  },
  {
    name: 'پویا صبرآموز',
    role: 'مدیرعامل سابق و مترجم کتاب «برنامه‌نویس عملگرا»',
    topic:
      'عضو پنل تخصصی؛ مهارت‌های ماندگار در بازار کار با اتکا به ۵۰۰+ مصاحبه',
    avatarText: 'پ.ص',
    image: '/images/events/dar-miyan-e-meh/speakers/pouya_sabramooz.webp',
    link: withEventUtm(
      'https://www.linkedin.com/in/pouya-sabramooz-53106815a/',
      'speaker_card'
    ),
    linkLabel: 'پروفایل لینکدین پویا',
  },
];

interface ReportImageProps {
  src: string;
  alt: string;
  caption: string;
  priority?: boolean;
}

const ReportImage: React.FC<ReportImageProps> = ({
  src,
  alt,
  caption,
  priority = false,
}) => (
  <figure className="my-6 overflow-hidden rounded-2xl border border-border bg-surface-muted/40 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 900px"
        priority={priority}
        className="object-cover transition-transform duration-500 hover:scale-[1.02]"
      />
    </div>
    <figcaption className="border-t border-border/60 bg-surface-solid/90 px-4 py-2.5 text-center text-xs text-muted">
      {caption}
    </figcaption>
  </figure>
);

const DarMiyanEMehSingle: React.FC = () => {
  return (
    <>
      <article
        className="section pt-0"
        aria-label="گزارش تصویری کامل رویداد حضوری در میان مِه"
      >
        <Banner
          title="گزارش تصویری رویداد «در میان مِه»"
          parent={{ label: 'رویدادهای حضوری', href: '/conferences/' }}
        />

        <div className="container">
          <div className="mx-auto max-w-5xl">
            {/* Quick Meta Badge Row */}
            <div className="fade flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 font-medium text-emerald-700 dark:text-emerald-300">
                <IoCheckmarkCircleOutline className="text-base" />
                رویداد برگزار شد • گزارش اختصاصی و تصویری
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-4 py-1.5 font-medium text-dark">
                <IoCalendarOutline className="text-base text-primary" />
                پنجشنبه، ۲ مهر ۱۴۰۵
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-4 py-1.5 font-medium text-dark">
                <IoTimeOutline className="text-base text-primary" />
                ساعت ۱۵:۰۰ الی ۱۹:۳۰
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-4 py-1.5 font-medium text-dark">
                <IoLocationOutline className="text-base text-primary" />
                کارخانه نوآوری آزادی • فضای کار اشتراکی زاویه
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-4 py-1.5 font-medium text-dark">
                <IoPeopleOutline className="text-base text-primary" />
                ۵۰ شرکت‌کننده • ۱۴ صندلی اهدایی جامعه
              </span>
            </div>

            {/* Poster Card with Action Hub */}
            <div className="fade mt-8 overflow-hidden rounded-3xl border border-border bg-surface-solid shadow-xl transition-all">
              <div className="relative aspect-video w-full overflow-hidden bg-surface-muted sm:aspect-[21/9]">
                <Image
                  src="/images/events/dar-miyan-e-meh-banner.jpg"
                  alt="پوستر رویداد حضوری در میان مِه — فرانت‌چپتر"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 text-white sm:flex-row sm:items-end">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      <IoSparklesOutline />
                      هم‌اندیشی در روزهای عدم‌قطعیت
                    </span>
                    <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                      در میان مِه؛ روایتی تصویری از هم‌اندیشی و جست‌وجوی مسیر
                    </h1>
                  </div>
                </div>
              </div>

              {/* Direct Links Hub Bar */}
              <div className="border-t border-border bg-surface-muted/60 p-6 sm:p-8">
                <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                  <div className="text-center lg:text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                      <IoImagesOutline />
                      مستندات و آلبوم کامل عکس‌ها
                    </span>
                    <h2 className="mt-2 text-xl font-bold text-dark sm:text-2xl">
                      آلبوم تصاویر، مقاله تحلیلی و پیوست‌های رویداد
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      مستندات کامل رویداد، آلبوم باکیفیت در گوگل فوتوز و
                      پیوندهای پیوست برای مطالعه و دانلود در دسترس است.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={GOOGLE_PHOTOS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/35"
                    >
                      <IoImagesOutline className="text-lg" />
                      <span>دانلود تصاویر ایونت (Google Photos)</span>
                      <IoOpenOutline className="text-base" />
                    </a>

                    <a
                      href={YASIN_ARTICLE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-solid px-5 py-3 text-sm font-semibold text-dark transition-all hover:border-primary/50 hover:text-primary"
                    >
                      <IoDocumentTextOutline className="text-lg text-primary" />
                      <span>مقاله یاسین: از تخصص تا فرصت</span>
                      <IoOpenOutline className="text-base" />
                    </a>

                    <a
                      href={REGISTRATION_ARCHIVE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-solid px-5 py-3 text-sm font-semibold text-dark transition-all hover:border-primary/50 hover:text-primary"
                    >
                      <IoOpenOutline className="text-base" />
                      <span>صفحه اصلی ثبت‌نام رویداد</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Statistics Cards */}
            <div className="fade mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-surface-solid p-5 text-center transition-all hover:border-primary/40">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <IoPeopleOutline className="text-xl" />
                </span>
                <div className="mt-3 text-2xl font-bold text-dark sm:text-3xl">
                  ۵۰
                </div>
                <p className="mt-1 text-xs font-medium text-muted">
                  حاضران و متخصصان همراه
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface-solid p-5 text-center transition-all hover:border-primary/40">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <IoHeartOutline className="text-xl" />
                </span>
                <div className="mt-3 text-2xl font-bold text-dark sm:text-3xl">
                  ۱۴
                </div>
                <p className="mt-1 text-xs font-medium text-muted">
                  صندلی اهدایی توسط جامعه
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface-solid p-5 text-center transition-all hover:border-primary/40">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <IoCloudOutline className="text-xl" />
                </span>
                <div className="mt-3 text-xl font-bold text-dark sm:text-2xl">
                  ۲ میلیون
                </div>
                <p className="mt-1 text-xs font-medium text-muted">
                  تومان اعتبار ابری لیارا به هر نفر
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface-solid p-5 text-center transition-all hover:border-primary/40">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <IoBookOutline className="text-xl" />
                </span>
                <div className="mt-3 text-2xl font-bold text-dark sm:text-3xl">
                  ۵۰ جلد
                </div>
                <p className="mt-1 text-xs font-medium text-muted">
                  کتاب برنامه‌نویس عملگرا هدیه
                </p>
              </div>
            </div>

            {/* Document Image 1: Immediately after title and before Heraclitus quote */}
            <div className="fade mt-10">
              <ReportImage
                src="/images/events/dar-miyan-e-meh/01-event-hall-overview.webp"
                alt="گردهمایی اعضای جامعه فرانت‌چپتر در رویداد در میان مِه — فضای کار اشتراکی زاویه"
                caption="گردهمایی اعضای جامعه فناوری و فرانت‌چپتر در فضای کار اشتراکی زاویه، کارخانه نوآوری آزادی"
                priority
              />
            </div>

            {/* Quote / Manifest */}
            <div className="fade mt-10 rounded-3xl border border-border bg-gradient-to-br from-surface-solid via-surface-solid to-primary/5 p-8 text-center shadow-sm sm:p-12">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                <IoSparklesOutline />
                درنگ در معنای دگرگونی و آغاز راه
              </span>
              <blockquote className="mt-4 text-xl font-bold leading-relaxed text-dark sm:text-2xl md:text-3xl">
                «هیچ‌کس دوبار در یک رودخانه قدم نمی‌گذارد؛ چون هم رودخانه دیگر
                همان رودخانه نیست، هم او دیگر همان آدم نیست.»
              </blockquote>
              <cite className="mt-3 block text-sm font-semibold text-muted">
                — هراکلیتوس
              </cite>
              <div className="mx-auto my-6 h-px w-24 bg-border" />
              <p className="mx-auto max-w-3xl text-sm leading-loose text-muted sm:text-base">
                شاید کمتر جمله‌ای به اندازه این نقل‌قول باستانی بتواند وضعیت
                امروز ما را توصیف کند؛ روزهایی که تغییر، دیگر اتفاقی دور و
                استثنایی نیست و به بخشی دائمی از زندگی حرفه‌ای و فردی ما تبدیل
                شده است. برای طراحان، برنامه‌نویسان، مدیران محصول و تمام کسانی
                که در اکوسیستم فناوری فعالیت می‌کنند، سرعت این تغییرات بیش از
                همیشه محسوس است. فناوری‌های جدید، ظهور هوش مصنوعی، تغییر مدل‌های
                کسب‌وکار، دگرگونی بازار کار و مجموعه‌ای از عدم‌قطعیت‌های اقتصادی
                و اجتماعی، بسیاری از مسیرهایی را که تا همین چند سال پیش روشن به
                نظر می‌رسیدند، در هاله‌ای از ابهام فرو برده‌اند.
              </p>
            </div>

            {/* Narrative Report Sections with In-place Images in Exact Google Doc Order */}
            <div className="fade mt-14 space-y-12">
              {/* Introduction & Overview */}
              <section className="rounded-3xl border border-border bg-surface-solid p-7 shadow-sm sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    ۰۱
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    مقدمه؛ گردهمایی برای مکث، شنیدن و هم‌اندیشی
                  </h2>
                </div>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    با همین نگاه، رویداد حضوری <strong>«در میان مِه»</strong> به
                    میزبانی جامعه فرانت‌چپتر و در فضای کار اشتراکی زاویه، واقع
                    در کارخانه نوآوری آزادی، برگزار شد. این گردهمایی با حضور
                    حدود ۵۰ نفر از اعضا و فعالان جامعه فناوری شکل گرفت؛ جمعی که
                    آمده بودند نه برای دریافت یک پاسخ قطعی، بلکه برای شنیدن
                    تجربه‌های یکدیگر، بازنگری در مسیرهای پیش‌رو و پیدا کردن
                    نشانه‌هایی برای ادامه مسیر در شرایطی که آینده بیش از همیشه
                    نامطمئن به نظر می‌رسد.
                  </p>
                  <p>
                    «در میان مِه» تلاش کرد به جای ارائه نسخه‌ای آماده برای عبور
                    از این شرایط، فضایی برای گفت‌وگو ایجاد کند؛ فضایی که در آن
                    بتوان درباره ترس‌ها، فرصت‌ها، تغییرات تکنولوژیک، مسیر
                    حرفه‌ای، سلامت روان و حتی چیزهایی که هنوز پاسخ روشنی برایشان
                    نداریم صحبت کرد. از همین رو، برنامه رویداد ترکیبی از ارائه،
                    کارگاه، تجربه‌نگاری و گفت‌وگوی جمعی بود.
                  </p>
                </div>
              </section>

              {/* Section 1: Community Spirit & Sponsors (No image in Google Doc) */}
              <section className="rounded-3xl border border-border bg-surface-solid p-7 shadow-sm sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    ۰۲
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    ۱. روح جمعی و همراهی جامعه و حامیان
                  </h2>
                </div>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    شاید یکی از مهم‌ترین اتفاقات «در میان مِه» حتی پیش از آغاز
                    رسمی برنامه رخ داده بود؛ جایی که جامعه نشان داد مفهوم
                    کامیونیتی فقط به حضور در یک رویداد یا دنبال کردن یک صفحه و
                    کانال محدود نمی‌شود.
                  </p>
                  <div className="my-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
                    <div className="flex items-start gap-3">
                      <IoHeartOutline className="mt-0.5 shrink-0 text-2xl text-amber-600 dark:text-amber-400" />
                      <div>
                        <h3 className="text-base font-bold text-dark">
                          فرهنگ حمایت متقابل و صندلی‌های اهدایی (Pay It Forward)
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          از میان ۵۰ صندلی رویداد، ۱۴ صندلی توسط خود
                          شرکت‌کنندگان برای افراد دیگری خریداری و اهدا شد. این
                          اتفاق کمک کرد افرادی که شاید به دلیل محدودیت‌های مالی
                          امکان حضور در برنامه را نداشتند، بتوانند در این
                          گردهمایی شرکت کنند. در روزهایی که بسیاری از اعضای
                          جامعه فناوری با عدم‌قطعیت‌های اقتصادی و حرفه‌ای
                          دست‌وپنجه نرم می‌کنند، چنین همراهی‌هایی نشان می‌دهد که
                          بخشی از قدرت یک جامعه در توانایی اعضای آن برای حمایت
                          از یکدیگر شکل می‌گیرد.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p>
                    حامیان رویداد نیز نقش مهمی در فراهم شدن این تجربه داشتند:
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-surface-muted/50 p-5">
                      <div className="flex items-center gap-2 text-base font-bold text-primary">
                        <IoCloudOutline className="text-xl" />
                        <span>پلتفرم ابری لیارا</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                        پلتفرم ابری لیارا برای تمام شرکت‌کنندگان رویداد{' '}
                        <strong>۲ میلیون تومان اعتبار هدیه</strong> استفاده از
                        خدمات ابری در نظر گرفت؛ حمایتی که می‌تواند برای افرادی
                        که روی پروژه‌های شخصی، محصولات کوچک یا ایده‌های تازه کار
                        می‌کنند، فرصتی برای ادامه مسیر و آزمایش ایده‌هایشان
                        فراهم کند.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface-muted/50 p-5">
                      <div className="flex items-center gap-2 text-base font-bold text-primary">
                        <IoBookOutline className="text-xl" />
                        <span>پویا صبرآموز و کتاب برنامه‌نویس عملگرا</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                        پویا صبرآموز، مدیرعامل سابق و مترجم اثر شناخته‌شده{' '}
                        <em>«برنامه‌نویس عملگرا» (The Pragmatic Programmer)</em>
                        ، به هر یک از شرکت‌کنندگان یک جلد از این کتاب را هدیه
                        داد؛ یادآور دیگری از اهمیت انتقال تجربه و دانشی که گاهی
                        یک کتاب یا یک گفت‌وگوی کوتاه می‌تواند آن را منتقل کند.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Opening & Paradigm Shifts + Document Image 2 */}
              <section className="rounded-3xl border border-border bg-surface-solid p-7 shadow-sm sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    ۰۳
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    ۲. افتتاحیه و پیش‌گفتار؛ رویارویی با پارادایم‌شیفت‌ها
                  </h2>
                </div>

                {/* Document Image 2 */}
                <ReportImage
                  src="/images/events/dar-miyan-e-meh/02-opening-paradigm-shifts-saleh-shojaei.webp"
                  alt="ارائه افتتاحیه صالح شجاعی درباره پارادایم‌شیفت‌ها در رویداد در میان مه"
                  caption="صالح شجاعی در حال تشریح مفهوم پارادایم‌شیفت‌ها، دگرگونی ابزارها و بقای نیازهای انسانی در عصر هوش مصنوعی"
                />

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    رویداد با صحبت‌های آغازین و افتتاحیه{' '}
                    <strong>صالح شجاعی</strong> شروع شد. نقطه شروع این ارائه،
                    پرسش‌هایی بود که بسیاری از فعالان حوزه فناوری در سال‌های
                    اخیر بارها با آن مواجه شده‌اند: وقتی قواعد بازی تغییر
                    می‌کنند، ما چه چیزی را باید تغییر دهیم؟ چه چیزهایی را باید
                    کنار بگذاریم؟ و کدام بخش از تجربه و مهارت ما همچنان ارزشمند
                    باقی می‌ماند؟
                  </p>
                  <p>
                    صالح شجاعی بحث خود را به مفهوم «پارادایم‌شیفت» گره زد؛
                    لحظاتی که تغییر فناوری یا شرایط، تنها یک ابزار جدید به زندگی
                    ما اضافه نمی‌کند، بلکه شیوه انجام کارها و حتی تصور ما از یک
                    حرفه را تغییر می‌دهد. او برای توضیح این تغییرات از نمونه‌های
                    ملموسی استفاده کرد؛ از گذار فرش‌بافی دستی به فرش ماشینی
                    گرفته تا تغییر شیوه سفر و جابه‌جایی از تجربه‌هایی مانند
                    هیچ‌هایک به استفاده از هواپیما.
                  </p>
                  <div className="rounded-2xl border-r-4 border-primary bg-surface-muted/60 p-4 text-sm sm:p-5 sm:text-base">
                    <strong>نکته بنیادین:</strong> تغییر ابزار لزوماً به معنای
                    از بین رفتن نیازهای انسانی نیست. فناوری روش انجام بسیاری از
                    کارها را تغییر می‌دهد، اما مسئله، خلاقیت، حل مسئله، ارتباط
                    با دیگران و توانایی ساختن همچنان باقی می‌مانند. در این نگاه،
                    شاید مسئله اصلی فعالان فناوری در مواجهه با AI یا هر موج
                    تکنولوژیک دیگری، صرفاً یادگیری یک ابزار جدید نباشد؛ بلکه
                    فهمیدن این باشد که در جهان جدید،{' '}
                    <strong>کدام مسئله‌ها همچنان ارزش حل شدن دارند</strong>.
                  </div>
                </div>
              </section>

              {/* Section 3: Iran AI Factory + Document Image 3 */}
              <section className="rounded-3xl border border-border bg-surface-solid p-7 shadow-sm sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    ۰۴
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    ۳. کارخانه هوش مصنوعی ایران؛ ساختن یا انتظار در عصر AI؟
                  </h2>
                </div>

                {/* Document Image 3 */}
                <ReportImage
                  src="/images/events/dar-miyan-e-meh/03-iran-ai-factory-atabak-axon.webp"
                  alt="ارائه اتابک آکسون از کارخانه هوش مصنوعی ایران در رویداد در میان مه"
                  caption="اتابک آکسون از کارخانه هوش مصنوعی ایران؛ بررسی مواجهه با مسائل واقعی صنایع و حل مسائل با AI"
                />

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    در بخش بعدی، <strong>اتابک آکسون</strong> از کارخانه هوش
                    مصنوعی ایران مهمان رویداد بود. حضور او بحث را از سطح
                    پرسش‌های نظری به تجربه‌های واقعی استفاده از هوش مصنوعی در
                    صنعت نزدیک کرد. او درباره تجربه این مجموعه در مواجهه با
                    مسائل واقعی صنایع و تلاش برای حل این مسائل با استفاده از
                    فناوری‌های هوش مصنوعی صحبت کرد.
                  </p>
                  <p>
                    یکی از نکات اصلی این بخش، فاصله میان «ایده داشتن» و «ساختن»
                    بود. در شرایطی که هر روز خبر تازه‌ای درباره مدل‌های هوش
                    مصنوعی و ابزارهای جدید منتشر می‌شود، طبیعی است که بخشی از
                    افراد دچار این تردید شوند که آیا اکنون باید محصولی بسازند یا
                    منتظر بمانند تا فناوری به مرحله‌ای پایدارتر برسد.
                  </p>
                  <p>
                    تجربه‌هایی که اتابک از فضای واقعی صنعت مطرح کرد، این بحث را
                    به زمین عمل آورد: کارخانه‌ها، کسب‌وکارها و سازمان‌ها همین
                    حالا با مشکلاتی مواجه‌اند که می‌توان برای بخشی از آن‌ها
                    راه‌حل‌های مبتنی بر AI طراحی کرد. لازم نیست تمام مسیر آینده
                    را از قبل بدانیم تا بتوانیم قدم بعدی را برداریم؛ شناختن
                    مسئله‌ای واقعی و تلاش برای حل آن، نقطه شروع مسیر است.
                  </p>
                </div>
              </section>

              {/* Section 4: Dr. Mahyar Pooyamehr Workshop + Document Image 4 */}
              <section className="rounded-3xl border border-border bg-surface-solid p-7 shadow-sm sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    ۰۵
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    ۴. کارگاه تعاملی «از مِه تا وضوح» با دکتر مهیار پویامهر
                  </h2>
                </div>

                {/* Document Image 4 */}
                <ReportImage
                  src="/images/events/dar-miyan-e-meh/04-fog-to-clarity-workshop-mahyar-pooyamehr.webp"
                  alt="کارگاه تعاملی از مه تا وضوح با حضور و هدایت دکتر مهیار پویامهر"
                  caption="دکتر مهیار پویامهر در کارگاه تعاملی ۹۰ دقیقه‌ای «از مِه تا وضوح»؛ تحلیل روانشناختی عدم‌قطعیت و مدل جنگ، گریز و انجماد"
                />

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    پس از بحث درباره تغییرات تکنولوژیک، نوبت به بخشی رسید که
                    مستقیماً با تجربه انسانی این تغییرات سروکار داشت.{' '}
                    <strong>دکتر مهیار پویامهر</strong>، روان‌شناس بالینی و مدرس
                    دانشگاه، به مدت حدود یک ساعت و نیم کارگاه «از مِه تا وضوح»
                    را با شرکت‌کنندگان پیش برد؛ بخشی که یکی از طولانی‌ترین و
                    تعاملی‌ترین قسمت‌های برنامه بود.
                  </p>
                  <p>
                    موضوع اصلی کارگاه، فشار روانی ناشی از زندگی در شرایط
                    عدم‌قطعیت بود. وقتی فرد برای مدت طولانی با خبرهای متناقض،
                    تغییرات سریع، نگرانی درباره آینده شغلی یا اقتصادی و نداشتن
                    تصویری روشن از روزهای پیش‌رو مواجه می‌شود، این شرایط
                    می‌تواند روی تصمیم‌گیری، انگیزه و احساس توانمندی او اثر
                    بگذارد.
                  </p>
                  <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-surface-muted/60 p-4 text-center">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">
                        جنگ (Fight)
                      </span>
                      <p className="mt-1 text-xs text-muted">
                        تلاش وسواس‌گونه و پرفشار برای یادگیری همه‌چیز در یک زمان
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-muted/60 p-4 text-center">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        گریز (Flight)
                      </span>
                      <p className="mt-1 text-xs text-muted">
                        فرار یا اجتناب از روبه‌رو شدن با تغییرات و فناوری‌های نو
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-muted/60 p-4 text-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        انجماد (Freeze)
                      </span>
                      <p className="mt-1 text-xs text-muted">
                        کرختی ذهنی، به تعویق انداختن کارها و احساس ناتوانی در
                        اقدام
                      </p>
                    </div>
                  </div>
                  <p>
                    این مدل کمک کرد رفتارهایی که در دوره‌های پراسترس عجیب به نظر
                    می‌رسند، به عنوان واکنش‌های طبیعی سیستم روانی شناخته شوند.
                    سپس بحث به سمت راه‌های عملی برای بازگشت تدریجی از رخوت و
                    واکنش‌های خودکار به سوی تصمیم‌گیری آگاهانه حرکت کرد.
                  </p>
                </div>
              </section>

              {/* Section 5: CodeMeet Story + Document Image 5 */}
              <section className="rounded-3xl border border-border bg-surface-solid p-7 shadow-sm sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    ۰۶
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    ۵. داستان CodeMeet؛ از یک ایده آخرهفته‌ای تا محصول واقعی
                  </h2>
                </div>

                {/* Document Image 5 */}
                <ReportImage
                  src="/images/events/dar-miyan-e-meh/05-codemeet-story-shayan-heidari.webp"
                  alt="ارائه شایان حیدری بنیان‌گذار کدمیت در رویداد در میان مه"
                  caption="شایان حیدری در حال روایت داستان تولد پروژه CodeMeet و چالش‌های تبدیل آن به محصولی جدی"
                />

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    پس از کارگاه، <strong>شایان حیدری</strong>، بنیان‌گذار پروژه{' '}
                    <strong>CodeMeet</strong>، روی صحنه آمد تا داستان شکل‌گیری و
                    رشد این پروژه را روایت کند. در مرکز این ارائه یک ایده ساده
                    قرار داشت: پروژه‌های اثرگذار لزوماً از برنامه‌های چندساله و
                    سرمایه‌گذاری‌های سنگین شروع نمی‌شوند؛ گاهی یک نیاز واقعی و
                    زمانی محدود برای ساخت راه‌حل اولیه، نقطه آغاز است.
                  </p>
                  <p>
                    شایان از مسیر تبدیل یک پروژه آخرهفته‌ای به محصولی جدی برای
                    جامعه برنامه‌نویسان گفت؛ مسیری که در آن نگهداری، توسعه
                    قابلیت‌ها و توجه مداوم به بازخورد کاربران نقش کلیدی داشتند.
                    همچنین حمایت‌های زیرساختی حامیانی مانند لیارا به عنوان عاملی
                    موثر در ادامه حیات پروژه مطرح شد.
                  </p>

                  {/* Product Card: CodeMeet */}
                  <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:p-6">
                    <div className="text-center sm:text-right">
                      <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                          CM
                        </span>
                        <h3 className="text-lg font-bold text-dark">
                          محصول کدمیت (CodeMeet)
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-muted sm:text-sm">
                        پلتفرم تعاملی ارتباطی برای نشست‌ها و رویدادهای تخصصی
                        برنامه‌نویسان
                      </p>
                    </div>
                    <a
                      href={CODEMEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      <span>ورود به سایت کدمیت</span>
                      <IoOpenOutline className="text-base" />
                    </a>
                  </div>
                </div>
              </section>

              {/* Section 6: Widgetify Open Source + Document Image 6 */}
              <section className="rounded-3xl border border-border bg-surface-solid p-7 shadow-sm sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    ۰۷
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    ۶. تجربه بازمتن Widgetify؛ شکست‌ها، پیوت‌ها و ثبات در دیزاین
                  </h2>
                </div>

                {/* Document Image 6 */}
                <ReportImage
                  src="/images/events/dar-miyan-e-meh/06-widgetify-open-source-hossein-javan.webp"
                  alt="ارائه حسین جوان درباره تجربه متن‌باز ویجتیفای در رویداد در میان مه"
                  caption="حسین جوان از تیم Widgetify؛ بررسی شکست‌ها، پیوت‌های محصول، دیزاین سیستم و مدل‌های درآمدزایی متن‌باز"
                />

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    پس از زمان استراحت و گفت‌وگوی غیررسمی میان شرکت‌کنندگان،
                    نوبت به ارائه تیم <strong>Widgetify</strong> رسید.{' '}
                    <strong>حسین جوان</strong> در این بخش از پشت‌صحنه ساخت
                    محصولی صحبت کرد که در قالب یک پروژه متن‌باز و افزونه New
                    Tab، وارد استفاده روزمره کاربران شده است.
                  </p>
                  <p>
                    این ارائه تنها روایت یک محصول موفق نبود؛ بخش مهمی از صحبت‌ها
                    به شکست‌ها، تغییر مسیرها و پیوت‌هایی اختصاص داشت که
                    Widgetify در طول مسیر تجربه کرده بود. او همچنین بر اهمیت
                    ثبات در رابط و تجربه کاربری تأکید کرد و تجربیات تیم پیرامون
                    مدل‌های درآمدزایی در پروژه‌های منبع‌باز (Open Source) را به
                    اشتراک گذاشت.
                  </p>

                  {/* Product Card: Widgetify */}
                  <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:p-6">
                    <div className="text-center sm:text-right">
                      <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                          W
                        </span>
                        <h3 className="text-lg font-bold text-dark">
                          محصول ویجتیفای (Widgetify)
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-muted sm:text-sm">
                        افزونه صفحه شروع مرورگر با ویجت‌های کاربردی، مینیمال،
                        مدرن و متن‌باز
                      </p>
                    </div>
                    <a
                      href={WIDGETIFY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      <span>ورود به سایت ویجتیفای</span>
                      <IoOpenOutline className="text-base" />
                    </a>
                  </div>
                </div>
              </section>

              {/* Section 7: Honest Panel + Document Image 7 */}
              <section className="rounded-3xl border border-border bg-surface-solid p-7 shadow-sm sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    ۰۸
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    ۷. پنل گفت‌وگوی صریح؛ ریشه‌ها، فرصت‌ها و ثبات در هیاهو
                  </h2>
                </div>

                {/* Document Image 7 */}
                <ReportImage
                  src="/images/events/dar-miyan-e-meh/07-panel-discussion-karimi-hemmati-sabramooz.webp"
                  alt="پنل گفت‌وگوی صریح با حضور امیرحسین کریمی، یاسین همتی و پویا صبرآموز"
                  caption="پنل گفت‌وگوی صریح با اجرای امیرحسین کریمی و حضور یاسین همتی و پویا صبرآموز درباره مهارت‌های ماندگار و هوش مصنوعی در صنعت"
                />

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    در پایان برنامه، نوبت به پنل گفت‌وگو رسید؛ بخشی که موضوعات
                    مطرح‌شده در طول روز را در یک گفت‌وگوی مشترک کنار هم قرار
                    داد. این پنل با اجرای <strong>امیرحسین کریمی</strong>، مهندس
                    ارشد نرم‌افزار و مدیر فناوری InteliCraft، و با حضور{' '}
                    <strong>یاسین همتی</strong> و <strong>پویا صبرآموز</strong>{' '}
                    برگزار شد.
                  </p>

                  <div className="my-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-surface-muted/60 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-dark">
                          یاسین همتی
                        </h3>
                        <span className="text-xs font-medium text-primary">
                          دیدگاه صنعت و کارآفرینی
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                        یاسین همتی با تکیه بر تجربه مدیریتی و ارتباط با بدنه
                        صنعت، درباره نیازهای واقعی کارخانه‌ها و فرصت‌هایی صحبت
                        کرد که ابزارهای هوش مصنوعی برای متخصصان ایجاد کرده‌اند.
                        او در مقاله اختصاصی خود با عنوان{' '}
                        <a
                          href={YASIN_ARTICLE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-primary underline"
                        >
                          «از تخصص تا فرصت»
                        </a>{' '}
                        به تفصیل این چشم‌انداز را تشریح کرده است.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface-muted/60 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-dark">
                          پویا صبرآموز
                        </h3>
                        <span className="text-xs font-medium text-primary">
                          دیدگاه بازار کار و منابع انسانی
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                        پویا صبرآموز با اتکا به تجربه برگزاری بیش از ۵۰۰ مصاحبه،
                        به مهارت‌هایی پرداخت که در دوره‌های مختلف تغییر تکنولوژی
                        همچنان اهمیت خود را حفظ می‌کنند: تفکر انتقادی، توانایی
                        حل مسئله و سازگاری روانی که مستقل از تغییر ابزارها
                        همواره در مسیر حرفه‌ای تعیین‌کننده‌اند.
                      </p>
                    </div>
                  </div>

                  <p>
                    پنل در نهایت به همان پرسش محوری بازگشت: وقتی آینده کاملاً
                    قابل پیش‌بینی نیست، چگونه می‌توان همچنان حرکت کرد؟ شاید پاسخ
                    این پرسش یک تکنولوژی تازه یا فرمول قطعی نباشد؛ بلکه ترکیبی
                    از شناخت بهتر خود، فهم مسئله‌های واقعی، یادگیری مداوم،
                    گفت‌وگو با دیگران و داشتن انعطاف برای تغییر مسیر باشد.
                  </p>
                </div>
              </section>

              {/* Section 8: Final Words + Document Image 8 */}
              <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface-solid to-primary/5 p-7 text-center shadow-sm sm:p-10 sm:text-right">
                <div className="flex items-center justify-center gap-3 sm:justify-start">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-white">
                    ۰۹
                  </span>
                  <h2 className="text-xl font-bold text-dark sm:text-2xl">
                    سخن پایانی؛ در میان مِه، کنار هم
                  </h2>
                </div>

                {/* Document Image 8 */}
                <ReportImage
                  src="/images/events/dar-miyan-e-meh/08-closing-group-memorial-photo.webp"
                  alt="عکس یادگاری پایانی شرکت‌کنندگان رویداد در میان مِه در زاویه"
                  caption="عکس یادگاری دسته‌جمعی پایانی رویداد «در میان مِه» با حضور سخنرانان، حامیان و همراهان خانواده فرانت‌چپتر"
                />

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-text sm:text-base">
                  <p>
                    «در میان مِه» با ثبت عکس یادگاری و لحظه‌های پایانی رویداد به
                    پایان رسید، اما موضوعاتی که در طول روز شکل گرفته بودند، با
                    تمام شدن برنامه متوقف نشدند. از پارادایم‌شیفت‌های تکنولوژیک
                    و فرصت‌های هوش مصنوعی گرفته تا سلامت روان، مسیر ساخت محصول،
                    تجربه متن‌باز و مهارت‌های ماندگار حرفه‌ای، هر بخش بخشی از یک
                    تصویر بزرگ‌تر را نشان می‌داد.
                  </p>
                  <blockquote className="my-4 rounded-2xl border border-primary/30 bg-surface-solid/80 p-5 text-center text-base font-bold text-dark sm:text-lg">
                    «شاید مهم‌ترین پیام این روز این نبود که مِه از بین رفته است؛
                    ارزش این گردهمایی در این بود که کنار یکدیگر ایستادیم و
                    فهمیدیم برای ادامه دادن، دیدن تمام مسیر ضروری نیست؛ کافی است
                    قدم بعدی را ببینیم.»
                  </blockquote>
                  <p>
                    از تمام شرکت‌کنندگانی که با حضورشان به این روز معنا دادند،
                    از کسانی که صندلی دیگری برای حضور یک نفر بیشتر خریدند، از
                    سخنرانان و مهمانان، و از حامیانی که در شکل‌گیری این تجربه
                    همراه فرانت‌چپتر بودند (پلتفرم ابری لیارا و کارخانه هوش
                    مصنوعی ایران)، صمیمانه سپاسگزاریم.
                  </p>
                </div>
              </section>
            </div>

            {/* Presenters & Speakers Showcase */}
            <div className="fade mt-16">
              <div className="text-center sm:text-right">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  <IoPeopleOutline />
                  تیم ارائه‌دهندگان و مهمانان
                </span>
                <h3 className="mt-1 text-2xl font-bold text-dark sm:text-3xl">
                  سخنرانان و چهره‌های رویداد «در میان مِه»
                </h3>
                <p className="mt-1 text-sm text-muted">
                  متخصصان و ارائه‌دهندگانی که تجربیات، دانش و انرژی خود را با
                  جامعه به اشتراک گذاشتند
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {speakers.map((sp, idx) => (
                  <div
                    key={idx}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-surface-solid p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="flex flex-col items-center">
                      {sp.image ? (
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm">
                          <Image
                            src={sp.image}
                            alt={sp.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                          {sp.avatarText}
                        </div>
                      )}
                      <h4 className="mt-4 text-base font-bold text-dark transition-colors group-hover:text-primary">
                        {sp.name}
                      </h4>
                      <p className="mt-1 text-xs font-semibold text-primary/90">
                        {sp.role}
                      </p>
                      <p className="mt-2.5 text-xs leading-relaxed text-muted">
                        {sp.topic}
                      </p>
                    </div>

                    {sp.link && (
                      <div className="mt-4 border-t border-border pt-3">
                        <a
                          href={sp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          <span>
                            {sp.linkLabel ?? 'مشاهده پیوست / وب‌سایت'}
                          </span>
                          <IoOpenOutline className="text-sm" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Products Introduced in Event */}
            <div className="fade mt-16 rounded-3xl border border-border bg-surface-solid p-8 shadow-sm sm:p-10">
              <div className="text-center sm:text-right">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  <IoRocketOutline />
                  اکوسیستم محصول‌محور
                </span>
                <h3 className="mt-1 text-2xl font-bold text-dark sm:text-3xl">
                  محصولات معرفی‌شده در رویداد
                </h3>
                <p className="mt-1 text-sm text-muted">
                  نوآوری‌هایی که توسط اعضای جامعه و در پاسخ به نیازهای واقعی
                  مهندسان متولد شده‌اند
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface-muted/50 p-6 transition-all hover:border-primary/40">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
                        CM
                      </span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        ارتباطات جامعه برنامه‌نویسان
                      </span>
                    </div>
                    <h4 className="mt-4 text-xl font-bold text-dark">
                      کدمیت (CodeMeet)
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                      پلتفرمی با هدف تسهیل دورهمی‌ها، هم‌افزایی فنی و برگزاری
                      رویدادهای تخصصی برنامه‌نویسان که از دل یک نیاز شخصی متولد
                      شد و با پشتیبانی ابری لیارا به مقیاس عمومی رسید.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted">codemeet.chat</span>
                    <a
                      href={CODEMEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
                    >
                      <span>ورود به کدمیت</span>
                      <IoOpenOutline className="text-sm" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface-muted/50 p-6 transition-all hover:border-primary/40">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
                        W
                      </span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        افزونه متن‌باز مرورگر
                      </span>
                    </div>
                    <h4 className="mt-4 text-xl font-bold text-dark">
                      ویجتیفای (Widgetify)
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                      افزونه صفحه نیوتَب متن‌باز با تمرکز بر تجربه کاربری
                      بی‌نقص، طراحی تمیز و ابزارهای متمرکز بر بهره‌وری روزمره
                      برنامه‌نویسان و طراحان وب.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted">widgetify.ir</span>
                    <a
                      href={WIDGETIFY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
                    >
                      <span>ورود به ویجتیفای</span>
                      <IoOpenOutline className="text-sm" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda Timeline Recap */}
            <div className="fade mt-16">
              <h3 className="text-center text-h4 text-dark sm:text-right">
                مرور کنداکتور و روند اجرایی رویداد
              </h3>
              <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface-solid">
                {[
                  {
                    time: '۱۵:۰۰ الی ۱۵:۱۵',
                    title: 'پذیرش و خوش‌آمدگویی',
                    desc: 'پذیرش شرکت‌کنندگان، صرف چای و احوال‌پرسی صمیمانه اولیه',
                    type: 'پذیرش',
                  },
                  {
                    time: '۱۵:۱۵ الی ۱۵:۳۰',
                    title: 'افتتاحیه؛ رویارویی با پارادایم‌شیفت‌ها',
                    desc: 'سخنان آغازین صالح شجاعی و تعریف مأموریت رویداد در روزهای مبهم',
                    type: 'افتتاحیه',
                  },
                  {
                    time: '۱۵:۳۰ الی ۱۵:۴۵',
                    title: 'هوش مصنوعی در صنعت؛ ساختن یا انتظار؟',
                    desc: 'ارائه اتابک آکسون از کارخانه هوش مصنوعی ایران درباره نیازهای واقعی صنایع',
                    type: 'سخنرانی',
                  },
                  {
                    time: '۱۵:۴۵ الی ۱۷:۱۵',
                    title: 'کارگاه تعاملی «از مِه تا وضوح»',
                    desc: '۹۰ دقیقه کارگاه عمیق روانشناسی با هدایت دکتر مهیار پویامهر پیرامون مدل جنگ، گریز و انجماد',
                    type: 'کارگاه تعاملی',
                  },
                  {
                    time: '۱۷:۱۵ الی ۱۷:۳۵',
                    title: 'استراحت، پذیرایی و شبکه‌سازی',
                    desc: 'فرصتی برای گپ‌وگفت دوستانه، تبادل تجربیات کاری و پذیرایی',
                    type: 'استراحت',
                  },
                  {
                    time: '۱۷:۳۵ الی ۱۷:۵۰',
                    title: 'داستان محصول CodeMeet و همراهی لیارا',
                    desc: 'روایت شایان حیدری از تبدیل ایده تفننی به محصول واقعی با پشتیبانی ابری لیارا',
                    type: 'معرفی محصول',
                  },
                  {
                    time: '۱۷:۵۰ الی ۱۸:۰۵',
                    title: 'تجربه متن‌باز Widgetify',
                    desc: 'روایت حسین جوان از شکست‌ها، پیوت‌ها و ظرافت‌های طراحی رابط کاربری',
                    type: 'معرفی محصول',
                  },
                  {
                    time: '۱۸:۰۵ الی ۱۹:۱۵',
                    title: 'پنل گفت‌وگوی صریح و پرسش‌وپاسخ',
                    desc: 'گفت‌وگوی شفاف با امیرحسین کریمی، یاسین همتی و پویا صبرآموز پیرامون بازار کار و تخصص',
                    type: 'پنل تخصصی',
                  },
                  {
                    time: '۱۹:۱۵ الی ۱۹:۳۰',
                    title: 'جمع‌بندی و ثبت عکس یادگاری',
                    desc: 'اهدای کتاب‌های برنامه‌نویس عملگرا، مرور دستاوردها و عکس دسته‌جمعی پایانی',
                    type: 'اختتامیه',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-surface-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-xs font-bold text-muted">
                        ۰{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-dark">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-muted">
                        {item.type}
                      </span>
                      <time className="text-xs font-semibold text-primary">
                        {item.time}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsors & Venue Grid */}
            <div className="fade mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface-solid p-6">
                <div>
                  <div className="flex items-center gap-2 text-primary">
                    <IoRibbonOutline className="text-xl" />
                    <h4 className="text-base font-bold text-dark">
                      حامیان همراه رویداد
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    این گردهمایی با حمایت ارزشمند و مستقیم مجموعه‌های پیشرو
                    اکوسیستم برگزار شد:
                  </p>
                  <div className="mt-4 space-y-3">
                    <a
                      href={LIARA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-border bg-surface-muted/50 p-3.5 transition-all hover:border-primary/40 hover:bg-surface-muted"
                    >
                      <div>
                        <span className="text-sm font-bold text-dark">
                          پلتفرم ابری لیارا (Liara)
                        </span>
                        <p className="mt-0.5 text-xs text-muted">
                          اهدای اعتبار ابری ۲ میلیون تومانی به همه حاضران
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <span>ورود به لیارا</span>
                        <IoOpenOutline className="text-sm" />
                      </span>
                    </a>
                    <div className="flex items-center justify-between rounded-xl border border-border bg-surface-muted/50 p-3.5">
                      <div>
                        <span className="text-sm font-bold text-dark">
                          کارخانه هوش مصنوعی ایران
                        </span>
                        <p className="mt-0.5 text-xs text-muted">
                          همراه علمی و حامی ارتباط تکنولوژی با صنعت
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        حامی علمی
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface-solid p-6">
                <div>
                  <div className="flex items-center gap-2 text-primary">
                    <IoLocationOutline className="text-xl" />
                    <h4 className="text-base font-bold text-dark">
                      میزبان و محل برگزاری
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    تهران، میدان آزادی، ابتدای اتوبان شهید لشگری، کارخانه نوآوری
                    آزادی، فضای کار اشتراکی زاویه (روبه‌روی ایستگاه مترو بیمه).
                  </p>
                  <div className="mt-4 rounded-xl border border-border bg-surface-muted/50 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <IoShieldCheckmarkOutline className="text-base shrink-0 text-emerald-500" />
                      <span>
                        فضای آرام، الهام‌بخش و مجهز برای کارگاه‌های گروهی و
                        گفتگوهای عمیق
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Comprehensive Action Card */}
            <div className="fade mt-16 rounded-3xl border border-border bg-gradient-to-r from-primary/10 via-surface-solid to-primary/5 p-8 text-center shadow-lg sm:p-12">
              <h3 className="text-2xl font-bold text-dark sm:text-3xl">
                مشاهده و دانلود عکس‌های باکیفیت رویداد
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                تمامی تصاویر ثبت‌شده از لحظات کارگاه، ارائه‌ها، تعاملات پرشور
                حاضران و عکس دسته‌جمعی یادگاری در آلبوم اختصاصی رویداد در گوگل
                فوتوز قرار گرفته است.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={GOOGLE_PHOTOS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40"
                >
                  <IoImagesOutline className="text-xl" />
                  <span>ورود به آلبوم تصاویر (Google Photos)</span>
                  <IoOpenOutline className="text-lg" />
                </a>

                <a
                  href={YASIN_ARTICLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-solid px-6 py-3.5 text-sm font-semibold text-dark transition-all hover:border-primary/50 hover:text-primary"
                >
                  <IoDocumentTextOutline className="text-lg text-primary" />
                  <span>مطالعه مقاله یاسین: از تخصص تا فرصت</span>
                  <IoOpenOutline className="text-base" />
                </a>

                <Link
                  href="/conferences/"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-solid px-6 py-3.5 text-sm font-medium text-dark transition-all hover:bg-surface-muted"
                >
                  <IoArrowBackOutline className="text-base" />
                  <span>لیست تمام رویدادهای فرانت‌چپتر</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Cta />
    </>
  );
};

export default DarMiyanEMehSingle;
