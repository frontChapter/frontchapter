'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';
import { IoGlobeOutline, IoLogoGithub, IoLogoLinkedin } from 'react-icons/io5';

export type SocialKey = 'github_url' | 'linkedin_url' | 'website_url';

type SocialRow = {
  key: SocialKey;
  id: string;
  brand: string;
  labelFa: string;
  placeholder: string;
  icon: ReactNode;
  value: string;
  error?: string | null;
  onChange: (value: string) => void; // eslint-disable-line no-unused-vars
  onBlur?: () => void;
};

type Props = {
  rows: SocialRow[];
  className?: string;
};

/** One LTR stack — brand chip + input glued; no orphan RTL labels */
const JoinSocialLinks = ({ rows, className }: Props) => (
  <div className={clsx('join-social', className)}>
    <div className="join-social__head">
      <p className="join-social__title">لینک‌ها</p>
      <p className="join-social__lede">اختیاری — یوزرنیم یا لینک کامل</p>
    </div>

    <div
      className="join-social__stack"
      role="group"
      aria-label="لینک‌های عمومی"
    >
      {rows.map((row) => (
        <div key={row.key}>
          <label
            className={clsx(
              'join-social__row',
              row.error && 'join-social__row--error'
            )}
            htmlFor={row.id}
          >
            <span className="join-social__brand" title={row.labelFa}>
              <span className="join-social__icon" aria-hidden>
                {row.icon}
              </span>
              <span className="join-social__brand-text">
                <span className="join-social__brand-en">{row.brand}</span>
                <span className="join-social__brand-fa">{row.labelFa}</span>
              </span>
            </span>
            <input
              id={row.id}
              value={row.value}
              onChange={(e) => row.onChange(e.target.value)}
              onBlur={row.onBlur}
              className="join-social__input"
              placeholder={row.placeholder}
              dir="ltr"
              autoComplete="url"
              spellCheck={false}
              aria-label={row.labelFa}
              aria-invalid={Boolean(row.error)}
              aria-describedby={row.error ? `${row.id}-error` : undefined}
            />
          </label>
          {row.error ? (
            <p
              className="join-social__error"
              role="alert"
              id={`${row.id}-error`}
            >
              {row.error}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

export const SOCIAL_ICONS = {
  github: <IoLogoGithub className="h-5 w-5" />,
  linkedin: <IoLogoLinkedin className="h-5 w-5" />,
  website: <IoGlobeOutline className="h-5 w-5" />,
} as const;

export default JoinSocialLinks;
