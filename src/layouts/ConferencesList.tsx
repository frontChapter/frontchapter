'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoOpenOutline,
  IoArrowBackOutline,
  IoTimeOutline,
  IoImagesOutline,
  IoSparklesOutline,
} from 'react-icons/io5';
import Banner from './components/Banner';
import Cta from './components/Cta';

interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  isUpcoming: boolean;
  category: 'upcoming' | 'conference' | 'meetup';
  categoryLabel: string;
  href: string;
  isExternal?: boolean;
  secondaryHref?: string;
  ctaText?: string;
}

const GOOGLE_PHOTOS_URL = 'https://photos.app.goo.gl/oZY9Y2vzwqm4cPpY8';

const EVENTS_DATA: EventItem[] = [
  {
    id: 'dar-miyan-e-meh',
    title: 'در میان مِه',
    subtitle: 'یافتن مسیر در روزهای پر از ابهام',
    image: '/images/events/dar-miyan-e-meh-banner.jpg',
    date: 'پنجشنبه، ۲ مهر ۱۴۰۵',
    time: '۱۵:۰۰ الی ۱۹:۳۰',
    location: 'تهران • کارخانه نوآوری آزادی (زاویه)',
    description:
      'کارگاه تعاملی گروهی و نشست تخصصی روانشناختی با دکتر مهیار پویامهر، همراه با پنل گفت‌وگوی صریح یاسین همتی، امیر کریمی و پویا صبرآموز درباره پارادایم‌های تازه‌ی بازار کار در دوران هوش مصنوعی.',
    isUpcoming: true,
    category: 'upcoming',
    categoryLabel: 'رویداد پیش‌رو',
    href: 'https://mist.frontchapter.ir/',
    isExternal: true,
    secondaryHref: '/events/dar-miyan-e-meh/',
    ctaText: 'ورود به سایت رویداد',
  },
  {
    id: 'conf-1404',
    title: 'همایش سالانه ۱۴۰۴',
    subtitle: 'بزرگ‌ترین گردهمایی فرانت‌اند کشور در شیراز',
    image: '/images/1403/conf01.jpg',
    date: 'اسفند ۱۴۰۳',
    location: 'شیراز • تالار احسان / سینما فرهنگ',
    description:
      'چهارمین همایش بزرگ سالانه فرانت‌چپتر؛ با حضور بیش از ۵۰۰ توسعه‌دهنده، ارائه‌های تخصصی فنی، کارگاه‌ها، پنل استخدام و سفر گروهی به شیراز.',
    isUpcoming: false,
    category: 'conference',
    categoryLabel: 'همایش سالانه',
    href: '/conferences/1403/',
    isExternal: false,
    ctaText: 'مشاهده گزارش و تصاویر',
  },
  {
    id: 'programmer-day-2024',
    title: 'دورهمی روز برنامه‌نویس',
    subtitle: 'اپیزودهای ویژه هویج‌کست با مجتبی افراز و آرمان علی‌قنبری',
    image: '/images/1403/speakers/mojtaba_afraz.jpg',
    date: 'مهر ۱۴۰۳ • اکتبر ۲۰۲۴',
    location: 'تهران • فضای کار اشتراکی',
    description:
      'دورهمی روز برنامه‌نویس و ضبط اپیزودهای ویژه هویج‌کست؛ گفت‌وگو با مجتبی افراز درباره تغییر مسیر شغلی به سمت مهندسی نرم‌افزار و آرمان علی‌قنبری درباره چالش‌های صنعت نرم‌افزار.',
    isUpcoming: false,
    category: 'meetup',
    categoryLabel: 'دورهمی و پادکست',
    href: 'https://www.youtube.com/@frontchapter/',
    isExternal: true,
    ctaText: 'مشاهده در یوتیوب',
  },
  {
    id: 'havij-times-1year',
    title: 'جشن یک‌سالگی هویج تایمز',
    subtitle: 'گردهمایی صمیمانه خانواده هویج تایمز',
    image: '/images/session-69/event-reception.jpg',
    date: 'شهریور ۱۴۰۳',
    location: 'تهران',
    description:
      'دورهمی و جشن یک‌سالگی خبرنامه و نشریه هویج تایمز؛ با حضور اعضای فعال جامعه، مرور خاطرات، کیک تولد و شبکه‌سازی دوستانه میان برنامه‌نویسان.',
    isUpcoming: false,
    category: 'meetup',
    categoryLabel: 'جشن هویج تایمز',
    href: 'https://www.instagram.com/p/C_DIqwJCHzQ/?img_index=8',
    isExternal: true,
    ctaText: 'مشاهده در اینستاگرام',
  },
  {
    id: 'birthday-3years',
    title: 'جشن تولد ۳ سالگی فرانت‌چپتر',
    subtitle: 'گردهمایی بزرگ جامعه و جلسه ۶۹ حضوری',
    image: '/images/session-69/event-birthday.jpg',
    date: 'شهریور ۱۴۰۳',
    time: '۱۶:۰۰ الی ۱۹:۳۰',
    location: 'تهران • فضای کار اشتراکی زاویه',
    description:
      'جشن تولد ۳ سالگی خانواده فرانت‌چپتر هم‌زمان با جلسه ۶۹ حضوری با موضوع «بقا: هوش‌مصنوعی و آینده»، کارگاه روانشناسی بحران با دکتر مهیار پویامهر و شبکه‌سازی صمیمانه.',
    isUpcoming: false,
    category: 'meetup',
    categoryLabel: 'جشن ۳ سالگی',
    href: 'https://t.me/FrontChapter/302',
    isExternal: true,
    secondaryHref: '/events/session-69-ai-and-future/',
    ctaText: 'گزارش در تلگرام',
  },
  {
    id: 'reunion-meetup',
    title: 'دورهمی تجدید دیدار',
    subtitle: 'دیدار دوباره یاران فرانت‌چپتر در فضای زاویه',
    image: '/images/session-69/venue-zavie.jpg',
    date: 'تابستان ۱۴۰۳',
    location: 'تهران • کارخانه نوآوری آزادی (زاویه)',
    description:
      'دورهمی صمیمی تجدید دیدار اعضای جامعه فرانت‌چپتر؛ گفت‌وگوهای دورهمی، شبکه‌سازی و مرور خاطرات خوش رویدادهای گذشته در فضایی گرم و پرانرژی.',
    isUpcoming: false,
    category: 'meetup',
    categoryLabel: 'دورهمی حضوری',
    href: GOOGLE_PHOTOS_URL,
    isExternal: true,
    ctaText: 'مشاهده آلبوم تصاویر',
  },
  {
    id: 'conf-1402',
    title: 'همایش سالانه ۱۴۰۲',
    subtitle: 'گردهمایی متخصصان فرانت‌اند در تهران',
    image: '/images/1402/01.webp',
    date: 'اسفند ۱۴۰۲',
    location: 'تهران • مرکز همایش‌ها',
    description:
      'سومین همایش سالانه فرانت‌چپتر؛ بررسی ترندهای روز وب، معماری‌های فرانت‌اند و دورهمی صمیمی شب قبل با حضور شرکت‌کنندگان سراسر کشور.',
    isUpcoming: false,
    category: 'conference',
    categoryLabel: 'همایش سالانه',
    href: '/conferences/1402/',
    isExternal: false,
    ctaText: 'مشاهده گزارش و تصاویر',
  },
  {
    id: 'conf-1400',
    title: 'اولین همایش فرانت‌اند کشور',
    subtitle: 'نخستین رویداد جامعه در بابلسر',
    image: '/images/1400/01.webp',
    date: 'اسفند ۱۴۰۰',
    location: 'مازندران • بابلسر، هتل میزبان',
    description:
      'ترکیب خاطره‌انگیز سفر، آموزش و شبکه‌سازی؛ آغازگر گردهمایی‌های حضوری جامعه فرانت‌چپتر در ساحل مازندران.',
    isUpcoming: false,
    category: 'conference',
    categoryLabel: 'همایش سالانه',
    href: '/conferences/1400/',
    isExternal: false,
    ctaText: 'مشاهده گزارش و تصاویر',
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'همه رویدادها' },
  { key: 'upcoming', label: 'رویداد پیش‌رو' },
  { key: 'conference', label: 'همایش‌های سالانه' },
  { key: 'meetup', label: 'دورهمی‌ها و جشن‌ها' },
] as const;

