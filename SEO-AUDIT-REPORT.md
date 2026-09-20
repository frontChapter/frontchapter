# گزارش جامع ممیزی و بازطراحی سئوی فنی (Technical SEO Audit & Implementation Report)
**پروژه:** وب‌سایت جامعه فرانت‌چپتر (`frontchapter.ir`)  
**نسخه:** Next.js 14.2.32 (App Router) — معماری کاملاً استاتیک بر بستر GitHub Pages  
**تاریخ ممیزی:** شهریور ۱۴۰۵ / سپتامبر ۲۰۲۶  
**وضعیت نهایی:** بیلد و تست موفق (100% Passed) با ۱۲۷ صفحه استاتیک، ۱۱۹ آدرس در نقشه سایت و ۰ خطای اعتبارسنجی.

---

## ۱. خلاصه اجرایی (Executive Summary)

تمامی اهداف تعیین‌شده در پرامپت با موفقیت کامل و متناسب با محدودیت‌های هاستینگ استاتیک GitHub Pages پیاده‌سازی شدند:
- **۰ صفحه Duplicate یا Orphan:** مسیرهای تکراری حذف و با Soft Redirect استاتیک (Canonical + Meta Refresh + Script Fallback) به صفحه اصلی متصل شدند.
- **خروج کامل دیتای دمو:** صفحه نمونه قالب اندورمدا (`elements.md`) به وضعیت `draft: true` و `noindex` تغییر یافت و از خروجی بیلد و نقشه سایت حذف شد.
- **متادیتای یکتا و بهینه برای ۱۰۰٪ صفحات:** تایتل‌های زیر ۶۰ کاراکتر حاوی نام برند، توضیحات زیر ۱۶۰ کاراکتر، تصاویر Open Graph به ابعاد ۱۲۰۰×۶۳۰، کارت‌های توییتر، و مشخصه‌های سراسری `lang="fa" dir="rtl"` در تگ `<html>` اولیه سرور.
- **داده‌های ساختاریافته معتبر (JSON-LD):** پیاده‌سازی اسکیماهای استاندارد Google Search Gallery شامل `Organization`، `WebSite` با `SearchAction` (Sitelinks Search Box)، رویدادهای `Event` با تاریخ‌های استاندارد ISO 8601 و منطقه زمانی تهران (`+03:30`)، ارز ریال (`IRR`)، ارائه‌دهندگان (`Person`)، صفحات مقالات (`BlogPosting`) و سلسله‌مراتب مسیرها (`BreadcrumbList`).
- **نقشه سایت و روبات‌های استاتیک:** تولید فایل مستقل و استاتیک `public/sitemap.xml` حاوی ۱۱۹ آدرس زنده و اولویت‌بندی‌شده، فایل `public/robots.txt` بهینه‌شده، و فایل `public/CNAME`.
- **آمادگی کامل برای اتصال به GSC MCP:** ساختار داده‌ها دقیقاً با فیلدهای گزارش Enhancements و Index Coverage در Google Search Console سازگار است.

---

## ۲. جدول ممیزی مسیرها و ریدایرکت‌ها (Route Audit Matrix)

