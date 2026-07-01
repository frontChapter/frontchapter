export type DateLocale = 'fa' | 'en';

const dateFormat = (
  date: string | number | Date,
  locale: DateLocale = 'fa'
): string => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  if (locale === 'fa') {
    return new Intl.DateTimeFormat('fa-IR', {
      calendar: 'persian',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Tehran',
    }).format(parsed);
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(parsed);
};

export default dateFormat;
