'use client';

import Banner from '@layouts/components/Banner';
import {
  CarrotBadge,
  CarrotButton,
  CarrotEmptyState,
  CarrotLoader,
} from '@layouts/components/carrot';
import Cta from '@layouts/components/Cta';
import {
  BADGE_LABELS,
  LEVEL_LABELS,
  type LevelKey,
  type MemberStats,
} from '@lib/membership/types';
import { getSupabase } from '@lib/supabase/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  IoGlobeOutline,
  IoLogoGithub,
  IoLogoLinkedin,
  IoPaperPlaneOutline,
} from 'react-icons/io5';

type LoadState = 'loading' | 'ready' | 'error';

const Members = () => {
  const [members, setMembers] = useState<MemberStats[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const supabase = getSupabase();
        const { data, error: qErr } = await supabase
          .from('member_stats')
          .select(
            'id, username, display_name, photo_url, expertise, bio, linkedin_url, github_url, website_url, is_public, profile_completed_at, points_total, level_key, badges'
          )
          .eq('is_public', true)
          .not('profile_completed_at', 'is', null)
          .order('points_total', { ascending: false });

        if (qErr) throw qErr;
        if (!cancelled) {
          setMembers((data as MemberStats[]) ?? []);
          setState('ready');
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'بارگذاری اعضا ناموفق بود');
          setState('error');
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="section pt-0">
        <Banner title="هویجی‌ها" />
        <div className="container">
          <p className="fade mx-auto max-w-2xl text-center text-muted">
            اعضای عمومی جامعه فرانت‌چپتر. سطح‌ها از مشارکت در گروه و رویدادها
            رشد می‌کنن.
          </p>

          {state === 'loading' ? (
            <div className="flex justify-center py-20">
              <CarrotLoader variant="grow" label="در حال چیدن هویجی‌ها…" />
            </div>
          ) : null}

          {state === 'error' ? (
            <div className="mx-auto mt-12 max-w-lg">
              <CarrotEmptyState
                tone="error"
                title="لیست اعضا لود نشد"
                description={error || 'یک بار دیگه امتحان کن.'}
                action={
                  <CarrotButton
                    type="button"
                    variant="primary"
                    onClick={() => window.location.reload()}
                  >
                    تلاش دوباره
                  </CarrotButton>
                }
              />
            </div>
          ) : null}

          {state === 'ready' && members.length === 0 ? (
            <div className="mx-auto mt-12 max-w-lg">
              <CarrotEmptyState
                title="هنوز هویجی عمومی نیست"
                description="اولین نفر باش که پروفایل عمومی می‌سازه."
                actionLabel="هویجی شو!"
                actionHref="/join/"
              />
            </div>
          ) : null}

          {state === 'ready' && members.length > 0 ? (
            <ul className="fade mt-12 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m) => {
                const level = (m.level_key || 'badge') as LevelKey;
                const badges = Array.isArray(m.badges) ? m.badges : [];
                return (
                  <li
                    key={m.id}
                    className="flex flex-col gap-4 border-t border-border pt-6"
                  >
                    <div className="flex items-start gap-4">
                      {m.photo_url ? (
                        <Image
                          src={m.photo_url}
                          alt=""
                          width={64}
                          height={64}
                          className="h-16 w-16 shrink-0 rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-theme-light text-2xl"
                          aria-hidden
                        >
                          🥕
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-dark">
                          {m.display_name}
                        </p>
                        {m.username ? (
                          <p className="text-sm text-muted">@{m.username}</p>
                        ) : null}
                        {m.expertise ? (
                          <p className="mt-1 text-sm text-dark">
                            {m.expertise}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <CarrotBadge accent>{LEVEL_LABELS[level]}</CarrotBadge>
                      <span className="text-xs text-muted">
                        {m.points_total ?? 0} امتیاز
                      </span>
                      {badges.map((b) => (
                        <CarrotBadge key={b}>
                          {BADGE_LABELS[b] ?? b}
                        </CarrotBadge>
                      ))}
                    </div>

                    {m.bio ? (
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted">
                        {m.bio}
                      </p>
                    ) : null}

                    <div className="mt-auto flex flex-wrap gap-3 text-muted">
                      {m.linkedin_url ? (
                        <a
                          href={m.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-primary"
                          aria-label={`لینکدین ${m.display_name}`}
                        >
                          <IoLogoLinkedin className="h-5 w-5" />
                        </a>
                      ) : null}
                      {m.github_url ? (
                        <a
                          href={m.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-primary"
                          aria-label={`گیت‌هاب ${m.display_name}`}
                        >
                          <IoLogoGithub className="h-5 w-5" />
                        </a>
                      ) : null}
                      {m.website_url ? (
                        <a
                          href={m.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-primary"
                          aria-label={`وب‌سایت ${m.display_name}`}
                        >
                          <IoGlobeOutline className="h-5 w-5" />
                        </a>
                      ) : null}
                      {m.username ? (
                        <a
                          href={`https://t.me/${m.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-primary"
                          aria-label={`تلگرام ${m.display_name}`}
                        >
                          <IoPaperPlaneOutline className="h-5 w-5" />
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {state === 'ready' ? (
            <div className="mt-14 text-center">
              <CarrotButton href="/join/" variant="secondary">
                تو هم هویجی شو!
              </CarrotButton>
            </div>
          ) : null}
        </div>
      </section>
      <Cta />
    </>
  );
};

export default Members;
