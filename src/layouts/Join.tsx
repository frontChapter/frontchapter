'use client';

import Banner from '@layouts/components/Banner';
import {
  CarrotBadge,
  CarrotButton,
  CarrotLoader,
  CarrotSuccessState,
} from '@layouts/components/carrot';
import {
  LEVEL_LABELS,
  levelFromPoints,
  type Member,
  type MemberStats,
} from '@lib/membership/types';
import { getSupabase } from '@lib/supabase/client';
import type { Session } from '@supabase/supabase-js';
import Image from 'next/image';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

type Step = 'loading' | 'login' | 'profile' | 'done';

type TelegramWidgetUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

declare global {
  interface Window {
    onFrontChapterTelegramAuth?: (user: TelegramWidgetUser) => void;
  }
}

const TELEGRAM_BOT_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'FrontChapterMagic';

type FormState = {
  expertise: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  is_public: boolean;
};

const emptyForm: FormState = {
  expertise: '',
  bio: '',
  linkedin_url: '',
  github_url: '',
  website_url: '',
  is_public: true,
};

function formFromMember(m: Member | null): FormState {
  if (!m) return emptyForm;
  return {
    expertise: m.expertise ?? '',
    bio: m.bio ?? '',
    linkedin_url: m.linkedin_url ?? '',
    github_url: m.github_url ?? '',
    website_url: m.website_url ?? '',
    is_public: m.is_public,
  };
}

