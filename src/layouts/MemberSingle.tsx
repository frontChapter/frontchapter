import {
  CarrotBadge,
  CarrotButton,
  CarrotLevel,
} from '@layouts/components/carrot';
import Banner from '@layouts/components/Banner';
import Cta from '@layouts/components/Cta';
import {
  ACTIVITY_LABELS,
  formatTehranDate,
} from '@lib/membership/activity';
import type {
  MemberActivity,
  MemberProfile,
} from '@lib/membership/fetch';
import { memberPath, memberSlug } from '@lib/membership/slug';
import {
  BADGE_LABELS,
  LEVEL_LABELS,
  type LevelKey,
} from '@lib/membership/types';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  IoGlobeOutline,
  IoLogoGithub,
  IoLogoLinkedin,
  IoPaperPlaneOutline,
} from 'react-icons/io5';

export function buildMemberMetadata(m: MemberProfile): Metadata {
  const handle = m.username ? `@${m.username}` : m.display_name;
  const bits = [
    m.expertise,
    LEVEL_LABELS[(m.level_key || 'badge') as LevelKey],
    m.bio,
  ].filter(Boolean);
  return buildPageMetadata({
    title: m.display_name,
    meta_title: `${m.display_name} | هویجی‌های فرانت‌چپتر`,
    description:
      bits.join(' — ').slice(0, 160) ||
      `پروفایل ${handle} در جامعه فرانت‌چپتر`,
    image: m.photo_url || undefined,
    canonical: memberPath(memberSlug(m)),
    authors: [{ name: m.display_name }],
  });
}

type Props = {
  member: MemberProfile;
  activities: MemberActivity[];
};

const MemberSingle = ({ member: m, activities }: Props) => {
  const level = (m.level_key || 'badge') as LevelKey;
  const badges = Array.isArray(m.badges) ? m.badges : [];

  return (
    <>
      <section className="section member-plot pt-0">
        <Banner title={m.display_name} />
        <div className="container">
          <p className="mb-8 text-sm text-muted">
            <Link href="/members/" className="hover:text-primary">
              هویجی‌ها
            </Link>
            <span aria-hidden> / </span>
            <span className="text-dark">{m.display_name}</span>
          </p>

          <div className="member-plot__hero">
            <div className="member-plot__identity">
              {m.photo_url ? (
                <Image
                  src={m.photo_url}
                  alt=""
                  width={112}
                  height={112}
                  className="member-plot__avatar"
                  unoptimized
                />
              ) : (
                <span className="member-plot__avatar member-plot__avatar--fallback">
                  ؟
                </span>
              )}
              <div>
                <h1 className="member-plot__name">{m.display_name}</h1>
                <p className="member-plot__sub">
                  {m.username ? `@${m.username}` : null}
                  {m.username && m.expertise ? ' · ' : null}
                  {m.expertise || null}
                </p>
                {m.bio ? <p className="member-plot__bio">{m.bio}</p> : null}

                <div className="member-plot__links">
                  {m.username ? (
                    <a
                      href={`https://t.me/${m.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="تلگرام"
                    >
                      <IoPaperPlaneOutline className="h-5 w-5" />
                    </a>
                  ) : null}
                  {m.website_url ? (
                    <a
                      href={m.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="وب‌سایت"
                    >
                      <IoGlobeOutline className="h-5 w-5" />
                    </a>
                  ) : null}
                  {m.github_url ? (
                    <a
                      href={m.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="گیت‌هاب"
                    >
                      <IoLogoGithub className="h-5 w-5" />
                    </a>
                  ) : null}
                  {m.linkedin_url ? (
                    <a
                      href={m.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="لینکدین"
                    >
                      <IoLogoLinkedin className="h-5 w-5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="member-plot__meter">
              <CarrotLevel level={level} size="md" />
              <p className="member-plot__points">
                {m.points_total ?? 0} امتیاز
              </p>
              {badges.length > 0 ? (
                <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                  {badges.map((b) => (
                    <CarrotBadge key={b} accent>
                      {BADGE_LABELS[b] ?? b}
                    </CarrotBadge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <dl className="member-plot__dates">
            <div>
              <dt>عضویت در سایت</dt>
              <dd>{formatTehranDate(m.created_at)}</dd>
            </div>
            {m.profile_completed_at ? (
              <div>
                <dt>تکمیل پروفایل</dt>
                <dd>{formatTehranDate(m.profile_completed_at)}</dd>
              </div>
            ) : null}
            {m.telegram_joined_at ? (
              <div>
                <dt>عضویت تلگرام</dt>
                <dd>{formatTehranDate(m.telegram_joined_at)}</dd>
              </div>
            ) : null}
          </dl>

          <div className="member-plot__panels">
            <section className="member-plot__panel">
              <h2 className="member-plot__heading">تاریخچه فعالیت</h2>
              {activities.length === 0 ? (
                <p className="text-sm text-muted">هنوز فعالیت ثبت‌شده‌ای نیست.</p>
              ) : (
                <ol className="member-plot__timeline list-none p-0">
                  {activities.map((a) => (
                    <li key={a.id} className="member-plot__event">
                      <span className="member-plot__event-dot" aria-hidden />
                      <div>
                        <p className="member-plot__event-title">
                          {ACTIVITY_LABELS[a.activity_type] ?? a.activity_type}
                          {a.points > 0 ? (
                            <span className="member-plot__event-pts">
                              {' '}
                              +{a.points}
                            </span>
                          ) : null}
                        </p>
                        <p className="member-plot__event-date">
                          {formatTehranDate(a.created_at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>

          <div className="mt-12 text-center">
            <CarrotButton href="/join/" variant="community">
              تو هم هویجی شو!
            </CarrotButton>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
};

export default MemberSingle;
