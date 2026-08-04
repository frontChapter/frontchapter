#!/usr/bin/env node
/** Self-check for sessionPhase — mirrors src/lib/membership/session.ts */
function sessionPhase(fm, now = new Date()) {
  const deadline = fm.registration_deadline
    ? Date.parse(fm.registration_deadline)
    : NaN;
  const sessionAt = fm.session_datetime
    ? Date.parse(fm.session_datetime)
    : NaN;
  if (!Number.isFinite(deadline) && !Number.isFinite(sessionAt)) return 'hidden';
  if (Number.isFinite(sessionAt) && now.getTime() >= sessionAt)
    return 'live_or_done';
  if (Number.isFinite(deadline))
    return now.getTime() < deadline ? 'open' : 'closed';
  return 'open';
}

const t = new Date('2026-08-01T12:00:00Z');
const cases = [
  [{}, 'hidden'],
  [{ registration_deadline: '2026-09-01T00:00:00Z' }, 'open'],
  [{ registration_deadline: '2026-07-01T00:00:00Z' }, 'closed'],
  [
    {
      registration_deadline: '2026-09-01T00:00:00Z',
      session_datetime: '2026-07-15T00:00:00Z',
    },
    'live_or_done',
  ],
];
for (const [fm, want] of cases) {
  const got = sessionPhase(fm, t);
  if (got !== want) {
    console.error('FAIL', fm, got, want);
    process.exit(1);
  }
}
console.log('session ok');
