import clsx from 'clsx';

interface TicketTier {
  name: string;
  price: string;
  highlight?: boolean;
  soldOut?: boolean;
  contact?: boolean;
  features: string[];
}

const tiers1402: TicketTier[] = [
  {
    name: 'ثبت‌نام عادی',
    price: '۸۹۵,۰۰۰ تومان',
    features: [
      'حضور در ارائه‌ها',
      'حضور در پنل گفت‌وگو',
      'نهار و پذیرایی (روز همایش)',
      'بسته ویژه شرکت‌کنندگان',
    ],
  },
  {
    name: 'ثبت‌نام VIP',
    price: '۱,۵۹۵,۰۰۰ تومان',
    highlight: true,
    features: [
      'حضور در ارائه‌ها',
      'حضور در پنل گفت‌وگو',
      'نهار و پذیرایی (روز همایش)',
      'بسته ویژه شرکت‌کنندگان',
      'حضور در قسمت VIP سالن',
      'حضور در برنامه‌های ویژه',
      'عضویت در کلاب هویج طلایی',
    ],
  },
  {
    name: 'ثبت‌نام گروهی',
    price: 'تماس بگیرید',
    contact: true,
    features: [
      'حضور در ارائه‌ها',
      'حضور در پنل گفت‌وگو',
      'نهار و پذیرایی (روز همایش)',
      'بسته ویژه شرکت‌کنندگان',
      'تخفیف ویژه ثبت‌نام گروهی',
    ],
  },
  {
    name: 'ثبت‌نام زودهنگام',
    price: 'تمام شده',
    soldOut: true,
    features: [
      'حضور در ارائه‌ها',
      'حضور در پنل گفت‌وگو',
      'نهار و پذیرایی (روز همایش)',
      'بسته ویژه شرکت‌کنندگان',
    ],
  },
];

const ConferenceTickets = () => (
  <div className="conference-tickets not-prose mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
    {tiers1402.map((tier) => (
      <article
        key={tier.name}
        className={clsx(
          'flex flex-col rounded-2xl border bg-surface-solid p-5 shadow-sm md:p-6',
          tier.highlight
            ? 'border-primary shadow-md shadow-primary/10'
            : 'border-border',
          tier.soldOut && 'opacity-70'
        )}
      >
        <h4 className="text-base font-bold text-dark">{tier.name}</h4>
        <p
          className={clsx(
            'mt-3 text-lg font-bold md:text-xl',
            tier.soldOut ? 'text-muted' : 'text-primary'
          )}
        >
          {tier.price}
        </p>
        <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm leading-relaxed text-text">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      </article>
    ))}
  </div>
);

export default ConferenceTickets;
