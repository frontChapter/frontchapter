import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  IoArrowBack,
  IoCalendarOutline,
  IoLocationOutline,
  IoPlayOutline,
} from 'react-icons/io5';
import { CarrotBadge, CarrotButton } from '@/src/layouts/components/carrot';
import JsonLd from '@/src/layouts/partials/JsonLd';
import { SITE_NAME } from '@/src/lib/seo/constants';
import { buildWatchPageJsonLd } from '@/src/lib/seo/jsonLd';
import { buildPageMetadata } from '@/src/lib/seo/metadata';
import { getAllVideos, getVideoBySlug } from '@/src/lib/videos';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const videos = getAllVideos();
  return videos.map((v) => ({
    slug: v.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const video = getVideoBySlug(params.slug);
  if (!video) return {};

  const watchUrl = `/watch/${video.slug}/`;

  return buildPageMetadata({
    title: `${video.title} | ${SITE_NAME}`,
    meta_title: video.title,
    description: video.description,
    image: video.poster,
    canonical: watchUrl,
  });
}

export default function WatchPage({ params }: PageProps) {
  const video = getVideoBySlug(params.slug);
  if (!video) {
    notFound();
  }

  const allVideos = getAllVideos().filter((v) => v.slug !== video.slug);
  const jsonLd = buildWatchPageJsonLd(video);

  return (
    <>
      <JsonLd data={jsonLd} />
      <main
        id="main-content"
        className="min-h-screen bg-theme-light/40 py-8 md:py-12"
      >
        <div className="container-xl max-w-5xl px-4 sm:px-6">
          {/* Breadcrumb & Navigation */}
          <nav
            aria-label="مسیر صفحه"
            className="mb-6 flex items-center justify-between text-xs md:text-sm text-muted"
          >
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">
                خانه
              </Link>
              <span className="text-border">/</span>
              <Link
                href="/conferences/"
                className="hover:text-primary transition-colors"
              >
                همایش‌ها
              </Link>
              <span className="text-border">/</span>
              <span className="text-dark font-medium truncate max-w-[200px] sm:max-w-md">
                {video.title}
              </span>
            </div>
            {video.conferenceSlug && (
              <Link
                href={`/conferences/${video.conferenceSlug}/`}
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
              >
                <span>مشاهده همایش</span>
                <IoArrowBack className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </nav>

          {/* Primary Video Player - Above The Fold */}
          <article className="overflow-hidden rounded-2xl bg-surface-solid shadow-xl border border-border">
            <figure className="relative aspect-video w-full bg-black overflow-hidden">
              <video
                className="h-full w-full object-contain"
                controls
                playsInline
                preload="metadata"
                poster={video.poster}
                aria-label={video.title}
              >
                <source src={video.src} type="video/mp4" />
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
              </video>
            </figure>

            {/* Video Details & Meta */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <CarrotBadge accent>{video.categoryLabel}</CarrotBadge>
                {video.location && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <IoLocationOutline
                      className="h-3.5 w-3.5 text-primary"
                      aria-hidden="true"
                    />
                    <span>{video.location}</span>
                  </span>
                )}
                {video.uploadDate && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <IoCalendarOutline
                      className="h-3.5 w-3.5 text-primary"
                      aria-hidden="true"
                    />
                    <span>{video.uploadDate.split('T')[0]}</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-dark leading-tight mb-2">
                {video.title}
              </h1>

              {video.subtitle && (
                <p className="text-base md:text-lg text-primary font-medium mb-6">
                  {video.subtitle}
                </p>
              )}

              <p className="text-text leading-relaxed text-base md:text-lg mb-8">
                {video.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
                {video.conferenceSlug && (
                  <CarrotButton
                    href={`/conferences/${video.conferenceSlug}/`}
                    variant="primary"
                  >
                    گزارش کامل و تصاویر {video.conferenceTitle}
                  </CarrotButton>
                )}
                <CarrotButton href="/conferences/" variant="secondary">
                  مشاهده همه همایش‌ها
                </CarrotButton>
                <CarrotButton href="/" variant="ghost">
                  صفحه اصلی فرانت‌چپتر
                </CarrotButton>
              </div>
            </div>
          </article>

          {/* Other Videos Section */}
          {allVideos.length > 0 && (
            <section
              className="mt-12 pt-8 border-t border-border"
              aria-labelledby="other-videos-heading"
            >
              <h2
                id="other-videos-heading"
                className="text-lg md:text-xl font-bold text-dark mb-6"
              >
                سایر ویدیوها و تیزرهای فرانت‌چپتر
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {allVideos.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/watch/${item.slug}/`}
                    className="group block overflow-hidden rounded-xl bg-surface-solid border border-border shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black/10">
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                          <IoPlayOutline
                            className="h-5 w-5 ms-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-[11px] font-semibold text-primary mb-1 block">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-sm font-bold text-dark group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
