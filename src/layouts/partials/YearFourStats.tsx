'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

export interface YearFourStatsProps {
  title: string;
  year: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  birthday: {
    title: string;
    description: string;
    image: string;
  };
  communityCollaboration?: {
    title: string;
    description: string;
    collaborations: Array<{
      community: string;
      title: string;
      presenter: string;
      image: string;
      link: string;
      color: string;
    }>;
  };
  conference?: {
    title: string;
    description: string;
    images: {
      video: string;
      video_label: string;
      video_poster: string;
      gallery: Array<{
        src: string;
        label: string;
      }>;
    };
  };
  events: Array<{
    title: string;
    description: string;
    image: string;
    link: {
      label: string;
      href: string;
    };
  }>;
}

const YearFourStats: React.FC<YearFourStatsProps> = ({
  title,
  year,
  stats,
  birthday,
  communityCollaboration,
  conference,
  events,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLHeadingElement>(null);
  const birthdayRef = useRef<HTMLDivElement>(null);
  const conferenceRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Year animation
      gsap.fromTo(
        yearRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: yearRef.current,
            start: 'top bottom',
            end: 'bottom center',
          },
        }
      );

      // Stats animation
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems && statItems.length) {
        gsap.fromTo(
          statItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top bottom',
            },
          }
        );
      }

      // Birthday section animation
      gsap.fromTo(
        birthdayRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: birthdayRef.current,
            start: 'top bottom',
          },
        }
      );

      // Conference section animation
      if (conference && conferenceRef.current) {
        gsap.fromTo(
          conferenceRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: conferenceRef.current,
              start: 'top bottom',
            },
          }
        );
      }

      // Events section animation
      gsap.fromTo(
        eventsRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: eventsRef.current,
            start: 'top bottom',
          },
        }
      );

      // Images animation
      const imageContainers = document.querySelectorAll('.image-container');
      if (imageContainers && imageContainers.length) {
        gsap.fromTo(
          imageContainers,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
              trigger: imageContainers[0],
              start: 'top bottom',
            },
          }
        );
      }
    }
  }, [conference]);

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center justify-center gap-5 md:gap-8 py-6 md:py-12 relative overflow-visible px-4 md:px-6"
    >
      {/* Gradient Background Elements */}
      <div className="absolute -left-12 sm:-left-24 top-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-gradient-to-b from-[#ffece4]/20 to-[#ffe6db]/30 opacity-40 blur-3xl -z-10"></div>
      <div className="absolute -right-12 sm:-right-24 bottom-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-gradient-to-t from-[#ffece4]/20 to-[#ffe6db]/30 opacity-40 blur-3xl -z-10"></div>
      <div className="absolute left-1/4 top-1/3 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 opacity-30 blur-3xl -z-10"></div>
      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-2 md:gap-3 text-center">
        <p className="uppercase font-medium text-sm sm:text-base text-primary mb-1 tracking-wider">
          {title}
        </p>
        <h1
          ref={yearRef}
          className="font-bold text-4xl sm:text-5xl md:text-7xl text-slate-800 leading-tight bg-gradient-to-r from-slate-800 to-primary bg-clip-text text-transparent"
        >
          {year}
        </h1>
      </div>
      {/* Stats */}
      <div
        ref={statsRef}
        className="w-full max-w-4xl flex flex-col md:flex-row items-stretch justify-start gap-4 md:gap-6 py-4 md:py-8"
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="stat-item flex-1 text-center md:text-right p-4 relative bg-white/50 rounded-xl shadow-sm md:bg-transparent md:shadow-none"
          >
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 w-[1px] h-12 bg-[#ffe6db]/30 last:hidden first:hidden"></div>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-2 md:mb-3 transition-all hover:scale-110 origin-right">
              {stat.value}
            </h2>
            <p className="text-slate-600 text-base md:text-lg">{stat.label}</p>
          </div>
        ))}
      </div>
      {/* Conference Section */}
      {conference && (
        <div
          ref={conferenceRef}
          className="w-full py-12 md:py-24 px-6 md:px-10 bg-white/50 rounded-2xl backdrop-blur-sm shadow-sm"
        >
          <div className="flex flex-col max-w-5xl mx-auto gap-12">
            {/* Title and Description */}
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-bold text-2xl md:text-3xl text-primary mb-5 inline-flex items-center flex-wrap justify-center">
                <span className="text-2xl md:text-3xl text-primary/40 me-2">
                  ✯
                </span>
                {conference.title}
              </h2>
              <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                {conference.description}
              </p>
            </div>

            {/* Media Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
              {/* Video */}
              <figure className="image-container group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 aspect-square w-full">
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary rounded-full px-2 py-1 text-xs font-bold text-white z-20 flex items-center">
                  <span className="me-1 inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  {conference.images.video_label}
                </div>
                <video
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                  poster={conference.images.video_poster}
                >
                  <source src={conference.images.video} type="video/mp4" />
                  مرورگر شما از ویدیو پشتیبانی نمی‌کند.
                </video>
              </figure>

              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-6 md:gap-8 w-full">
                {conference.images.gallery.map((image, idx) => (
                  <figure
                    key={idx}
                    className={`image-container group relative rounded-xl overflow-hidden
                      shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20
                      transition-all duration-300
                      aspect-square w-full
                      ${idx % 2 !== 0 ? 'mt-6' : ''}`}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <Image
                        src={image.src}
                        alt={`همایش ${year} فرانت‌چپتر`}
                        width={350}
                        height={350}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20">
                        <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                          {image.label}
                        </span>
                      </div>
                      <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                        <span className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-3 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
                          <svg
                            width="256"
                            height="256"
                            viewBox="0 0 256 256"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M151.14 72H102.86C72.3666 72 57.12 72 50.6194 82.2645C44.1187 92.529 50.3074 106.831 62.685 135.435L92.8515 205.149C107.521 239.05 114.855 256 127 256C132.269 256 136.632 252.81 141.082 246.43C143.496 242.968 143.502 238.377 141.58 234.604L131.217 214.257C128.961 209.83 127.834 207.616 128.796 205.985C129.758 204.354 132.192 204.354 137.06 204.354H153.635C158.413 204.354 162.743 201.465 164.683 196.982L175.788 171.318C178.493 165.067 175.759 157.748 169.676 154.955L128.787 136.182C123.376 133.697 125.103 125.393 131.031 125.393H187.731C192.535 125.393 196.906 122.478 198.759 117.929C205.86 100.5 208.394 90.1812 203.381 82.2645C196.88 72 181.633 72 151.14 72Z"
                              fill="#FAFAFA"
                            />
                            <path
                              d="M128.075 63.9808C116.95 64.0307 107.637 61.5 99.3718 55.2065C92.264 49.7941 88.0122 42.4149 85.6601 33.7213C84.5315 29.5505 83.7994 25.3028 84.0488 20.917C84.1246 19.5817 84.5379 18.8738 85.896 18.9084C94.5134 19.1222 102.673 20.9438 109.749 26.4512C110.534 27.063 110.716 26.6816 110.901 26.0735C111.245 24.9521 111.497 23.7999 111.823 22.6721C113.621 16.4709 117.097 11.3016 120.964 6.37032C122.624 4.25418 124.441 2.29552 126.33 0.403418C126.864 -0.131696 127.207 -0.138099 127.734 0.405976C134.215 7.11538 139.978 14.3177 142.516 23.7603C142.599 24.0688 142.652 24.385 142.714 24.6986C143.155 27.0004 143.39 27.0657 145.159 25.7151C148.885 22.8705 153.161 21.342 157.592 20.259C161.065 19.4089 164.558 18.6754 168.171 18.8904C169.4 18.9634 169.993 19.4409 169.999 20.7531C170.065 33.0096 166.479 43.8297 157.923 52.371C152.203 58.0817 145.239 61.5446 137.381 62.9799C133.947 63.6097 130.524 64.1051 128.075 63.9808Z"
                              fill="#FAFAFA"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Community Collaboration Section */}
      {communityCollaboration && (
        <div className="w-full py-10 md:py-14 px-4 md:px-6 mt-12 mb-12 rounded-3xl">
          <div className="max-w-6xl mx-auto relative">
            {/* Title Section */}
            <div className="text-center mb-12 md:mb-16 pt-4">
              <h2 className="font-bold text-2xl md:text-3xl text-[#FF5C39]">
                {communityCollaboration.title}
              </h2>
              <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mt-5 leading-loose">
                {communityCollaboration.description}
              </p>
            </div>

            {/* Modern Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
              {communityCollaboration.collaborations.map((collab, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={collab.image}
                      alt={`${collab.community} Event`}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-0 right-0">
                      <div
                        className={`px-4 py-2 font-medium rounded-bl-xl`}
                        style={{
                          backgroundColor: collab.color,
                          color:
                            collab.color === '#FFCE31' ? '#1f2937' : 'white',
                        }}
                      >
                        {collab.community}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-right mb-4 text-slate-800 group-hover:text-[#FF5C39] transition-colors">
                      <span className="ml-2" style={{ color: collab.color }}>
                        ◆
                      </span>
                      {collab.title}
                    </h3>

                    <div className="flex items-center mt-auto mb-4">
                      <div className="mr-3 text-right flex-grow">
                        <span className="text-slate-500 text-sm">
                          ارائه‌دهنده
                        </span>
                        <p className="font-medium text-slate-700">
                          {collab.presenter}
                        </p>
                      </div>
                      <div className="bg-slate-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={collab.color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        href={collab.link}
                        className="inline-flex items-center font-medium transition-colors"
                        style={{
                          color: collab.color,
                        }}
                      >
                        <span className="ml-2">مشاهده گزارش کامل</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 12H5M12 19l-7-7 7-7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Birthday Section */}
      <div
        ref={birthdayRef}
        className="w-full py-8 md:py-14 px-6 md:px-10 bg-white/50 rounded-2xl backdrop-blur-sm shadow-sm"
      >
        <div className="flex flex-col max-w-5xl mx-auto gap-6">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-bold text-2xl md:text-3xl text-primary mb-3 inline-flex items-center flex-wrap justify-center">
              <span className="text-2xl md:text-3xl text-primary/40 me-2">
                ✯
              </span>
              {birthday.title}
            </h2>
            <p className="text-slate-600 leading-relaxed text-base md:text-lg py-4">
              {birthday.description}
            </p>
          </div>

          {/* Birthday Image */}
          <figure className="image-container group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 w-full max-w-4xl mx-auto">
            <div className="relative w-full h-full aspect-[16/9]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <Image
                src={birthday.image}
                alt={birthday.title}
                width={900}
                height={506}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <span className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-3 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
                  <svg
                    width="256"
                    height="256"
                    viewBox="0 0 256 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M151.14 72H102.86C72.3666 72 57.12 72 50.6194 82.2645C44.1187 92.529 50.3074 106.831 62.685 135.435L92.8515 205.149C107.521 239.05 114.855 256 127 256C132.269 256 136.632 252.81 141.082 246.43C143.496 242.968 143.502 238.377 141.58 234.604L131.217 214.257C128.961 209.83 127.834 207.616 128.796 205.985C129.758 204.354 132.192 204.354 137.06 204.354H153.635C158.413 204.354 162.743 201.465 164.683 196.982L175.788 171.318C178.493 165.067 175.759 157.748 169.676 154.955L128.787 136.182C123.376 133.697 125.103 125.393 131.031 125.393H187.731C192.535 125.393 196.906 122.478 198.759 117.929C205.86 100.5 208.394 90.1812 203.381 82.2645C196.88 72 181.633 72 151.14 72Z"
                      fill="#FAFAFA"
                    />
                    <path
                      d="M128.075 63.9808C116.95 64.0307 107.637 61.5 99.3718 55.2065C92.264 49.7941 88.0122 42.4149 85.6601 33.7213C84.5315 29.5505 83.7994 25.3028 84.0488 20.917C84.1246 19.5817 84.5379 18.8738 85.896 18.9084C94.5134 19.1222 102.673 20.9438 109.749 26.4512C110.534 27.063 110.716 26.6816 110.901 26.0735C111.245 24.9521 111.497 23.7999 111.823 22.6721C113.621 16.4709 117.097 11.3016 120.964 6.37032C122.624 4.25418 124.441 2.29552 126.33 0.403418C126.864 -0.131696 127.207 -0.138099 127.734 0.405976C134.215 7.11538 139.978 14.3177 142.516 23.7603C142.599 24.0688 142.652 24.385 142.714 24.6986C143.155 27.0004 143.39 27.0657 145.159 25.7151C148.885 22.8705 153.161 21.342 157.592 20.259C161.065 19.4089 164.558 18.6754 168.171 18.8904C169.4 18.9634 169.993 19.4409 169.999 20.7531C170.065 33.0096 166.479 43.8297 157.923 52.371C152.203 58.0817 145.239 61.5446 137.381 62.9799C133.947 63.6097 130.524 64.1051 128.075 63.9808Z"
                      fill="#FAFAFA"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </figure>
        </div>
      </div>
      {/* Events Section */}
      <div
        ref={eventsRef}
        className="w-full py-8 md:py-14 px-6 md:px-10 bg-white/50 rounded-2xl backdrop-blur-sm shadow-sm mt-5"
      >
        <div className="flex flex-col max-w-5xl mx-auto gap-6">
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-12">
            {events.map((event, idx) => (
              <React.Fragment key={idx}>
                {idx % 2 === 0 ? (
                  <>
                    {/* Image (Left) */}
                    <figure className="image-container group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 aspect-video w-full">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={600}
                          height={450}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20">
                          <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                            {event.title}
                          </span>
                        </div>
                        <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                          <span className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-3 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
                            <svg
                              width="256"
                              height="256"
                              viewBox="0 0 256 256"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M151.14 72H102.86C72.3666 72 57.12 72 50.6194 82.2645C44.1187 92.529 50.3074 106.831 62.685 135.435L92.8515 205.149C107.521 239.05 114.855 256 127 256C132.269 256 136.632 252.81 141.082 246.43C143.496 242.968 143.502 238.377 141.58 234.604L131.217 214.257C128.961 209.83 127.834 207.616 128.796 205.985C129.758 204.354 132.192 204.354 137.06 204.354H153.635C158.413 204.354 162.743 201.465 164.683 196.982L175.788 171.318C178.493 165.067 175.759 157.748 169.676 154.955L128.787 136.182C123.376 133.697 125.103 125.393 131.031 125.393H187.731C192.535 125.393 196.906 122.478 198.759 117.929C205.86 100.5 208.394 90.1812 203.381 82.2645C196.88 72 181.633 72 151.14 72Z"
                                fill="#FAFAFA"
                              />
                              <path
                                d="M128.075 63.9808C116.95 64.0307 107.637 61.5 99.3718 55.2065C92.264 49.7941 88.0122 42.4149 85.6601 33.7213C84.5315 29.5505 83.7994 25.3028 84.0488 20.917C84.1246 19.5817 84.5379 18.8738 85.896 18.9084C94.5134 19.1222 102.673 20.9438 109.749 26.4512C110.534 27.063 110.716 26.6816 110.901 26.0735C111.245 24.9521 111.497 23.7999 111.823 22.6721C113.621 16.4709 117.097 11.3016 120.964 6.37032C122.624 4.25418 124.441 2.29552 126.33 0.403418C126.864 -0.131696 127.207 -0.138099 127.734 0.405976C134.215 7.11538 139.978 14.3177 142.516 23.7603C142.599 24.0688 142.652 24.385 142.714 24.6986C143.155 27.0004 143.39 27.0657 145.159 25.7151C148.885 22.8705 153.161 21.342 157.592 20.259C161.065 19.4089 164.558 18.6754 168.171 18.8904C169.4 18.9634 169.993 19.4409 169.999 20.7531C170.065 33.0096 166.479 43.8297 157.923 52.371C152.203 58.0817 145.239 61.5446 137.381 62.9799C133.947 63.6097 130.524 64.1051 128.075 63.9808Z"
                                fill="#FAFAFA"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </figure>
                    {/* Content (Right) */}
                    <div className="flex flex-col justify-center gap-5 px-0 md:px-8">
                      <div className="text-right">
                        <h3 className="font-bold text-xl md:text-2xl text-primary mb-5">
                          {event.title}
                        </h3>
                        <p className="text-slate-600 text-base md:text-lg">
                          {event.description}
                        </p>
                      </div>
                      <div>
                        <Link
                          href={event.link.href}
                          className="px-6 py-3 bg-primary text-white font-semibold rounded inline-block hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                        >
                          {event.link.label}
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Content (Left) */}
                    <div className="flex flex-col justify-center gap-5 px-0 md:px-8">
                      <div className="text-right">
                        <h3 className="font-bold text-xl md:text-2xl text-primary mb-5">
                          {event.title}
                        </h3>
                        <p className="text-slate-600 text-base md:text-lg">
                          {event.description}
                        </p>
                      </div>
                      <div>
                        <Link
                          href={event.link.href}
                          className="px-6 py-3 bg-primary text-white font-semibold rounded inline-block hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                        >
                          {event.link.label}
                        </Link>
                      </div>
                    </div>
                    {/* Image (Right) */}
                    <figure className="image-container group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 aspect-video w-full">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={600}
                          height={450}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20">
                          <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                            {event.title}
                          </span>
                        </div>
                        <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                          <span className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-3 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
                            <svg
                              width="256"
                              height="256"
                              viewBox="0 0 256 256"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M151.14 72H102.86C72.3666 72 57.12 72 50.6194 82.2645C44.1187 92.529 50.3074 106.831 62.685 135.435L92.8515 205.149C107.521 239.05 114.855 256 127 256C132.269 256 136.632 252.81 141.082 246.43C143.496 242.968 143.502 238.377 141.58 234.604L131.217 214.257C128.961 209.83 127.834 207.616 128.796 205.985C129.758 204.354 132.192 204.354 137.06 204.354H153.635C158.413 204.354 162.743 201.465 164.683 196.982L175.788 171.318C178.493 165.067 175.759 157.748 169.676 154.955L128.787 136.182C123.376 133.697 125.103 125.393 131.031 125.393H187.731C192.535 125.393 196.906 122.478 198.759 117.929C205.86 100.5 208.394 90.1812 203.381 82.2645C196.88 72 181.633 72 151.14 72Z"
                                fill="#FAFAFA"
                              />
                              <path
                                d="M128.075 63.9808C116.95 64.0307 107.637 61.5 99.3718 55.2065C92.264 49.7941 88.0122 42.4149 85.6601 33.7213C84.5315 29.5505 83.7994 25.3028 84.0488 20.917C84.1246 19.5817 84.5379 18.8738 85.896 18.9084C94.5134 19.1222 102.673 20.9438 109.749 26.4512C110.534 27.063 110.716 26.6816 110.901 26.0735C111.245 24.9521 111.497 23.7999 111.823 22.6721C113.621 16.4709 117.097 11.3016 120.964 6.37032C122.624 4.25418 124.441 2.29552 126.33 0.403418C126.864 -0.131696 127.207 -0.138099 127.734 0.405976C134.215 7.11538 139.978 14.3177 142.516 23.7603C142.599 24.0688 142.652 24.385 142.714 24.6986C143.155 27.0004 143.39 27.0657 145.159 25.7151C148.885 22.8705 153.161 21.342 157.592 20.259C161.065 19.4089 164.558 18.6754 168.171 18.8904C169.4 18.9634 169.993 19.4409 169.999 20.7531C170.065 33.0096 166.479 43.8297 157.923 52.371C152.203 58.0817 145.239 61.5446 137.381 62.9799C133.947 63.6097 130.524 64.1051 128.075 63.9808Z"
                                fill="#FAFAFA"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </figure>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default YearFourStats;
