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
        <li className="inline-block">
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
      {linkedin && (
        <li className="inline-block">
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
        <li className="inline-block">
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
      {telegram && (
        <li className="inline-block">
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
        <li className="inline-block">
          <a aria-label="email" href={`mailto:${email}`}>
            <IoMail />
          </a>
        </li>
      )}
    </ul>
  );
};

export default Social;
