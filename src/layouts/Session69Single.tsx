'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTicketOutline,
  IoMapOutline,
  IoCheckmarkCircle,
  IoFlame,
  IoSparklesOutline,
  IoMicOutline,
  IoHeartOutline,
  IoLogoLinkedin,
  IoExpandOutline,
} from 'react-icons/io5';
import Banner from './components/Banner';
import ConferenceTimeline from './components/ConferenceTimeline';
import Cta from './components/Cta';
import ImageLightbox from './components/ImageLightbox';
import SectionHeading from './components/SectionHeading';
import TeamShowcase, { type TeamMember } from './components/TeamShowcase';
import { StatItem } from './components/YearStatsShowcase';
import ZoomCarrotChip from './components/ZoomCarrotChip';
import Accordion from './shortcodes/Accordion';
import { useImageLightbox, type ImageItem } from '../hooks/useImageLightbox';
import { withSponsorReferral } from '../lib/sponsorReferral';
import type { ScheduleEvent } from '../lib/conferences';

// TODO: لینک ایوند را پس از انتشار صفحه رویداد در ایوند در این متغیر جایگزین کنید
const EVAND_TICKET_URL = 'https://evand.com/';

// TODO: تعداد ثبت‌نامی‌های واقعی رویداد برای نمایش درصد پر شدن ظرفیت
const REGISTERED_SEATS = 38;
const TOTAL_CAPACITY = 50;

const galleryImages: ImageItem[] = [
  {
    src: '/images/session-69/venue-zavie.jpg',
    alt: 'محیط داخلی فضای کار اشتراکی زاویه — محل برگزاری جلسه ۶۹ فرانت‌چپتر',
    label: 'فضای کار اشتراکی زاویه (کارخانه نوآوری آزادی)',
  },
  {
    src: '/images/session-69/event-birthday.jpg',
    alt: 'جشن تولد ۳ سالگی و گردهمایی بزرگ جامعه فرانت‌چپتر',
    label: 'جشن ۳ سالگی و گردهمایی جامعه فرانت‌چپتر',
  },
  {
    src: '/images/session-69/event-workshop.jpg',
    alt: 'کارگاه‌های تخصصی و جلسات هم‌اندیشی فرانت‌چپتر',
    label: 'کارگاه‌های تخصصی و جلسات هم‌اندیشی',
  },
  {
    src: '/images/session-69/event-reception.jpg',
    alt: 'پذیرش، کارت شرکت‌کنندگان و پک رویداد فرانت‌چپتر',
    label: 'میز پذیرش، نشان اختصاصی و پک‌های یادبود',
  },
  {
    src: '/images/session-69/event-meetup.jpg',
    alt: 'دورهمی حضوری، گفتگو و شبکه‌سازی اعضای فرانت‌چپتر',
    label: 'دورهمی حضوری، گفتگو و شبکه‌سازی',
  },
];

const stats = [
  { value: '۵۰ نفر', label: 'ظرفیت محدود' },
  { value: '۳٫۵ ساعت', label: 'مدت جلسه' },
  { value: '۲', label: 'سخنران تخصصی' },
  { value: '۱', label: 'کارگاه گروه تراپی' },
];

