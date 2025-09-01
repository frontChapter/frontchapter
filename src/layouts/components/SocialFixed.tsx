import {
  IoCall,
  IoGlobeOutline,
  IoLocation,
  IoLogoBehance,
  IoLogoBitbucket,
  IoLogoCodepen,
  IoLogoDiscord,
  IoLogoDribbble,
  IoLogoFacebook,
  IoLogoFoursquare,
  IoLogoGithub,
  IoLogoGitlab,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoMedium,
  IoLogoPinterest,
  IoLogoReddit,
  IoLogoRss,
  IoLogoSkype,
  IoLogoSlack,
  IoLogoSnapchat,
  IoLogoSoundcloud,
  IoLogoTiktok,
  IoLogoTumblr,
  IoLogoTwitter,
  IoLogoVimeo,
  IoLogoVk,
  IoLogoWhatsapp,
  IoLogoYoutube,
  IoMail,
} from 'react-icons/io5';

interface SocialProps {
  source: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
    gitlab?: string;
    discord?: string;
    slack?: string;
    medium?: string;
    codepen?: string;
    bitbucket?: string;
    dribbble?: string;
    behance?: string;
    pinterest?: string;
    soundcloud?: string;
    tumblr?: string;
    reddit?: string;
    vk?: string;
    whatsapp?: string;
    snapchat?: string;
    vimeo?: string;
    tiktok?: string;
    foursquare?: string;
    rss?: string;
    email?: string;
    phone?: string;
    address?: string;
    skype?: string;
    website?: string;
  };
  className?: string;
}

const SocialFixed = ({ source, className }: SocialProps) => {
  const {
    facebook,
    twitter,
    instagram,
    youtube,
    linkedin,
    github,
    gitlab,
    discord,
    slack,
    medium,
    codepen,
    bitbucket,
    dribbble,
    behance,
    pinterest,
    soundcloud,
    tumblr,
    reddit,
    vk,
    whatsapp,
    snapchat,
    vimeo,
    tiktok,
    foursquare,
    rss,
    email,
    phone,
    address,
    skype,
    website,
  } = source;

  // For RTL support, use flex with gap instead of space-x
  return (
    <ul className={`${className} flex gap-4 flex-wrap`}>
      {facebook && (
        <li>
          <a
            aria-label="facebook"
            href={facebook}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoFacebook />
          </a>
        </li>
      )}
      {twitter && (
        <li>
          <a
            aria-label="twitter"
            href={twitter}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoTwitter />
          </a>
        </li>
      )}
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
      {pinterest && (
        <li>
          <a
            aria-label="pinterest"
            href={pinterest}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoPinterest />
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
      {gitlab && (
        <li>
          <a
            aria-label="gitlab"
            href={gitlab}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoGitlab />
          </a>
        </li>
      )}
      {discord && (
        <li>
          <a
            aria-label="discord"
            href={discord}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoDiscord />
          </a>
        </li>
      )}
      {slack && (
        <li>
          <a
            aria-label="slack"
            href={slack}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoSlack />
          </a>
        </li>
      )}
      {medium && (
        <li>
          <a
            aria-label="medium"
            href={medium}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoMedium />
          </a>
        </li>
      )}
      {codepen && (
        <li>
          <a
            aria-label="codepen"
            href={codepen}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoCodepen />
          </a>
        </li>
      )}
      {bitbucket && (
        <li>
          <a
            aria-label="bitbucket"
            href={bitbucket}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoBitbucket />
          </a>
        </li>
      )}
      {dribbble && (
        <li>
          <a
            aria-label="dribbble"
            href={dribbble}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoDribbble />
          </a>
        </li>
      )}
      {behance && (
        <li>
          <a
            aria-label="behance"
            href={behance}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoBehance />
          </a>
        </li>
      )}
      {soundcloud && (
        <li>
          <a
            aria-label="soundcloud"
            href={soundcloud}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoSoundcloud />
          </a>
        </li>
      )}
      {tumblr && (
        <li>
          <a
            aria-label="tumblr"
            href={tumblr}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoTumblr />
          </a>
        </li>
      )}
      {reddit && (
        <li>
          <a
            aria-label="reddit"
            href={reddit}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoReddit />
          </a>
        </li>
      )}
      {vk && (
        <li>
          <a
            aria-label="vk"
            href={vk}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoVk />
          </a>
        </li>
      )}
      {whatsapp && (
        <li>
          <a
            aria-label="whatsapp"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoWhatsapp />
          </a>
        </li>
      )}
      {snapchat && (
        <li>
          <a
            aria-label="snapchat"
            href={snapchat}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoSnapchat />
          </a>
        </li>
      )}
      {vimeo && (
        <li>
          <a
            aria-label="vimeo"
            href={vimeo}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoVimeo />
          </a>
        </li>
      )}
      {tiktok && (
        <li>
          <a
            aria-label="tiktok"
            href={tiktok}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoTiktok />
          </a>
        </li>
      )}
      {foursquare && (
        <li>
          <a
            aria-label="foursquare"
            href={foursquare}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoFoursquare />
          </a>
        </li>
      )}
      {skype && (
        <li>
          <a
            aria-label="skype"
            href={skype}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoSkype />
          </a>
        </li>
      )}
      {website && (
        <li>
          <a
            aria-label="website"
            href={website}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoGlobeOutline />
          </a>
        </li>
      )}
      {rss && (
        <li>
          <a
            aria-label="rss feed"
            href={rss}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLogoRss />
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
      {phone && (
        <li>
          <a aria-label="telephone" href={`tel:${phone}`}>
            <IoCall />
          </a>
        </li>
      )}
      {address && (
        <li>
          <a
            aria-label="location"
            href={address}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <IoLocation />
          </a>
        </li>
      )}
    </ul>
  );
};

export default SocialFixed;
