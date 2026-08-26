'use client';

import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TelegramLoginWidget from '../../layouts/components/TelegramLoginWidget';
import {
  CarrotButton,
  CarrotLoader,
  CarrotSuccessState,
  TierBadge,
} from '../../layouts/components/carrot';
import { completeOnboarding, verifyTelegramAuth } from '../../lib/api';
import { TelegramUser } from '../../types/gamification';

type OnboardingStep =
  | 'STEP_AUTH'
  | 'STEP_PROFILE'
  | 'STEP_RULES'
  | 'STEP_SUCCESS';

function JoinContent() {
  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get('chat_id');

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('STEP_AUTH');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // Rules Checkboxes
  const [rule1, setRule1] = useState<boolean>(false);
  const [rule2, setRule2] = useState<boolean>(false);
  const [rule3, setRule3] = useState<boolean>(false);

  const allRulesAccepted = rule1 && rule2 && rule3;

  const handleTelegramAuth = async (user: TelegramUser) => {
    setTelegramUser(user);
    setLoading(true);
    setErrorMsg(null);

    // Default full name from Telegram payload
    const initialName = [user.first_name, user.last_name]
      .filter(Boolean)
      .join(' ');
    setFullName(initialName);

    try {
      const res = await verifyTelegramAuth(user);
      if (res.data?.exists && res.data.profile) {
        setJobTitle(res.data.profile.job_title || '');
        setBio(res.data.profile.bio || '');
        setEmail(res.data.profile.email || '');
        setIsPublic(res.data.profile.is_public ?? true);
      }
      setCurrentStep('STEP_PROFILE');
    } catch {
      setErrorMsg('خطا در اعتبارسنجی حساب کاربری. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep('STEP_RULES');
  };

  const handleCompleteRegistration = async () => {
    if (!telegramUser || !allRulesAccepted) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const nameParts = fullName.trim().split(' ');
      const fName = nameParts[0];
      const lName = nameParts.slice(1).join(' ') || undefined;

      const res = await completeOnboarding({
        telegramAuth: telegramUser,
        profile: {
          first_name: fName,
          last_name: lName,
          job_title: jobTitle.trim() || undefined,
          bio: bio.trim() || undefined,
          email: email.trim() || undefined,
          is_public: isPublic,
        },
        rules_accepted: true,
      });

      if (res.success) {
        setCurrentStep('STEP_SUCCESS');
      } else {
        setErrorMsg(res.message || 'خطا در ثبت نهایی اطلاعات.');
      }
    } catch {
      setErrorMsg('مشکلی در اتصال به سرور رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const telegramReturnUrl = chatIdFromUrl
    ? `https://t.me/c/${chatIdFromUrl.replace(/^-100/, '')}`
    : 'https://t.me/frontchapter';

  return (
    <div className="min-h-screen bg-theme py-12 md:py-20">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header Title */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-primary">
            <span>🥕 هویجی شو</span>
            <span>·</span>
            <span>فرانت‌چپتر</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-dark md:text-3xl">
            تایید عضویت و دریافت نشان هویجی
          </h1>
          <p className="mt-2 text-sm text-muted">
            برای تعامل در گروه تلگرام فرانت‌چپتر و ثبت امتیازهای مشارکت در
            رویدادها
          </p>
        </div>

        {/* Step Indicator */}
        <div className="relative mb-8 flex items-center justify-between px-4">
          <div className="-z-0 absolute left-8 right-8 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
          {[
            { id: 'STEP_AUTH', label: 'ورود تلگرام', stepNum: 1 },
            { id: 'STEP_PROFILE', label: 'اطلاعات پروفایل', stepNum: 2 },
            { id: 'STEP_RULES', label: 'پذیرش مرام‌نامه', stepNum: 3 },
            { id: 'STEP_SUCCESS', label: 'عضویت رسمی', stepNum: 4 },
          ].map((item, idx) => {
            const stepOrder = [
              'STEP_AUTH',
              'STEP_PROFILE',
              'STEP_RULES',
              'STEP_SUCCESS',
            ];
            const currentIndex = stepOrder.indexOf(currentStep);
            const isDone = currentIndex > idx;
            const isCurrent = currentStep === item.id;

            return (
              <div
                key={item.id}
                className="relative z-10 flex flex-col items-center"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-md'
                      : isCurrent
                        ? 'bg-primary text-white shadow-md ring-4 ring-orange-500/20'
                        : 'border border-border bg-surface-solid text-muted'
                  }`}
                >
                  {isDone ? '✓' : item.stepNum}
                </div>
                <span
                  className={`mt-1.5 hidden text-2xs sm:block ${
                    isCurrent ? 'font-bold text-dark' : 'text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-xs text-red-600 dark:text-red-400 md:text-sm">
            {errorMsg}
          </div>
        )}

        {/* Wizard Card Container */}
        <div className="rounded-3xl border border-border bg-surface-solid p-6 shadow-xl backdrop-blur-md md:p-8">
          {/* STEP 1: AUTH */}
          {currentStep === 'STEP_AUTH' && (
            <div>
              <TelegramLoginWidget onAuth={handleTelegramAuth} />
              {loading && (
                <div className="mt-4 flex justify-center">
                  <CarrotLoader />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PROFILE FORM */}
          {currentStep === 'STEP_PROFILE' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-surface-muted p-3">
                {telegramUser?.photo_url ? (
                  <Image
                    src={telegramUser.photo_url}
                    alt={fullName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border-2 border-primary/40 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
                    🥕
                  </div>
                )}
                <div>
                  <div className="text-xs text-muted">
                    حساب تلگرام متصل شده:
                  </div>
                  <div className="text-sm font-bold text-dark">
                    @
                    {telegramUser?.username ||
                      telegramUser?.first_name ||
                      'تلگرام'}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-dark">
                  نام و نام خانوادگی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: صالح شجاعی"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-dark transition-colors focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-dark">
                  عنوان شغلی / تخصص
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="مثال: Senior Frontend Engineer"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-dark transition-colors focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-dark">
                  درباره من (بیوگرافی کوتاه)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="چند کلمه درباره علایق فنی، حوزه‌های کاری یا تجربیات خود بنویسید..."
                  className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-dark transition-colors focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-dark">
                  ایمیل (اختیاری جهت اطلاع‌رسانی همایش‌ها)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-left text-sm text-dark transition-colors focus:border-primary focus:outline-none"
                  dir="ltr"
                />
              </div>

              {/* Public Profile Toggle */}
              <div className="pt-2">
                <label className="flex cursor-pointer select-none items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-dark">
                    نمایش پروفایل من در دایرکتوری عمومی کامیونتی و لیدربورد
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <CarrotButton
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  مرحله بعد: مرام‌نامه و قوانین →
                </CarrotButton>
              </div>
            </form>
          )}

          {/* STEP 3: RULES & COVENANT */}
          {currentStep === 'STEP_RULES' && (
            <div className="space-y-5">
              <div className="pb-2 text-center">
                <h3 className="mb-1 text-base font-bold text-dark">
                  مرام‌نامه و اصول اخلاقی کامیونتی فرانت‌چپتر
                </h3>
                <p className="text-xs text-muted">
                  هدف ما ایجاد فضایی امن، دوستانه و ارزش‌آفرین برای همه فعالان
                  وب است.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl border border-border/80 bg-surface-muted p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={rule1}
                    onChange={(e) => setRule1(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="text-xs leading-relaxed text-dark">
                    <strong className="mb-0.5 block text-dark">
                      احترام متقابل و ادبیات حرفه‌ای:
                    </strong>
                    تعهد می‌دهم در تمام گفتگوهای گروه و رویدادها، با احترام و
                    بدون توهین یا تعصب رفتار کنم.
                  </div>
                </label>

                <div className="h-px bg-border/40" />

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={rule2}
                    onChange={(e) => setRule2(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="text-xs leading-relaxed text-dark">
                    <strong className="mb-0.5 block text-dark">
                      پرهیز از اسپم و تبلیغات غیرمرتبط:
                    </strong>
                    از ارسال تبلیغات، پیام‌های تجاری و لینک‌های غیرمرتبط به گروه
                    خودداری می‌کنم.
                  </div>
                </label>

                <div className="h-px bg-border/40" />

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={rule3}
                    onChange={(e) => setRule3(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="text-xs leading-relaxed text-dark">
                    <strong className="mb-0.5 block text-dark">
                      فرهنگ اشتراک‌گذاری و بازخورد سازنده:
                    </strong>
                    تلاش می‌کنم در حل چالش‌های فنی همکاران مشارکت داشته و در
                    مسیر رشد جامعه فرانت‌اند کوشا باشم.
                  </div>
                </label>
              </div>

              <div className="flex flex-col items-center justify-between gap-3 pt-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCurrentStep('STEP_PROFILE')}
                  className="text-xs text-muted transition-colors hover:text-dark"
                >
                  ← بازگشت به ویرایش پروفایل
                </button>
                <CarrotButton
                  type="button"
                  variant="primary"
                  onClick={handleCompleteRegistration}
                  disabled={!allRulesAccepted || loading}
                  className="w-full sm:w-auto"
                >
                  {loading
                    ? 'در حال فعال‌سازی...'
                    : 'تایید نهایی و هویجی شدن 🥕'}
                </CarrotButton>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {currentStep === 'STEP_SUCCESS' && (
            <div className="space-y-6 py-4 text-center">
              <CarrotSuccessState
                title="تبریک! شما رسماً هویجی شدید 🎉"
                description="حساب تلگرام شما تایید شد و دسترسی کامل به گروه فرانت‌چپتر با تگ هویج‌نشان برای شما فعال گردید."
              />

              <div className="mx-auto max-w-md rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                <div className="mb-2 text-xs text-muted">
                  تگ جدید شما در گروه تلگرام:
                </div>
                <div className="inline-flex items-center gap-2">
                  <TierBadge tier="havij_neshan" size="lg" />
                </div>
                <p className="mt-2 text-2xs text-muted">
                  با پاسخ مفید به سوالات دوستان و شرکت در رویدادها، تگ و
                  نشان‌های بالاتری مثل «هویج‌طلا» دریافت کنید!
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                <CarrotButton
                  href={telegramReturnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="community"
                  className="w-full text-sm sm:w-auto"
                >
                  بازگشت به گروه تلگرام ✈️
                </CarrotButton>
                <Link
                  href="/community"
                  className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-dark transition-colors hover:bg-surface-muted md:text-sm"
                >
                  مشاهده لیدربورد اعضا 🥕
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-theme">
          <CarrotLoader />
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}
