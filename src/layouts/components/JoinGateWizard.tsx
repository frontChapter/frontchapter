'use client';

import JoinChipGroup from '@layouts/components/JoinChipGroup';
import JoinSocialLinks, {
  SOCIAL_ICONS,
} from '@layouts/components/JoinSocialLinks';
import { CarrotButton, CarrotProgress } from '@layouts/components/carrot';
import {
  BIO_SUGGESTIONS,
  EXPERIENCE_LEVELS,
  EXPERTISE_TOPICS,
  experienceLabel,
  type ExperienceId,
} from '@lib/membership/join-presets';
import {
  validateGithubInput,
  validateLinkedinInput,
  validateWebsiteInput,
} from '@lib/membership/join-url';
import type { Member } from '@lib/membership/types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IoPersonOutline } from 'react-icons/io5';

export type GateFormState = {
  experienceId: ExperienceId | '';
  expertiseTopics: string[];
  customExpertise: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  is_public: boolean;
};

type FieldErrors = {
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
};

type Props = {
  member: Member | null;
  form: GateFormState;
  setForm: Dispatch<SetStateAction<GateFormState>>;
  saving: boolean;
  onFinish: (includeOptional: boolean) => Promise<void>; // eslint-disable-line no-unused-vars
};

type Pane = 1 | 2 | 3;

const FA_DIGIT = ['۰', '۱', '۲', '۳'] as const;

