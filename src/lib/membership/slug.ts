/** Public profile URL segment */
export function memberSlug(m: {
  username: string | null;
  telegram_id: number;
}): string {
  const u = m.username?.trim().toLowerCase();
  if (u) return u;
  return `tg-${m.telegram_id}`;
}

export function memberPath(slug: string): string {
  return `/members/${encodeURIComponent(slug)}/`;
}

export function parseMemberSlug(
  slug: string
): { kind: 'username'; value: string } | { kind: 'telegram_id'; value: number } {
  const s = slug.trim().toLowerCase();
  if (s.startsWith('tg-')) {
    const n = Number(s.slice(3));
    if (!Number.isFinite(n) || n <= 0) {
      return { kind: 'username', value: s };
    }
    return { kind: 'telegram_id', value: n };
  }
  return { kind: 'username', value: s };
}