const scheduleEvents: ScheduleEvent[] = [
  {
    day: '۲۶ شهریور ۱۴۰۵ — فضای کار اشتراکی زاویه',
    time: '۱۶:۰۰',
    endTime: '۱۶:۲۰',
    title: 'پذیرش و خوش‌آمدگویی + پذیرایی',
    type: 'general',
    description:
      'ورود شرکت‌کنندگان، پذیرش، دریافت نشان رویداد و پذیرایی اولیه.',
  },
  {
    day: '۲۶ شهریور ۱۴۰۵ — فضای کار اشتراکی زاویه',
    time: '۱۶:۲۰',
    endTime: '۱۶:۳۰',
    title: 'آغاز رسمی و معرفی جلسه‌ی ۶۹',
    type: 'general',
    description:
      'مقدمه‌ای بر دغدغه مشترک این روزها، ضرورت بازتعریف بقا در عصر هوش مصنوعی و معرفی بخش‌های رویداد.',
  },
  {
    day: '۲۶ شهریور ۱۴۰۵ — فضای کار اشتراکی زاویه',
    time: '۱۶:۳۰',
    endTime: '۱۷:۱۵',
    title: 'بقا در شرایط عدم قطعیت و بحران',
    subtitle: 'سخنرانی تخصصی روانشناسی',
    speaker: 'مهیار پویامهر',
    type: 'talk',
    description:
      'تحلیل روانشناختی مواجهه با بحران‌ها، کاهش اضطراب شغلی و راهکارهای علمی تاب‌آوری در برابر تحولات پرشتاب هوش مصنوعی.',
  },
  {
    day: '۲۶ شهریور ۱۴۰۵ — فضای کار اشتراکی زاویه',
    time: '۱۷:۱۵',
    endTime: '۱۷:۳۵',
    title: 'استراحت و پذیرایی میان‌وعده',
    type: 'break',
    description:
      'فرصت استراحت، گفتگو، تبادل نظر اولیه و پذیرایی با نوشیدنی و میان‌وعده.',
  },
  {
    day: '۲۶ شهریور ۱۴۰۵ — فضای کار اشتراکی زاویه',
    time: '۱۷:۳۵',
    endTime: '۱۸:۲۰',
    title: 'ادامه‌ی راه: درس از گذشته',
    subtitle: 'سخنرانی فنی و تجربی',
    speaker: 'صالح شجاعی',
    type: 'talk',
    description:
      'درس‌هایی واقعی از عبور از بحران‌های فناوری در یک دهه گذشته و چگونگی حفظ پویایی و انطباق با ابزارهای نوین.',
  },
  {
    day: '۲۶ شهریور ۱۴۰۵ — فضای کار اشتراکی زاویه',
    time: '۱۸:۲۰',
    endTime: '۱۹:۱۰',
    title: 'گروه تراپی و گفت‌وگوی تعاملی',
    subtitle: 'پردازش جمعی دغدغه‌ها',
    type: 'workshop',
    description:
      'فضایی صمیمانه، محرمانه و ساختاریافته برای بیان نگرانی‌های شغلی، پردازش اضطراب‌ها و همفکری در جمع ۵۰ نفره.',
  },
  {
    day: '۲۶ شهریور ۱۴۰۵ — فضای کار اشتراکی زاویه',
    time: '۱۹:۱۰',
    endTime: '۱۹:۳۰',
    title: 'جمع‌بندی، شبکه‌سازی و پذیرایی پایانی',
    type: 'general',
    description:
      'جمع‌بندی دستاوردهای جلسه، عکس یادگاری و ارتباط آزاد شرکت‌کنندگان با سخنرانان و تیم فرانت‌چپتر.',
  },
];

const teamMembers: TeamMember[] = [
  {
    name: 'امیرحسین کریمی',
    role: 'تیم برگزاری',
    image: '/images/team/amirhossein_karimi.webp',
    linkedin: 'https://www.linkedin.com/in/amirhosseinkarimi/',
  },
  {
    name: 'علی گلکار',
    role: 'تیم برگزاری',
    image: '/images/team/ali_golkar.webp',
    linkedin: 'https://www.linkedin.com/in/aligolkarali/',
    instagram: 'https://www.instagram.com/lokiwich/',
  },
  {
    name: 'صالح شجاعی',
    role: 'تیم برگزاری (و سخنران)',
    image: '/images/team/saleh_shojaei.webp',
    linkedin: 'https://www.linkedin.com/in/salehshojaei/',
    instagram: 'https://www.instagram.com/roxaleh/',
  },
  {
    name: 'ریحانه ملکی',
    role: 'تیم محتوا',
    image: '/images/team/riyehane_maleki.webp',
    youtube: 'https://www.youtube.com/@Ryhnmaleki',
  },
];

