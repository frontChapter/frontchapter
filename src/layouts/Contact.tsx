'use client';

import config from '@config/config.json';
import social from '@config/social.json';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import {
  IoLocationOutline,
  IoMailOutline,
  IoPaperPlaneOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
} from 'react-icons/io5';
import Banner from './components/Banner';
import SocialFixed from './components/SocialFixed';

interface Frontmatter {
  title: string;
  [key: string]: unknown;
}

interface ContactData {
  frontmatter: Frontmatter;
}

type ContactProps = {
  data: ContactData;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const Contact: React.FC<ContactProps> = ({ data }) => {
  const { title } = data.frontmatter;
  const { email, location } = config.contact_info;
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    // honeypot — bots fill this; humans never see it
    if (formData.get('_honey')) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const endpoint =
        config.params.contact_form_action ||
        `https://formsubmit.co/ajax/${email}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          _subject: `پیام جدید از سایت فرانت‌چپتر: ${formData.get('subject')}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const result = await res.json();
      if (!res.ok || result.success === 'false') {
        throw new Error(result.message || 'ارسال ناموفق بود');
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMsg(
        'ارسال پیام با مشکل مواجه شد. لطفاً دوباره تلاش کنید یا مستقیم ایمیل بزنید.'
      );
    }
  };

  return (
    <section className="section !pt-0">
      <Banner title={title} />

      <div className="container pt-12 md:pt-16">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <p className="text-lg leading-relaxed text-dark/70">
            سوالی داری، پیشنهادی هست، یا می‌خوای با کامیونیتی در ارتباط باشی؟
            همین‌جا بنویس — پیام‌ت مستقیم به تیم فرانت‌چپتر می‌رسه.
          </p>
        </div>

        <div className="row g-4 items-start justify-center">
          {/* Contact details */}
          <aside className="animate col-12 mb-10 lg:col-4 lg:mb-0">
            <div className="space-y-6">
              <div>
                <p className="mb-1 text-sm font-medium text-primary">
                  راه‌های ارتباط
                </p>
                <h2 className="h4 text-dark">با ما در تماس باش</h2>
              </div>

              <ul className="space-y-5">
                {email && (
                  <li className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-secondary bg-theme-light text-primary">
                      <IoMailOutline className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="mb-0.5 text-sm text-muted">ایمیل</p>
                      <Link
                        href={`mailto:${email}`}
                        className="font-medium text-dark transition-colors duration-300 hover:text-primary"
                      >
                        {email}
                      </Link>
                    </div>
                  </li>
                )}

                {location && (
                  <li className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-secondary bg-theme-light text-primary">
                      <IoLocationOutline className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="mb-0.5 text-sm text-muted">آدرس</p>
                      <p className="font-medium leading-relaxed text-dark">
                        {location}
                      </p>
                    </div>
                  </li>
                )}

                {social.telegram && (
                  <li className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-secondary bg-theme-light text-primary">
                      <IoPaperPlaneOutline className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="mb-0.5 text-sm text-muted">تلگرام</p>
                      <a
                        href={social.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-dark transition-colors duration-300 hover:text-primary"
                      >
                        @frontchapter
                      </a>
                    </div>
                  </li>
                )}
              </ul>

              <div className="border-t border-border pt-6">
                <p className="mb-3 text-sm text-muted">شبکه‌های اجتماعی</p>
                <SocialFixed source={social} className="social-icons" />
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="animate col-12 lg:col-7">
            {status === 'success' ? (
              <div
                className="flex flex-col items-center rounded-2xl border border-border-secondary bg-theme-light px-6 py-16 text-center"
                role="status"
              >
                <IoCheckmarkCircle
                  className="mb-4 h-14 w-14 text-primary"
                  aria-hidden
                />
                <h3 className="h4 mb-2 text-dark">پیامت رسید!</h3>
                <p className="mb-8 max-w-md text-text">
                  ممنون که نوشتی. در اولین فرصت جواب می‌دیم.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-primary cursor-pointer"
                  onClick={() => setStatus('idle')}
                >
                  ارسال پیام جدید
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-surface-solid p-6 shadow-[0_4px_25px_var(--color-shadow)] sm:p-8"
                noValidate={false}
              >
                <h2 className="h4 mb-2 text-dark">ارسال پیام</h2>
                <p className="mb-8 text-sm text-muted">
                  فیلدهای ستاره‌دار الزامی‌اند.
                </p>

                {/* honeypot */}
                <input
                  type="text"
                  name="_honey"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                />

                <div className="mb-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-dark"
                      htmlFor="contact-name"
                    >
                      نام <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-name"
                      className="form-input w-full"
                      name="name"
                      placeholder="نام و نام خانوادگی"
                      type="text"
                      required
                      autoComplete="name"
                      disabled={status === 'loading'}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-dark"
                      htmlFor="contact-email"
                    >
                      ایمیل <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-email"
                      className="form-input w-full"
                      name="email"
                      placeholder="you@example.com"
                      type="email"
                      required
                      autoComplete="email"
                      dir="ltr"
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-2 block text-sm font-medium text-dark"
                    htmlFor="contact-subject"
                  >
                    موضوع <span className="text-primary">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    className="form-input w-full"
                    name="subject"
                    placeholder="مثلاً پیشنهاد همکاری، سوال درباره رویداد…"
                    type="text"
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="mb-2 block text-sm font-medium text-dark"
                    htmlFor="contact-message"
                  >
                    پیام <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    className="form-textarea w-full"
                    name="message"
                    rows={6}
                    placeholder="هر چی لازم داری بنویس…"
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {status === 'error' && (
                  <div
                    className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300"
                    role="alert"
                  >
                    <IoAlertCircleOutline
                      className="mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden
                    />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary flex w-full cursor-pointer items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'در حال ارسال…' : 'ارسال پیام'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
