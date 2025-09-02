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

const SocialFixed = ({ source, className }: SocialProps) => {
  const { instagram, youtube, linkedin, github, email, telegram } = source;

  // For RTL support, use flex with gap instead of space-x
  return (
    <ul className={`${className} flex gap-4 flex-wrap`}>
      {linkedin && (
        <li>
          <a
            aria-label="linkedin"
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoLinkedin />
          </a>
        </li>
      )}
      {github && (
        <li>
          <a
            aria-label="github"
            href={github}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoGithub />
          </a>
        </li>
      )}
      {instagram && (
        <li>
          <a
            aria-label="instagram"
            href={instagram}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoInstagram />
          </a>
        </li>
      )}
      {youtube && (
        <li>
          <a
            aria-label="youtube"
            href={youtube}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoYoutube />
          </a>
        </li>
      )}
      {telegram && (
        <li>
          <a
            aria-label="telegram"
            href={telegram}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoPaperPlane />
          </a>
        </li>
      )}
      {email && (
        <li>
          <a aria-label="email" href={`mailto:${email}`}>
            <IoMail />
          </a>
        </li>
      )}
    </ul>
  );
};

export default SocialFixed;
