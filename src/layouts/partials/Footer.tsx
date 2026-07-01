import config from '@config/config.json';
import menu from '@config/menu.json';
import social from '@config/social.json';
import { markdownify } from '@lib/utils/textConverter';
import Link from 'next/link';
import React from 'react';
import { IoLocationOutline, IoMailOutline, IoCallOutline } from 'react-icons/io5';
import { useRTL } from '../../hooks/useRTL';
import Logo from '../components/Logo';
import SocialFixed from '../components/SocialFixed';

interface MenuItem {
  name: string;
  url: string;
}

interface FooterMenu {
  footer: MenuItem[];
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
    <footer className="site-footer" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="site-footer__main">
        <div className="container">
          <div className="row g-4 g-lg-5 py-12 lg:py-16">
            {/* Brand + social */}
            <div className="animate col-12 lg:col-5">
              <Logo />
              {markdownify({
                content: footer_content,
                tag: 'p',
                className: 'mt-4 max-w-sm leading-relaxed text-muted',
              })}
              <div className="mt-8">
                <p className="footer-section-title">شبکه‌های اجتماعی</p>
                <SocialFixed
                  source={social as SocialSource}
                  className="social-icons mt-4"
                />
              </div>
            </div>

            {/* Quick links */}
            <div className="animate col-12 sm:col-6 lg:col-3 lg:mt-0 mt-8">
              <p className="footer-section-title">لینک‌های سریع</p>
              <ul className="footer-links mt-4">
                {(menu as FooterMenu).footer.map((item) => (
                  <li key={item.name}>
                    <Link href={item.url} className="footer-link">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="animate col-12 sm:col-6 lg:col-4 lg:mt-0 mt-8">
              <p className="footer-section-title">ارتباط با ما</p>
              <ul className="footer-contact mt-4">
                {location && (
                  <li className="footer-contact__item">
                    <IoLocationOutline
                      className="footer-contact__icon"
                      aria-hidden
                    />
                    {markdownify({ content: location })}
                  </li>
                )}
                {email && (
                  <li className="footer-contact__item">
                    <IoMailOutline
                      className="footer-contact__icon"
                      aria-hidden
                    />
                    <Link href={`mailto:${email}`} className="footer-link">
                      {email}
                    </Link>
                  </li>
                )}
                {phone && (
                  <li className="footer-contact__item">
                    <IoCallOutline
                      className="footer-contact__icon"
                      aria-hidden
                    />
                    <Link href={`tel:${phone}`} className="footer-link">
                      {phone}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer__bar">
        <div className="container py-5 text-center">
          {markdownify({
            content: copyright,
            tag: 'p',
            className: 'footer-copy-write text-sm text-subtle',
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
