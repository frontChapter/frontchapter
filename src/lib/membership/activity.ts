export const ACTIVITY_LABELS: Record<string, string> = {
  profile_complete: 'تکمیل پروفایل',
  quality_message: 'پیام باکیفیت',
  invite: 'دعوت دوست',
  event_online: 'رویداد آنلاین',
  event_inperson: 'رویداد حضوری',
  blog_post: 'نوشته',
  talk: 'ارائه',
};

export function formatTehranDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Tehran',
    });
  } catch {
    return iso;
  }
}