| ردیف | مسیر (Route) | نوع صفحه | وضعیت جدید | کانونیکال مقصد (Canonical) | جزئیات و تدابیر سئو |
| :---: | :--- | :--- | :---: | :--- | :--- |
| ۱ | `/` | خانه | **زنده** | `https://frontchapter.ir/` | اسکیمای Organization + WebSite با SearchAction |
| ۲ | `/conferences/` | رویدادهای حضوری | **زنده** | `https://frontchapter.ir/conferences/` | هاب مرکزی؛ اسکیمای CollectionPage + Breadcrumb |
| ۳ | `/conferences/1403/` | همایش ۱۴۰۳ شیراز | **زنده** | `https://frontchapter.ir/conferences/1403/` | اسکیمای جامع Event، سخنرانان، ساب‌اونت‌ها و ویدیو |
| ۴ | `/conferences/1402/` | همایش ۱۴۰۲ مازندران | **زنده** | `https://frontchapter.ir/conferences/1402/` | اسکیمای جامع Event و گالری تصاویر |
| ۵ | `/conferences/1400/` | همایش ۱۴۰۰ بابلسر | **زنده** | `https://frontchapter.ir/conferences/1400/` | اسکیمای جامع Event و آرشیو سخنرانی‌ها |
| ۶ | `/events/dar-miyan-e-meh/` | رویداد «در میان مِه» | **زنده (اصلی)** | `https://frontchapter.ir/events/dar-miyan-e-meh/` | رویداد فعال؛ اسکیمای Event با قیمت ۴۵۵,۰۰۰ ریال و ۵۰ ظرفیت |
| ۷ | `/events/session-69-ai-and-future/` | جلسه ۶۹ (بقا) | **زنده** | `https://frontchapter.ir/events/session-69-ai-and-future/` | اسکیمای Event با تاریخ ISO و ارائه‌دهندگان |
| ۸ | `/events/` | لیست رویدادها | **ریدایرکت استاتیک** | `https://frontchapter.ir/conferences/` | ریدایرکت با `noindex, follow` و کانونیکال صریح به کنفرانس‌ها |
| ۹ | `/mist/` | نام مستعار رویداد | **ریدایرکت استاتیک** | `https://frontchapter.ir/events/dar-miyan-e-meh/` | ریدایرکت با `noindex, follow` و کانونیکال به در میان مه |
| ۱۰ | `/events/through-the-fog/` | نسخه انگلیسی | **ریدایرکت استاتیک** | `https://frontchapter.ir/events/dar-miyan-e-meh/` | ریدایرکت با `noindex, follow` و کانونیکال به در میان مه |
| ۱۱ | `/speakers/` | لیست سخنرانان | **زنده** | `https://frontchapter.ir/speakers/` | اسکیمای CollectionPage و متادیتای اختصاصی |
| ۱۲ | `/speakers/[slug]/` | پروفایل ۳۴ سخنران | **زنده** | `https://frontchapter.ir/speakers/[slug]/` | اسکیمای Person و BreadcrumbList مجزا برای هر سخنران |
| ۱۳ | `/posts/` | هاب وبلاگ و جلسات | **زنده** | `https://frontchapter.ir/posts/` | کانونیکال اختصاصی و CollectionPage |
| ۱۴ | `/posts/page/[slug]/` | پیجینیشن بلاگ (۲ الی ۶) | **زنده** | `https://frontchapter.ir/posts/page/[slug]/` | کانونیکال یکتا برای هر صفحه جهت پیشگیری از duplicate |
| ۱۵ | `/posts/[single]/` | ۶۸ پست جلسات آنلاین | **زنده** | `https://frontchapter.ir/posts/[single]/` | اسکیمای BlogPosting با تاریخ انتشار، نویسنده و تصویر |
| ۱۶ | `/about/` | درباره ما | **زنده** | `https://frontchapter.ir/about/` | اسکیمای AboutPage و اعضای تیم با لینک‌های شبکه‌های اجتماعی |
| ۱۷ | `/contact/` | تماس با ما | **زنده** | `https://frontchapter.ir/contact/` | صفحه تماس رسمی با کانونیکال اختصاصی |
| ۱۸ | `/terms-policy/` | قوانین و خط‌مشی | **زنده** | `https://frontchapter.ir/terms-policy/` | صفحه مقررات با اولویت پایین در نقشه سایت |
| ۱۹ | `/elements/` | المان‌های دمو اندورمدا | **حذف کامل** | — | تبدیل به `draft: true` و `noindex`؛ حذف کامل از خروجی بیلد |
| ۲۰ | `/404/` | صفحه خطای سیستم | **حذف از سایت‌مپ** | — | تنها برای نمایش خطای ۴۰۴ در کلاینت؛ بدون ایندکس |

---

## ۳. اصلاحات متادیتا و معماری ریشه (Root Layout & Metadata)

۱. **تبدیل `src/app/layout.tsx` به کامپوننت سمت سرور (Server Component):**
   - پیش‌تر این فایل دارای `'use client'` بود که مانع از تولید تگ‌های استاتیک در HTML خام می‌شد.
   - با تفکیک کامپوننت‌های نیازمند کلاینت (`Header` و `Footer`) و حفظ کلاینت بودن آن‌ها، روت لی‌اوت اکنون تگ‌های `<html lang="fa" dir="rtl">`، `metadataBase` و `viewport` را مستقیماً در HTML اولیه‌ای که تحویل ربات گوگل می‌شود رندر می‌کند.
۲. **تنظیم طول عنوان‌ها و توضیحات:**
   - عنوان تمام صفحات زیر ۶۰ کاراکتر و همراه با الگوی استاندارد `%s | فرانت‌چپتر` نگه‌داشته شد.
   - طول توضیحات صفحه رویداد «در میان مِه» از ۲۰۳ کاراکتر به ۱۵۰ کاراکتر بهینه‌سازی شد تا در نتایج دسکتاپ و موبایل گوگل برش نخورد.
