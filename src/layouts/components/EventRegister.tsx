'use client';

import {
  CarrotButton,
  CarrotLoader,
} from '@layouts/components/carrot';
import { sessionPhase, type SessionFrontmatter } from '@lib/membership/session';
import { getSupabase } from '@lib/supabase/client';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';

type Props = {
  postSlug: string;
  session: SessionFrontmatter;
};

type Status =
  | 'loading'
  | 'guest'
  | 'need_profile'
  | 'ready'
  | 'registered'
  | 'hidden';

export default function EventRegister({ postSlug, session }: Props) {
  const phase = sessionPhase(session);
  const [status, setStatus] = useState<Status>('loading');
  const [email, setEmail] = useState('');
  const [needEmail, setNeedEmail] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [hint, setHint] = useState('');

  const refresh = useCallback(async () => {
    if (phase === 'hidden') {
      setStatus('hidden');
      return;
    }
    setError('');
    try {
      const supabase = getSupabase();
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        setStatus('guest');
        return;
      }
      const uid = sess.session.user.id;
      const { data: member } = await supabase
        .from('members')
        .select('profile_completed_at')
        .eq('id', uid)
        .maybeSingle();
      if (!member?.profile_completed_at) {
        setStatus('need_profile');
        return;
      }

      const { data: emailRow } = await supabase
        .from('member_emails')
        .select('email')
        .eq('member_id', uid)
        .maybeSingle();
      const em = (emailRow as { email?: string } | null)?.email ?? '';
      setEmail(em);
      setNeedEmail(!em);

      const { data: ev } = await supabase
        .from('events')
        .select('id')
        .eq('post_slug', postSlug)
        .maybeSingle();
      if (ev?.id) {
        const { data: reg } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('event_id', ev.id)
          .eq('member_id', uid)
          .maybeSingle();
        if (reg) {
          setStatus('registered');
          return;
        }
      }
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطا در بارگذاری');
      setStatus('guest');
    }
  }, [phase, postSlug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (phase === 'hidden' || status === 'hidden') return null;

  const onRegister = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setHint('');
    try {
      const supabase = getSupabase();
      const { data, error: rpcErr } = await supabase.rpc('register_for_event', {
        p_post_slug: postSlug,
        p_email: email.trim() || null,
      });
      if (rpcErr) throw rpcErr;
      const res = data as {
        already?: boolean;
        points_awarded?: number;
      };
      if (res.already) {
        setHint('قبلاً ثبت‌نام کرده‌ای.');
      } else {
        setHint(
          res.points_awarded
            ? `ثبت‌نام شد — ${res.points_awarded} امتیاز گرفتی 🥕`
            : 'ثبت‌نام شد.'
        );
      }
      setStatus('registered');
      setNeedEmail(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ثبت‌نام ناموفق بود');
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="mb-10 rounded-2xl border border-border-secondary bg-theme-light p-5 sm:p-6">
      <h2 className="h5 mb-2 text-dark">ثبت‌نام جلسه آنلاین</h2>
      {session.session_datetime ? (
        <p className="mb-4 text-sm text-muted">
          زمان جلسه:{' '}
          <time dateTime={session.session_datetime}>
            {new Date(session.session_datetime).toLocaleString('fa-IR', {
              dateStyle: 'full',
              timeStyle: 'short',
              timeZone: 'Asia/Tehran',
            })}
          </time>
        </p>
      ) : null}

      {error ? (
        <p className="mb-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {hint ? <p className="mb-3 text-sm text-muted">{hint}</p> : null}

      {status === 'loading' ? (
        <div className="flex justify-center py-4">
          <CarrotLoader variant="grow" label="…" />
        </div>
      ) : null}

      {phase === 'closed' || phase === 'live_or_done' ? (
        <p className="mb-0 text-sm text-muted">
          {phase === 'closed'
            ? 'مهلت ثبت‌نام تمام شده.'
            : 'این جلسه برگزار شده — محتوای بالا آرشیو/خلاصه است.'}
        </p>
      ) : null}

      {phase === 'open' && status === 'guest' ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="mb-0 text-sm text-dark">
            برای ثبت‌نام اول با تلگرام وارد شو.
          </p>
          <CarrotButton href="/join/" variant="community">
            ورود / عضویت
          </CarrotButton>
        </div>
      ) : null}

      {phase === 'open' && status === 'need_profile' ? (
        <p className="mb-0 text-sm text-dark">
          اول{' '}
          <Link href="/join/" className="text-primary underline">
            پروفایلت را کامل کن
          </Link>
          ، بعد برگرد اینجا ثبت‌نام کن.
        </p>
      ) : null}

      {phase === 'open' && status === 'ready' ? (
        <form onSubmit={onRegister} className="space-y-4">
          {needEmail ? (
            <div>
              <label
                className="mb-2 block text-sm font-medium text-dark"
                htmlFor={`event-email-${postSlug}`}
              >
                ایمیل <span className="text-primary">*</span>
              </label>
              <input
                id={`event-email-${postSlug}`}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full"
                placeholder="you@example.com"
                dir="ltr"
              />
              <p className="mt-1 mb-0 text-xs text-muted">
                برای دعوت تقویم و تأیید حضور. عمومی نمی‌شود.
              </p>
            </div>
          ) : null}
          <CarrotButton type="submit" variant="primary" loading={saving}>
            ثبت‌نام در جلسه
          </CarrotButton>
        </form>
      ) : null}

      {status === 'registered' ? (
        <div className="space-y-2">
          <p className="mb-0 text-sm font-medium text-dark">
            ثبت‌نامت ثبت شد ✅
          </p>
          {session.meet_link && phase !== 'live_or_done' ? (
            <p className="mb-0 text-sm">
              <a
                href={session.meet_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
                dir="ltr"
              >
                لینک ورود به جلسه
              </a>
            </p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
