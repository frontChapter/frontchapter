import {
  IoBedOutline,
  IoBusOutline,
  IoRestaurantOutline,
} from 'react-icons/io5';

const items = [
  {
    icon: IoBusOutline,
    title: 'رفت و آمد',
    description:
      'سرویس رفت‌وآمد ویژه از ترمینال شرق تهران برای شرکت‌کنندگان تهرانی.',
  },
  {
    icon: IoBedOutline,
    title: 'اقامت راحت',
    description:
      'اقامتگاه دنج کنار دریا برای راحتی شرکت‌کنندگان فراهم شده بود.',
  },
  {
    icon: IoRestaurantOutline,
    title: 'ناهار و پذیرایی',
    description:
      'ناهار در سالن لادن هتل میزبان؛ فرصتی برای گفت‌وگو و آشنایی با دوستان جدید.',
  },
];

const ConferenceTravelCards = () => (
  <div className="conference-travel-cards not-prose mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
    {items.map(({ icon: Icon, title, description }) => (
      <article
        key={title}
        className="flex flex-col items-center rounded-2xl border border-border bg-surface-solid p-6 text-center shadow-sm"
      >
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h4 className="text-base font-bold text-dark">{title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {description}
        </p>
      </article>
    ))}
  </div>
);

export default ConferenceTravelCards;