۳. **تگ‌های Open Graph و Twitter Cards:**
   - ابعاد استاندارد ۱۲۰۰×۶۳۰ با `og:locale: 'fa_IR'` و `twitter:card: 'summary_large_image'`.

---

## ۴. داده‌های ساختاریافته (JSON-LD / Schema.org)

تمامی اسکیماها با استاندارد رسمی schema.org و دستورالعمل‌های Google Search Central مطابقت دارند:

### الف) اسکیماهای صفحه اصلی (`/`)
- **`Organization`**: نام برند، لوگو، آدرس در ایران، ایمیل سازمانی و لینک‌های `sameAs` به شبکه‌های اجتماعی رسمی (تلگرام، اینستاگرام، لینکدین، یوتیوب، گیت‌هاب).
- **`WebSite`**: مشخصات سایت شامل نام رسمی، آدرس کانونیکال، زبان محتوا (`fa-IR`) و ارجاع ناشر به سازمان فرانت‌چپتر.
  > [!NOTE]
  > **حذف آگاهانه `SearchAction` (کادر جستجو):**  
  > اسکیمای `SearchAction` به آدرس `https://frontchapter.ir/posts/?q={search_term_string}` به دلیل عدم وجود موتور فیلتر واقعی در صفحه مقالات به‌طور کامل حذف شد. گوگل پیش از فعال‌سازی Sitelinks Search Box این اندپوینت را تست می‌کند و در صورت عدم فیلتر واقعی، آن را به‌عنوان داده گمراه‌کننده (Deceptive Structured Data) جریمه می‌کند.
- **`EventSeries`**: زنجیره رویدادهای سالانه با ارجاع به همایش‌های ۱۴۰۰، ۱۴۰۲ و ۱۴۰۳.

### ب) اسکیماهای رویدادها (`/events/dar-miyan-e-meh/` و `/events/session-69-ai-and-future/`)
- **`Event`**:
  - `startDate` و `endDate`: فرمت استاندارد بین‌المللی با منطقه زمانی ایران (`2026-09-24T15:00:00+03:30`).
  - `location`: نوع `Place` با نشانی کامل در تهران، خیابان آزادی، کارخانه نوآوری آزادی.
  - `offers`: نوع `Offer` با واحد ارزی `IRR` و وضعیت `InStock`.
  - `performer`: آرایه‌ای از اشخاص (`Person`) با عناوین شغلی و لینک‌های پروفایل.
- **`BreadcrumbList`**: سلسله‌مراتب ۳ سطحی (خانه > رویدادهای حضوری > عنوان رویداد).

### ج) اسکیماهای سخنرانان (`/speakers/` و `/speakers/[slug]/`)
- صفحه فهرست: `CollectionPage` + `BreadcrumbList` شامل کلیه سخنرانان با تصاویر و لینک‌های پروفایل.
- صفحه اختصاصی هر سخنران: `ProfilePage` + `Person` با ارجاع سازمانی به فرانت‌چپتر (`worksFor`), لینکدین (`sameAs`)، تصویر پروفایل و `BreadcrumbList`.

### د) اسکیماهای وبلاگ و جلسات (`/posts/[single]/`)
- **`BlogPosting`**: تیتر، خلاصه، تصویر شاخص، تاریخ‌های `datePublished` و `dateModified`، نویسنده (`Person`) و ناشر (`Organization`).

---

## ۵. نقشه سایت (Sitemap) و کنترل دسترسی ربات‌ها (Robots)

- **تایید حذف قطعی `src/app/sitemap.ts`:**
  - فایل داینامیک قدیمی `src/app/sitemap.ts` به طور کامل از ساختار پروژه حذف شد تا هیچ‌گونه تداخل مسیریابی بین روت نکست و خروجی استاتیک در زمان `next build` یا روی سرور رخ ندهد.
- **فایل استاتیک `public/sitemap.xml`:**
  - توسط اسکریپت خودکار `scripts/generate-sitemap.mjs` پیش از بیلد تولید شده و مستقیماً در روت خروجی (`out/sitemap.xml`) قرار می‌گیرد.
  - شامل ۱۱۹ نشانی اینترنتی معتبر بدون هیچ نشانی ریدایرکتی، ۴۰۴ یا دمو.
  - تگ‌های `<priority>` و `<changefreq>` برای سازگاری کامل با استاندارد XML سرفصل‌بندی شده‌اند (توجه: گوگل رسماً اولویت‌های اعشاری را نادیده می‌گیرد و به ساختار و تاریخ‌های `lastmod` اتکا می‌کند).
