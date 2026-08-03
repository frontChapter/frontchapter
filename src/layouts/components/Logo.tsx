import config from '@config/config.json';
import Link from 'next/link';
import ImageFallback from './ImageFallback';

interface Props {
  src?: string;
  /** Header shows larger mark; footer keeps compact config size */
  size?: 'default' | 'header';
}

const Logo = ({ src, size = 'default' }: Props) => {
  const { logo, logo_dark, logo_height, logo_text, title } = config.site;

  const configHeight = parseInt(logo_height.replace('px', ''), 10);
  // Preserve SVG aspect (787:198) — old 240×34 squash made carrot look tiny
  const aspect = 787 / 198;
  const height = size === 'header' ? 48 : Math.max(configHeight, 36);
  const width = Math.round(height * aspect);

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
