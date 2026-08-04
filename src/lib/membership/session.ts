/** Session fields on /posts/ frontmatter (optional — CTA only when present). */

export type SessionFrontmatter = {
  session_datetime?: string;
  registration_deadline?: string;
  meet_link?: string;
};

export type SessionPhase =
  | 'hidden'
  | 'open'
  | 'closed'
  | 'live_or_done';

export function sessionPhase(
  fm: SessionFrontmatter,
  now = new Date()
): SessionPhase {
  const deadline = fm.registration_deadline
    ? Date.parse(fm.registration_deadline)
    : NaN;
  const sessionAt = fm.session_datetime
    ? Date.parse(fm.session_datetime)
    : NaN;

  if (!Number.isFinite(deadline) && !Number.isFinite(sessionAt)) {
    return 'hidden';
  }

  if (Number.isFinite(sessionAt) && now.getTime() >= sessionAt) {
    return 'live_or_done';
  }

  if (Number.isFinite(deadline)) {
    return now.getTime() < deadline ? 'open' : 'closed';
  }

  // session in future, no deadline → treat as open
  return 'open';
}

/** ponytail: smallest check — fails if phase logic breaks */
export function assertSessionPhaseOk() {
  const t = new Date('2026-08-01T12:00:00Z');
  const cases: Array<[SessionFrontmatter, SessionPhase]> = [
    [{}, 'hidden'],
    [
      { registration_deadline: '2026-09-01T00:00:00Z' },
      'open',
    ],
    [
      { registration_deadline: '2026-07-01T00:00:00Z' },
      'closed',
    ],
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
      throw new Error(`sessionPhase(${JSON.stringify(fm)}) → ${got}, want ${want}`);
    }
  }
  return true;
}