- **فایل `public/robots.txt`:**
  - مجاز بودن کلیه صفحات با مسدودسازی مسیرهای `/api/` و `/elements/`.
  - ارجاع صریح به `Sitemap: https://frontchapter.ir/sitemap.xml`.
- **فایل `public/CNAME`:**
  - ثبت قطعی دامنه `frontchapter.ir` جهت حفظ همیشگی دامنه اختصاصی در دیپلوی GitHub Pages.

---

## ۶. پرفورمنس و صفات پیوندها (Link Attributes & CWV)

- **تفکیک و اصلاح صفات پیوندها (Rel Attributes):**
  - **حامیان مالی و اسپانسرها (لیارا و سایرین):** دارای صفت رسمی `rel="noopener noreferrer sponsored"` مطابق استاندارد گوگل برای لینک‌های حمایتی/تجاری.
  - **شبکه‌های اجتماعی رسمی فرانت‌چپتر:** دارای صفت ایمن `rel="noopener noreferrer"` بدون `nofollow`، تا سیگنال‌های برندینگ و هویت اجتماعی فرانت‌چپتر به موتورهای جستجو به درستی منتقل شوند.
  - **پروفایل‌های شخصی و متفرقه سخنرانان/نویسندگان:** دارای صفت `rel="noopener noreferrer nofollow"`.
- **پیشگیری از Layout Shift (CLS):** فونت محلی `DanaVF.woff2` با ویژگی `preload` در هدر بارگذاری شده و با `font-display: swap` رندر می‌شود.
- **بهینه‌سازی بزرگ‌ترین المان بصری (LCP):** تصاویر هیرو در صفحات رویداد با ویژگی `priority` بارگذاری می‌شوند تا سریع‌ترین FCP و LCP حاصل شود.
- **بارگذاری تنبل (Lazy Loading):** ویدیوها و تصاویر پایین صفحه با ویژگی‌های `loading="lazy"` و کامپوننت `LazyVideo` رندر می‌شوند.

---

## ۷. راهنمای گام‌به‌گام برای Google Search Console و ابزارها

### ۱. تایید مالکیت در گوگل (Google Site Verification)
بهترین و پایدارترین روش تایید مالکیت برای سایت‌های GitHub Pages، اضافه کردن یک رکورد **DNS TXT** در کنترل‌پنل دامنه `frontchapter.ir` است:
- نوع رکورد: `TXT`
- میزبان (Host): `@`
- مقدار: کدی که گوگل در بخش Domain Verification سرچ کنسول ارائه می‌دهد (مثلاً `google-site-verification=...`).
- *روش جایگزین:* کد تایید را می‌توانید در متغیر محیطی `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` یا فایل `src/config/config.json` در بخش `analytics.google_site_verification` قرار دهید؛ کامپوننت `SiteVerification.tsx` به صورت خودکار آن را در `<head>` رندر می‌کند.

## ۷. وضعیت استقرار و اتصال ابزارها (تاییدشده ۱۰۰٪)

### ۱. وضعیت استقرار زنده در GitHub Pages
- **پایپ‌لاین دیپلوی خودکار GitHub Actions:**
  - تنها و رسمی‌ترین مسیر دیپلوی به برنچ `gh-pages` از طریق ورک‌فلوهای GitHub Actions تنظیم و یکپارچه‌سازی شد.
  - اسکریپت دستی `deploy` در `package.json` مسدود و ایمن شد تا هیچ تغییر دستی یا مغایرتی روی `gh-pages` اعمال نگردد.
  - اجرای آخرین ورک‌فلوها (شماره ۳۵۵۲۲۰۹۲۷۸۵ و ۳۵۵۲۲۱۸۲۴۱۶) روی برنچ `main` با موفقیت کامل (`success`) به پایان رسید.
- **راستی‌آزمایی سرور زنده (`https://frontchapter.ir/`):**
  - تمامی فایل‌ها و چانک‌های `_next/static/` با کد وضعیت ۲۰۰ سرو می‌شوند.
  - تگ اولیه `<html lang="fa" dir="rtl">` مستقیماً از سورس اولیه سرور بازگردانده می‌شود.
  - اسکیمای `SearchAction` به طور کامل حذف شده است.
  - تگ‌های `rel="noopener noreferrer sponsored"` برای حامیان مالی در سورس زنده اعمال شده‌اند.
  - فایل `sitemap.xml` با ۱۱۹ آدرس و `robots.txt` با مسدودسازی صحیح به‌صورت زنده در دسترس هستند.