const faqs = [
  {
    q: 'آیا امکان شرکت آنلاین در این جلسه وجود دارد؟',
    a: 'خیر، این جلسه کاملاً حضوری است تا بستر تعاملی، گفت‌وگوی چهره‌به‌چهره و بخش گروه تراپی با بالاترین کیفیت و محرمانگی ممکن برگزار شود.',
  },
  {
    q: 'ظرفیت جلسه چقدر است و آیا افزایش پیدا می‌کند؟',
    a: 'ظرفیت رویداد برای حفظ فضای تعاملی و اثربخشی کارگاه گروه تراپی به ۵۰ نفر محدود است و پس از تکمیل، امکان ثبت‌نام اضافه وجود نخواهد داشت.',
  },
  {
    q: 'اگر استطاعت مالی برای تهیه بلیت نداشته باشم چطور؟',
    a: 'هدف فرانت‌چپتر دسترسی آزاد همگان به آموزش و کامیونیتی است. اگر واقعاً مشتاق حضوری اما شرایط مالی فعلی اجازه نمی‌دهد، به ما به آدرس frontchapter.ir@gmail.com ایمیل بزن تا بدون دغدغه میزبان شما باشیم.',
  },
  {
    q: 'آیا پذیرایی در طول جلسه انجام می‌شود؟',
    a: 'بله، در دو نوبت پذیرایی اولیه و میان‌وعده کامل سرد و گرم برای تمام شرکت‌کنندگان تدارک دیده شده است.',
  },
  {
    q: 'بلیت جلسه را از کجا باید خریداری کنم؟',
    a: 'ثبت‌نام رسمی از طریق سامانه ایوند انجام می‌شود و بلافاصله پس از پرداخت، بلیت دیجیتال و جزئیات ورود به رویداد برای شما ایمیل خواهد شد.',
  },
];

