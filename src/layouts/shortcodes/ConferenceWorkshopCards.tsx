import Image from 'next/image';

const workshops1403 = [
  {
    community: 'شیرازلاگ',
    title: 'آشنایی با وب‌اسمبلی (WebAssembly)',
    presenter: 'محمد میرشایی',
    time: '۱۵:۰۰ — ۱۶:۳۰',
    image: '/images/1403/shirazlug_frontchapter.jpg',
    alt: 'کارگاه وب‌اسمبلی — نشست مشترک شیرازلاگ و فرانت‌چپتر',
  },
  {
    community: 'سرکش',
    title: 'قصه‌های فونت فارسی',
    presenter: 'مسلم ابراهیمی — بنیان‌گذار فونت‌ایران',
    time: '۱۶:۳۰ — ۱۸:۰۰',
    image: '/images/1403/sarkesh_frontchapter.jpg',
    alt: 'کارگاه فونت فارسی — نشست مشترک سرکش و فرانت‌چپتر',
  },
  {
    community: 'نگارنده',
    title: 'چگونگی گفتگو با نویسندگان',
    presenter: 'تیم نگارنده',
    time: '۱۸:۰۰ — ۱۹:۳۰',
    image: '/images/1403/negarande_frontchapter.jpg',
    alt: 'کارگاه گفتگو با نویسندگان — نشست مشترک نگارنده و فرانت‌چپتر',
  },
];

const ConferenceWorkshopCards = () => (
  <div className="conference-workshop-cards not-prose mt-6 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
    {workshops1403.map(({ community, title, presenter, time, image, alt }) => (
      <article
        key={community}
        className="overflow-hidden rounded-2xl border border-border bg-surface-solid shadow-sm"
      >
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        </div>
        <div className="p-5 md:p-6">
          <span className="text-xs font-medium text-primary">
            نشست مشترک {community}
          </span>
          <h4 className="mt-2 text-base font-bold text-dark">{title}</h4>
          <p className="mt-2 text-sm text-muted">{presenter}</p>
          <p className="mt-3 text-sm font-medium tabular-nums text-text">
            {time}
          </p>
        </div>
      </article>
    ))}
  </div>
);

export default ConferenceWorkshopCards;
