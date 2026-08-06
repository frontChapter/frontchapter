'use client';

import Banner from '@layouts/components/Banner';
import JoinGateWizard from '@layouts/components/JoinGateWizard';
import JoinLearnMoreLink from '@layouts/components/JoinLearnMoreLink';
import JoinOnboardingSidebar from '@layouts/components/JoinOnboardingSidebar';
import JoinOnboardingSteps, {
  type OnboardingStepKey,
} from '@layouts/components/JoinOnboardingSteps';
import JoinSocialLinks, {
  SOCIAL_ICONS,
} from '@layouts/components/JoinSocialLinks';
import {
  CarrotButton,
  CarrotLevel,
  CarrotLoader,
  CarrotSuccessState,
} from '@layouts/components/carrot';
import {
  BIO_SUGGESTIONS,
  CHARTER_HIGHLIGHTS,
  EXPERIENCE_LEVELS,
  EXPERTISE_TOPICS,
  TELEGRAM_GROUP_URL,
  WELCOME_JOURNEY,
  buildExpertiseString,
  type ExperienceId,
} from '@lib/membership/join-presets';
import {
  normalizeGithubUrl,
  normalizeLinkedinUrl,
  normalizeWebsiteUrl,
  urlOrNull,
  validateGithubInput,
  validateLinkedinInput,
  validateWebsiteInput,
} from '@lib/membership/join-url';
import {
  levelFromPoints,
  type Member,
  type MemberStats,
} from '@lib/membership/types';
import { memberPath, memberSlug } from '@lib/membership/slug';
import { getSupabase } from '@lib/supabase/client';
import type { Session } from '@supabase/supabase-js';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { IoPersonOutline } from 'react-icons/io5';

type Step = 'loading' | 'welcome' | 'charter' | 'profile' | 'enrich' | 'done';

type TelegramLoginResult = {
  id_token?: string;
  user?: Record<string, unknown>;
  error?: string;
};

type TelegramAuthOptions = {
  client_id?: number | string;
  bot_id?: number | string;
  scope?: Array<'profile' | 'phone' | 'write'>;
  request_access?: boolean | 'write';
  lang?: string;
  redirect_uri?: string;
  redirect_url?: string;
};

type TelegramLoginApi = {
  auth: (
    // eslint-disable-next-line no-unused-vars -- Telegram SDK signature
    opts: TelegramAuthOptions,
    // eslint-disable-next-line no-unused-vars -- Telegram SDK signature
    cb: (data: TelegramLoginResult) => void
  ) => void;
};

type TelegramWindow = Window & {
  Telegram?: { Login?: TelegramLoginApi };
};

const TELEGRAM_CLIENT_ID =
  process.env.NEXT_PUBLIC_TELEGRAM_CLIENT_ID || '8954964070';
const TELEGRAM_LOGIN_SCRIPT = 'https://telegram.org/js/telegram-login.js';

const MEMBER_SELECT =
  'id, telegram_id, username, display_name, photo_url, expertise, bio, linkedin_url, github_url, website_url, is_public, profile_completed_at, charter_accepted_at, created_at';

type FormState = {
  experienceId: ExperienceId | '';
  expertiseTopics: string[];
  customExpertise: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  is_public: boolean;
};

const emptyForm: FormState = {
  experienceId: '',
  expertiseTopics: [],
  customExpertise: '',
  bio: '',
  linkedin_url: '',
  github_url: '',
  website_url: '',
  is_public: true,
};

function parseExpertiseFromMember(expertise: string | null): {
  experienceId: ExperienceId | '';
  expertiseTopics: string[];
  customExpertise: string;
} {
  if (!expertise?.trim()) {
    return { experienceId: '', expertiseTopics: [], customExpertise: '' };
  }
  const parts = expertise
    .split('·')
    .map((p) => p.trim())
    .filter(Boolean);
  let experienceId: ExperienceId | '' = '';
  const expertiseTopics: string[] = [];
  const customParts: string[] = [];
  const topicSet = new Set<string>(EXPERTISE_TOPICS);

  for (const p of parts) {
    const level = EXPERIENCE_LEVELS.find((l) => l.label === p);
    if (level && !experienceId) {
      experienceId = level.id;
    } else if (topicSet.has(p)) {
      expertiseTopics.push(p);
    } else {
      customParts.push(p);
    }
  }

  return {
    experienceId,
    expertiseTopics,
    customExpertise: customParts.join(' · '),
  };
}