const ConferencesList = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredEvents = EVENTS_DATA.filter((event) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return event.isUpcoming;
    return event.category === activeTab;
  });

  return (
    <>
      <section className="section pt-0">
        <Banner title="رویدادهای حضوری فرانت‌چپتر" />

        <div className="container">
          <p className="fade mx-auto max-w-2xl text-center text-muted">
            مرور همایش‌های سالانه، کارگاه‌های تخصصی و دورهمی‌های صمیمانه جامعه
            فرانت‌چپتر از ۱۴۰۰ تا امروز.
          </p>

          {/* Filter Tabs */}
          <div className="fade mt-10 flex flex-wrap items-center justify-center gap-2">
            {FILTER_TABS.map((tab) => {
              const count =
                tab.key === 'all'
                  ? EVENTS_DATA.length
                  : tab.key === 'upcoming'
                    ? EVENTS_DATA.filter((e) => e.isUpcoming).length
                    : EVENTS_DATA.filter((e) => e.category === tab.key).length;

              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'border border-border bg-surface-solid text-muted hover:border-primary/40 hover:text-dark'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-muted text-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Unified Event Grid (All Square Banners) */}
          <div className="fade mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface-solid shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* 1:1 Square Banner Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-surface-muted">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={event.isUpcoming}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient shadow for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3.5 right-3.5 flex flex-wrap gap-2 z-10">
                    {event.isUpcoming ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                        ثبت‌نام فعال
                      </span>
                    ) : (
                      <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                        برگزار شده
                      </span>
                    )}
                  </div>

                  {/* Bottom Corner Tag */}
                  <div className="absolute bottom-3.5 right-3.5 z-10">
                    <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                      {event.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Meta Row: Date & Time */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <IoCalendarOutline className="text-primary text-sm shrink-0" />
                        {event.date}
                      </span>
                      {event.time && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                          <IoTimeOutline className="text-primary text-sm shrink-0" />
                          {event.time}
                        </span>
                      )}
                    </div>

                    {/* Meta Row: Location */}
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted">
                      <IoLocationOutline className="text-primary text-sm shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="mt-3.5 text-xl font-bold text-dark transition-colors group-hover:text-primary">
                      {event.title}
                    </h3>
                    {event.subtitle && (
                      <p className="mt-0.5 text-xs font-semibold text-primary/90">
                        {event.subtitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-muted">
                      {event.description}
                    </p>
                  </div>

                  {/* Actions / CTA Footer */}
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                    {event.isExternal ? (
                      <a
                        href={event.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
                      >
                        <span>{event.ctaText ?? 'ورود به سایت رویداد'}</span>
                        <IoOpenOutline className="text-sm" />
                      </a>
                    ) : (
                      <Link
                        href={event.href}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-surface-muted px-4 py-2 text-xs font-bold text-dark transition-all hover:bg-primary hover:text-white"
                      >
                        <span>{event.ctaText ?? 'مشاهده جزئیات'}</span>
                        <IoArrowBackOutline className="text-sm" />
                      </Link>
                    )}

                    {event.secondaryHref && (
                      <Link
                        href={event.secondaryHref}
                        className="text-xs text-muted transition-colors hover:text-primary underline underline-offset-4"
                      >
                        صفحه رویداد
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Community Photos Album Banner */}
          <div className="fade mt-16 rounded-3xl border border-border bg-gradient-to-r from-primary/10 via-surface-solid to-primary/5 p-8 sm:p-10 shadow-lg">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-4 text-center md:text-right">
                <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary text-3xl">
                  <IoImagesOutline />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    <IoSparklesOutline />
                    آلبوم اشتراکی جامعه فرانت‌چپتر
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-dark sm:text-2xl">
                    تمام خاطرات و عکس‌های فرانت‌چپتر در گوگل فوتوز
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-muted leading-relaxed">
                    مجموعه کامل تصاویر همایش‌ها، دورهمی‌های حضوری، کارگاه‌ها و
                    پشت‌صحنه‌های اعضای جامعه از سال ۱۴۰۰ تا امروز.
                  </p>
                </div>
              </div>

              <a
                href={GOOGLE_PHOTOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-dark px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary hover:shadow-lg"
              >
                <span>مشاهده آلبوم کامل عکس‌ها</span>
                <IoOpenOutline className="text-lg" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
};

export default ConferencesList;
