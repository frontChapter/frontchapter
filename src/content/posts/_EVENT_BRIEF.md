---
# =============================================================================
# BRIEF جلسه فرانت‌چپتر — فقط این بخش را پر کن، بعد کل فایل را به ChatGPT بده
# =============================================================================
# دستور به مدل (کپی کن):
#
#   با توجه به BRIEF زیر و قوانین OUTPUT، یک فایل کامل markdown پست بساز
#   دقیقاً با فرمت frontmatter پروژه FrontChapter (مثل session-69).
#   فقط فایل نهایی `.md` را برگردان — توضیح اضافه نده.
#
# خروجی باید در مسیر پیشنهادی باشد، مثلاً:
#   src/content/posts/session-NN-slug.md

brief:
  # شماره جلسه (عدد)
  session_number: 70

  # عنوان انگلیسی کوتاه روی پوستر (اختیاری)
  title_en: Prompt to Production

  # عنوان فارسی اصلی
  title_fa: مسیر جدید توسعه نرم‌افزار

  # slug انگلیسی برای url پست (kebab-case، بدون session-NN اگر خودت می‌سازی)
  slug: prompt-to-production

  # مسیر پوستر داخل repo (باید فایل واقعاً وجود داشته باشد)
  image: /images/blog/XX.jpg

  # تاریخ انتشار پست روی سایت (ISO UTC) — معمولاً چند روز قبل از جلسه
  publish_date: 2026-08-10T08:00:00.000Z

  # زمان شروع جلسه (ISO UTC) — تهران = UTC+3:30
  # مثال: ۱۹:۰۰ تهران جمعه = 15:30Z همان روز
  session_datetime: 2026-08-14T15:30:00.000Z

  # مهلت ثبت‌نام (ISO UTC) — معمولاً ۳۰ دقیقه قبل از شروع
  registration_deadline: 2026-08-14T15:00:00.000Z

  # لینک میت — خالی بگذار تا موقع انتشار ادمین خودکار ساخته شود
  # یا لینک واقعی از meet.google.com بگذار
  meet_link:

  # تاریخ/ساعت فارسی برای نمایش در کپشن‌ها (دستی بنویس؛ دقیق و خوانا)
  when_fa: جمعه ۲۳ مرداد
  time_fa: ۱۹:۰۰ تا ۲۰:۳۰

  speaker:
    name_fa: رامین رضایی
    role_en: Software Engineer
    company: Sinch
    # لینک پروفایل LinkedIn (برای منشن/لینک در پست LinkedIn)
    linkedin_url: https://www.linkedin.com/in/raminr77/
    # هندل اینستاگرام بدون @ (برای تگ روی عکس + منشن در کپشن)
    instagram_handle: raminr77
    # موقعیت تگ روی پوستر (۰ تا ۱) — مرکز تقریبی صورت روی پوستر
    instagram_tag_x: 0.72
    instagram_tag_y: 0.38
    # آواتار سخنران اگر در repo هست
    avatar: /images/author/ramin.jpg

  # هوک / زاویه اصلی (۱–۳ جمله)
  hook: |
    اکثر تیم‌ها با AI دمو می‌سازن؛ کمتر تیمی بدون دردسر به پروداکشن می‌رسونه.

  # بولت‌های تجربه/کنفرانس/نکات سخنران
  highlights:
    - Google Summit
    - Anthropic Claude Code Event
    - React Norway

  # موضوعاتی که در جلسه پوشش داده می‌شود
  topics:
    - ورک‌فلو واقعی از پرامپت تا پروداکشن
    - نقش جدید دولوپر در تیم‌های AI-native
    - ابزارها و ترندهای ۲۰۲۶

  # تگ‌های سایت (فارسی/انگلیسی کوتاه)
  tags:
    - جلسات آنلاین
    - فرانت‌چپتر
    - هوش مصنوعی

  # اگر draft بماند منتشر نمی‌شود
  draft: false
---

# قوانین OUTPUT برای مدل

فایل خروجی یک `.md` با frontmatter YAML + بدنه HTML `dir=rtl` است.

## ۱) Frontmatter اجباری

