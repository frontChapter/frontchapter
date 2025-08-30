import config from '@config/config.json';
import menu from '@config/menu.json';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { useRTL } from '../../hooks/useRTL';
import Logo from '../components/Logo';

type MenuChild = {
  name: string;
  url: string;
};

type MenuItem = {
  name: string;
  url: string;
  hasChildren?: boolean;
  children?: MenuChild[];
};

type Menu = {
  main: MenuItem[];
  footer?: MenuItem[];
};

type SiteConfig = {
  logo: string;
  [key: string]: string | number | boolean | undefined;
};

type NavButtonConfig = {
  enable: boolean;
  label: string;
  link: string;
};

type Config = {
  site: SiteConfig;
  nav_button: NavButtonConfig;
  [key: string]: unknown;
};

const Header: React.FC = () => {
  // distructuring the main menu from menu object
  const { main } = menu as Menu;

  // states declaration
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [sticky, setSticky] = useState<boolean>(false);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const [direction, setDirection] = useState<number | null>(null);

  const pathname = usePathname();
  const asPath = pathname;

  //sticky header
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const headerHeight = header.clientHeight + 200;
    let prevScroll = 0;
    const onScroll = () => {
      const scrollY = window.scrollY;
      setSticky(scrollY > 0);
      if (scrollY > headerHeight) {
        setDirection(prevScroll > scrollY ? -1 : 1);
        prevScroll = scrollY;
      } else {
        setDirection(null);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // logo source
  const { logo } = (config as Config).site;

  const { isRTL } = useRTL();
  return (
    <>
      <div className="header-height-fix"></div>
      <header
        className={clsx(
          'header',
          sticky && 'header-sticky',
          direction === 1 && 'unpinned'
        )}
        ref={headerRef}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <nav
          className={
            isRTL
              ? 'navbar container-xl flex items-center justify-between'
              : 'navbar container-xl flex items-center'
          }
        >
          {/* RTL: hamburger far left, logo centered; LTR: logo left */}
          {isRTL ? (
            <>
              <div className="flex items-center">
                {/* Hamburger menu button */}
                {showMenu ? (
                  <button
                    className="h-8 w-8 text-3xl text-dark lg:hidden me-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <CgClose />
                  </button>
                ) : (
                  <button
                    className="text-dark lg:hidden me-2"
                    onClick={() => setShowMenu(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      width="32px"
                      height="32px"
                      style={{ transform: 'scaleX(-1)' }}
                    >
                      <path
                        fill="currentColor"
                        d="M 5 5 L 5 11 L 11 11 L 11 5 L 5 5 z M 13 5 L 13 11 L 19 11 L 19 5 L 13 5 z M 21 5 L 21 11 L 27 11 L 27 5 L 21 5 z M 7 7 L 9 7 L 9 9 L 7 9 L 7 7 z M 15 7 L 17 7 L 17 9 L 15 9 L 15 7 z M 23 7 L 25 7 L 25 9 L 23 9 L 23 7 z M 5 13 L 5 19 L 11 19 L 11 13 L 5 13 z M 13 13 L 13 19 L 19 19 L 19 13 L 13 13 z M 21 13 L 21 19 L 27 19 L 27 13 L 21 13 z M 7 15 L 9 15 L 9 17 L 7 17 L 7 15 z M 15 15 L 17 15 L 17 17 L 15 17 L 15 15 z M 23 15 L 25 15 L 25 17 L 23 17 L 23 15 z M 5 21 L 5 27 L 11 27 L 11 21 L 5 21 z M 13 21 L 13 27 L 19 27 L 19 21 L 13 21 z M 21 21 L 21 27 L 27 27 L 27 21 L 21 21 z M 7 23 L 9 23 L 9 25 L 7 25 L 7 23 z M 15 23 L 17 23 L 17 25 L 15 25 L 15 23 z"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-1 flex justify-center">
                <Logo src={logo} />
              </div>
            </>
          ) : (
            <div className="flex items-center">
              <Logo src={logo} />
            </div>
          )}

          <ul
            id="nav-menu"
            className={clsx(
              'navbar-nav',
              isRTL ? 'order-2' : 'order-2',
              'w-full justify-center lg:order-1 md:w-auto md:space-x-2 lg:flex',
              !showMenu && 'hidden'
            )}
            style={isRTL ? { direction: 'rtl' } : { direction: 'ltr' }}
          >
            {main.map((menu, i) => (
              <React.Fragment key={`menu-${i}`}>
                {menu.hasChildren && menu.children ? (
                  <li className="nav-item nav-dropdown group relative">
                    <span className="nav-link inline-flex items-center">
                      {menu.name}
                      {isRTL ? (
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                          style={{ transform: 'scaleX(-1)' }}
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      )}
                    </span>
                    <ul
                      className={`nav-dropdown-list hidden max-h-0 w-full overflow-hidden border border-border-secondary py-0 transition-all duration-500 group-hover:block group-hover:max-h-[106px] group-hover:py-2 lg:invisible lg:absolute lg:${isRTL ? 'right-1/2' : 'left-1/2'} lg:block lg:w-auto lg:-translate-x-1/2 lg:group-hover:visible lg:group-hover:opacity-100`}
                    >
                      {menu.children.map((child, j) => (
                        <li className="nav-dropdown-item" key={`children-${j}`}>
                          <Link
                            href={child.url}
                            className={clsx(
                              'nav-dropdown-link block transition-all',
                              asPath === child.url && 'active'
                            )}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link
                      href={menu.url}
                      className={clsx(
                        'nav-link block',
                        asPath === menu.url && 'active'
                      )}
                    >
                      {menu.name}
                    </Link>
                  </li>
                )}
              </React.Fragment>
            ))}
            {(config as Config).nav_button.enable && (
              <li className="nav-item lg:hidden">
                <Link
                  className="btn btn-primary hidden lg:flex"
                  href={(config as Config).nav_button.link}
                >
                  {(config as Config).nav_button.label}
                </Link>
              </li>
            )}
          </ul>
          <div
            className={
              isRTL
                ? 'order-2 ms-auto flex items-center md:ms-0 flex-row-reverse'
                : 'order-1 ms-auto flex items-center md:ms-0'
            }
          >
            {/* Hamburger menu button for LTR and close button for RTL when menu is open */}
            {!isRTL && showMenu && (
              <button
                className="h-8 w-8 text-3xl text-dark lg:hidden ms-2"
                onClick={() => setShowMenu(!showMenu)}
              >
                <CgClose />
              </button>
            )}
            {!isRTL && !showMenu && (
              <button
                className="text-dark lg:hidden ms-2"
                onClick={() => setShowMenu(!showMenu)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  width="32px"
                  height="32px"
                >
                  <path
                    fill="currentColor"
                    d="M 5 5 L 5 11 L 11 11 L 11 5 L 5 5 z M 13 5 L 13 11 L 19 11 L 19 5 L 13 5 z M 21 5 L 21 11 L 27 11 L 27 5 L 21 5 z M 7 7 L 9 7 L 9 9 L 7 9 L 7 7 z M 15 7 L 17 7 L 17 9 L 15 9 L 15 7 z M 23 7 L 25 7 L 25 9 L 23 9 L 23 7 z M 5 13 L 5 19 L 11 19 L 11 13 L 5 13 z M 13 13 L 13 19 L 19 19 L 19 13 L 13 13 z M 21 13 L 21 19 L 27 19 L 27 13 L 21 13 z M 7 15 L 9 15 L 9 17 L 7 17 L 7 15 z M 15 15 L 17 15 L 17 17 L 15 17 L 15 15 z M 23 15 L 25 15 L 25 17 L 23 17 L 23 15 z M 5 21 L 5 27 L 11 27 L 11 21 L 5 21 z M 13 21 L 13 27 L 19 27 L 19 21 L 13 21 z M 21 21 L 21 27 L 27 27 L 27 21 L 21 21 z M 7 23 L 9 23 L 9 25 L 7 25 L 7 23 z M 15 23 L 17 23 L 17 25 L 15 25 L 15 23 z"
                  />
                </svg>
              </button>
            )}
            {/* /navbar toggler */}
            {(config as Config).nav_button.enable && (
              <Link
                className="btn btn-primary hidden lg:flex"
                href={(config as Config).nav_button.link}
              >
                {(config as Config).nav_button.label}
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
