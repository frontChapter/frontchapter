'use client';

import Banner from '@layouts/components/Banner';
import {
  CarrotButton,
  CarrotEmptyState,
  CarrotLevel,
  CarrotLoader,
} from '@layouts/components/carrot';
import Cta from '@layouts/components/Cta';
import MemberSingle from '@layouts/MemberSingle';
import {
  BADGE_LABELS,
  LEVEL_LABELS,
  type LevelKey,
  type MemberStats,
} from '@lib/membership/types';
import type { MemberActivity, MemberProfile } from '@lib/membership/fetch';
import { memberPath, memberSlug, parseMemberSlug } from '@lib/membership/slug';
import { getSupabase } from '@lib/supabase/client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type LoadState = 'loading' | 'ready' | 'error';

type Row = MemberStats & { telegram_id: number };

const PROFILE_SELECT =
  'id, telegram_id, username, display_name, photo_url, expertise, bio, linkedin_url, github_url, website_url, is_public, telegram_joined_at, profile_completed_at, created_at, points_total, level_key, badges';

function MemberProfileByQuery({ slug }: { slug: string }) {
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState('');
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [activities, setActivities] = useState<MemberActivity[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const supabase = getSupabase();
        const parsed = parseMemberSlug(slug);
        let q = supabase
          .from('member_stats')
          .select(PROFILE_SELECT)
          .eq('is_public', true)
          .not('profile_completed_at', 'is', null);

        q =
          parsed.kind === 'telegram_id'
            ? q.eq('telegram_id', parsed.value)
            : q.ilike('username', parsed.value);

        const { data, error: qErr } = await q.maybeSingle();
        if (qErr) throw qErr;
        if (!data) {
          if (!cancelled) {
            setMember(null);
            setState('ready');
          }
          return;
        }

        const { data: acts, error: aErr } = await supabase
          .from('activity_log')
          .select('id, activity_type, points, created_at')
          .eq('member_id', data.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (aErr) throw aErr;

        if (!cancelled) {
          setMember(data as MemberProfile);
          setActivities((acts as MemberActivity[]) ?? []);
          setState('ready');
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : 'بارگذاری پروفایل ناموفق بود'
          );
          setState('error');
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state === 'loading') {
    return (
      <div className="flex justify-center py-20">
        <CarrotLoader variant="bounce" label="در حال باز کردن پروفایل…" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="mx-auto mt-8 max-w-lg">
        <CarrotEmptyState
          tone="error"
          title="پروفایل لود نشد"
          description={error || 'یک بار دیگه امتحان کن.'}
          action={
            <CarrotButton variant="primary" href="/members/">
              بازگشت به هویجی‌ها
            </CarrotButton>
          }
        />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mx-auto mt-8 max-w-lg">
        <CarrotEmptyState
          title="هویجی یافت نشد"
          description="این پروفایل عمومی نیست یا وجود نداره."
          actionLabel="هویجی‌ها"
          actionHref="/members/"
        />
      </div>
    );
  }

  return <MemberSingle member={member} activities={activities} />;
}

function MemberDirectory({ members }: { members: Row[] }) {
  return (
    <>
      <section className="section members-garden pt-0">
        <Banner title="هویجی‌ها" />
        <div className="container">
          <p className="members-garden__lede fade mx-auto mb-10 max-w-xl text-center text-muted">
            باغ جامعه. هر هویج رنگی یک پله رشد است — از مشارکت در گروه و
            رویدادها.
          </p>

          {members.length === 0 ? (
            <div className="mx-auto mt-8 max-w-lg">
              <CarrotEmptyState
                title="هنوز هویجی عمومی نیست"
                description="اولین نفر باش که پروفایل عمومی می‌سازه."
                actionLabel="هویجی شو!"
                actionHref="/join/"
              />
            </div>
          ) : null}

          {members.length > 0 ? (
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
}

function MembersRouter({ members }: { members: Row[] }) {
  const search = useSearchParams();
  const slug = search.get('m')?.trim();

  if (slug) {
    return <MemberProfileByQuery slug={slug} />;
  }

  return <MemberDirectory members={members} />;
}

const Members = ({ members }: { members: Row[] }) => (
  <Suspense
    fallback={
      <div className="flex justify-center py-20">
        <CarrotLoader variant="bounce" label="در حال بارگذاری…" />
      </div>
    }
  >
    <MembersRouter members={members} />
  </Suspense>
);

export default Members;