const Join = () => {
  const [step, setStep] = useState<Step>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  const finishTelegramLogin = useCallback(async (user: TelegramWidgetUser) => {
    setLoggingIn(true);
    setError('');
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw new Error('Supabase env missing');

      const res = await fetch(`${url}/functions/v1/telegram-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
        },
        body: JSON.stringify(user),
      });
      const payload = await res.json();
      if (!res.ok || payload.error) {
        throw new Error(payload.error || 'ورود ناموفق بود');
      }

      const supabase = getSupabase();
      const { error: otpErr } = await supabase.auth.verifyOtp({
        token_hash: payload.token_hash,
        type: 'magiclink',
      });
      if (otpErr) throw otpErr;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ورود با تلگرام ناموفق بود');
      setLoggingIn(false);
    }
  }, []);

  const loadMember = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    const { data: row, error: memErr } = await supabase
      .from('members')
      .select(
        'id, telegram_id, username, display_name, photo_url, expertise, bio, linkedin_url, github_url, website_url, is_public, profile_completed_at, created_at'
      )
      .eq('id', userId)
      .maybeSingle();

    if (memErr) throw memErr;

    const m = row as Member | null;
    setMember(m);
    setForm(formFromMember(m));

    if (m?.profile_completed_at) {
      const { data: s } = await supabase
        .from('member_stats')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      setStats((s as MemberStats | null) ?? null);
      setStep('done');
    } else {
      setStats(null);
      setStep('profile');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabase();

    const sync = async (s: Session | null) => {
      if (cancelled) return;
      setSession(s);
      setError('');
      if (!s) {
        setMember(null);
        setStats(null);
        setForm(emptyForm);
        setStep('login');
        return;
      }
      try {
        await loadMember(s.user.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'خطا در بارگذاری پروفایل');
        setStep('profile');
      }
    };

    supabase.auth.getSession().then(({ data }) => sync(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      sync(s);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadMember]);

  // Mount official Telegram Login Widget (hash auth — not broken OIDC)
  useEffect(() => {
    if (step !== 'login') return;
    const host = widgetRef.current;
    if (!host) return;

    window.onFrontChapterTelegramAuth = (user) => {
      void finishTelegramLogin(user);
    };

    host.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onFrontChapterTelegramAuth(user)');
    host.appendChild(script);

    return () => {
      delete window.onFrontChapterTelegramAuth;
      host.innerHTML = '';
    };
  }, [step, finishTelegramLogin]);

  const logout = async () => {
    setError('');
    await getSupabase().auth.signOut();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.expertise.trim()) {
      setError('حوزه تخصص الزامی است.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const supabase = getSupabase();
      const { data, error: rpcErr } = await supabase.rpc('complete_profile', {
        p_expertise: form.expertise.trim(),
        p_bio: form.bio.trim() || null,
        p_linkedin_url: form.linkedin_url.trim() || null,
        p_github_url: form.github_url.trim() || null,
        p_website_url: form.website_url.trim() || null,
        p_is_public: form.is_public,
      });
      if (rpcErr) throw rpcErr;
      const updated = data as Member;
      setMember(updated);
      if (session) await loadMember(session.user.id);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره ناموفق بود');
    } finally {
      setSaving(false);
    }
  };

  const points = stats?.points_total ?? (member?.profile_completed_at ? 10 : 0);
  const levelKey = stats?.level_key ?? levelFromPoints(points);

  return (
    <section className="section pt-0">
      <Banner title="هویجی شو!" />
      <div className="container">
        <div className="animate mx-auto max-w-xl">
          {/* Step indicator */}
          <ol className="mb-8 flex items-center justify-center gap-3 text-sm">
            <li
              className={
                step === 'login' || step === 'loading'
                  ? 'font-semibold text-primary'
                  : 'text-muted'
              }
            >
              ۱. ورود با تلگرام
            </li>
            <li className="text-light" aria-hidden>
              —
            </li>
            <li
              className={
                step === 'profile' || step === 'done'
                  ? 'font-semibold text-primary'
                  : 'text-muted'
              }
            >
              ۲. تکمیل پروفایل
            </li>
          </ol>

          {error ? (
            <p
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {step === 'loading' ? (
            <div className="flex justify-center py-16">
              <CarrotLoader variant="grow" label="در حال بارگذاری…" />
            </div>
          ) : null}

          {step === 'login' ? (
            <div className="rounded-2xl border border-border bg-surface-solid p-6 shadow-[0_4px_25px_var(--color-shadow)] sm:p-10">
              <CarrotBadge accent className="mb-4">
                جامعه فرانت‌چپتر
              </CarrotBadge>
              <h2 className="h4 mb-3 text-dark">به جمع هویجی‌ها بپیوند</h2>
              <p className="mb-8 text-sm leading-relaxed text-muted">
                با اکانت تلگرام وارد شو، پروفایلت را کامل کن و در فهرست عمومی
                اعضا دیده شو. عضویت خودکار است — بدون تأیید دستی.
              </p>
              {loggingIn ? (
                <div className="flex justify-center py-4">
                  <CarrotLoader variant="grow" label="در حال ورود…" />
                </div>
              ) : (
                <div
                  ref={widgetRef}
                  className="flex min-h-[48px] items-center justify-center"
                />
              )}
            </div>
          ) : null}

          {step === 'profile' ? (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border bg-surface-solid p-6 shadow-[0_4px_25px_var(--color-shadow)] sm:p-8"
            >
              {member ? (
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-6">
                  {member.photo_url ? (
                    <Image
                      src={member.photo_url}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-theme-light text-lg text-primary">
                      🥕
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-dark">
                      {member.display_name}
                    </p>
                    {member.username ? (
                      <p className="text-sm text-muted">@{member.username}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <h2 className="h4 mb-2 text-dark">پروفایل عضویت</h2>
              <p className="mb-6 text-sm text-muted">
                فیلدهای ستاره‌دار الزامی‌اند.
              </p>

              <div className="mb-5">
                <label
                  className="mb-2 block text-sm font-medium text-dark"
                  htmlFor="join-expertise"
                >
                  حوزه تخصص <span className="text-primary">*</span>
                </label>
                <input
                  id="join-expertise"
                  required
                  value={form.expertise}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expertise: e.target.value }))
                  }
                  className="form-input w-full"
                  placeholder="مثلاً Frontend، React، CSS…"
                />
              </div>

              <div className="mb-5">
                <label
                  className="mb-2 block text-sm font-medium text-dark"
                  htmlFor="join-bio"
                >
                  بیو (اختیاری)
                </label>
                <textarea
                  id="join-bio"
                  rows={3}
                  value={form.bio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bio: e.target.value }))
                  }
                  className="form-textarea w-full"
                  placeholder="چند خط درباره خودت…"
                />
              </div>

              <div className="mb-5 grid gap-5 sm:grid-cols-1">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-dark"
                    htmlFor="join-linkedin"
                  >
                    لینکدین
                  </label>
                  <input
                    id="join-linkedin"
                    type="url"
                    value={form.linkedin_url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, linkedin_url: e.target.value }))
                    }
                    className="form-input w-full"
                    placeholder="https://linkedin.com/in/…"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-dark"
                    htmlFor="join-github"
                  >
                    گیت‌هاب
                  </label>
                  <input
                    id="join-github"
                    type="url"
                    value={form.github_url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, github_url: e.target.value }))
                    }
                    className="form-input w-full"
                    placeholder="https://github.com/…"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-dark"
                    htmlFor="join-website"
                  >
                    وب‌سایت
                  </label>
                  <input
                    id="join-website"
                    type="url"
                    value={form.website_url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, website_url: e.target.value }))
                    }
                    className="form-input w-full"
                    placeholder="https://…"
                    dir="ltr"
                  />
                </div>
              </div>

              <label className="mb-8 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="form-checkbox mt-1"
                  checked={form.is_public}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_public: e.target.checked }))
                  }
                />
                <span className="text-sm text-dark">
                  پروفایلم در فهرست عمومی اعضا نمایش داده شود
                  <span className="mt-0.5 block text-muted">
                    پیش‌فرض روشن است.
                  </span>
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <CarrotButton type="submit" variant="primary" loading={saving}>
                  ذخیره پروفایل
                </CarrotButton>
                <CarrotButton
                  type="button"
                  variant="ghost"
                  onClick={logout}
                  disabled={saving}
                >
                  خروج
                </CarrotButton>
              </div>
            </form>
          ) : null}

          {step === 'done' && member?.profile_completed_at ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border-secondary bg-theme-light px-6 py-10">
                <CarrotSuccessState
                  title="خوش اومدی هویجی!"
                  description={
                    form.is_public || member.is_public
                      ? 'پروفایلت ذخیره شد و در فهرست اعضا دیده می‌شود.'
                      : 'پروفایلت ذخیره شد (نمایش عمومی خاموش است).'
                  }
                />
              </div>

              <div className="rounded-2xl border border-border bg-surface-solid p-6 sm:p-8">
                <div className="flex flex-wrap items-start gap-4">
                  {member.photo_url ? (
                    <Image
                      src={member.photo_url}
                      alt=""
                      width={72}
                      height={72}
                      className="h-[72px] w-[72px] rounded-full object-cover"
                      unoptimized
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="h4 mb-0 text-dark">
                        {member.display_name}
                      </h2>
                      <CarrotBadge accent>{LEVEL_LABELS[levelKey]}</CarrotBadge>
                    </div>
                    {member.username ? (
                      <p className="mb-1 text-sm text-muted">
                        @{member.username}
                      </p>
                    ) : null}
                    {member.expertise ? (
                      <p className="mb-2 text-sm font-medium text-dark">
                        {member.expertise}
                      </p>
                    ) : null}
                    {member.bio ? (
                      <p className="mb-3 text-sm leading-relaxed text-muted">
                        {member.bio}
                      </p>
                    ) : null}
                    <p className="text-sm text-muted">{points} امتیاز</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <CarrotButton
                    type="button"
                    variant="secondary"
                    onClick={() => setStep('profile')}
                  >
                    ویرایش پروفایل
                  </CarrotButton>
                  <CarrotButton type="button" variant="ghost" onClick={logout}>
                    خروج
                  </CarrotButton>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Join;
