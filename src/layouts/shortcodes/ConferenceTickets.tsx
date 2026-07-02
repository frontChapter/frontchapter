import clsx from 'clsx';

interface TicketTier {
  name: string;
  price: string;
  originalPrice?: string;
  highlight?: boolean;
  soldOut?: boolean;
  contact?: boolean;
  badge?: string;
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

const tiers1403: TicketTier[] = [
  {
    name: 'بلیت انفرادی',
    price: '۸۹۵ هزار تومان',
    originalPrice: '۱,۲۰۰ هزار تومان',
    highlight: true,
    badge: 'تخفیف ویژه روز مهندس',
    features: [
      'تجارب واقعی مهندسان برتر',
      'تیم‌سازی و مهارت‌های گروهی',
      'سفر در کنار صدها توسعه‌دهنده',
      'گواهی شرکت در همایش',
      'نهار و میان‌وعده',
    ],
  },
  {
    name: 'بلیت گروهی',
    price: 'تماس بگیرید',
    contact: true,
    features: [
      'شرکت گروهی (بیش از ۴ نفر)',
      'تخفیف ویژه خرید گروهی',
      'مناسب برای شرکت‌ها و دانشگاه‌ها',
      'بج ویژه شرکت گروهی',
      'اولویت در انتخاب جایگاه',
    ],
  },
];

const tiersByVariant: Record<string, TicketTier[]> = {
  '1402': tiers1402,
  '1403': tiers1403,
};

interface ConferenceTicketsProps {
  variant?: '1402' | '1403';
}

const ConferenceTickets = ({ variant = '1402' }: ConferenceTicketsProps) => {
  const tiers = tiersByVariant[variant] ?? tiers1402;
  const gridClass =
    variant === '1403'
      ? 'sm:grid-cols-2 lg:max-w-3xl lg:mx-auto'
      : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div
      className={clsx(
        'conference-tickets not-prose mt-6 grid grid-cols-1 gap-4 lg:gap-5',
        gridClass
      )}
    >
      {tiers.map((tier) => (
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
          {tier.badge && (
            <span className="mb-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {tier.badge}
            </span>
          )}
          <h4 className="text-base font-bold text-dark">{tier.name}</h4>
          {tier.originalPrice && (
            <p className="mt-2 text-sm text-muted line-through">
              {tier.originalPrice}
            </p>
          )}
          <p
            className={clsx(
              'font-bold md:text-xl',
              tier.originalPrice ? 'mt-1 text-2xl' : 'mt-3 text-lg',
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
};

export default ConferenceTickets;
