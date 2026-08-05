'use client';

import { CarrotButton, CarrotLoader } from '@layouts/components/carrot';
import { downloadEventIcs } from '@lib/membership/ics';
import { sessionPhase, type SessionFrontmatter } from '@lib/membership/session';
import { getSupabase } from '@lib/supabase/client';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';

type Props = {
  postSlug: string;
  eventTitle: string;
  session: SessionFrontmatter;
};

type Status =
  | 'loading'
  | 'guest'
  | 'need_profile'
  | 'ready'
  | 'registered'
  | 'hidden';

function googleCalendarAddUrl(
  title: string,
  sessionDatetime: string,
  eventUrl: string,
  meetLink?: string
) {
  const start = new Date(sessionDatetime);
  if (!Number.isFinite(start.getTime())) return '';
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `${title}\n${eventUrl}`,
    location: meetLink || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function EventRegister({
  postSlug,
  eventTitle,
  session,
}: Props) {
  const phase = sessionPhase(session);
  const [status, setStatus] = useState<Status>('loading');
  const [email, setEmail] = useState('');
  const [needEmail, setNeedEmail] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hint, setHint] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [calendarUrl, setCalendarUrl] = useState('');
  const [meetLink, setMeetLink] = useState(session.meet_link || '');

  const runFollowups = useCallback(async () => {
    const supabase = getSupabase();
    const eventPageUrl = `https://frontchapter.ir/posts/${postSlug}/`;
    const fallbackCal = session.session_datetime
      ? googleCalendarAddUrl(
          eventTitle,
          session.session_datetime,
          eventPageUrl,
          meetLink || session.meet_link
        )
      : '';
    const { data, error: fnErr } = await supabase.functions.invoke(
      'event-ops',
      {
        body: {
          action: 'register_event_followups',
          post_slug: postSlug,
          event_title: eventTitle,
          event_url: eventPageUrl,
          meet_link: meetLink || session.meet_link || '',
          session_datetime: session.session_datetime || '',
        },
      }
    );
    if (fnErr) throw fnErr;
    const res = data as {
      error?: string;
      invite_sent?: boolean;
      invite_error?: string | null;
      calendar_add_url?: string | null;
      meet_link?: string | null;
    };
    if (res?.error && !res.calendar_add_url) throw new Error(res.error);
    const url = res.calendar_add_url || fallbackCal;
    if (url) setCalendarUrl(url);
    if (res.meet_link) setMeetLink(res.meet_link);
    if (res.invite_sent) {
      setHint((h) => `${h} دعوت‌نامه Calendar به ایمیلت ارسال شد.`.trim());
    } else {
      setHint((h) =>
        `${h} ایونت را به Calendar اضافه کن یا .ics دانلود کن.`
          .replace(/\s+/g, ' ')
          .trim()
      );
    }
    if (res.invite_error) console.warn('calendar invite:', res.invite_error);
  }, [
    eventTitle,
    meetLink,
    postSlug,
    session.meet_link,
    session.session_datetime,
  ]);

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
        .select('profile_completed_at, is_admin')
        .eq('id', uid)
        .maybeSingle();
      setIsAdmin(Boolean(member?.is_admin));
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
        .select('id, meet_link')
        .eq('post_slug', postSlug)
        .maybeSingle();
      if (ev?.meet_link) setMeetLink(String(ev.meet_link));
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

  useEffect(() => {
    if (status !== 'registered' || !session.session_datetime || calendarUrl) {
      return;
    }
    setCalendarUrl(
      googleCalendarAddUrl(
        eventTitle,
        session.session_datetime,
        `https://frontchapter.ir/posts/${postSlug}/`,
        meetLink || session.meet_link
      )
    );
  }, [
    status,
    calendarUrl,
    eventTitle,
    postSlug,
    meetLink,
    session.meet_link,
    session.session_datetime,
  ]);

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

      try {
        await runFollowups();
      } catch (e) {
        console.error('event followups failed', e);
        if (session.session_datetime) {
          setCalendarUrl(
            googleCalendarAddUrl(
              eventTitle,
              session.session_datetime,
              `https://frontchapter.ir/posts/${postSlug}/`,
              meetLink || session.meet_link
            )
          );
        }
        setHint((h) =>
          `${h} افزودن خودکار به Calendar ناموفق بود — از دکمه‌های زیر استفاده کن.`
            .replace(/\s+/g, ' ')
            .trim()
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ثبت‌نام ناموفق بود');
    } finally {
      setSaving(false);
    }
  };

  const onPublishTest = async () => {
    setPublishing(true);
    setError('');
    setHint('');
    try {
      const supabase = getSupabase();
      const scheduledFor = new Date(
        Date.now() + 3 * 60 * 60 * 1000
      ).toISOString();
      const origin = window.location.origin;
      const imagePath = session.image || '';
      const imageUrl = imagePath
        ? imagePath.startsWith('http')
          ? imagePath
          : `${origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
        : '';
      const social = session.social || {};
      const speaker = session.speaker || {};
      const { data, error: fnErr } = await supabase.functions.invoke(
        'event-ops',
        {
          body: {
            action: 'publish_event_test',
            post_slug: postSlug,
            event_title: eventTitle,
            event_url: `https://frontchapter.ir/posts/${postSlug}/`,
            session_datetime: session.session_datetime || '',
            meet_link: session.meet_link || '',
            scheduled_for: scheduledFor,
            image_url: imageUrl,
            image_alt: session.image_alt || eventTitle,
            social: {
              telegram: social.telegram || '',
              linkedin: social.linkedin || '',
              linkedin_first_comment: social.linkedin_first_comment || '',
              twitter: social.twitter || '',
              instagram: social.instagram || '',
              instagram_first_comment: social.instagram_first_comment || '',
            },
            speaker: {
              linkedin: speaker.linkedin || '',
              instagram: speaker.instagram || '',
              instagram_tag_x: speaker.instagram_tag_x ?? 0.7,
              instagram_tag_y: speaker.instagram_tag_y ?? 0.35,
            },
          },
        }
      );
      if (fnErr) {
        throw new Error(
          fnErr.message.includes('Failed to send')
            ? 'ارتباط با سرور قطع شد (timeout). یک‌بار دیگر امتحان کن.'
            : fnErr.message
        );
      }
      const payload = data as {
        error?: string;
        buffer_error?: string | null;
        meet_link?: string | null;
        calendar_error?: string | null;
      };
      if (payload?.error) throw new Error(payload.error);
      if (payload.meet_link) setMeetLink(payload.meet_link);
      const parts = [
        'ارسال تلگرام انجام شد و Buffer برای ۳ ساعت بعد schedule شد.',
      ];
      if (payload.meet_link) parts.push(`Meet: ${payload.meet_link}`);
      if (payload.calendar_error) {
        parts.push(`Calendar: ${payload.calendar_error}`);
      }
      if (payload.buffer_error) parts.push(`(${payload.buffer_error})`);
      setHint(parts.join(' '));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'انتشار تستی ناموفق بود');
    } finally {
      setPublishing(false);
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

      {isAdmin ? (
        <div className="mb-4">
          <CarrotButton
            type="button"
            variant="secondary"
            loading={publishing}
            onClick={onPublishTest}
          >
            انتشار تستی (تلگرام + Buffer تا ۳ ساعت بعد)
          </CarrotButton>
        </div>
      ) : null}

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
        <div className="space-y-3">
          <p className="mb-0 text-sm font-medium text-dark">
            ثبت‌نامت ثبت شد ✅
          </p>
          <div className="flex flex-wrap gap-2">
            {calendarUrl ? (
              <CarrotButton
                href={calendarUrl}
                variant="primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                افزودن به Google Calendar
              </CarrotButton>
            ) : null}
            {session.session_datetime ? (
              <CarrotButton
                type="button"
                variant="secondary"
                onClick={() => {
                  try {
                    downloadEventIcs({
                      uid: postSlug,
                      title: eventTitle,
                      sessionDatetime: session.session_datetime!,
                      eventUrl: `https://frontchapter.ir/posts/${postSlug}/`,
                      meetLink: meetLink || session.meet_link,
                    });
                  } catch (e) {
                    setError(
                      e instanceof Error ? e.message : 'دانلود ICS ناموفق'
                    );
                  }
                }}
              >
                دانلود .ics
              </CarrotButton>
            ) : null}
          </div>
          {(meetLink || session.meet_link) &&
          phase !== 'live_or_done' &&
          !(meetLink || session.meet_link || '').includes('test-session') ? (
            <p className="mb-0 text-sm">
              <a
                href={meetLink || session.meet_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
                dir="ltr"
              >
                لینک ورود به جلسه (Meet)
              </a>
            </p>
          ) : (
            <p className="mb-0 text-xs text-muted">
              لینک Meet بعد از انتشار ادمین / ساخت Calendar آماده می‌شود.
            </p>
          )}
          <p className="mb-0 text-xs text-muted">
            برای یادآوری تلگرام، یک‌بار بات را با /start باز کن.
          </p>
        </div>
      ) : null}
    </aside>
  );
}
