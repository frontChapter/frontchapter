/** Normalize social handle or partial URL to full https URL */
export function normalizeGithubUrl(
  input: string,
  fallbackUsername?: string
): string {
  const raw = input.trim();
  if (!raw && fallbackUsername) {
    return `https://github.com/${fallbackUsername.replace(/^@/, '')}`;
  }
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  const handle = raw.replace(/^@/, '').replace(/^github\.com\//i, '');
  return `https://github.com/${handle}`;
}

export function normalizeLinkedinUrl(input: string): string {
  const raw = input.trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  const handle = raw.replace(/^@/, '').replace(/^linkedin\.com\/in\//i, '');
  return `https://linkedin.com/in/${handle}`;
}

export function normalizeWebsiteUrl(input: string): string {
  const raw = input.trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export function urlOrNull(value: string): string | null {
  const v = value.trim();
  return v ? v : null;
}

/** Inline field errors — empty input = OK (optional fields) */
export function validateGithubInput(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/\s/.test(raw)) return 'فاصله نذار — @یوزرنیم یا لینک کامل';
  try {
    const u = new URL(normalizeGithubUrl(raw));
    if (!/^([a-z0-9-]+\.)*github\.com$/i.test(u.hostname)) {
      return 'لینک باید مال github.com باشه';
    }
    const path = u.pathname.replace(/\/+$/, '').slice(1);
    if (!path || path.includes('/')) {
      return 'یوزرنیم گیت‌هاب را درست وارد کن';
    }
  } catch {
    return 'فرمت گیت‌هاب نامعتبره (@user یا لینک)';
  }
  return null;
}

export function validateLinkedinInput(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/\s/.test(raw)) return 'فاصله نذار — @handle یا لینک کامل';
  try {
    const u = new URL(normalizeLinkedinUrl(raw));
    if (!/^([a-z0-9-]+\.)*linkedin\.com$/i.test(u.hostname)) {
      return 'لینک باید مال linkedin.com باشه';
    }
    if (!/^\/in\/[^/]+\/?$/i.test(u.pathname)) {
      return 'آدرس پروفایل لینکدین را چک کن (/in/…)';
    }
  } catch {
    return 'فرمت لینکدین نامعتبره (@handle یا لینک)';
  }
  return null;
}

export function validateWebsiteInput(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/\s/.test(raw)) return 'آدرس وب‌سایت نباید فاصله داشته باشه';
  try {
    const u = new URL(normalizeWebsiteUrl(raw));
    if (!u.hostname.includes('.')) {
      return 'دامنهٔ معتبر بنویس (مثلاً example.com)';
    }
  } catch {
    return 'آدرس وب‌سایت نامعتبره';
  }
  return null;
}
