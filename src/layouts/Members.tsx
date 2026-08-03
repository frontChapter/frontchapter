'use client';

import Banner from '@layouts/components/Banner';
import {
  CarrotButton,
  CarrotEmptyState,
  CarrotLevel,
  CarrotLoader,
} from '@layouts/components/carrot';
import Cta from '@layouts/components/Cta';
import {
  BADGE_LABELS,
  LEVEL_LABELS,
  type LevelKey,
  type MemberStats,
} from '@lib/membership/types';
import { memberPath, memberSlug } from '@lib/membership/slug';
import { getSupabase } from '@lib/supabase/client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type LoadState = 'loading' | 'ready' | 'error';

type Row = MemberStats & { telegram_id: number };

const Members = () => {
  const [members, setMembers] = useState<Row[]>([]);
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
            'id, telegram_id, username, display_name, photo_url, expertise, bio, linkedin_url, github_url, website_url, is_public, profile_completed_at, points_total, level_key, badges'
          )
          .eq('is_public', true)
          .not('profile_completed_at', 'is', null)
          .order('points_total', { ascending: false });

        if (qErr) throw qErr;
        if (!cancelled) {
          setMembers((data as Row[]) ?? []);
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
      <section className="section members-garden pt-0">
        <Banner title="هویجی‌ها" />
        <div className="container">
          <p className="members-garden__lede fade mx-auto mb-10 max-w-xl text-center text-muted">
            باغ جامعه. هر هویج رنگی یک پله رشد است — از مشارکت در گروه و رویدادها.
          </p>

          {state === 'loading' ? (
            <div className="flex justify-center py-20">
              <CarrotLoader variant="bounce" label="در حال چیدن هویجی‌ها…" />
            </div>
          ) : null}

          {state === 'error' ? (
            <div className="mx-auto mt-8 max-w-lg">
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
            <div className="mx-auto mt-8 max-w-lg">
              <CarrotEmptyState
                title="هنوز هویجی عمومی نیست"
                description="اولین نفر باش که پروفایل عمومی می‌سازه."
                actionLabel="هویجی شو!"
                actionHref="/join/"
              />
            </div>
          ) : null}

          {state === 'ready' && members.length > 0 ? (
            <div className="members-garden__bed fade">
              <ul className="members-garden__list list-none p-0">
                {members.map((m, index) => {
                  const level = (m.level_key || 'badge') as LevelKey;
                  const badges = Array.isArray(m.badges) ? m.badges : [];
                  const slug = memberSlug(m);
                  const rank = index + 1;

                  return (
                    <li key={m.id}>
                      <Link
                        href={memberPath(slug)}
                        className={clsx(
                          'members-garden__row group',
                          rank <= 3 && 'members-garden__row--top'
                        )}
                        style={{
                          animationDelay: `${Math.min(index, 16) * 35}ms`,
                        }}
                      >
                        <span
                          className={clsx(
                            'members-garden__rank',
                            rank <= 3
                              ? 'members-garden__rank--hot'
                              : 'members-garden__rank--quiet'
                          )}
                        >
                          {rank}
                        </span>

                        <div className="members-garden__who">
                          {m.photo_url ? (
                            <Image
                              src={m.photo_url}
                              alt=""
                              width={56}
                              height={56}
                              className="members-garden__avatar"
                              unoptimized
                            />
                          ) : (
                            <span
                              className="members-garden__avatar members-garden__avatar--fallback"
                              aria-hidden
                            >
                              ؟
                            </span>
                          )}
                          <div className="members-garden__meta min-w-0">
                            <p className="members-garden__name">
                              {m.display_name}
                            </p>
                            <p className="members-garden__sub">
                              {m.username ? `@${m.username}` : null}
                              {m.username && m.expertise ? ' · ' : null}
                              {m.expertise || null}
                            </p>
                            {m.bio ? (
                              <p className="members-garden__bio">{m.bio}</p>
                            ) : null}
                            {badges.length > 0 ? (
                              <p className="members-garden__badges">
                                {badges
                                  .map((b) => BADGE_LABELS[b] ?? b)
                                  .join(' · ')}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="members-garden__growth">
                          <CarrotLevel
                            level={level}
                            size="md"
                            showLabel={false}
                          />
                          <span className="members-garden__level">
                            {LEVEL_LABELS[level]}
                          </span>
                          <span className="members-garden__points">
                            {m.points_total ?? 0} امتیاز
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
      <Cta />
    </>
  );
};

export default Members;
