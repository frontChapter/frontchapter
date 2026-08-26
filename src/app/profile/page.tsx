'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TelegramUser,
  UserProfile,
  TIERS_ORDERED,
} from '../../types/gamification';
import { verifyTelegramAuth } from '../../lib/api';
import TelegramLoginWidget from '../../layouts/components/TelegramLoginWidget';
import {
  TierBadge,
  TierProgressBar,
  CarrotLoader,
} from '../../layouts/components/carrot';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAuth = async (user: TelegramUser) => {
    setLoading(true);
    try {
      const res = await verifyTelegramAuth(user);
      if (res.data?.profile) {
        setCurrentUser(res.data.profile);
      } else {
        // Mock / newly verified state
        setCurrentUser({
          telegram_id: user.id,
          username: user.username || null,
          first_name: user.first_name,
          last_name: user.last_name || null,
          avatar_url: user.photo_url || null,
          coins_balance: 0,
          tier_level: 'havij_neshan',
          is_public: true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme py-12 md:py-20">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-primary">
            <span>🥕 وضعیت کاربری</span>
            <span>·</span>
            <span>هویجی شو</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-dark md:text-4xl">
            سطح و پیشرفت هویجی شما
          </h1>
        </div>

        {!currentUser ? (
          <div className="space-y-6 rounded-3xl border border-border bg-surface-solid p-6 text-center md:p-8">
            <p className="mx-auto max-w-md text-sm text-muted">
              برای مشاهده موجودی هویج، پیشرفت تا سطح بعدی و دسترسی‌های ویژه،
              وارد حساب کاربری خود شوید:
            </p>
            <TelegramLoginWidget onAuth={handleAuth} />
            {loading && <CarrotLoader />}
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface-solid p-6 shadow-lg sm:flex-row sm:items-start md:p-8">
              {currentUser.avatar_url ? (
                <Image
                  src={currentUser.avatar_url}
                  alt={currentUser.first_name}
                  width={80}
                  height={80}
                  className="h-20 w-20 shrink-0 rounded-2xl border-2 border-primary object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface-muted text-3xl font-bold text-primary">
                  🥕
                </div>
              )}
              <div className="flex-1 text-center sm:text-right">
                <div className="mb-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <h2 className="text-xl font-bold text-dark">
                    {currentUser.first_name} {currentUser.last_name || ''}
                  </h2>
                  <TierBadge tier={currentUser.tier_level} size="md" />
                </div>
                {currentUser.username && (
                  <div className="mb-2 text-xs text-muted" dir="ltr">
                    @{currentUser.username}
                  </div>
                )}
                {currentUser.job_title && (
                  <p className="mb-3 text-xs font-medium text-muted">
                    {currentUser.job_title}
                  </p>
                )}
                {currentUser.bio && (
                  <p className="rounded-xl border border-border/40 bg-surface-muted/60 p-3 text-2xs leading-relaxed text-muted/90">
                    {currentUser.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Progression Bar */}
            <TierProgressBar coins={currentUser.coins_balance} />

            {/* How to earn Carrots Guide */}
            <div className="space-y-4 rounded-3xl border border-border bg-surface-solid p-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-dark">
                <span>🥕</span>
                <span>چطور هویج‌های بیشتری جمع کنم؟</span>
              </h3>
              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-surface-muted p-3.5">
                  <div className="mb-1 font-bold text-primary">
                    +۱ هویج (پیام مفید در گروه)
                  </div>
                  <div className="leading-relaxed text-muted">
                    با پاسخ به سوالات فنی دیگران؛ زمانی که ادمین‌ها پیام شما را
                    با{' '}
                    <code className="rounded border border-border bg-surface px-1 py-0.5">
                      /useful
                    </code>{' '}
                    یا{' '}
                    <code className="rounded border border-border bg-surface px-1 py-0.5">
                      +هویج
                    </code>{' '}
                    تایید کنند.
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-surface-muted p-3.5">
                  <div className="mb-1 font-bold text-emerald-600 dark:text-emerald-400">
                    +۲ هویج (میت‌آپ‌های آنلاین)
                  </div>
                  <div className="leading-relaxed text-muted">
                    با شرکت در جلسات هفتگی و آنلاین گوگل میت جامعه که به صورت
                    خودکار ثبت می‌گردد.
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-surface-muted p-3.5">
                  <div className="mb-1 font-bold text-blue-600 dark:text-blue-400">
                    +۵ هویج (ورکشاپ‌ها و دورهمی حضوری)
                  </div>
                  <div className="leading-relaxed text-muted">
                    حضور در کارگاه‌ها و دورهمی‌های حضوری با ثبت‌نام و چک‌این در
                    محل رویداد.
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-surface-muted p-3.5">
                  <div className="mb-1 font-bold text-amber-600 dark:text-amber-400">
                    +۱۰ هویج (همایش سالانه فرانت‌چپتر)
                  </div>
                  <div className="leading-relaxed text-muted">
                    شرکت در بزرگ‌ترین گردهمایی سالانه توسعه‌دهندگان فرانت‌اند
                    ایران.
                  </div>
                </div>
              </div>
            </div>

            {/* Tiers & Perks Table */}
            <div className="space-y-4 rounded-3xl border border-border bg-surface-solid p-6">
              <h3 className="text-base font-bold text-dark">
                سطوح و مزایای تگ‌های هویجی در تلگرام
              </h3>
              <div className="space-y-2.5">
                {TIERS_ORDERED.map((tier) => {
                  const isCurrentTier = currentUser.tier_level === tier.key;
                  return (
                    <div
                      key={tier.key}
                      className={`flex flex-col justify-between gap-3 rounded-2xl border p-3.5 transition-all sm:flex-row sm:items-center ${
                        isCurrentTier
                          ? 'border-orange-500/40 bg-orange-500/10 ring-2 ring-orange-500/20'
                          : 'border-border bg-surface-muted/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <TierBadge tier={tier.key} size="sm" />
                        <span className="text-xs text-muted">
                          ({tier.minCoins}
                          {tier.maxCoins !== null
                            ? ` – ${tier.maxCoins}`
                            : '+'}{' '}
                          هویج)
                        </span>
                      </div>
                      <div className="text-2xs text-dark sm:text-left sm:text-xs">
                        {tier.perks}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/community"
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-orange-600 md:text-sm"
              >
                مشاهده لیدربورد اعضا 🥕
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
