import config from "@config/config.json";
import menu from "@config/menu.json";
import social from "@config/social.json";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { useRTL } from "../../hooks/useRTL";
import Logo from "../components/Logo";
import Social from "../components/Social";

interface MenuItem {
  name: string;
  url: string;
}

interface FooterMenu {
  footer: MenuItem[];
}

interface SocialItem {
  name: string;
  url: string;
}

interface ConfigParams {
  copyright: string;
  footer_content: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
}

interface Config {
  params: ConfigParams;
  contact_info: ContactInfo;
  // Social expects an object, not array
}
export interface SocialSource {
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
}

const Footer: React.FC = () => {
  const { copyright, footer_content } = (config as Config).params;
  const { email, phone, location } = (config as Config).contact_info;
  const { isRTL } = useRTL();
  return (
    <footer className="" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container">
        <div className={`row border-y border-border py-12${isRTL ? " flex-row-reverse" : ""}`}
          style={isRTL ? { direction: "rtl", textAlign: "right" } : {}}>
          <div className={`animate md:col-6 lg:col-3${isRTL ? " text-right" : ""}`}>
            <Logo />
            {markdownify({ content: footer_content, tag: "p", className: "mt-3" })}
          </div>
          <div className={`animate mt-8 md:col-6 lg:col-3 lg:mt-0${isRTL ? " text-right" : ""}`}>
            <h3 className="h5">Socials</h3>
            <div className="mt-5">
              {email && <Link href={`mailto:${email}`}>{email}</Link>}
              {/* social icons */}
              <Social source={social as SocialSource} className="social-icons mt-5" />
            </div>
          </div>
          <div className={`animate mt-8 md:col-6 lg:col-3 lg:mt-0${isRTL ? " text-right" : ""}`}>
            <h3 className="h5">Quick Links</h3>
            {/* footer menu */}
            <ul className="mt-5 leading-10">
              {(menu as FooterMenu).footer.map((menu) => (
                <li key={menu.name}>
                  <Link
                    href={menu.url}
                    className=" hover:text-primary hover:underline"
                  >
                    {menu.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={`animate mt-8 md:col-6 lg:col-3 lg:mt-0${isRTL ? " text-right" : ""}`}>
            <h3 className="h5">Location & Contact</h3>
            <ul className="mt-5 leading-10">
              <li>{location && markdownify({ content: location })}</li>
              {phone && (
                <li>
                  <Link href={`tel:${phone}`}>{phone}</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        {/* copyright */}
        <div className=" py-6 text-center">
          {markdownify({ content: copyright, tag: "p", className: "footer-copy-write" })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