function formFromMember(m: Member | null): FormState {
  if (!m) return { ...emptyForm };
  const parsed = parseExpertiseFromMember(m.expertise);
  return {
    ...parsed,
    bio: m.bio ?? '',
    linkedin_url: m.linkedin_url ?? '',
    github_url: m.github_url ?? '',
    website_url: m.website_url ?? '',
    is_public: m.is_public,
  };
}

function wantsCompleteLater(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('complete') === '1';
}

type TelegramWebViewWindow = TelegramWindow & {
  TelegramWebviewProxy?: unknown;
};

/** Telegram in-app browser — Login.auth needs oauth_supported before popup path */
function isTelegramInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as TelegramWebViewWindow;
  return (
    Boolean(w.TelegramWebviewProxy) || /\bTelegram\b/i.test(navigator.userAgent)
  );
}

function loadTelegramLoginScript(): Promise<TelegramLoginApi> {
  return new Promise((resolve, reject) => {
    const w = window as TelegramWindow;
    if (w.Telegram?.Login?.auth) {
      resolve(w.Telegram.Login);
      return;
    }

    const onReady = () => {
      const api = (window as TelegramWindow).Telegram?.Login;
      if (api?.auth) resolve(api);
      else reject(new Error('Telegram Login SDK failed to load'));
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="${TELEGRAM_LOGIN_SCRIPT}"]`
    );
    if (existing) {
      if ((window as TelegramWindow).Telegram?.Login?.auth) onReady();
      else existing.addEventListener('load', onReady);
      return;
    }

    const script = document.createElement('script');
    script.src = `${TELEGRAM_LOGIN_SCRIPT}?3`;
    script.async = true;
    script.onload = onReady;
    script.onerror = () =>
      reject(new Error('Telegram Login SDK failed to load'));
    document.head.appendChild(script);
  });
}

/** SDK initProxy → oauth_supported sets in-app mode; auth before that = blocked popup */
async function waitTelegramOidcReady(ms = 900) {
  if (!isTelegramInAppBrowser()) return;
  await loadTelegramLoginScript();
  await new Promise((r) => setTimeout(r, ms));
}

function stepToOnboardingKey(step: Step): OnboardingStepKey {
  if (step === 'loading' || step === 'welcome') return 'welcome';
  if (step === 'charter') return 'charter';
  if (step === 'profile') return 'profile';
  // enrich + done — post-gate
  return 'done';
}

const Join = () => {
  const [step, setStep] = useState<Step>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [charterChecked, setCharterChecked] = useState(false);
  const [enrichFieldErrors, setEnrichFieldErrors] = useState<{
    github_url?: string | null;
    linkedin_url?: string | null;
    website_url?: string | null;
  }>({});
  const [unmuting, setUnmuting] = useState(false);
  const [unmuteHint, setUnmuteHint] = useState('');
  const skipUnmuteEffectRef = useRef(false);
  const autoAuthStartedRef = useRef(false);
  const joinMainRef = useRef<HTMLDivElement>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [acceptingCharter, setAcceptingCharter] = useState(false);

  const finishTelegramLogin = useCallback(async (idToken: string) => {
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
        body: JSON.stringify({ id_token: idToken }),
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

  const loginWithTelegram = useCallback(async () => {
    setLoggingIn(true);
    setError('');
    let settled = false;
    const done = () => {
      settled = true;
    };
    const failSafe = window.setTimeout(() => {
      if (settled) return;
      done();
      setLoggingIn(false);
      setError('ورود تلگرام باز نشد — دوباره روی دکمه بزن.');
    }, 10000);
    try {
      await waitTelegramOidcReady();
      const login = await loadTelegramLoginScript();
      const redirectUri = `${window.location.origin}/join/`;
      login.auth(
        {
          client_id: Number(TELEGRAM_CLIENT_ID),
          bot_id: Number(TELEGRAM_CLIENT_ID),
          scope: ['profile', 'write'],
          request_access: 'write',
          lang: 'fa',
          redirect_uri: redirectUri,
          redirect_url: redirectUri,
        },
        (data) => {
          if (settled) return;
          done();
          window.clearTimeout(failSafe);
          if (data.error) {
            // popup_closed = common when auto-start lacks user gesture; stay quiet
            if (data.error !== 'popup_closed') setError(data.error);
            setLoggingIn(false);
            return;
          }
          if (!data.id_token) {
            setError('توکن تلگرام دریافت نشد');
            setLoggingIn(false);
            return;
          }
          void finishTelegramLogin(data.id_token);
        }
      );
    } catch (e) {
      done();
      window.clearTimeout(failSafe);
      setError(
        e instanceof Error ? e.message : 'بارگذاری ورود تلگرام ناموفق بود'
      );
      setLoggingIn(false);
    }
  }, [finishTelegramLogin]);
  const loadMember = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    const { data: row, error: memErr } = await supabase
      .from('members')
      .select(MEMBER_SELECT)
      .eq('id', userId)
      .maybeSingle();

    if (memErr) throw memErr;

    const m = row as Member | null;
    const nextForm = formFromMember(m);
    setMember(m);
    setForm(nextForm);
    setCharterChecked(Boolean(m?.charter_accepted_at));

    if (m?.profile_completed_at) {
      const { data: s } = await supabase
        .from('member_stats')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      setStats((s as MemberStats | null) ?? null);
      setStep(wantsCompleteLater() ? 'enrich' : 'done');
    } else if (m?.charter_accepted_at) {
      setStats(null);
      setStep('profile');
    } else {
      setStats(null);
      setStep('charter');
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
        setCharterChecked(false);
        setStep('welcome');
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
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      // getSession already handled initial; skip duplicate loadMember
      if (event === 'INITIAL_SESSION') return;
      sync(s);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadMember]);

  // Bot deep-link: /join/?auth=telegram → start Telegram login without extra click
  useEffect(() => {
    if (
      step !== 'welcome' ||
      session ||
      loggingIn ||
      autoAuthStartedRef.current
    ) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') !== 'telegram') return;
    autoAuthStartedRef.current = true;
    // Drop ?auth= so refresh / back doesn't re-fire
    const url = new URL(window.location.href);
    url.searchParams.delete('auth');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    void loginWithTelegram();
  }, [step, session, loggingIn, loginWithTelegram]);

  // After each flow step, bring the new panel into view (mobile stays scrolled down otherwise)
  useEffect(() => {
    if (step === 'loading') return;
    joinMainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const logout = async () => {
    setError('');
    await getSupabase().auth.signOut();
  };

  const requestUnmute = async () => {
    const supabase = getSupabase();
    const { data, error: fnErr } = await supabase.functions.invoke(
      'telegram-bot',
      { body: { action: 'unmute' } }
    );
    if (fnErr) throw fnErr;
    if (data && data.unmuted === false && data.reason) {
      const reason = String(data.reason);
      // Owner/admin already unmuted — bot may still return old reason until redeploy
      if (
        /can't remove chat owner|CHAT_OWNER|administrator|ADMIN|already/i.test(
          reason
        )
      ) {
        return;
      }
      if (reason === 'no_chat_id') {
        throw new Error(
          'هنوز به گروه وصل نشدی — اول وارد گروه تلگرام شو، بعد دوباره امتحان کن.'
        );
      }
      throw new Error('باز کردن چت گروه الان ممکن نشد. دوباره امتحان کن.');
    }
  };

  const requestSiteRebuild = async () => {
    const { error: fnErr } =
      await getSupabase().functions.invoke('site-rebuild');
    if (fnErr) console.warn('[join] site-rebuild:', fnErr.message);
  };

  useEffect(() => {
    if (step !== 'done' || !member?.profile_completed_at) return;
    if (skipUnmuteEffectRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        await requestUnmute();
        if (!cancelled) setUnmuteHint('دسترسی چت گروه باز شد ✅');
      } catch {
        if (!cancelled) setUnmuteHint('');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, member?.profile_completed_at, member?.id]);

  const onAcceptCharter = async () => {
    if (!charterChecked) {
      setError('برای ادامه، پذیرش میثاق‌نامه الزامی است.');
      return;
    }
    setAcceptingCharter(true);
    setError('');
    try {
      const supabase = getSupabase();
      const { error: rpcErr } = await supabase.rpc('accept_community_charter');
      if (rpcErr) throw rpcErr;
      if (session) await loadMember(session.user.id);
      else setStep('profile');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'ثبت پذیرش میثاق‌نامه ناموفق بود'
      );
    } finally {
      setAcceptingCharter(false);
    }
  };

  /** Gate finish — optional pane can skip bio/socials */
  const finishGate = async (includeOptional: boolean) => {
    const expertise = buildExpertiseString(
      form.experienceId,
      form.expertiseTopics,
      form.customExpertise
    );
    if (!form.experienceId) {
      setError('سطح تجربه را انتخاب کن.');
      return;
    }
    if (form.expertiseTopics.length === 0 && !form.customExpertise.trim()) {
      setError('حداقل یک حوزه یا علاقه‌مندی انتخاب کن یا بنویس.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const supabase = getSupabase();
      const { data, error: rpcErr } = await supabase.rpc('complete_profile', {
        p_expertise: expertise,
        p_bio: includeOptional
          ? form.bio.trim() || null
          : (member?.bio ?? null),
        p_linkedin_url: includeOptional
          ? urlOrNull(normalizeLinkedinUrl(form.linkedin_url))
          : (member?.linkedin_url ?? null),
        p_github_url: includeOptional
          ? urlOrNull(
              normalizeGithubUrl(form.github_url, member?.username ?? undefined)
            )
          : (member?.github_url ?? null),
        p_website_url: includeOptional
          ? urlOrNull(normalizeWebsiteUrl(form.website_url))
          : (member?.website_url ?? null),
        p_is_public: form.is_public,
        p_email: null,
      });
      if (rpcErr) throw rpcErr;
      const updated = data as Member;
      // Start unmute immediately — don't wait on React paint / loadMember / rebuild
      skipUnmuteEffectRef.current = true;
      setUnmuteHint('در حال باز کردن چت گروه…');
      const unmuteP = requestUnmute();
      const points = 10;
      setMember(updated);
      setStats({
        ...updated,
        points_total: points,
        level_key: levelFromPoints(points),
        badges: [],
      });
      setStep('done');
      if (form.is_public) void requestSiteRebuild();
      try {
        await unmuteP;
        setUnmuteHint('دسترسی چت گروه باز شد ✅');
      } catch (err) {
        setUnmuteHint(
          err instanceof Error
            ? err.message
            : 'باز کردن چت گروه ناموفق بود — از دکمهٔ زیر دوباره بزن.'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره ناموفق بود');
    } finally {
      setSaving(false);
    }
  };

  const onEnrichSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!member?.expertise?.trim()) {
      setError('ابتدا مرحلهٔ عضویت را کامل کن.');
      return;
    }
    const nextErrors = {
      github_url: validateGithubInput(form.github_url),
      linkedin_url: validateLinkedinInput(form.linkedin_url),
      website_url: validateWebsiteInput(form.website_url),
    };
    setEnrichFieldErrors(nextErrors);
    const first =
      nextErrors.github_url ||
      nextErrors.linkedin_url ||
      nextErrors.website_url;
    if (first) {
      setError(first);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const supabase = getSupabase();
      const { data, error: rpcErr } = await supabase.rpc('complete_profile', {
        p_expertise: member.expertise,
        p_bio: form.bio.trim() || null,
        p_linkedin_url: urlOrNull(normalizeLinkedinUrl(form.linkedin_url)),
        p_github_url: urlOrNull(
          normalizeGithubUrl(form.github_url, member.username ?? undefined)
        ),
        p_website_url: urlOrNull(normalizeWebsiteUrl(form.website_url)),
        p_is_public: form.is_public,
        p_email: null,
      });
      if (rpcErr) throw rpcErr;
      const updated = data as Member;
      // drop ?complete= before loadMember so it lands on done, not enrich
      const u = new URL(window.location.href);
      if (u.searchParams.has('complete')) {
        u.searchParams.delete('complete');
        window.history.replaceState({}, '', u.pathname + u.search);
      }
      setMember(updated);
      setForm(formFromMember(updated));
      if (form.is_public) void requestSiteRebuild();
      setStep('done');
      if (session) {
        const { data: s } = await getSupabase()
          .from('member_stats')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        setStats((s as MemberStats | null) ?? null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره ناموفق بود');
    } finally {
      setSaving(false);
    }
  };

  const points = stats?.points_total ?? (member?.profile_completed_at ? 10 : 0);
  const levelKey = stats?.level_key ?? levelFromPoints(points);
  const showSidebar =
    step === 'welcome' || step === 'charter' || step === 'profile';

  return (
    <section className="section pt-0">
      <Banner title="عضویت در جامعه" />
      <div className="container">
        <div
          className={clsx(
            'animate',
            showSidebar ? 'join-layout mx-auto max-w-6xl' : 'mx-auto max-w-2xl'
          )}
        >
          {showSidebar ? <JoinOnboardingSidebar /> : null}

          <div
            ref={joinMainRef}
            className={showSidebar ? 'join-layout__main' : undefined}
          >
            {step !== 'loading' ? (
              <JoinOnboardingSteps current={stepToOnboardingKey(step)} />
            ) : null}

            {error && step !== 'profile' && step !== 'enrich' ? (
              <p className="join-toast mb-6" role="alert">
                {error}
              </p>
            ) : null}

            {step === 'loading' ? (
              <div className="flex justify-center py-16">
                <CarrotLoader variant="grow" label="در حال بارگذاری…" />
              </div>
            ) : null}

            {step === 'welcome' ? (
              <div className="join-panel join-form">
                <h2 className="h4 mb-3 text-dark">
                  به جامعه فرانت‌چپتر خوش آمدی!
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted">
                  فقط چند کلیک ساده تا دسترسی به دورهمی‌ها، رویدادها و شبکه‌ای
                  باز برای برنامه‌نویسان، علاقه‌مندان و هر کسی که دوست دارد
                  هم‌مسیر باشد.
                </p>

                <ul className="mb-8 space-y-3 list-none p-0">
                  {WELCOME_JOURNEY.map((item, idx) => (
                    <li key={item.title} className="join-journey-item">
                      <span className="text-primary font-semibold">
                        {idx + 1}
                      </span>
                      <span>
                        <strong className="text-dark">{item.title}</strong>
                        <span className="mt-0.5 block text-muted">
                          {item.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <CarrotButton
                  type="button"
                  variant="community"
                  className="w-full sm:w-auto"
                  loading={loggingIn}
                  onClick={loginWithTelegram}
                >
                  ورود با تلگرام
                </CarrotButton>
                <JoinLearnMoreLink className="mt-5 text-xs" />
                <p className="mt-3 text-xs text-muted">
                  قبلاً عضو شدی؟ همین دکمه برای ورود دوباره است.
                </p>
              </div>
            ) : null}

            {step === 'charter' ? (
              <div className="join-panel">
                {member ? (
                  <MemberHeader
                    member={member}
                    className="mb-6 border-b pb-6"
                  />
                ) : null}

                <h2 className="h4 mb-2 text-dark">
                  میثاق‌نامه جامعه فرانت‌چپتر
                </h2>
                <p className="mb-6 text-sm text-muted">
                  برای ادامه، خلاصه ارزش‌های جامعه را بخوان. نسخه کامل در{' '}
                  <Link
                    href="/terms-policy/"
                    className="carrot-text-link text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    قوانین و مقررات
                  </Link>{' '}
                  موجود است.
                </p>

                <ul className="mb-6 space-y-3 list-none p-0">
                  {CHARTER_HIGHLIGHTS.map((item) => (
                    <li
                      key={item.title}
                      className="rounded-xl border border-border-secondary bg-theme-light px-4 py-3"
                    >
                      <p className="mb-1 font-semibold text-dark">
                        {item.title}
                      </p>
                      <p className="mb-0 text-sm text-muted">{item.body}</p>
                    </li>
                  ))}
                </ul>

                <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-border-secondary bg-surface-solid p-4">
                  <input
                    type="checkbox"
                    className="form-checkbox mt-1"
                    checked={charterChecked}
                    onChange={(e) => setCharterChecked(e.target.checked)}
                  />
                  <span className="text-sm text-dark">
                    میثاق‌نامه و قوانین جامعه فرانت‌چپتر را خواندم و می‌پذیرم.
                    <span className="mt-1 block text-xs text-muted">
                      ادامهٔ مشارکت در جامعه به معنای پذیرش نسخهٔ به‌روز همین
                      قوانین است.
                    </span>
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <CarrotButton
                    type="button"
                    variant="primary"
                    loading={acceptingCharter}
                    onClick={onAcceptCharter}
                  >
                    می‌پذیرم و ادامه می‌دهم
                  </CarrotButton>
                </div>
                <p className="mt-4 mb-0 text-xs text-muted">
                  حساب تلگرام اشتباه است؟{' '}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={logout}
                    disabled={acceptingCharter}
                  >
                    خروج و ورود دوباره
                  </button>
                </p>
              </div>
            ) : null}

            {step === 'profile' ? (
              <>
                <JoinGateWizard
                  member={member}
                  form={form}
                  setForm={setForm}
                  saving={saving}
                  onFinish={finishGate}
                />
                {error ? (
                  <p className="join-toast mt-4" role="alert">
                    {error}
                  </p>
                ) : null}
              </>
            ) : null}

            {step === 'enrich' ? (
              <form
                onSubmit={onEnrichSubmit}
                className="join-panel join-panel--gate join-form"
              >
                {member ? (
                  <MemberHeader
                    member={member}
                    className="mb-6 border-b pb-6"
                  />
                ) : null}

                <h2 className="h4 mb-2 text-dark">تکمیل پروفایل</h2>
                <p className="mb-6 text-sm text-muted">
                  اختیاری است — هر وقت خواستی. دسترسی گروه از قبل باز شده.
                </p>

                <div className="mb-5">
                  <p className="mb-2 text-sm font-medium text-dark">
                    معرفی کوتاه
                  </p>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {BIO_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className={clsx(
                          'join-chip text-xs',
                          form.bio === suggestion && 'join-chip--selected'
                        )}
                        onClick={() =>
                          setForm((f) => ({ ...f, bio: suggestion }))
                        }
                      >
                        {suggestion.slice(0, 36)}…
                      </button>
                    ))}
                  </div>
                  <div className="join-field__shell join-field__shell--textarea">
                    <span className="join-field__icon" aria-hidden>
                      <IoPersonOutline className="h-5 w-5" />
                    </span>
                    <textarea
                      id="join-bio-enrich"
                      rows={3}
                      value={form.bio}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, bio: e.target.value }))
                      }
                      className="form-textarea w-full"
                      placeholder="یک یا دو خط درباره خودت…"
                    />
                  </div>
                </div>

                <JoinSocialLinks
                  rows={[
                    {
                      key: 'github_url',
                      id: 'join-github-enrich',
                      brand: 'GitHub',
                      labelFa: 'گیت‌هاب',
                      placeholder: '@username or https://…',
                      icon: SOCIAL_ICONS.github,
                      value: form.github_url,
                      error: enrichFieldErrors.github_url,
                      onChange: (v) => {
                        setForm((f) => ({ ...f, github_url: v }));
                        setEnrichFieldErrors((fe) => ({
                          ...fe,
                          github_url: validateGithubInput(v),
                        }));
                      },
                    },
                    {
                      key: 'linkedin_url',
                      id: 'join-linkedin-enrich',
                      brand: 'LinkedIn',
                      labelFa: 'لینکدین',
                      placeholder: '@handle or https://…',
                      icon: SOCIAL_ICONS.linkedin,
                      value: form.linkedin_url,
                      error: enrichFieldErrors.linkedin_url,
                      onChange: (v) => {
                        setForm((f) => ({ ...f, linkedin_url: v }));
                        setEnrichFieldErrors((fe) => ({
                          ...fe,
                          linkedin_url: validateLinkedinInput(v),
                        }));
                      },
                    },
                    {
                      key: 'website_url',
                      id: 'join-website-enrich',
                      brand: 'Website',
                      labelFa: 'وب‌سایت',
                      placeholder: 'example.com',
                      icon: SOCIAL_ICONS.website,
                      value: form.website_url,
                      error: enrichFieldErrors.website_url,
                      onChange: (v) => {
                        setForm((f) => ({ ...f, website_url: v }));
                        setEnrichFieldErrors((fe) => ({
                          ...fe,
                          website_url: validateWebsiteInput(v),
                        }));
                      },
                    },
                  ]}
                />

                {error ? (
                  <p className="join-toast join-toast--inline" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <CarrotButton
                    type="submit"
                    variant="primary"
                    loading={saving}
                  >
                    ذخیره
                  </CarrotButton>
                  <CarrotButton
                    type="button"
                    variant="ghost"
                    onClick={() => setStep('done')}
                    disabled={saving}
                  >
                    فعلاً نه
                  </CarrotButton>
                </div>
              </form>
            ) : null}

            {step === 'done' && member?.profile_completed_at ? (
              <div className="space-y-6">
                <div className="join-panel join-panel--gate px-6 py-10">
                  <CarrotSuccessState
                    title="خوش آمدی به جامعه!"
                    description="ثبت‌نامت کامل شد. وقتشه خودت را در گروه معرفی کنی."
                  />
                </div>

                <div className="join-panel">
                  <h3 className="h5 mb-4 text-dark">قدم‌های بعدی</h3>
                  <ol className="mb-6 space-y-3 list-none p-0 text-sm">
                    <li className="flex gap-3">
                      <span className="text-primary">✓</span>
                      <span className="text-muted">
                        میثاق‌نامه را پذیرفتید و پروفایل ذخیره شد.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-semibold">۱</span>
                      <span>
                        <strong className="text-dark">چت گروه را باز کن</strong>
                        <span className="mt-0.5 block text-muted">
                          تا پیام‌هات در گروه تلگرام ارسال شود.
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-semibold">۲</span>
                      <span>
                        <strong className="text-dark">خودت را معرفی کن</strong>
                        <span className="mt-0.5 block text-muted">
                          یک پیام کوتاه: نام، حوزه، و چرا فرانت‌چپتر؟
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-semibold">۳</span>
                      <span>
                        <strong className="text-dark">رویدادها را ببین</strong>
                        <span className="mt-0.5 block text-muted">
                          جلسات آنلاین و حضوری در وبلاگ ثبت‌نام دارند.
                        </span>
                      </span>
                    </li>
                  </ol>

                  <div className="flex flex-wrap gap-3">
                    <CarrotButton
                      type="button"
                      variant="primary"
                      loading={unmuting}
                      onClick={async () => {
                        setUnmuting(true);
                        setUnmuteHint('');
                        try {
                          await requestUnmute();
                          setUnmuteHint('دسترسی چت گروه باز شد ✅');
                        } catch (err) {
                          setUnmuteHint(
                            err instanceof Error
                              ? err.message
                              : 'باز کردن چت ناموفق بود'
                          );
                        } finally {
                          setUnmuting(false);
                        }
                      }}
                    >
                      باز کردن چت گروه
                    </CarrotButton>
                    <CarrotButton
                      href={TELEGRAM_GROUP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                    >
                      ورود به گروه تلگرام
                    </CarrotButton>
                    <CarrotButton href="/posts/" variant="ghost">
                      رویدادها و وبلاگ
                    </CarrotButton>
                    <CarrotButton
                      type="button"
                      variant="ghost"
                      onClick={() => setStep('enrich')}
                    >
                      تکمیل پروفایل (اختیاری)
                    </CarrotButton>
                  </div>
                  {unmuteHint ? (
                    <p className="mt-3 mb-0 text-sm text-muted">{unmuteHint}</p>
                  ) : null}
                </div>

                <div className="join-panel">
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
                      <h2 className="h4 mb-1 text-dark">
                        {member.display_name}
                      </h2>
                      {member.username ? (
                        <p className="mb-2 text-sm text-muted">
                          @{member.username}
                        </p>
                      ) : null}
                      {member.expertise ? (
                        <p className="mb-3 text-sm font-medium text-dark">
                          {member.expertise}
                        </p>
                      ) : null}
                      <CarrotLevel level={levelKey} size="md" />
                      <p className="mt-1 text-xs text-muted">{points} امتیاز</p>
                      {member.bio ? (
                        <p className="mt-3 mb-0 text-sm leading-relaxed text-muted">
                          {member.bio}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {form.is_public || member.is_public ? (
                      <CarrotButton
                        href={memberPath(memberSlug(member))}
                        variant="secondary"
                      >
                        دیدن پروفایل عمومی
                      </CarrotButton>
                    ) : null}
                    <CarrotButton
                      type="button"
                      variant="ghost"
                      onClick={() => setStep('enrich')}
                    >
                      تکمیل پروفایل
                    </CarrotButton>
                    <CarrotButton
                      type="button"
                      variant="ghost"
                      onClick={logout}
                    >
                      خروج
                    </CarrotButton>
                  </div>
                </div>
                <JoinLearnMoreLink className="mt-6 text-center text-xs" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

function MemberHeader({
  member,
  className,
}: {
  member: Member;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
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
        <p className="font-semibold text-dark">{member.display_name}</p>
        {member.username ? (
          <p className="text-sm text-muted">@{member.username}</p>
        ) : null}
      </div>
    </div>
  );
}

export default Join;
