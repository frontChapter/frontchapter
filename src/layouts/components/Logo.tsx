import config from '@config/config.json';
import Link from 'next/link';
import ImageFallback from './ImageFallback';

interface Props {
  src?: string;
}

const Logo = ({ src }: Props) => {
  // destructuring items from config object
  const { logo, logo_dark, logo_width, logo_height, logo_text, title } = config.site;

  return (
    <Link href="/" className="navbar-brand block">
      {src || logo ? (
        <ImageFallback
          width={parseInt(logo_width.replace('px', '')) * 2}
          height={parseInt(logo_height.replace('px', '')) * 2}
          src={src ? src : logo}
          className="dark:hidden"
          alt={title}
          priority
          style={{
            height: logo_height.replace('px', '') + 'px',
            width: logo_width.replace('px', '') + 'px',
          }}
          fallback="/images/logo.png"
        />
      ) : null}
      {src || logo_dark || logo ? (
        <ImageFallback
          width={parseInt(logo_width.replace('px', '')) * 2}
          height={parseInt(logo_height.replace('px', '')) * 2}
          src={src ? src : (logo_dark || logo)}
          className="hidden dark:block"
          alt={title}
          priority
          style={{
            height: logo_height.replace('px', '') + 'px',
            width: logo_width.replace('px', '') + 'px',
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
