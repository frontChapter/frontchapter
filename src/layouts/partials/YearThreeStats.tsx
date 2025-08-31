import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface YearThreeStatsProps {
  title: string;
  year: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  conference: {
    title: string;
    description: string;
    images: {
      video: string;
      video_label: string;
      gallery: Array<{
        src: string;
        label: string;
      }>;
    };
  };
  magazine: {
    title: string;
    subtitle: string;
    description: string;
    link: {
      label: string;
      href: string;
    };
    images: Array<{
      src: string;
      label: string;
    }>;
  };
  festival: {
    title: string;
    description: string;
    link: {
      label: string;
      href: string;
    };
    images: Array<{
      src: string;
      label: string;
    }>;
  };
}

const YearThreeStats: React.FC<YearThreeStatsProps> = ({
  title,
  year,
  stats,
  conference,
  magazine,
  festival,
}) => {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-6 py-6 md:py-12">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-4 text-center">
        <p className="uppercase font-medium text-base text-slate-800 mb-2">
          {title}
        </p>
        <h1 className="font-bold text-5xl md:text-6xl text-slate-800 leading-tight">
          {year}
        </h1>
      </div>

      {/* Stats */}
      <div className="w-full max-w-3xl flex flex-wrap md:flex-row items-stretch justify-start gap-4 bg-white rounded-xl shadow-sm py-8 px-4 md:px-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex-1 text-right px-4 min-w-[140px]">
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-2">
              {stat.value}
            </h2>
            <p className="text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Conference Section */}
      <div className="w-full py-12 md:py-24 px-6 md:px-10 bg-white">
        <div className="flex flex-col max-w-5xl mx-auto gap-12">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-5">
              {conference.title}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {conference.description}
            </p>
          </div>

          {/* Media Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video */}
            <figure className="group relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 aspect-square">
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary rounded-full px-2 py-1 text-xs font-bold text-white z-20 flex items-center">
                <span className="me-1 inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {conference.images.video_label}
              </div>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={conference.images.video} type="video/mp4" />
                مرورگر شما از ویدیو پشتیبانی نمی‌کند.
              </video>
            </figure>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-6">
              {conference.images.gallery.map((image, idx) => (
                <figure
                  key={idx}
                  className={`group relative rounded-xl overflow-hidden shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ${idx % 2 !== 0 ? 'mt-6' : ''}`}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <Image
                      src={image.src}
                      alt={`همایش ${year} فرانت‌چپتر`}
                      width={282}
                      height={282}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20">
                      <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                        {image.label}
                      </span>
                    </div>
                    <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                      <span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-2 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
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

      {/* Magazine Section */}
      <div className="w-full py-12 md:py-24 px-6 md:px-10 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-12">
          {/* Images */}
          <div className="flex flex-1 gap-6">
            {magazine.images.map((image, idx) => (
              <figure
                key={idx}
                className={`group relative rounded-xl overflow-hidden shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ${idx === 1 ? 'mt-12' : ''}`}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <Image
                    src={image.src}
                    alt={magazine.title}
                    width={320}
                    height={420}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20">
                    <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                      {image.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-2 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
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

          {/* Content */}
          <div className="flex-1 text-right">
            <p className="uppercase font-medium text-base text-slate-800 mb-6">
              {magazine.subtitle}
            </p>
            <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-5">
              {magazine.title}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {magazine.description}
            </p>
            <Link
              href={magazine.link.href}
              className="px-8 py-4 bg-[#ea7847] text-white font-semibold rounded inline-block hover:opacity-90 transition-opacity"
            >
              {magazine.link.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Festival Section */}
      <div className="w-full py-12 md:py-24 px-6 md:px-10 bg-white">
        <div className="flex flex-col max-w-5xl mx-auto gap-8">
          {/* Title and Description */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-bold text-3xl md:text-5xl text-slate-800 mb-5">
              {festival.title}
            </h1>
            <p className="text-slate-600 leading-relaxed mb-8">
              {festival.description}
            </p>
            <Link
              href={festival.link.href}
              className="px-8 py-4 bg-[#ea7847] text-white font-semibold rounded inline-block hover:opacity-90 transition-opacity"
            >
              {festival.link.label}
            </Link>
          </div>

          {/* Images */}
          <div className="flex flex-wrap gap-6 justify-center mt-8">
            {festival.images.map((image, idx) => (
              <figure
                key={idx}
                className={`group relative rounded-xl overflow-hidden shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ${idx % 2 !== 0 ? 'mt-6' : ''}`}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <Image
                    src={image.src}
                    alt={`جشنواره ${festival.title}`}
                    width={282}
                    height={idx % 2 === 0 ? 370 : 420}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 z-20">
                    <span className="text-xs md:text-sm font-medium backdrop-blur-sm bg-black/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                      {image.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-2 rounded-full backdrop-blur-md flex items-center justify-center bg-white/20">
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
    </section>
  );
};

export default YearThreeStats;
