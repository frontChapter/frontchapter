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
} from 'react-icons/io5';
import Banner from './components/Banner';
import Cta from './components/Cta';

const EXTERNAL_URL = 'https://mist.frontchapter.ir/';

const DarMiyanEMehSingle: React.FC = () => {
  return (
    <>
      <article className="section pt-0" aria-label="رویداد حضوری در میان مِه">
        <Banner
          title="رویداد حضوری در میان مِه"
          parent={{ label: 'رویدادهای حضوری', href: '/conferences/' }}
        />

        <div className="container">
          <div className="mx-auto max-w-5xl">
            {/* Quick Meta Badge Row */}
            <div className="fade flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-4 py-1.5 font-medium text-dark">
                <IoCalendarOutline className="text-primary text-base" />
                پنجشنبه، ۲ مهر ۱۴۰۵
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-4 py-1.5 font-medium text-dark">
                <IoTimeOutline className="text-primary text-base" />
                ساعت ۱۵:۰۰ الی ۱۹:۳۰
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-solid px-4 py-1.5 font-medium text-dark">
                <IoLocationOutline className="text-primary text-base" />
                تهران • کارخانه نوآوری آزادی (زاویه)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 font-medium text-amber-700 dark:text-amber-300">
                <IoPeopleOutline className="text-base" />
                ظرفیت محدود • ۵۰ نفر
              </span>
            </div>

            {/* Poster Card */}
            <div className="fade mt-8 overflow-hidden rounded-3xl border border-border bg-surface-solid shadow-xl transition-all">
              <div className="relative aspect-square w-full max-w-2xl mx-auto overflow-hidden bg-surface-muted">
                <Image
                  src="/images/events/dar-miyan-e-meh-banner.jpg"
                  alt="پوستر رویداد حضوری در میان مه — فرانت‌چپتر"
                  fill
                  sizes="(max-width: 1024px) 100vw, 768px"
                  priority
                  className="object-cover"
                />
              </div>

              {/* Direct External Link Highlight Box */}
              <div className="border-t border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                  <div className="text-center sm:text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                      <IoSparklesOutline />
                      وب‌سایت اختصاصی رویداد
                    </span>
                    <h2 className="mt-2 text-xl font-bold text-dark sm:text-2xl">
                      مشاهده جزئیات کامل و رزرو صندلی
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      اطلاعات تکمیلی، خرید بلیت و ثبت‌نام در وب‌سایت رسمی رویداد
                      در دسترس است.
                    </p>
                  </div>

                  <a
                    href={EXTERNAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-primary px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/35"
                  >
                    <span>ورود به سایت در میان مِه</span>
                    <IoOpenOutline className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quote / Manifest */}
            <div className="fade mt-14 rounded-2xl border border-border bg-surface-solid p-8 text-center sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                بیانیه و مأموریت رویداد
              </p>
              <blockquote className="mt-4 text-lg font-medium leading-relaxed text-dark sm:text-2xl">
                «هیچ‌کس دوبار در یک رودخانه قدم نمی‌گذارد؛ چون هم رودخانه دیگر
                همان رودخانه نیست، هم او دیگر همان آدم نیست.»
              </blockquote>
              <cite className="mt-2 block text-xs text-muted">
                — هراکلیتوس / درنگ در معنای دگرگونی و آغاز راه
              </cite>
              <div className="mx-auto my-6 h-px w-24 bg-border" />
              <p className="mx-auto max-w-2xl text-sm leading-loose text-muted sm:text-base">
                دیدن راه، ممکن نیست؛ فقط مه است و ما، در میان آن. توان قدم
                برداشتن در دورانی که به نظر می‌رسد هیچ چیزی پیش رو نیست. «در
                میان مِه» رویدادی تعاملی برای طراحان، برنامه‌نویسان و متخصصان وب
                و محصول است تا در فضایی مشترک، عدم‌قطعیت و موج هوش مصنوعی را به
                گفتگو و هم‌اندیشی بگذارند.
              </p>
            </div>

            {/* Three Pillars */}
            <div className="fade mt-14">
              <h3 className="text-center text-h4 text-dark sm:text-right">
                سه بخش کلیدی برنامه
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-surface-solid p-6 transition-all hover:border-primary/50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                    ۱
                  </span>
                  <h4 className="mt-4 text-base font-bold text-dark">
                    ورود و آغاز مسیر
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    پذیرش شرکت‌کنندگان، پذیرایی و معرفی چارچوب تعاملی روز پیش از
                    شروع کارگاه گروهی.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-solid p-6 transition-all hover:border-primary/50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                    ۲
                  </span>
                  <h4 className="mt-4 text-base font-bold text-dark">
                    نشست تخصصی «از مِه تا وضوح»
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    کارگاه تعاملی و مواجهه با بحران و بلاتکلیفی در گروه‌های کوچک
                    با هدایت دکتر مهیار پویامهر.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-solid p-6 transition-all hover:border-primary/50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                    ۳
                  </span>
                  <h4 className="mt-4 text-base font-bold text-dark">
                    پنل تخصصی و پارادایم‌شیفت‌ها
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    گفت‌وگوی صریح یاسین همتی، امیر کریمی و پویا صبرآموز پیرامون
                    واقعیت‌های بازار کار و چشم‌انداز آینده.
                  </p>
                </div>
              </div>
            </div>

            {/* Presenters & Guests */}
            <div className="fade mt-14">
              <h3 className="text-center text-h4 text-dark sm:text-right">
                سخنرانان و ارائه‌دهندگان
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center rounded-2xl border border-border bg-surface-solid p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    م.پ
                  </div>
                  <h4 className="mt-3 text-base font-bold text-dark">
                    دکتر مهیار پویامهر
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    روان‌شناس بالینی و مدرس دانشگاه
                  </p>
                  <span className="mt-3 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] text-muted">
                    هدایت‌گر کارگاه تعاملی
                  </span>
                </div>

                <div className="flex flex-col items-center rounded-2xl border border-border bg-surface-solid p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    ی.ه
                  </div>
                  <h4 className="mt-3 text-base font-bold text-dark">
                    یاسین همتی
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    رئیس هیئت‌مدیره تأمین آلیاژ کارا صنعت
                  </p>
                  <span className="mt-3 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] text-muted">
                    عضو پنل تخصصی
                  </span>
                </div>

                <div className="flex flex-col items-center rounded-2xl border border-border bg-surface-solid p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    ا.ک
                  </div>
                  <h4 className="mt-3 text-base font-bold text-dark">
                    امیر کریمی
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    مهندس ارشد نرم‌افزار و مدیر فناوری InteliCraft
                  </p>
                  <span className="mt-3 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] text-muted">
                    عضو پنل تخصصی
                  </span>
                </div>

                <div className="flex flex-col items-center rounded-2xl border border-border bg-surface-solid p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    پ.ص
                  </div>
                  <h4 className="mt-3 text-base font-bold text-dark">
                    پویا صبرآموز
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    مدیرعامل (CEO) و مدیر فناوری سابق
                  </p>
                  <span className="mt-3 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] text-muted">
                    عضو پنل تخصصی
                  </span>
                </div>
              </div>
            </div>

            {/* Agenda Timeline Summary */}
            <div className="fade mt-14">
              <h3 className="text-center text-h4 text-dark sm:text-right">
                زمان‌بندی و کنداکتور برنامه
              </h3>
              <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface-solid">
                {[
                  {
                    time: '۱۵:۰۰ الی ۱۵:۱۵',
                    title: 'خوش اومدی',
                    desc: 'پذیرش، صرف چای و احوال‌پرسی اولیه',
                    type: 'پذیرش',
                  },
                  {
                    time: '۱۵:۱۵ الی ۱۵:۳۰',
                    title: 'شروع ماجرا',
                    desc: 'معرفی هدف و داستان شکل‌گیری رویداد',
                    type: 'افتتاحیه',
                  },
                  {
                    time: '۱۵:۳۰ الی ۱۵:۴۵',
                    title: 'نگاهی به بحران هوش مصنوعی',
                    desc: 'دیدگاهی از اثرات AI بر بازار کار با کارخانه هوش مصنوعی ایران',
                    type: 'سخنرانی',
                  },
                  {
                    time: '۱۵:۴۵ الی ۱۷:۱۵',
                    title: 'نشست تخصصی «از مِه تا وضوح»',
                    desc: 'نود دقیقه تعاملی و گفت‌وگوی روانشناختی با دکتر مهیار پویامهر',
                    type: 'کارگاه تعاملی',
                  },
                  {
                    time: '۱۷:۱۵ الی ۱۷:۳۵',
                    title: 'یه نفس تازه',
                    desc: 'پذیرایی، استراحت و شبکه‌سازی میان شرکت‌کنندگان',
                    type: 'استراحت',
                  },
                  {
                    time: '۱۷:۳۵ الی ۱۷:۵۰',
                    title: 'وقتی حمایت به محصول تبدیل می‌شه',
                    desc: 'داستان محصول عام‌المنفعه CodeMeet با حمایت لیارا',
                    type: 'معرفی حامی',
                  },
                  {
                    time: '۱۷:۵۰ الی ۱۹:۱۵',
                    title: 'حرف‌های رودررو',
                    desc: 'پنل گفت‌وگوی صریح و پرسش‌وپاسخ با حضور یاسین همتی، امیر کریمی و پویا صبرآموز',
                    type: 'پنل تخصصی',
                  },
                  {
                    time: '۱۹:۱۵ الی ۱۹:۳۰',
                    title: 'جمع‌بندی و خداحافظی',
                    desc: 'مرور دستاوردها و عکس یادگاری پایانی',
                    type: 'اختتامیه',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
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
                      <time className="font-mono text-xs font-medium text-primary">
                        {item.time}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsors & Location */}
            <div className="fade mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface-solid p-6">
                <div className="flex items-center gap-2 text-primary">
                  <IoRibbonOutline className="text-xl" />
                  <h4 className="text-base font-bold text-dark">
                    حامیان رویداد
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  این رویداد با حمایت مستقیم پلتفرم ابری لیارا و کارخانه هوش
                  مصنوعی ایران برگزار می‌شود.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm font-semibold text-dark">
                    لیارا (Liara)
                  </span>
                  <span className="rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm font-semibold text-dark">
                    کارخانه هوش مصنوعی ایران
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface-solid p-6">
                <div className="flex items-center gap-2 text-primary">
                  <IoLocationOutline className="text-xl" />
                  <h4 className="text-base font-bold text-dark">محل برگزاری</h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  تهران، میدان آزادی، ابتدای اتوبان شهید لشگری، کارخانه نوآوری
                  آزادی، فضای کار اشتراکی زاویه (روبه‌روی ایستگاه مترو بیمه).
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <IoShieldCheckmarkOutline className="text-base text-emerald-500" />
                  <span>دسترسی آسان با مترو و وسایل حمل‌ونقل عمومی</span>
                </div>
              </div>
            </div>

            {/* Bottom Primary Action Card */}
            <div className="fade mt-14 rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-primary/5 p-8 text-center sm:p-12">
              <h3 className="text-2xl font-bold text-dark sm:text-3xl">
                آماده‌اید در میان مِه با هم مسیر را پیدا کنیم؟
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
                ظرفیت این گردهمایی تنها ۵۰ نفر در نظر گرفته شده تا امکان
                گفت‌وگوی واقعی و کارگاه گروهی مؤثر فراهم باشد.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={EXTERNAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40"
                >
                  <span>ورود به وب‌سایت رویداد و ثبت‌نام</span>
                  <IoOpenOutline className="text-xl" />
                </a>
                <Link
                  href="/conferences/"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-solid px-6 py-3.5 text-sm font-medium text-dark transition-all hover:bg-surface-muted"
                >
                  بازگشت به لیست رویدادهای حضوری
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
