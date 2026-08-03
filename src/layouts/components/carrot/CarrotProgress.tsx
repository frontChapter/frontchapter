import clsx from 'clsx';

type Props = {
  /** 0–100 */
  value?: number;
  /** Indeterminate growth loop when value omitted */
  label?: string;
  className?: string;
};

/** Growth-as-progress — soil bar fills with primary (no carrot icon spam) */
const CarrotProgress = ({ value, label, className }: Props) => {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? undefined : Math.max(0, Math.min(100, value));

  return (
    <div
      className={clsx('carrot-progress', className)}
      role="progressbar"
      aria-label={label ?? 'پیشرفت'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-valuetext={indeterminate ? 'در حال پیشرفت' : `${clamped} درصد`}
    >
      <div className="carrot-progress__track">
        <div
          className={clsx(
            'carrot-progress__fill',
            indeterminate && 'carrot-progress__fill--indeterminate'
          )}
          style={clamped !== undefined ? { width: `${clamped}%` } : undefined}
        />
      </div>
      {label ? <span className="carrot-progress__label">{label}</span> : null}
    </div>
  );
};

export default CarrotProgress;
