/** Minimal .ics builder for “download calendar” after event register. */

export type IcsEventInput = {
  uid: string;
  title: string;
  sessionDatetime: string;
  eventUrl: string;
  meetLink?: string;
  durationMinutes?: number;
};

function icsEscape(s: string) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function icsUtc(d: Date) {
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

export function buildEventIcs(input: IcsEventInput): string {
  const start = new Date(input.sessionDatetime);
  if (!Number.isFinite(start.getTime())) {
    throw new Error('invalid sessionDatetime');
  }
  const mins = input.durationMinutes ?? 90;
  const end = new Date(start.getTime() + mins * 60 * 1000);
  const loc = input.meetLink || input.eventUrl;
  const desc = [input.eventUrl, input.meetLink].filter(Boolean).join('\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FrontChapter//Events//FA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${icsEscape(input.uid)}@frontchapter.ir`,
    `DTSTAMP:${icsUtc(new Date())}`,
    `DTSTART:${icsUtc(start)}`,
    `DTEND:${icsUtc(end)}`,
    `SUMMARY:${icsEscape(input.title)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    `LOCATION:${icsEscape(loc)}`,
    `URL:${icsEscape(input.meetLink || input.eventUrl)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadEventIcs(input: IcsEventInput, filename?: string) {
  const body = buildEventIcs(input);
  const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${input.uid}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/** ponytail: fails if ICS folding/escaping breaks */
export function assertEventIcsOk() {
  const ics = buildEventIcs({
    uid: 'test-69',
    title: 'جلسه تست; ویرگول, خط\nبعد',
    sessionDatetime: '2026-08-05T19:00:00.000Z',
    eventUrl: 'https://frontchapter.ir/posts/x/',
    meetLink: 'https://meet.google.com/abc-defg-hij',
  });
  if (!ics.includes('BEGIN:VEVENT')) throw new Error('missing VEVENT');
  if (!ics.includes('meet.google.com/abc-defg-hij')) {
    throw new Error('meet link missing');
  }
  if (!ics.includes('\\;') || !ics.includes('\\,')) {
    throw new Error('escape broken');
  }
  return true;
}
