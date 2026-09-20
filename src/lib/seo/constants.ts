export const SITE_URL = 'https://frontchapter.ir';

export const SITE_NAME = 'فرانت‌چپتر';

export const DEFAULT_TITLE = 'فرانت چپتر | جامعه و کامیونتی فرانت‌اند ایران';

export const DEFAULT_DESCRIPTION =
  'کامیونتی فرانت‌اند ایران؛ همایش‌ها، دورهمی‌ها و رویدادهای تخصصی برای برنامه‌نویسان وب. آموزش فرانت‌اند و شبکه‌سازی حرفه‌ای.';

export const DEFAULT_OG_IMAGE = '/images/banner-app.png';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const formatIsoUploadDate = (dateStr?: string) => {
  if (!dateStr) return '2025-02-27T08:00:00+03:30';
  if (dateStr.includes('T')) {
    if (
      dateStr.endsWith('Z') ||
      dateStr.includes('+') ||
      dateStr.slice(10).includes('-')
    ) {
      return dateStr;
    }
    return `${dateStr}+03:30`;
  }
  return `${dateStr}T08:00:00+03:30`;
};
