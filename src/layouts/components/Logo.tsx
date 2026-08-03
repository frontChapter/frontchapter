import config from '@config/config.json';
import Link from 'next/link';
import ImageFallback from './ImageFallback';
import LivingCarrot from './LivingCarrot';

interface Props {
  src?: string;
  /** Header: static wordmark + living carrot. Footer: full static logo. */
  size?: 'default' | 'header';
}

const Logo = ({ src, size = 'default' }: Props) => {
  const { logo, logo_dark, logo_height, logo_text, title } = config.site;

  const configHeight = parseInt(logo_height.replace('px', ''), 10);
  const isHeader = size === 'header' && !src;

  // Wordmark-only aspect ~560:198; full logo 787:198
  const aspect = isHeader ? 560 / 198 : 787 / 198;
  const height = isHeader ? 48 : Math.max(configHeight, 36);
  const width = Math.round(height * aspect);
  const carrotSize = Math.round(height * 0.95);

  const wordmark = '/images/logo-wordmark.svg';
  const wordmarkDark = '/images/logo-wordmark-dark.svg';

  if (isHeader) {
    return (
      <Link
        href="/"
        className="navbar-brand navbar-brand--living"
        aria-label={title}
        dir="ltr"
      >
        <span className="navbar-brand__wordmark">
          <ImageFallback
            width={width * 2}
            height={height * 2}
            src={wordmark}
            className="dark:hidden"
            alt=""
            aria-hidden="true"
            priority
            style={{ height: `${height}px`, width: `${width}px` }}
            fallback="/images/logo.png"
          />
          <ImageFallback
            width={width * 2}
            height={height * 2}
            src={wordmarkDark}
            className="hidden dark:block"
            alt=""
            aria-hidden="true"
            priority
            style={{ height: `${height}px`, width: `${width}px` }}
            fallback="/images/logo.png"
          />
        </span>
        <LivingCarrot size={carrotSize} />
        <span className="sr-only">{title}</span>
      </Link>
    );
  }

  return (
    <Link href="/" className="navbar-brand" aria-label={title}>
      {src || logo ? (
        <ImageFallback
          width={width * 2}
          height={height * 2}
          src={src ? src : logo}
          className="dark:hidden"
          alt={title}
          priority
          style={{
            height: `${height}px`,
            width: `${width}px`,
          }}
          fallback="/images/logo.png"
        />
      ) : null}
      {src || logo_dark || logo ? (
        <ImageFallback
          width={width * 2}
          height={height * 2}
          src={src ? src : logo_dark || logo}
          className="hidden dark:block"
          alt=""
          aria-hidden="true"
          priority
          style={{
            height: `${height}px`,
            width: `${width}px`,
          }}
          fallback="/images/logo.png"
        />
      ) : logo_text ? (
        logo_text
      ) : (
        title
      )}
    </Link>
  );
};

export default Logo;
