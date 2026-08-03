import clsx from 'clsx';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type CarrotButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'community'
  | 'destructive';

type Base = {
  variant?: CarrotButtonVariant;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

type Props = Base &
  (
    | ({ href: string; target?: string; rel?: string } & Omit<
        ButtonHTMLAttributes<HTMLAnchorElement>,
        'href' | 'type'
      >)
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

/** Clean CTA — carrot personality via motion/hover/loading, not icons */
const VARIANT_CLASS: Record<CarrotButtonVariant, string> = {
  primary:
    'carrot-btn--primary bg-primary text-white shadow-md shadow-primary/25',
  community:
    'carrot-btn--community bg-primary text-white shadow-md shadow-primary/30',
  secondary:
    'carrot-btn--secondary border border-primary bg-theme-light text-primary',
  ghost: 'carrot-btn--ghost border border-border bg-surface-solid text-dark',
  destructive:
    'carrot-btn--destructive border border-red-400 bg-red-50 text-red-700',
};

const CarrotButton = ({
  variant = 'primary',
  children,
  className,
  disabled,
  loading = false,
  href,
  ...rest
}: Props) => {
  const isDisabled = disabled || loading;
  const classes = clsx(
    'carrot-btn',
    VARIANT_CLASS[variant],
    loading && 'carrot-btn--loading',
    className
  );

  const content = (
    <>
      <span className="carrot-btn__label">{children}</span>
      {loading ? (
        <span className="carrot-btn__grow" aria-hidden="true" />
      ) : null}
    </>
  );

  if (href) {
    if (isDisabled) {
      return (
        <span
          className={clsx(classes, 'pointer-events-none')}
          aria-disabled="true"
          aria-busy={loading || undefined}
        >
          {content}
        </span>
      );
    }
    const { target, rel, onClick } = rest as {
      target?: string;
      rel?: string;
      onClick?: ButtonHTMLAttributes<HTMLAnchorElement>['onClick'];
    };
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  const { type, ...restButton } = buttonProps;
  return (
    <button
      {...restButton}
      type={type ?? 'button'}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
};

export default CarrotButton;
