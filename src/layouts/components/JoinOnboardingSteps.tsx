import clsx from 'clsx';

const STEPS = [
  { key: 'welcome', label: 'شروع' },
  { key: 'charter', label: 'میثاق‌نامه' },
  { key: 'profile', label: 'پروفایل' },
  { key: 'done', label: 'خوش‌آمدی' },
] as const;

export type OnboardingStepKey = (typeof STEPS)[number]['key'];

type Props = {
  current: OnboardingStepKey;
};

const JoinOnboardingSteps = ({ current }: Props) => {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <ol
      className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm"
      aria-label="مراحل عضویت در جامعه"
    >
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = step.key === current;
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={clsx(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                done && 'border-primary bg-primary text-white',
                active && !done && 'border-primary bg-theme-light text-primary',
                !done && !active && 'border-border text-muted'
              )}
            >
              {done ? '✓' : idx + 1}
            </span>
            <span
              className={clsx(
                active || done ? 'font-semibold text-dark' : 'text-muted'
              )}
            >
              {step.label}
            </span>
            {idx < STEPS.length - 1 ? (
              <span className="text-light mx-1 hidden sm:inline" aria-hidden>
                —
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
};

export default JoinOnboardingSteps;