const JoinGateWizard = ({ member, form, setForm, saving, onFinish }: Props) => {
  const [pane, setPane] = useState<Pane>(1);
  const [paneError, setPaneError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [dir, setDir] = useState<'forward' | 'back'>('forward');
  const topRef = useRef<HTMLFormElement>(null);

  const experienceLabels = EXPERIENCE_LEVELS.map((l) => l.label);
  const selectedExperienceLabel = experienceLabel(form.experienceId);
  const progress = pane === 1 ? 33 : pane === 2 ? 66 : 100;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pane]);

  const go = (next: Pane) => {
    setDir(next > pane ? 'forward' : 'back');
    setPaneError('');
    setPane(next);
  };

  const nextFromExperience = () => {
    if (!form.experienceId) {
      setPaneError('سطح تجربه را انتخاب کن.');
      return;
    }
    go(2);
  };

  const nextFromInterests = () => {
    if (form.expertiseTopics.length === 0 && !form.customExpertise.trim()) {
      setPaneError('حداقل یک حوزه یا علاقه‌مندی انتخاب کن یا بنویس.');
      return;
    }
    go(3);
  };

  const validateOptional = (): boolean => {
    const next: FieldErrors = {
      github_url: validateGithubInput(form.github_url),
      linkedin_url: validateLinkedinInput(form.linkedin_url),
      website_url: validateWebsiteInput(form.website_url),
    };
    setFieldErrors(next);
    const first = next.github_url || next.linkedin_url || next.website_url;
    if (first) {
      setPaneError(first);
      return false;
    }
    return true;
  };

  const submitOptional = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateOptional()) return;
    setPaneError('');
    await onFinish(true);
  };

  const skipOptional = async () => {
    setFieldErrors({});
    setPaneError('');
    await onFinish(false);
  };

  return (
    <form
      ref={topRef}
      onSubmit={
        pane === 3
          ? submitOptional
          : (e) => {
              e.preventDefault();
              if (pane === 1) nextFromExperience();
              else nextFromInterests();
            }
      }
      className="join-panel join-panel--gate join-form"
    >
      {member ? (
        <div className="join-gate-header mb-6 flex items-center gap-3 border-b border-border-secondary pb-5">
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
              unoptimized
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-theme-light text-primary">
              ؟
            </span>
          )}
          <div className="min-w-0">
            <p className="mb-0 truncate font-semibold text-dark">
              {member.display_name}
            </p>
            {member.username ? (
              <p className="mb-0 text-xs text-muted">@{member.username}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted">
          <span>
            قدم {FA_DIGIT[pane]} از ۳{pane === 3 ? ' · اختیاری' : ''}
          </span>
          <span className="text-primary">
            {pane === 1 ? 'تجربه' : pane === 2 ? 'علاقه‌مندی' : 'معرفی'}
          </span>
        </div>
        <CarrotProgress value={progress} label="پیشرفت پروفایل" />
      </div>

      <div
        key={pane}
        className={clsx(
          'join-wizard-pane',
          dir === 'forward'
            ? 'join-wizard-pane--in'
            : 'join-wizard-pane--in-back'
        )}
      >
        {pane === 1 ? (
          <>
            <h2 className="h4 mb-2 text-dark">سطح تجربه‌ات چیه؟</h2>
            <p className="mb-5 text-sm text-muted">
              یکی را انتخاب کن — بعداً هم می‌تونی عوضش کنی.
            </p>
            <JoinChipGroup
              label="سطح تجربه"
              options={experienceLabels}
              selected={
                selectedExperienceLabel ? [selectedExperienceLabel] : []
              }
              onChange={(sel) => {
                const label = sel[0];
                const id =
                  EXPERIENCE_LEVELS.find((l) => l.label === label)?.id ?? '';
                setForm((f) => ({ ...f, experienceId: id }));
                setPaneError('');
              }}
              max={1}
              required
            />
          </>
        ) : null}

        {pane === 2 ? (
          <>
            <h2 className="h4 mb-2 text-dark">به چی علاقه داری؟</h2>
            <p className="mb-5 text-sm text-muted">
              تا ۳ مورد — لازم نیست فقط فرانت باشی.
            </p>
            <JoinChipGroup
              label="علاقه‌مندی و حوزهٔ کاری"
              hint="اگر موردت نبود، پایین بنویس"
              options={EXPERTISE_TOPICS}
              selected={form.expertiseTopics}
              onChange={(topics) => {
                setForm((f) => ({ ...f, expertiseTopics: topics }));
                setPaneError('');
              }}
              max={3}
              required
            />
            <div className="mb-2">
              <label
                className="mb-2 block text-sm font-medium text-dark"
                htmlFor="join-custom-expertise"
              >
                حوزهٔ دیگر (اختیاری)
              </label>
              <input
                id="join-custom-expertise"
                value={form.customExpertise}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    customExpertise: e.target.value,
                  }))
                }
                className="form-input w-full"
                placeholder="مثلاً وکالت، پزشکی، هنر، Java…"
              />
            </div>
          </>
        ) : null}

        {pane === 3 ? (
          <>
            <h2 className="h4 mb-2 text-dark">یک معرفی کوتاه؟</h2>
            <p className="mb-5 text-sm text-muted">
              کاملاً اختیاریه — می‌تونی الان رد شی و بعداً کامل کنی.
            </p>

            <div className="mb-5">
              <p className="mb-2 text-sm font-medium text-dark">معرفی کوتاه</p>
              <div className="mb-2 flex flex-wrap gap-2">
                {BIO_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className={clsx(
                      'join-chip text-xs',
                      form.bio === suggestion && 'join-chip--selected'
                    )}
                    onClick={() => setForm((f) => ({ ...f, bio: suggestion }))}
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
                  id="join-bio"
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
                  id: 'join-github',
                  brand: 'GitHub',
                  labelFa: 'گیت‌هاب',
                  placeholder: '@username or https://…',
                  icon: SOCIAL_ICONS.github,
                  value: form.github_url,
                  error: fieldErrors.github_url,
                  onChange: (v) => {
                    setForm((f) => ({ ...f, github_url: v }));
                    setFieldErrors((fe) => ({
                      ...fe,
                      github_url: validateGithubInput(v),
                    }));
                  },
                  onBlur: () =>
                    setFieldErrors((fe) => ({
                      ...fe,
                      github_url: validateGithubInput(form.github_url),
                    })),
                },
                {
                  key: 'linkedin_url',
                  id: 'join-linkedin',
                  brand: 'LinkedIn',
                  labelFa: 'لینکدین',
                  placeholder: '@handle or https://…',
                  icon: SOCIAL_ICONS.linkedin,
                  value: form.linkedin_url,
                  error: fieldErrors.linkedin_url,
                  onChange: (v) => {
                    setForm((f) => ({ ...f, linkedin_url: v }));
                    setFieldErrors((fe) => ({
                      ...fe,
                      linkedin_url: validateLinkedinInput(v),
                    }));
                  },
                  onBlur: () =>
                    setFieldErrors((fe) => ({
                      ...fe,
                      linkedin_url: validateLinkedinInput(form.linkedin_url),
                    })),
                },
                {
                  key: 'website_url',
                  id: 'join-website',
                  brand: 'Website',
                  labelFa: 'وب‌سایت',
                  placeholder: 'example.com',
                  icon: SOCIAL_ICONS.website,
                  value: form.website_url,
                  error: fieldErrors.website_url,
                  onChange: (v) => {
                    setForm((f) => ({ ...f, website_url: v }));
                    setFieldErrors((fe) => ({
                      ...fe,
                      website_url: validateWebsiteInput(v),
                    }));
                  },
                  onBlur: () =>
                    setFieldErrors((fe) => ({
                      ...fe,
                      website_url: validateWebsiteInput(form.website_url),
                    })),
                },
              ]}
            />

            <label className="mb-2 mt-2 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="form-checkbox mt-1"
                checked={form.is_public}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_public: e.target.checked }))
                }
              />
              <span className="text-sm text-dark">
                پروفایلم در{' '}
                <Link href="/members/" className="text-primary underline">
                  فهرست اعضا
                </Link>{' '}
                نمایش داده شود
                <span className="mt-0.5 block text-muted">
                  پیش‌فرض روشن — می‌توانی بعداً خاموشش کنی.
                </span>
              </span>
            </label>
          </>
        ) : null}
      </div>

      {paneError ? (
        <p className="join-toast join-toast--inline" role="alert">
          {paneError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {pane > 1 ? (
          <CarrotButton
            type="button"
            variant="ghost"
            onClick={() => go((pane - 1) as Pane)}
            disabled={saving}
          >
            قبلی
          </CarrotButton>
        ) : null}

        {pane < 3 ? (
          <CarrotButton type="submit" variant="primary">
            ادامه
          </CarrotButton>
        ) : (
          <>
            <CarrotButton type="submit" variant="primary" loading={saving}>
              ورود به جامعه
            </CarrotButton>
            <CarrotButton
              type="button"
              variant="secondary"
              loading={saving}
              onClick={skipOptional}
            >
              بعداً می‌نویسم
            </CarrotButton>
          </>
        )}
      </div>
    </form>
  );
};

export default JoinGateWizard;