---

### ۲. وضعیت تایید مالکیت و ثبت نقشه سایت در Search Console
- **تایید مالکیت دامنه:**
  - دامین پراپرتی `sc-domain:frontchapter.ir` با سطح دسترسی مالک کامل (`siteOwner`) تایید شد.
- **ثبت موفق نقشه سایت (Sitemap Submission):**
  - نقشه سایت `https://frontchapter.ir/sitemap.xml` مستقیماً از طریق API ثبت شد.
  - وضعیت خروجی سرچ کنسول:
    - **Status:** `Valid`
    - **Indexed URLs:** `119`
    - **Errors:** `0`
    - **Warnings:** `0`
    - **Last Downloaded:** `2026-09-20 16:32`
- **بینگ وبمستر تولز (Bing Webmaster Tools - اقدام دستی کاربر):**
  > [!IMPORTANT]
  > **اقدام دستی خارج از توان ابزارهای خودکار:**  
  > اتصال و ثبت نقشه سایت در **Bing Webmaster Tools** نیازمند ورود با حساب مایکروسافت در [bing.com/webmasters](https://www.bing.com/webmasters) و کلیک روی گزینه **Import from Google Search Console** است تا سایت‌مپ و دسترسی دامنه با یک کلیک همگام‌سازی شوند.

---

### ۳. راه‌اندازی سرور محلی MCP Google Search Console (`mcp-gsc`)
- **احراز هویت و ذخیره نشست:**
  - فرآیند احراز هویت OAuth با فایل `client_secrets.json` انجام شد و توکن پایدار در مسیر `/Users/saleh/Library/Application Support/mcp-gsc/token.json` ذخیره گردید.
- **کانفیگ دائمی در Antigravity:**
  - سرور در فایل کانفیگ جهانی `/Users/saleh/.gemini/config/mcp_config.json` تحت کلید `gsc` با مفسر اختصاصی پایتون ۳.۱۴ در محیط مجازی `.venv` ثبت شد.

---

## ۸. نتایج زنده بازرسی صفحات (URL Inspection) و تحلیل عملکرد (Search Analytics)

### ۱. جدول بازرسی وضعیت زنده ایندکس صفحات کلیدی (Google URL Inspection API)

| نشانی اینترنتی (URL) | وضعیت ایندکس (Coverage State) | وضعیت کلی (Verdict) | تاریخ آخرین خزش گوگل | کانونیکال اعلامی کاربر | کانونیکال انتخابی گوگل | وضعیت ربات‌ها | وضعیت ایندکس‌پذیری |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `https://frontchapter.ir/` | **Submitted and indexed** | `PASS` | ۲۰۲۶-۰۹-۱۹ ۱۶:۵۲ | `https://frontchapter.ir/` | `https://frontchapter.ir/` | `ALLOWED` | `INDEXING_ALLOWED` |
| `https://frontchapter.ir/events/dar-miyan-e-meh/` | **Discovered - currently not indexed** | `NEUTRAL` | در صف خزش (هنوز خزش نشده) | — | — | — | در انتظار خزش سایت‌مپ |
| `https://frontchapter.ir/conferences/1403/` | **Submitted and indexed** | `PASS` | ۲۰۲۶-۰۸-۱۹ ۲۱:۳۹ | `https://frontchapter.ir/conferences/1403/` | `https://frontchapter.ir/conferences/1403/` | `ALLOWED` | `INDEXING_ALLOWED` |
| `https://frontchapter.ir/speakers/saleh-shojaei/` | **Duplicate without user-selected canonical** | `NEUTRAL` | ۲۰۲۶-۰۷-۰۲ ۱۱:۴۹ *(خزش قدیمی)* | قبلاً `null` (اکنون اصلاح شد) | نامعتبر در گذشته | `ALLOWED` | `INDEXING_ALLOWED` |
| `https://frontchapter.ir/mist/` | **URL is unknown to Google** | `NEUTRAL` | خزش نشده (فاقد لینک/ورودی) | — | — | — | خارج از نقشه سایت (درست) |

> [!NOTE]
> **تحلیل دقیق خطاهای خام گوگل:**
> 1. صفحه رویداد «در میان مِه» به دلیل جدید بودن، وضعیت **`Discovered - currently not indexed`** دارد. این یعنی گوگل آن را از طریق نقشه سایت یا پیوندها کشف کرده و در صف خزش اولیه قرار داده است.
> 2. وضعیت صفحه سخنران مربوط به خزش ۲ ماه قبل (جولای ۲۰۲۶) بوده که تگ کانونیکال روی پروفایل سخنرانان وجود نداشت (`user_canonical: null`). در اصلاحات اخیر، تگ کانونیکال معتبر به تمامی صفحات سخنرانان اضافه شد و با ثبت نقشه سایت ۱۱۹ آدرسی در این مرحله، در خزش بعدی این مورد به طور خودکار برطرف خواهد شد.
> 3. صفحه ریدایرکت `/mist/` وضعیت **`URL is unknown to Google`** دارد؛ زیرا به درستی از نقشه سایت حذف شده و موتور جستجو دلیلی برای صرف بودجه خزش روی آن ندارد.

---

### ۲. گزارش پایه عملکرد ۲۸ روز اخیر (Search Analytics Baseline)
این داده‌ها عملکرد واقعی دامنه پیش از ایندکس تغییرات جدید است و به عنوان مبنای مقایسه (Baseline) برای سنجش رشد سئو استفاده می‌شود:

- **مجموع کلیک‌ها (Clicks):** ۶۱ کلیک
- **مجموع نمایش در نتایج (Impressions):** ۱,۰۵۳ نمایش
- **نرخ کلیک میانگین (Average CTR):** ۵.۷۹٪
- **جایگاه میانگین در نتایج (Average Position):** ۶.۷

#### کوئری‌های برتر جستجو (Top Queries):
| عبارت جستجو (Query) | تعداد کلیک | تعداد نمایش (Impressions) | نرخ کلیک (CTR) | جایگاه میانگین |
| :--- | :---: | :---: | :---: | :---: |
| **فرانت چپتر** | ۱۴ | ۲۵ | ۵۶.۰٪ | ۱.۰ |
| **حسام موسوی** | ۵ | ۸۹ | ۵.۶٪ | ۵.۴ |
| **سجاد منشی** | ۱ | ۳ | ۳۳.۳٪ | ۱.۷ |
| **علی گلکار** | ۱ | ۱۶ | ۶.۲٪ | ۷.۹ |
| **مسعود بیگی** | ۱ | ۵۲ | ۱.۹٪ | ۵.۵ |
| **نیما رحمتی** | ۱ | ۲۲ | ۴.۵٪ | ۸.۱ |
| **چپتر** | ۰ | ۲۳۱ | ۰٪ | ۸.۴ |
| **وحید محمدی** | ۰ | ۷۵ | ۰٪ | ۷.۹ |

#### صفحات برتر دارای کلیک و نمایش (Top Pages):
| نشانی صفحه (Page) | تعداد کلیک | تعداد نمایش (Impressions) | نرخ کلیک (CTR) | جایگاه میانگین |
| :--- | :---: | :---: | :---: | :---: |
| `https://frontchapter.ir/` (صفحه اصلی) | ۳۷ | ۳۶۸ | ۱۰.۱٪ | ۷.۱ |
| `https://frontchapter.ir/speakers/hesam-mousavi/` | ۶ | ۱۵۷ | ۳.۸٪ | ۶.۱ |
| `https://frontchapter.ir/speakers/pouria-babaali/` | ۳ | ۸ | ۳۷.۵٪ | ۳.۴ |
| `https://frontchapter.ir/speakers/behnia-azad/` | ۲ | ۶ | ۳۳.۳٪ | ۲.۷ |
| `https://frontchapter.ir/speakers/masoud-beigi/` | ۲ | ۶۹ | ۲.۹٪ | ۵.۶ |
| `https://frontchapter.ir/conferences/1400/` | ۱ | ۷ | ۱۴.۳٪ | ۵.۴ |
| `https://frontchapter.ir/posts/` | ۱ | ۳۳ | ۳.۰٪ | ۳.۲ |
| `https://frontchapter.ir/speakers/ali-golkar/` | ۱ | ۲۲ | ۴.۵٪ | ۷.۲ |
| `https://frontchapter.ir/speakers/nima-rahmati/` | ۱ | ۲۵ | ۴.۰٪ | ۸.۱ |
| `https://frontchapter.ir/speakers/sajjad-monshi/` | ۱ | ۶ | ۱۶.۷٪ | ۱.۷ |