const Session69Single = () => {
  const lightbox = useImageLightbox(galleryImages);

  return (
    <>
      <article
        className="section pt-0"
        aria-label="بقا: هوش‌مصنوعی و آینده | جلسه ۶۹ فرانت‌چپتر"
      >
        {/* Banner with Waves and Breadcrumbs */}
        <Banner
          title="بقا: هوش‌مصنوعی و آینده"
          parent={{ label: 'رویدادها', href: '/conferences/' }}
        />

        <div className="container">
          <div className="mx-auto max-w-5xl">
            {/* Live Hero Header with Urgency & Scarcity */}
            <div className="fade text-center">
              {/* Urgency Pill */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-sm sm:text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <span>جلسه حضوری ۶۹ فرانت‌چپتر • ظرفیت محدود ۵۰ نفر</span>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-dark sm:text-3xl md:text-4xl">
                بقا: هوش‌مصنوعی و آینده
              </h2>

              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted sm:text-base md:text-lg">
                رویدادی حضوری برای عبور از سردرگمی، بررسی روانشناختی اضطراب
                تکنولوژی، تجربه‌های واقعی برنامه‌نویسی و یک گروه تراپی جمعی در
                کنار هم.
              </p>

              {/* Meta Badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs text-muted sm:gap-3 sm:text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-3.5 py-1.5 shadow-sm">
                  <IoCalendarOutline className="h-4 w-4 text-primary" />
                  ۲۶ شهریور ۱۴۰۵ — ساعت ۱۶:۰۰ الی ۱۹:۳۰
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-3.5 py-1.5 shadow-sm">
                  <IoLocationOutline className="h-4 w-4 text-primary" />
                  تهران، فضای کار اشتراکی زاویه (کارخانه نوآوری آزادی)
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-3.5 py-1.5 font-medium text-dark shadow-sm">
                  <IoTicketOutline className="h-4 w-4 text-primary" />
                  ۴۴۵ هزار تومان (با تخفیف ویژه)
                </span>
              </div>

              {/* Primary High-Impact CTA */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3">
                <Link
                  href={EVAND_TICKET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-bold shadow-xl shadow-primary/25 transition-all hover:scale-105"
                >
                  <IoTicketOutline className="h-5 w-5" />
                  ثبت‌نام در ایوند (ظرفیت محدود)
                </Link>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <IoFlame className="h-4 w-4 text-primary" />
                  ظرفیت محدود به ۵۰ نفر — جامون داره تنگ میشه!
                </p>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <section className="fade mt-12" aria-label="آمار سریع جلسه">
              <h2 className="section-title text-center text-h5">
                آمار کلی رویداد
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 md:flex md:flex-row md:items-center md:justify-center">
                {stats.map((stat, idx) => (
                  <React.Fragment key={stat.label}>
                    {idx > 0 && (
                      <div
                        className="hidden h-12 w-px shrink-0 self-center bg-primary/20 md:block"
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex min-w-0 flex-1 justify-center">
                      <StatItem value={stat.value} label={stat.label} />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </section>

            {/* About the Session */}
            <section
              className="fade mt-12 rounded-2xl border border-border-secondary bg-theme-light p-6 md:p-8"
              aria-labelledby="about-session-heading"
            >
              <SectionHeading id="about-session-heading" as="h2">
                درباره این جلسه
              </SectionHeading>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-text md:text-lg">
                <p>
                  دنیای فناوری با شتابی بی‌سابقه در حال دگرگونی است و موج فراگیر
                  هوش مصنوعی، بسیاری از ما را با ابهام، اضطراب شغلی و حس عدم
                  قطعیت روبه‌رو کرده است. این جلسه با تمام دورهمی‌های معمول
                  فرانت‌چپتر فرق دارد؛ چرا که این‌بار به جای صرفاً کد و ابزار،
                  به خودمان و چگونگی بقا و تاب‌آوری‌مان می‌پردازیم.
                </p>
                <p>
                  در جلسه‌ی ۶۹، ابتدا نگاه علمی و روانشناختی به مدیریت بحران و
                  پذیرش تغییر را مرور می‌کنیم و سپس با تجربیات واقعی یک
                  برنامه‌نویس ارشد از گذر از بحران‌های فناوری همراه می‌شویم. در
                  پایان نیز در یک جلسه‌ی گروه تراپی صمیمانه و تعاملی، دغدغه‌ها و
                  ناگفته‌هایمان را با همراهی همدیگر پردازش می‌کنیم تا با ذهنی
                  آرام‌تر و نقشه‌ای روشن‌تر به مسیرمان ادامه دهیم.
                </p>
              </div>
            </section>

            {/* Symmetrical & Rich Speakers Section */}
            <section className="fade mt-14" aria-labelledby="speakers-heading">
              <SectionHeading
                id="speakers-heading"
                as="h2"
                centered
                className="w-full mb-8"
              >
                سخنران‌های جلسه‌ی ۶۹
              </SectionHeading>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                {/* Speaker 1: Mahyar Pouyamehr */}
                <article className="flex flex-col rounded-2xl border border-border bg-surface-solid p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 sm:p-7">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 sm:h-24 sm:w-24">
                      <Image
                        // TODO: عکس اختصاصی مهیار پویامهر پس از آماده‌سازی جایگزین شود
                        src="/images/author/derick.jpg"
                        alt="مهیار پویامهر — سخنران جلسه ۶۹ فرانت‌چپتر"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-dark sm:text-xl">
                        مهیار پویامهر
                      </h3>
                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                        روانشناس و مشاور توسعه فردی
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border/60 pt-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-primary sm:text-sm">
                      <IoMicOutline className="h-4 w-4 shrink-0" />
                      موضوع سخنرانی: «بقا در شرایط عدم قطعیت و بحران»
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                      بررسی روانشناختی مواجهه با بحران‌ها، مکانیزم‌های مقابله با
                      اضطراب ناشی از هوش مصنوعی و راهکارهای علمی برای تاب‌آوری
                      ذهنی در دنیای مدرن.
                    </p>
                  </div>
                </article>

                {/* Speaker 2: Saleh Shojaei */}
                <article className="flex flex-col rounded-2xl border border-border bg-surface-solid p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 sm:p-7">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 sm:h-24 sm:w-24">
                      <Image
                        src="/images/team/saleh_shojaei.webp"
                        alt="صالح شجاعی — سخنران جلسه ۶۹ فرانت‌چپتر"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-dark sm:text-xl">
                          صالح شجاعی
                        </h3>
                        <Link
                          href="https://www.linkedin.com/in/salehshojaei/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted transition-colors hover:text-primary"
                          aria-label="صفحه لینکدین صالح شجاعی"
                        >
                          <IoLogoLinkedin className="h-4 w-4" />
                        </Link>
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                        برنامه‌نویس ارشد و بنیان‌گذار فرانت‌چپتر
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border/60 pt-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-primary sm:text-sm">
                      <IoMicOutline className="h-4 w-4 shrink-0" />
                      موضوع سخنرانی: «ادامه‌ی راه: درس از گذشته»
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                      تجربه‌زیسته یک دهه فعالیت فنی، درس‌های عبور از تغییرات
                      شتابان پارادایم‌های نرم‌افزاری و چگونگی انطباق با
                      واقعیت‌های هوش مصنوعی.
                    </p>
                  </div>
                </article>
              </div>
            </section>

            {/* Mid-Page Quick CTA Card */}
            <div className="fade mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center sm:p-6">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:text-right">
                <div>
                  <h3 className="text-base font-bold text-dark sm:text-lg">
                    دوست داری در این گفت‌وگوی ۵۰ نفره کنارمون باشی؟
                  </h3>
                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    دو سخنرانی، گروه تراپی و پذیرایی کامل در فضای کار اشتراکی
                    زاویه
                  </p>
                </div>
                <Link
                  href={EVAND_TICKET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary shrink-0 px-6 py-2.5 text-sm font-bold shadow-md"
                >
                  رزرو بلیت ایوند
                </Link>
              </div>
            </div>

            {/* Schedule Timeline */}
            <section
              className="fade mt-14 rounded-2xl border border-border bg-surface-solid p-6 md:p-8"
              aria-labelledby="schedule-heading"
            >
              <SectionHeading id="schedule-heading" as="h2" className="mb-6">
                برنامه زمانی جلسه
              </SectionHeading>
              <ConferenceTimeline events={scheduleEvents} />
            </section>

            {/* Venue Section */}
            <section
              className="fade mt-14 rounded-2xl border border-border bg-surface-solid p-6 md:p-8"
              aria-labelledby="venue-heading"
            >
              <SectionHeading id="venue-heading" as="h2">
                محل برگزاری
              </SectionHeading>
              <div className="mt-4">
                {/* Large Clickable Venue Photo with Lightbox */}
                <figure
                  onClick={() => lightbox.openLightbox(0)}
                  className="group relative mb-6 h-64 w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-dark shadow-lg shadow-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 sm:h-80 md:h-[420px]"
                >
                  <Image
                    src="/images/session-69/venue-zavie.jpg"
                    alt="فضای کار اشتراکی زاویه — محل برگزاری جلسه ۶۹ فرانت‌چپتر"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 950px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Zoom Chip Hover Indicator */}
                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomCarrotChip size="lg" />
                  </div>

                  <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-xl bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:text-sm">
                      محیط داخلی فضای کار اشتراکی زاویه (کارخانه نوآوری آزادی)
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      <IoExpandOutline className="h-4 w-4" />
                      مشاهده تصویر در اندازه بزرگ
                    </span>
                  </div>
                </figure>

                <h3 className="text-lg font-bold text-dark sm:text-xl">
                  فضای کار اشتراکی زاویه (Zavie CoWork)
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text sm:text-base">
                  زاویه در دل «کارخانه نوآوری آزادی» واقع شده است؛ بزرگ‌ترین و
                  مجهزترین فضای کار اشتراکی ایران با وسعتی نزدیک به ۱۰۰۰ متر
                  مربع (زیرمجموعه شرکت هم‌آوا). این فضا به دلیل داشتن محیطی
                  آرام، مدرن و امکانات پذیرایی و صوتی ایده‌آل، بستری بی‌نظیر
                  برای برگزاری جلسات تعاملی و گروه تراپی فراهم می‌آورد.
                </p>
                <p className="mt-3 text-xs text-muted sm:text-sm">
                  📍 آدرس: تهران، میدان آزادی، اتوبان شهید لشگری، کارخانه نوآوری
                  آزادی، فضای کار اشتراکی زاویه
                </p>

                {/* Neshan Map Embed */}
                <div className="mt-6 overflow-hidden rounded-xl border border-border shadow-sm">
                  <iframe
                    title="نقشه محل برگزاری — فضای کار اشتراکی زاویه"
                    src="https://neshan.org/maps/iframe/places/4e09fb9c5fe83b144bf619b64313d78f#c35.700-51.319-20z-0p/35.699950527535606/51.31910263372955"
                    width="100%"
                    height="380"
                    className="w-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="https://www.google.com/maps/search/?api=1&query=کارخانه+نوآوری+آزادی+فضای+کار+اشتراکی+زاویه"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex items-center gap-2 text-sm font-medium"
                  >
                    <IoMapOutline className="h-4 w-4" />
                    مسیریابی در نقشه گوگل
                  </Link>
                  <Link
                    href="https://neshan.org/maps/places/4e09fb9c5fe83b144bf619b64313d78f"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary inline-flex items-center gap-2 text-sm font-medium"
                  >
                    <IoLocationOutline className="h-4 w-4" />
                    مشاهده در نشان
                  </Link>
                </div>
              </div>
            </section>

            {/* Past Events & Community Atmosphere Gallery with Large Photos and Lightbox */}
            <section
              className="fade mt-14 rounded-2xl border border-border-secondary bg-theme-light p-6 md:p-8"
              aria-labelledby="gallery-heading"
            >
              <SectionHeading
                id="gallery-heading"
                as="h2"
                centered
                className="w-full mb-2"
              >
                اتمسفر و رویدادهای پیشین فرانت‌چپتر
              </SectionHeading>
              <p className="mx-auto mb-8 max-w-xl text-center text-xs text-muted sm:text-sm">
                گوشه‌هایی از گردهمایی‌ها، تولد کامیونیتی، کارگاه‌های تخصصی و
                فضای صمیمانه‌ای که در انتظار شماست (برای مشاهده بزرگ‌تر، روی هر
                تصویر کلیک کنید)
              </p>

              {/* 2-Column Spacious Large Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Photo 1: Birthday Gathering */}
                <figure
                  onClick={() => lightbox.openLightbox(1)}
                  className="group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-dark shadow-md shadow-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 sm:min-h-[300px] md:h-80"
                >
                  <Image
                    src="/images/session-69/event-birthday.jpg"
                    alt="جشن تولد ۳ سالگی و گردهمایی جامعه فرانت‌چپتر"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 500px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomCarrotChip size="md" />
                  </div>

                  <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                    <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:text-sm">
                      جشن ۳ سالگی و گردهمایی جامعه فرانت‌چپتر
                    </span>
                    <span className="rounded-full bg-primary/90 p-1.5 text-white">
                      <IoExpandOutline className="h-4 w-4" />
                    </span>
                  </figcaption>
                </figure>

                {/* Photo 2: Workshop & Discussions */}
                <figure
                  onClick={() => lightbox.openLightbox(2)}
                  className="group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-dark shadow-md shadow-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 sm:min-h-[300px] md:h-80"
                >
                  <Image
                    src="/images/session-69/event-workshop.jpg"
                    alt="کارگاه‌های تخصصی و جلسات هم‌اندیشی فرانت‌چپتر"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 500px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomCarrotChip size="md" />
                  </div>

                  <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                    <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:text-sm">
                      کارگاه‌های تخصصی و جلسات هم‌اندیشی
                    </span>
                    <span className="rounded-full bg-primary/90 p-1.5 text-white">
                      <IoExpandOutline className="h-4 w-4" />
                    </span>
                  </figcaption>
                </figure>

                {/* Photo 3: Reception Desk & Badge Packs */}
                <figure
                  onClick={() => lightbox.openLightbox(3)}
                  className="group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-dark shadow-md shadow-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 sm:min-h-[300px] md:h-80"
                >
                  <Image
                    src="/images/session-69/event-reception.jpg"
                    alt="میز پذیرش، کارت شرکت‌کنندگان و پک رویداد"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 500px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomCarrotChip size="md" />
                  </div>

                  <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                    <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:text-sm">
                      میز پذیرش، نشان اختصاصی و پک‌های یادبود
                    </span>
                    <span className="rounded-full bg-primary/90 p-1.5 text-white">
                      <IoExpandOutline className="h-4 w-4" />
                    </span>
                  </figcaption>
                </figure>

                {/* Photo 4: Community Meetup */}
                <figure
                  onClick={() => lightbox.openLightbox(4)}
                  className="group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-dark shadow-md shadow-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 sm:min-h-[300px] md:h-80"
                >
                  <Image
                    src="/images/session-69/event-meetup.jpg"
                    alt="دورهمی حضوری، گفتگو و شبکه‌سازی اعضای فرانت‌چپتر"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 500px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomCarrotChip size="md" />
                  </div>

                  <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                    <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:text-sm">
                      دورهمی حضوری، گفتگو و شبکه‌سازی
                    </span>
                    <span className="rounded-full bg-primary/90 p-1.5 text-white">
                      <IoExpandOutline className="h-4 w-4" />
                    </span>
                  </figcaption>
                </figure>
              </div>
            </section>

            {/* Premium Prominent Sponsor Showcase Section - Tailored for Frontend Devs & Web Designers */}
            <section
              className="fade relative mt-16 overflow-hidden rounded-3xl border border-[#28c1f5]/30 bg-gradient-to-br from-[#121c2a] via-[#1a2332] to-[#0b1017] p-6 shadow-2xl shadow-[#28c1f5]/15 sm:p-8 md:p-10"
              aria-labelledby="sponsor-heading"
            >
              {/* Glowing Background Ambience Orbs */}
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#28c1f5]/15 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#87fcc4]/10 blur-3xl"
                aria-hidden="true"
              />

              {/* Header Badge */}
              <div className="relative z-10 text-center md:text-right">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#28c1f5]/40 bg-[#28c1f5]/10 px-4 py-1.5 text-xs font-bold text-[#28c1f5] backdrop-blur-md shadow-sm">
                  <IoSparklesOutline className="h-4 w-4 text-[#87fcc4]" />
                  حامی رسمی جامعه فرانت‌اند و جلسه‌ی ۶۹ فرانت‌چپتر
                </span>
              </div>

              {/* Main Content Grid */}
              <div className="relative z-10 mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                {/* Brand Showcase & Info (7 Cols) */}
                <div className="text-center lg:col-span-7 lg:text-right">
                  <Link
                    href={withSponsorReferral('https://liara.ir')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-transform duration-300 hover:scale-105"
                    aria-label="وب‌سایت لیارا — سکوی ابری توسعه‌دهندگان"
                  >
                    <Image
                      src="/images/1402/sponsors/liara.svg"
                      alt="لوگوی رسمی لیارا — حامی فرانت‌چپتر"
                      width={180}
                      height={60}
                      className="h-12 w-auto object-contain drop-shadow-[0_0_24px_rgba(40,193,245,0.45)] sm:h-14"
                    />
                  </Link>

                  <h3
                    id="sponsor-heading"
                    className="mt-4 text-xl font-extrabold text-white sm:text-2xl"
                  >
                    لیارا؛ خانه ابری پروژه‌های فرانت‌اند و طراحان وب
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm md:text-base">
                    استقرار بی‌دغدغه‌ی برنامه‌های Next.js، React، Vue، Astro و
                    سایت‌های مدرن فقط با یک دستور. بدون درگیری با سرور و داکر؛
                    پروژه‌ها، پورتفولیو و صفحات لندینگ خودت رو با SSL رایگان،
                    شبکه CDN پرسرعت و پشتیبانی کامل از SSR و Server Actions روی
                    لیارا بالا بیار و تمام تمرکزت رو بذار روی کدنویسی تمیز و
                    طراحی رابط کاربری (UI/UX).
                  </p>

                  {/* Feature Tags for Frontend & Web Designers */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
                      ⚛️ استقرار یک‌کلیکه Next.js, React & Vue
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
                      ⚡ CDN داخلی پرسرعت + SSL خودکار
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
                      🔄 دیپلوی آنی با هر Push به گیت‌هاب
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
                      📦 راه‌اندازی سریع Headless CMS و دیتابیس
                    </span>
                  </div>
                </div>

                {/* Call to Action Box (5 Cols) */}
                <div className="lg:col-span-5">
                  <div className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/[0.04] p-6 text-center shadow-inner backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-200 sm:text-sm">
                      توسعه بدون دردسر سرور برای فرانت‌اند کارها
                    </span>

                    <Link
                      href={withSponsorReferral('https://liara.ir')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#28c1f5] to-[#87fcc4] px-6 py-3.5 text-center text-sm font-extrabold text-slate-950 shadow-lg shadow-[#28c1f5]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#28c1f5]/40 sm:text-base"
                    >
                      استقرار رایگان اولین پروژه در لیارا
                      <span aria-hidden="true">↗</span>
                    </Link>

                    <span className="mt-3 text-[11px] text-slate-400">
                      مناسب برای پورتفولیو، لندینگ پیج‌ها، Next.js و اپ‌های
                      تجاری
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* High-Converting Ticket Section with Price Anchoring & Urgency */}
            <section className="fade mt-14" aria-labelledby="tickets-heading">
              <SectionHeading
                id="tickets-heading"
                as="h2"
                centered
                className="w-full mb-6"
              >
                بلیت و ثبت‌نام در رویداد
              </SectionHeading>

              <div className="mx-auto max-w-xl">
                <article className="relative overflow-hidden rounded-2xl border-2 border-primary bg-surface-solid p-6 shadow-2xl shadow-primary/20 md:p-8">
                  {/* Top Badge Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                      <IoSparklesOutline className="h-4 w-4" />
                      ظرفیت محدود ۵۰ نفر
                    </span>
                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400">
                      ٪۶۷ تخفیف ویژه هویجی‌ها
                    </span>
                  </div>

                  {/* Title & Price Anchoring */}
                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-dark sm:text-2xl">
                      بلیت جلسه‌ی ۶۹: بقا (حضوری)
                    </h3>
                    <p className="mt-1 text-xs text-muted sm:text-sm">
                      شامل دسترسی کامل به دو سخنرانی، گروه تراپی و پذیرایی
                    </p>

                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="text-base text-muted line-through sm:text-lg">
                        ۱,۳۵۰,۰۰۰ تومان
                      </span>
                      <span className="text-3xl font-extrabold text-primary sm:text-4xl">
                        ۴۴۵,۰۰۰ تومان
                      </span>
                    </div>

                    {/* Urgency Progress / Indicator */}
                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-dark">
                        <span className="flex items-center gap-1 text-primary">
                          <IoFlame className="h-4 w-4" />
                          ظرفیت محدود به ۵۰ نفر
                        </span>
                        <span>{REGISTERED_SEATS} صندلی رزرو شده</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{
                            width: `${(REGISTERED_SEATS / TOTAL_CAPACITY) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm leading-relaxed text-text">
                    <li className="flex items-start gap-2.5">
                      <IoCheckmarkCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>حضور در سخنرانی تخصصی روانشناسی مهیار پویامهر</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <IoCheckmarkCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>حضور در سخنرانی فنی و تجربی صالح شجاعی</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <IoCheckmarkCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>مشارکت فعال در کارگاه گروه تراپی ۵۰ نفره</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <IoCheckmarkCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>دو نوبت پذیرایی اولیه و میان‌وعده کامل</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <IoCheckmarkCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>
                        شبکه‌سازی مستقیم با جامعه فرانت‌چپتر در فضای کار اشتراکی
                        زاویه
                      </span>
                    </li>
                  </ul>

                  {/* Giant CTA Button */}
                  <div className="mt-8">
                    <Link
                      href={EVAND_TICKET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary flex w-full items-center justify-center gap-2.5 text-center text-lg font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02]"
                    >
                      <IoTicketOutline className="h-6 w-6" />
                      ثبت‌نام و خرید بلیت در ایوند
                    </Link>
                  </div>

                  {/* Supportive Assistance Note */}
                  <div className="mt-5 rounded-lg bg-theme-light p-3 text-center text-xs leading-relaxed text-muted">
                    <p className="flex items-center justify-center gap-1 font-medium text-dark mb-1">
                      <IoHeartOutline className="h-4 w-4 text-primary" />
                      مسئولیت اجتماعی فرانت‌چپتر
                    </p>
                    اگه به این جلسه نیاز داری ولی استطاعت مالی پرداخت بلیت رو
                    نداری، برامون ایمیل بزن:{' '}
                    <a
                      href="mailto:frontchapter.ir@gmail.com"
                      className="font-bold text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      frontchapter.ir@gmail.com
                    </a>
                  </div>
                </article>
              </div>
            </section>

            {/* Organizing Team */}
            <section className="fade my-14 rounded-2xl border border-border-secondary bg-theme-light p-6 md:p-8">
              <TeamShowcase
                title="تیم برگزاری"
                members={teamMembers}
                titleAs="h2"
                titleId="session-team-heading"
                titleIcon="✯"
                centered
              />
            </section>

            {/* FAQ Section */}
            <section className="fade my-14" aria-labelledby="faq-heading">
              <SectionHeading
                id="faq-heading"
                as="h2"
                centered
                className="w-full mb-6"
              >
                سوالات متداول
              </SectionHeading>

              <div className="not-prose mt-6 space-y-2">
                {faqs.map(({ q, a }) => (
                  <Accordion key={q} title={q}>
                    <p className="text-sm leading-relaxed text-text">{a}</p>
                  </Accordion>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>

      {/* Fullscreen Lightbox Modal for All 5 Images */}
      <ImageLightbox
        images={galleryImages}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.closeLightbox}
        onPrevious={lightbox.goToPrevious}
        onNext={lightbox.goToNext}
        onGoToImage={lightbox.goToImage}
      />

      {/* Standard Community CTA */}
      <Cta />
    </>
  );
};

export default Session69Single;