```yaml
title: 'جلسه NN: …'          # فارسی؛ می‌تواند عنوان ترکیبی باشد
image: /images/blog/….jpg
image_alt: >-                 # یک خط توصیفی پوستر + سخنران + نقش
author:
  name: نام‌سخنران             # برای آرشیو سخنران؛ نه «فرانت‌چپتر» مگر مهمان نداریم
  avatar: /images/author/….jpg
date: …ISO…
draft: false
url: session-NN-slug          # یکتا
categories:
  - جلسات آنلاین
description: >-               # SEO ~۱۵۰–۱۶۰ کاراکتر
tags: […]
meta_title: … | فرانت‌چپتر
canonical: /posts/session-NN-slug/

session_datetime: …
registration_deadline: …
meet_link: …

speaker:
  linkedin: https://www.linkedin.com/in/…
  instagram: handle_without_at
  instagram_tag_x: 0.72
  instagram_tag_y: 0.38

social:
  telegram: |
    …HTML با <b>…</b> و __EVENT_URL__…
  linkedin: |
    …
  twitter: |
    …≤۲۲۰ کاراکتر بدون URL…
  instagram: |
    …
```

## ۲) استایل هر پلتفرم

### Telegram (`social.telegram`)
- الگوی کانال [@FrontChapter](https://t.me/FrontChapter) / پست نمونه مثل `t.me/FrontChapter/387`
- `parse_mode` HTML: فقط `<b>` برای عنوان‌ها؛ بدون Markdown
- ساختار: هوک → معرفی سخنران → بولت کنفرانس/موضوع → زمان → ثبت‌نام `__EVENT_URL__` → جمله دعوت‌نامه تقویم → `🥕 @FrontChapter`
- طول نهایی با URL کمتر از ~۱۰۰۰ کاراکتر

### LinkedIn (`social.linkedin`)
- حرفه‌ای، هوک تضاد، پاراگراف کوتاه، بولت ارزش، CTA نرم
- **منشن سخنران:** نام را بنویس و همان‌جا لینک LinkedIn را بیاور، مثال:
  `رامین رضایی — https://www.linkedin.com/in/raminr77/`
- حداکثر ۵ هشتگ انگلیسی در انتها
- لینک ثبت‌نام را در متن ننویس؛ سرور اضافه می‌کند
- بدون «کامنت اول» (پلن رایگان Buffer)

### X / Twitter (`social.twitter`)
- حداکثر ~۲۲۰ کاراکتر (URL جداگانه چسبانده می‌شود)
- هوک تند + یک خط ارزش + زمان کوتاه
- بدون هشتگ زیاد

### Instagram (`social.instagram`)
- خط اول = هوک قوی (در فید دیده می‌شود)
- **منشن سخنران در کپشن:** `@handle` (همان `speaker.instagram`)
- لیست بصری، زمان، CTA
- بعد از سه خط `.` هشتگ‌های فارسی/انگلیسی (۸–۱۵ تا)
- لینک ثبت‌نام را سرور ته کپشن می‌چسباند
- تگ روی عکس از `speaker.instagram` + مختصات `instagram_tag_*` انجام می‌شود

## ۳) بدنه پست (بعد از `---`)

```html
<div dir="rtl">

خلاصه کوتاه جلسه برای صفحه سایت (۲–۵ پاراگراف یا بولت).
لینک ثبت‌نام از کامپوننت سایت می‌آید؛ لازم نیست فرم جدا بسازی.

</div>
```

## ۴) چک‌لیست قبل از تحویل

- [ ] `url` یکتا و kebab-case با پیشوند `session-NN-`
- [ ] `session_datetime` / `registration_deadline` ISO UTC درست
- [ ] `image` و `author.avatar` مسیر واقعی
- [ ] `speaker.linkedin` و `speaker.instagram` پر شده
- [ ] تلگرام: `__EVENT_URL__` و `<b>` دارد
- [ ] LinkedIn: URL پروفایل سخنران داخل متن
- [ ] Instagram: `@handle` سخنران داخل کپشن
- [ ] Twitter زیر ۲۲۰ کاراکتر
