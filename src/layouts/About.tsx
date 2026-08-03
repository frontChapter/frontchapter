'use client';
import React from 'react';

import { markdownify } from '@lib/utils/textConverter';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Banner from './components/Banner';
import Circle from './components/Circle';
import Cta from './components/Cta';
import ImageFallback from './components/ImageFallback';
import LazyVideo from './components/LazyVideo';
import SocialFixed from './components/SocialFixed';
import TeamShowcase from './components/TeamShowcase';

interface AboutUs {
  image: string;
  subtitle: string;
  title: string;
  content: string;
}

interface Work {
  title: string;
  content: string;
}

interface Works {
  subtitle: string;
  title: string;
  content: string;
  list: Work[];
}

interface Mission {
  image: string;
  subtitle: string;
  title: string;
  content: string;
}

interface Video {
  subtitle: string;
  title: string;
  description: string;
  src: string;
  poster: string;
}

interface Brand {
  name: string;
  logo: string;
  url?: string;
}

interface Clients {
  subtitle: string;
  title: string;
  brands: Brand[];
}

interface CoreTeamMember {
  image: string;
  name: string;
  role: string;
  bio: string;
  social?: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
  };
}

interface CoreTeam {
  subtitle: string;
  title: string;
  list: CoreTeamMember[];
}

interface ExecutiveTeam {
  subtitle: string;
  title: string;
  content: string;
  list: {
    image: string;
    name: string;
    role: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  }[];
}

interface Place {
  name: string;
  year?: string;
  location: string;
}

interface OurOffice {
  subtitle: string;
  title: string;
  content: string;
  countries: Place[];
}

interface Continued {
  subtitle: string;
  title: string;
  description: string;
}

interface Frontmatter {
  title: string;
  about_us: AboutUs;
  works: Works;
  mission: Mission;
  video: Video;
  clients: Clients;
  core_team: CoreTeam;
  executive_team: ExecutiveTeam;
  our_office: OurOffice;
  continued?: Continued;
}

interface AboutProps {
  data: {
    frontmatter: Frontmatter;
  };
}

