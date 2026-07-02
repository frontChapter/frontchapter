import { IoBedOutline, IoBonfireOutline, IoBusOutline } from 'react-icons/io5';
import type { IconType } from 'react-icons';

interface ExperienceItem {
  icon: IconType;
  title: string;
  description: string;
  details: string[];
}

const items1402: ExperienceItem[] = [
  {
    icon: IoBedOutline,
    title: 'اقامت شب قبل از همایش',
    description:
      'اقامت ویژه شب قبل از همایش در کنار دیگر شرکت‌کنندگان و سخنرانان.',
    details: [
      'هتل کیش مهر فریدونکنار',
      '۰۹ اسفند ۱۴۰۲',
      'شب قبل تا صبح روز همایش',
    ],
  },
  {
    icon: IoBusOutline,
    title: 'رفت و برگشت',
    description:
      'رفت و برگشت از تهران به محل اقامت و بازگشت پس از اتمام همایش به تهران.',
    details: ['ترمینال شرق تهران — ۱۴:۰۰', 'محل اقامت — ۱۸:۰۰'],
  },
  {
    icon: IoBonfireOutline,
    title: 'دورهمی فرانت‌چپتر',
    description:
      'شب قبل از همایش دور هم جمع می‌شدیم؛ شبکه‌سازی کنار آتش و موسیقی در فضایی صمیمی.',
    details: ['ویژه‌برنامه شب ۰۹ اسفند', '۱۹:۳۰ تا ۲۱:۳۰'],
  },
];

const ConferenceExperienceCards = () => (
  <div className="conference-experience-cards not-prose mt-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {items1402.map(({ icon: Icon, title, description, details }) => (
        <article
          key={title}
          className="flex h-full flex-col rounded-2xl border border-border bg-surface-solid p-6 shadow-sm"
        >
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h4 className="text-base font-bold text-dark">{title}</h4>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-text">
            {description}
          </p>
          <ul className="mt-4 space-y-2 border-t border-border pt-4">
            {details.map((detail) => (
              <li
                key={detail}
                className="flex items-start gap-2 text-xs leading-relaxed text-muted md:text-sm"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                {detail}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>

    <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface-solid shadow-sm md:mt-10">
      <picture className="block">
        <source srcSet="/images/1402/01.webp" type="image/webp" />
        <img
          src="/images/1402/01.JPG"
          alt="دورهمی شب قبل از همایش فرانت‌چپتر ۱۴۰۲"
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
          decoding="async"
          width={1200}
          height={675}
        />
      </picture>
      <figcaption className="border-t border-border px-5 py-4 text-center text-sm text-muted md:px-6">
        دورهمی شب قبل از همایش — فضایی صمیمی برای آشنایی با سخنرانان و
        شرکت‌کنندگان
      </figcaption>
    </figure>
  </div>
);

export default ConferenceExperienceCards;
