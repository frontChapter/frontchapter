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

interface Clients {
  subtitle: string;
  title: string;
  brands: string[];
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

interface Country {
  flag?: string;
  name: string;
  location: string;
}

interface OurOffice {
  subtitle: string;
  title: string;
  content: string;
  countries: Country[];
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
  } = frontmatter;

  return (
    <>
      <section className="section pt-0">
        <Banner title={title} />
        {/* About */}
        <div className="section container">
          <div className="row items-center justify-center">
            <div className="animate md:col-6 md:order-2 lg:col-5">
              <div className="about-image relative p-[60px]">
                <ImageFallback
                  className="animate relative w-full rounded-2xl"
                  src={about_us.image}
                  fallback="/images/fallback.png"
                  width={425}
                  height={487}
                  alt=""
                />
                <Circle
                  className="left-4 top-4 z-[-1]"
                  width={85}
                  height={85}
                />
                <Circle
                  width={37}
                  height={37}
                  fill={false}
                  className="right-10 top-20 z-[-1]"
                />
                <Circle
                  className="right-12 top-1/2 -z-[1]"
                  width={24}
                  height={24}
                />
                <Circle
                  className="bottom-6 right-6 z-[-1]"
                  width={85}
                  height={85}
                />
                <Circle
                  className="left-12 top-1/2 z-[-1]"
                  width={20}
                  height={20}
                />
                <Circle
                  className="bottom-12 left-8 z-[1]"
                  width={47}
                  height={47}
                  fill={false}
                />
              </div>
            </div>
            <div className="animate md:col-6 md:order-1 lg:col-4">
              <p>{about_us.subtitle}</p>
              {markdownify({
                content: about_us.title,
                tag: 'h2',
                className: 'section-title bar-left mt-4',
              })}
              {markdownify({
                content: about_us.content,
                tag: 'p',
                className: 'mt-10',
              })}
            </div>
          </div>
        </div>

        {/* Works */}
        <div className="section container">
          <div className="animate text-center">
            <p>{works.subtitle}</p>
            {markdownify({
              content: works.title,
              tag: 'h2',
              className: 'section-title mt-4',
            })}
            {markdownify({
              content: works.content,
              tag: 'p',
              className: 'mt-10',
            })}
          </div>
          <div className="row mt-10 justify-center">
            {works.list.map((work, index) => (
              <div key={`work-${index}`} className="mt-10 md:col-6 lg:col-5">
                <div className="animate text-center md:px-6 xl:px-12">
                  {markdownify({
                    content: work.title,
                    tag: 'h3',
                    className: 'h4',
                  })}
                  {markdownify({
                    content: work.content,
                    tag: 'p',
                    className: 'mt-2',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="section container">
          <div className="row items-center justify-center">
            <div className="animate md:col-6 lg:col-5">
              <div className="about-image relative p-[60px]">
                <ImageFallback
                  className="animate relative w-full rounded-2xl"
                  src={mission.image}
                  fallback="/images/fallback.png"
                  width={425}
                  height={487}
                  alt=""
                />
                <Circle
                  className="left-4 top-4 z-[-1]"
                  width={85}
                  height={85}
                />
                <Circle
                  width={37}
                  height={37}
                  fill={false}
                  className="right-10 top-20 z-[-1]"
                />
                <Circle
                  className="right-12 top-1/2 -z-[1]"
                  width={24}
                  height={24}
                />
                <Circle
                  className="bottom-6 right-6 z-[-1]"
                  width={85}
                  height={85}
                />
                <Circle
                  className="left-12 top-1/2 z-[-1]"
                  width={20}
                  height={20}
                />
                <Circle
                  className="bottom-12 left-8 z-[1]"
                  width={47}
                  height={47}
                  fill={false}
                />
              </div>
            </div>
            <div className="animate md:col-6 lg:col-4">
              <p>{mission.subtitle}</p>
              {markdownify({
                content: mission.title,
                tag: 'h2',
                className: 'section-title bar-left mt-4',
              })}
              {markdownify({
                content: mission.content,
                tag: 'p',
                className: 'mt-10',
              })}
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="container-xl relative">
          <div className="bg-theme absolute left-0 top-0 w-full">
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
              className="bottom-[35%] left-[4%]"
              width={20}
              height={20}
              fill={false}
            />
            <Circle
              className="bottom-[11%] left-[10%]"
              width={37}
              height={37}
              fill={false}
            />
            <Circle
              className="bottom-[48%] left-[44%]"
              width={37}
              height={37}
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
          <div className="row items-center justify-center py-[90px]">
            <div className="md:col-6 xl:col-4">
              <div className="animate p-5">
                <p>{video.subtitle}</p>
                {markdownify({
                  content: video.title,
                  tag: 'h2',
                  className: 'mt-4 section-title bar-left',
                })}
                {markdownify({
                  content: video.description,
                  tag: 'p',
                  className: 'mt-10',
                })}
              </div>
            </div>
            <div className="md:col-6 xl:col-5">
              <div className="px-4 ">
                <LazyVideo
                  src={video.src}
                  poster={video.poster}
                  controls
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className="section container">
          <div className="animate text-center">
            <p>{clients.subtitle}</p>
            {markdownify({
              content: clients.title,
              tag: 'h2',
              className: 'section-title mt-4',
            })}
          </div>
          <div className="animate from-right col-12 mt-16">
            <Swiper
              loop={true}
              slidesPerView={3}
              breakpoints={{
                992: {
                  slidesPerView: 5,
                },
              }}
              spaceBetween={20}
              modules={[Autoplay]}
              autoplay={{ delay: 3000 }}
              dir="ltr"
            >
              {clients.brands.map((brand, index) => (
                <SwiperSlide
                  className=" h-20 cursor-pointer px-6 py-6 grayscale  transition hover:grayscale-0 lg:px-10"
                  key={`brand-${index}`}
                >
                  <div className="relative h-full">
                    <ImageFallback
                      className="object-contain"
                      src={brand}
                      fallback="/images/fallback.png"
                      sizes="100vw"
                      alt=""
                      fill={true}
                      priority={true}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Core Team */}
        <div className="section container">
          <div className="animate text-center">
            <p>{core_team.subtitle}</p>
            {markdownify({
              content: core_team.title,
              tag: 'h2',
              className: 'section-title mt-4',
            })}
          </div>
          <div className="row justify-center mt-10">
            {core_team.list.map((member, index) => (
              <div
                key={`core-member-${index}`}
                className="animate mt-10 text-center md:col-6 lg:col-4"
              >
                <ImageFallback
                  className="mx-auto rounded-full shadow-[10px_10px_0] shadow-primary/10"
                  src={member.image}
                  fallback="/images/fallback.png"
                  width={200}
                  height={200}
                  alt={`${member.name} در فرانت‌چپتر`}
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
              </div>
            ))}
          </div>
        </div>

        {/* Executive Team */}
        <div className="section container">
          <div className="animate text-center">
            <p>{executive_team.subtitle}</p>
            {markdownify({
              content: executive_team.title,
              tag: 'h2',
              className: 'section-title mt-4',
            })}
            {markdownify({
              content: executive_team.content,
              tag: 'p',
              className: 'mt-10',
            })}
          </div>
          <div className="row justify-center mt-6">
            <div className="lg:col-11">
              <TeamShowcase
                title=""
                members={executive_team.list}
                centered
                titleAs="h2"
              />
            </div>
          </div>
        </div>

        {/* Office */}
        <div className="section container">
          <div className="animate text-center">
            <p>{our_office.subtitle}</p>
            {markdownify({
              content: our_office.title,
              tag: 'h2',
              className: 'section-title mt-4',
            })}
            {markdownify({
              content: our_office.content,
              tag: 'p',
              className: 'mt-16',
            })}
          </div>
          <div className="row justify-center">
            <div className="lg:col-10">
              <div className="row  justify-center">
                {our_office.countries.map((country, index) => (
                  <div
                    key={`country-${index}`}
                    className="animate mt-10 md:col-6 xl:col-3"
                  >
                    <div className="rounded-xl p-5 shadow-[0_4px_25px_rgba(0,0,0,.05)]">
                      <h5 className="h4">{country.name}</h5>
                      <p className="mt-2">{country.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
};

export default About;