const About: React.FC<AboutProps> = ({ data }) => {
  const { frontmatter } = data;
  const {
    title,
    about_us,
    works,
    mission,
    video,
    clients,
    core_team,
    executive_team,
    our_office,
    continued,
  } = frontmatter;

  return (
    <>
      <main id="main-content">
        <Banner title={title} />

        {/* Story */}
        <section
          className="section relative overflow-hidden"
          aria-labelledby="about-story-heading"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-theme-light/80 via-transparent to-transparent" />
          <div className="container relative">
            <div className="row items-center justify-center gap-y-10">
              <div className="animate md:col-6 lg:col-5 md:order-2">
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-border-secondary to-transparent" />
                  <ImageFallback
                    className="relative w-full rounded-2xl shadow-[0_20px_50px_var(--color-shadow)]"
                    src={about_us.image}
                    fallback="/images/fallback.png"
                    width={520}
                    height={580}
                    alt="لحظه‌ای از همایش فرانت‌چپتر"
                    priority
                  />
                </div>
              </div>
              <div className="animate md:col-6 lg:col-5 md:order-1">
                <p className="text-sm font-medium tracking-wider text-primary">
                  {about_us.subtitle}
                </p>
                {markdownify({
                  content: about_us.title,
                  tag: 'h2',
                  className: 'section-title mt-4',
                  id: 'about-story-heading',
                })}
                {markdownify({
                  content: about_us.content,
                  tag: 'p',
                  className: 'mt-8 text-base leading-loose text-text',
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Works */}
        <section
          className="section bg-theme-light/40"
          aria-labelledby="about-works-heading"
        >
          <div className="container">
            <header className="animate mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium tracking-wider text-primary">
                {works.subtitle}
              </p>
              {markdownify({
                content: works.title,
                tag: 'h2',
                className: 'section-title mt-4',
                id: 'about-works-heading',
              })}
              {markdownify({
                content: works.content,
                tag: 'p',
                className: 'mt-6 text-base leading-relaxed text-text',
              })}
            </header>
            <ul className="mt-14 grid gap-6 md:grid-cols-2">
              {works.list.map((work, index) => (
                <li
                  key={`work-${index}`}
                  className="animate group rounded-2xl border border-border bg-surface-solid p-6 transition duration-300 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(254,96,25,0.08)] md:p-8"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {markdownify({
                    content: work.title,
                    tag: 'h3',
                    className: 'mt-4 text-xl font-semibold text-dark',
                  })}
                  {markdownify({
                    content: work.content,
                    tag: 'p',
                    className: 'mt-3 text-text leading-relaxed',
                  })}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Mission */}
        <section
          className="section"
          aria-labelledby="about-mission-heading"
        >
          <div className="container">
            <div className="row items-center justify-center gap-y-10">
              <div className="animate md:col-6 lg:col-5">
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-tl from-primary/15 via-border-secondary to-transparent" />
                  <ImageFallback
                    className="relative w-full rounded-2xl shadow-[0_20px_50px_var(--color-shadow)]"
                    src={mission.image}
                    fallback="/images/fallback.png"
                    width={520}
                    height={580}
                    alt="جمع شرکت‌کنندگان فرانت‌چپتر"
                  />
                </div>
              </div>
              <div className="animate md:col-6 lg:col-5">
                <p className="text-sm font-medium tracking-wider text-primary">
                  {mission.subtitle}
                </p>
                {markdownify({
                  content: mission.title,
                  tag: 'h2',
                  className: 'section-title mt-4',
                  id: 'about-mission-heading',
                })}
                {markdownify({
                  content: mission.content,
                  tag: 'p',
                  className: 'mt-8 text-base leading-loose text-text',
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Video */}
        <section
          className="container-xl relative overflow-hidden"
          aria-labelledby="about-video-heading"
        >
          <div className="bg-theme absolute inset-0 w-full">
            <Circle
              className="left-[7%] top-[21%]"
              width={32}
              height={32}
              fill={false}
            />
            <Circle
              className="left-[30%] top-[10%]"
              width={20}
              height={20}
              fill={false}
            />
            <Circle
              className="bottom-[22%] left-[35%]"
              width={20}
              height={20}
              fill={false}
            />
            <Circle
              className="right-[32%] top-[2%]"
              width={47}
              height={47}
              fill={false}
            />
          </div>
          <div className="row relative items-center justify-center py-16 md:py-24">
            <div className="md:col-6 xl:col-4">
              <div className="animate p-5">
                <p className="text-sm font-medium tracking-wider text-primary">
                  {video.subtitle}
                </p>
                {markdownify({
                  content: video.title,
                  tag: 'h2',
                  className: 'mt-4 section-title',
                  id: 'about-video-heading',
                })}
                {markdownify({
                  content: video.description,
                  tag: 'p',
                  className: 'mt-8 text-text leading-relaxed',
                })}
              </div>
            </div>
            <div className="md:col-6 xl:col-5">
              <div className="animate px-4">
                <LazyVideo
                  src={video.src}
                  poster={video.poster}
                  controls
                  className="rounded-2xl shadow-[0_20px_50px_var(--color-shadow)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Clients */}
        <section
          className="section"
          aria-labelledby="about-clients-heading"
        >
          <div className="container">
            <header className="animate mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium tracking-wider text-primary">
                {clients.subtitle}
              </p>
              {markdownify({
                content: clients.title,
                tag: 'h2',
                className: 'section-title mt-4',
                id: 'about-clients-heading',
              })}
            </header>
            <div className="animate mt-12">
              <Swiper
                loop={clients.brands.length > 4}
                slidesPerView={2}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  992: { slidesPerView: 5 },
                }}
                spaceBetween={16}
                modules={[Autoplay]}
                autoplay={{ delay: 2800, disableOnInteraction: false }}
                dir="ltr"
                className="!pb-2"
              >
                {clients.brands.map((brand, index) => {
                  const logo = (
                    <div className="relative h-12 w-full">
                      <ImageFallback
                        className="object-contain"
                        src={brand.logo}
                        fallback="/images/fallback.png"
                        sizes="140px"
                        alt={`لوگوی ${brand.name}`}
                        fill={true}
                        priority={index < 5}
                      />
                    </div>
                  );

                  return (
                    <SwiperSlide
                      className="flex h-24 items-center justify-center rounded-xl border border-border/70 bg-surface-solid px-6 py-5 grayscale transition duration-300 hover:border-primary/30 hover:grayscale-0"
                      key={`brand-${brand.name}`}
                    >
                      {brand.url ? (
                        <a
                          href={brand.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                          aria-label={`وب‌سایت ${brand.name}`}
                        >
                          {logo}
                        </a>
                      ) : (
                        logo
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </section>

        {/* Core Team */}
        <section
          className="section bg-theme-light/40"
          aria-labelledby="about-core-team-heading"
        >
          <div className="container">
            <header className="animate mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium tracking-wider text-primary">
                {core_team.subtitle}
              </p>
              {markdownify({
                content: core_team.title,
                tag: 'h2',
                className: 'section-title mt-4',
                id: 'about-core-team-heading',
              })}
            </header>
            <ul className="row mt-6 justify-center">
              {core_team.list.map((member, index) => (
                <li
                  key={`core-member-${index}`}
                  className="animate mt-10 text-center md:col-6 lg:col-4"
                >
                  <ImageFallback
                    className="mx-auto rounded-full shadow-[10px_10px_0] shadow-primary/10"
                    src={member.image}
                    fallback="/images/fallback.png"
                    width={200}
                    height={200}
                    alt={`${member.name}، ${member.role} فرانت‌چپتر`}
                  />
                  <h3 className="mt-8 h4">{member.name}</h3>
                  <p className="mt-2 font-semibold text-primary">{member.role}</p>
                  {markdownify({
                    content: member.bio,
                    tag: 'p',
                    className: 'mt-4 text-text leading-relaxed',
                  })}
                  {member.social && (
                    <SocialFixed
                      source={member.social}
                      className="social-icons mt-4 flex justify-center gap-2"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Executive Team */}
        <section
          className="section"
          aria-labelledby="about-exec-team-heading"
        >
          <div className="container">
            <header className="animate mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium tracking-wider text-primary">
                {executive_team.subtitle}
              </p>
              {markdownify({
                content: executive_team.title,
                tag: 'h2',
                className: 'section-title mt-4',
                id: 'about-exec-team-heading',
              })}
              {markdownify({
                content: executive_team.content,
                tag: 'p',
                className: 'mt-6 text-base leading-relaxed text-text',
              })}
            </header>
            <div className="row mt-10 justify-center">
              <div className="lg:col-11">
                <TeamShowcase
                  title=""
                  members={executive_team.list}
                  centered
                />
              </div>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section
          className="section bg-theme-light/40"
          aria-labelledby="about-journey-heading"
        >
          <div className="container">
            <header className="animate mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium tracking-wider text-primary">
                {our_office.subtitle}
              </p>
              {markdownify({
                content: our_office.title,
                tag: 'h2',
                className: 'section-title mt-4',
                id: 'about-journey-heading',
              })}
              {markdownify({
                content: our_office.content,
                tag: 'p',
                className: 'mt-6 text-base leading-relaxed text-text',
              })}
            </header>
            <ol className="relative mx-auto mt-14 max-w-xl space-y-5">
              <div
                className="absolute start-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-primary/15 to-transparent"
                aria-hidden
              />
              {our_office.countries.map((place, index) => (
                <li
                  key={`place-${index}`}
                  className="animate relative ms-10 rounded-2xl border border-border bg-surface-solid p-5 shadow-[0_8px_30px_var(--color-shadow)]"
                >
                  <span
                    className="absolute -start-[1.9rem] top-6 h-3.5 w-3.5 rounded-full border-2 border-primary bg-body"
                    aria-hidden
                  />
                  {place.year && (
                    <span className="text-sm font-bold text-primary">
                      {place.year}
                    </span>
                  )}
                  <h3 className="mt-1 text-xl font-semibold text-dark">
                    {place.name}
                  </h3>
                  <p className="mt-2 text-text leading-relaxed">
                    {place.location}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Continued story */}
        {continued && (
          <section
            className="section"
            aria-labelledby="about-continued-heading"
          >
            <div className="container">
              <div className="animate mx-auto max-w-3xl text-center">
                <p className="font-medium text-primary">{continued.subtitle}</p>
                <h2
                  id="about-continued-heading"
                  className="mt-4 text-3xl font-bold leading-tight text-dark md:text-4xl"
                >
                  {continued.title}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-text md:px-8">
                  {continued.description}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Cta />
    </>
  );
};

export default About;
