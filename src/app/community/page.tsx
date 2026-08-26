'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { UserProfile, TIERS_ORDERED } from '../../types/gamification';
import { getCommunityMembers } from '../../lib/api';
import {
  TierBadge,
  CarrotEmptyState,
  CarrotLoader,
  CarrotButton,
} from '../../layouts/components/carrot';

export default function CommunityPage() {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      try {
        const { members } = await getCommunityMembers({
          tier: selectedTier,
          query: searchQuery,
        });
        setMembers(members);
      } catch (err) {
        console.error('Failed to load community members', err);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, [selectedTier, searchQuery]);

  // Top 3 Leaderboard highlight
  const topMembers = useMemo(() => {
    return members.slice(0, 3);
  }, [members]);

  return (
    <div className="min-h-screen bg-theme py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header Hero */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-primary">
            <span>🥕 جامعه فرانت‌چپتر</span>
            <span>·</span>
            <span>لیدربورد اعضا</span>
          </div>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-dark md:text-5xl">
            دایرکتوری و رتبه‌بندی اعضای جامعه
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-sm text-muted md:text-base">
            با مشارکت در پاسخ به سوالات فنی، شرکت در جلسات و همایش‌ها، امتیاز
            هویجی کسب کنید و در جمع فعال‌ترین اعضای جامعه فرانت‌اند ایران
            بدرخشید.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <CarrotButton href="/join" variant="primary">
              هویجی شو و دریافت نشان 🥕
            </CarrotButton>
            <CarrotButton
              href="https://t.me/frontchapter"
              target="_blank"
              rel="noopener noreferrer"
              variant="community"
            >
              عضویت در گروه تلگرام ✈️
            </CarrotButton>
          </div>
        </div>

        {/* Search & Tier Filter Bar */}
        <div className="mx-auto mb-10 max-w-4xl space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس نام، نام کاربری یا تخصص شغلی..."
                className="w-full rounded-2xl border border-border bg-surface-solid py-3 pl-10 pr-4 text-sm text-dark placeholder:text-muted shadow-sm focus:border-primary focus:outline-none"
              />
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">
                🔍
              </span>
            </div>
          </div>

          {/* Tier Tabs */}
          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedTier('all')}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedTier === 'all'
                  ? 'border-primary bg-primary text-white shadow-sm'
                  : 'border-border bg-surface-solid text-muted hover:border-primary/50'
              }`}
            >
              همه سطوح ({members.length})
            </button>

            {TIERS_ORDERED.map((tier) => (
              <button
                key={tier.key}
                type="button"
                onClick={() => setSelectedTier(tier.key)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedTier === tier.key
                    ? 'border-primary bg-primary text-white shadow-sm'
                    : 'border-border bg-surface-solid text-muted hover:border-primary/50'
                }`}
              >
                <span>{tier.badgeEmoji}</span>
                <span>{tier.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium (when showing 'all' and no active query) */}
        {selectedTier === 'all' && !searchQuery && topMembers.length >= 3 && (
          <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {/* Rank 2 */}
            <div className="order-2 relative flex flex-col items-center justify-between rounded-3xl border border-border bg-surface-solid p-6 text-center shadow-md transition-all hover:shadow-lg md:order-1">
              <div className="absolute right-4 top-4 text-xl">🥈</div>
              <div className="flex flex-col items-center">
                {topMembers[1].avatar_url ? (
                  <Image
                    src={topMembers[1].avatar_url}
                    alt={topMembers[1].first_name}
                    width={64}
                    height={64}
                    className="mb-3 h-16 w-16 rounded-full border-2 border-slate-400 object-cover"
                  />
                ) : (
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {topMembers[1].first_name[0]}
                  </div>
                )}
                <h3 className="text-base font-bold text-dark">
                  {topMembers[1].first_name} {topMembers[1].last_name || ''}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-2xs text-muted">
                  {topMembers[1].job_title || 'عضو فعال فرانت‌چپتر'}
                </p>
                <div className="mt-3">
                  <TierBadge tier={topMembers[1].tier_level} size="sm" />
                </div>
              </div>
              <div className="mt-4 w-full border-t border-border/60 pt-3 text-center">
                <span className="text-lg font-black text-primary">
                  {topMembers[1].coins_balance}
                </span>{' '}
                <span className="text-2xs text-muted">هویج</span>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="order-1 relative flex flex-col items-center justify-between rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-surface-solid to-surface-solid p-7 text-center shadow-xl transition-all hover:shadow-2xl md:order-2 md:-translate-y-2">
              <div className="absolute right-4 top-4 animate-bounce text-2xl">
                👑
              </div>
              <div className="flex flex-col items-center">
                {topMembers[0].avatar_url ? (
                  <Image
                    src={topMembers[0].avatar_url}
                    alt={topMembers[0].first_name}
                    width={80}
                    height={80}
                    className="mb-3 h-20 w-20 rounded-full border-4 border-amber-500 object-cover shadow-md"
                  />
                ) : (
                  <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-100 text-2xl font-bold text-amber-600 dark:bg-amber-950/60">
                    {topMembers[0].first_name[0]}
                  </div>
                )}
                <h3 className="text-lg font-extrabold text-dark">
                  {topMembers[0].first_name} {topMembers[0].last_name || ''}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                  {topMembers[0].job_title || 'عضو طلایی فرانت‌چپتر'}
                </p>
                <div className="mt-3">
                  <TierBadge tier={topMembers[0].tier_level} size="md" />
                </div>
              </div>
              <div className="mt-4 w-full border-t border-border/60 pt-3 text-center">
                <span className="text-2xl font-black text-amber-500">
                  {topMembers[0].coins_balance}
                </span>{' '}
                <span className="text-xs font-bold text-muted">هویج</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="order-3 relative flex flex-col items-center justify-between rounded-3xl border border-border bg-surface-solid p-6 text-center shadow-md transition-all hover:shadow-lg">
              <div className="absolute right-4 top-4 text-xl">🥉</div>
              <div className="flex flex-col items-center">
                {topMembers[2].avatar_url ? (
                  <Image
                    src={topMembers[2].avatar_url}
                    alt={topMembers[2].first_name}
                    width={64}
                    height={64}
                    className="mb-3 h-16 w-16 rounded-full border-2 border-amber-700/60 object-cover"
                  />
                ) : (
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-900/10 text-xl font-bold text-amber-800 dark:text-amber-200">
                    {topMembers[2].first_name[0]}
                  </div>
                )}
                <h3 className="text-base font-bold text-dark">
                  {topMembers[2].first_name} {topMembers[2].last_name || ''}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-2xs text-muted">
                  {topMembers[2].job_title || 'عضو فعال فرانت‌چپتر'}
                </p>
                <div className="mt-3">
                  <TierBadge tier={topMembers[2].tier_level} size="sm" />
                </div>
              </div>
              <div className="mt-4 w-full border-t border-border/60 pt-3 text-center">
                <span className="text-lg font-black text-primary">
                  {topMembers[2].coins_balance}
                </span>{' '}
                <span className="text-2xs text-muted">هویج</span>
              </div>
            </div>
          </div>
        )}

        {/* Member Grid List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <CarrotLoader />
          </div>
        ) : members.length === 0 ? (
          <div className="mx-auto max-w-md py-12">
            <CarrotEmptyState
              tone="empty"
              title="عضوی با این مشخصات یافت نشد"
              description="می‌توانید فیلتر جستجو را تغییر دهید یا خودتان اولین نفری باشید که در این دسته هویجی می‌شود!"
            />
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => {
              const rank = index + 1;
              return (
                <div
                  key={member.telegram_id || member.id || index}
                  className="group flex flex-col justify-between rounded-3xl border border-border bg-surface-solid p-5 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    {/* Top Row: Rank & Badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <span className="font-bold text-dark">#{rank}</span>
                        <span>رتبه</span>
                      </div>
                      <TierBadge tier={member.tier_level} size="sm" />
                    </div>

                    {/* User Info */}
                    <div className="mb-3 flex items-start gap-3.5">
                      {member.avatar_url ? (
                        <Image
                          src={member.avatar_url}
                          alt={member.first_name}
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-2xl border border-border object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface-muted text-lg font-bold text-primary">
                          🥕
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-dark">
                          {member.first_name} {member.last_name || ''}
                        </h4>
                        {member.username && (
                          <div
                            className="truncate text-2xs text-muted"
                            dir="ltr"
                          >
                            @{member.username}
                          </div>
                        )}
                        {member.job_title && (
                          <p className="mt-1 line-clamp-1 text-2xs text-muted/90">
                            {member.job_title}
                          </p>
                        )}
                      </div>
                    </div>

                    {member.bio && (
                      <p className="line-clamp-2 rounded-xl border border-border/40 bg-surface-muted/50 p-2.5 text-2xs leading-relaxed text-muted">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  {/* Footer Coins Count */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                    <span className="text-muted">موجودی هویج:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-primary">
                        {member.coins_balance}
                      </span>
                      <span className="text-2xs text-muted">هویج</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
