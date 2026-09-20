import {
  IoLogoGithub,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoYoutube,
  IoMail,
  IoPaperPlane,
} from 'react-icons/io5';

interface SocialProps {
  source: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    telegram?: string;
  };
  className?: string;
}

const Social = ({ source, className }: SocialProps) => {
  const { instagram, youtube, linkedin, github, email, telegram } = source;
  return (
    <ul className={className}>
      {instagram && (
        <li className="inline-block">
          <a
            aria-label="اینستاگرام فرانت‌چپتر"
            title="اینستاگرام فرانت‌چپتر"
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoInstagram />
          </a>
        </li>
      )}
      {youtube && (
        <li className="inline-block">
          <a
            aria-label="کانال یوتیوب فرانت‌چپتر"
            title="کانال یوتیوب فرانت‌چپتر"
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoYoutube />
          </a>
        </li>
      )}
      {linkedin && (
        <li className="inline-block">
          <a
            aria-label="صفحه لینکدین فرانت‌چپتر"
            title="صفحه لینکدین فرانت‌چپتر"
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoLinkedin />
          </a>
        </li>
      )}
      {github && (
        <li className="inline-block">
          <a
            aria-label="گیت‌هاب فرانت‌چپتر"
            title="گیت‌هاب فرانت‌چپتر"
            href={github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoGithub />
          </a>
        </li>
      )}
      {telegram && (
        <li className="inline-block">
          <a
            aria-label="کانال تلگرام فرانت‌چپتر"
            title="کانال تلگرام فرانت‌چپتر"
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoPaperPlane />
          </a>
        </li>
      )}
      {email && (
        <li className="inline-block">
          <a
            aria-label="ایمیل به فرانت‌چپتر"
            title="ارسال ایمیل به فرانت‌چپتر"
            href={`mailto:${email}`}
          >
            <IoMail />
          </a>
        </li>
      )}
    </ul>
  );
};

export default Social;
