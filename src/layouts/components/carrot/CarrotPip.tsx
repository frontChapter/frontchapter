import clsx from 'clsx';

type Props = {
  lit?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

/** Classic carrot glyph for level meters — not the F-logo mark. */
const CarrotPip = ({ lit = false, size = 'sm', className }: Props) => {
  const h = size === 'md' ? 28 : 20;
  const w = Math.round(h * (18 / 32));

  return (
    <svg
      viewBox="0 0 18 32"
      width={w}
      height={h}
      className={clsx(
        'carrot-pip',
        lit ? 'carrot-pip--lit' : 'carrot-pip--dim',
        className
      )}
      aria-hidden="true"
      focusable="false"
    >
      {/* leaves */}
      <path
        className="carrot-pip__leaf"
        d="M9 1.2C7.2 3.4 6.1 5.8 6.4 8.2c1.1-.2 2.1-.1 2.6.4.5-.5 1.5-.6 2.6-.4.3-2.4-.8-4.8-2.6-7z"
      />
      <path
        className="carrot-pip__leaf"
        d="M4.2 4.5c-.9 2.1-.7 4.2.2 5.8 1-.8 2.1-1.1 2.9-.9C6.6 7.4 5.4 5.7 4.2 4.5z"
      />
      <path
        className="carrot-pip__leaf"
        d="M13.8 4.5c.9 2.1.7 4.2-.2 5.8-1-.8-2.1-1.1-2.9-.9 1.7-1.7 2.9-3.4 3.1-4.9z"
      />
      {/* body */}
      <path
        className="carrot-pip__body"
        d="M9 9.2c-3.4 0-5.6 2.2-5.4 5.6.3 4.2 2.4 9.2 4.5 14.1.3.7.9 1.1 1.4.3 2.1-3.6 4.1-8.4 4.5-12.8.3-3.4-1.8-7.2-5-7.2z"
      />
    </svg>
  );
};

export default CarrotPip;
