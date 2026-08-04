'use client';

import Banner from '@layouts/components/Banner';
import { CarrotButton, CarrotLoader } from '@layouts/components/carrot';
import { getSupabase } from '@lib/supabase/client';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';

type Gate = 'loading' | 'denied' | 'ok';

type ImportResult = {
  ok?: boolean;
  csv_emails?: number;
  matched?: number;
  newly_awarded?: number;
  unmatched_count?: number;
  unmatched?: string[];
  error?: string;
};

export default function AdminAttendance() {
  const [gate, setGate] = useState<Gate>('loading');
  const [postSlug, setPostSlug] = useState('');
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const checkAdmin = useCallback(async () => {
    try {
      const supabase = getSupabase();
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        setGate('denied');
        return;
      }
      const { data: m } = await supabase
        .from('members')
        .select('is_admin')
        .eq('id', sess.session.user.id)
        .maybeSingle();
      setGate(m?.is_admin ? 'ok' : 'denied');
    } catch {
      setGate('denied');
    }
  }, []);

  useEffect(() => {
    void checkAdmin();
  }, [checkAdmin]);

  const onFile = async (file: File | null) => {
    if (!file) return;
    setCsv(await file.text());
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setResult(null);
    try {
      const supabase = getSupabase();
      const { data, error: fnErr } = await supabase.functions.invoke(
        'event-attendance',
        { body: { post_slug: postSlug.trim(), csv } }
      );
      if (fnErr) throw fnErr;
      const payload = data as ImportResult;
      if (payload?.error) throw new Error(payload.error);
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'آپلود ناموفق');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section pt-0">
      <Banner title="ورود حضور جلسه" />
      <div className="container">
        <div className="mx-auto max-w-xl">
          {gate === 'loading' ? (
            <div className="flex justify-center py-16">
              <CarrotLoader variant="grow" label="…" />
            </div>
          ) : null}

          {gate === 'denied' ? (
            <div className="rounded-2xl border border-border bg-surface-solid p-6 text-sm text-muted">
              فقط ادمین. اول{' '}
              <Link href="/join/" className="text-primary underline">
                وارد شو
              </Link>
              .
            </div>
          ) : null}

          {gate === 'ok' ? (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border bg-surface-solid p-6 sm:p-8"
            >
              <p className="mb-6 text-sm text-muted">
                CSV خروجی اکستنشن Meet (ستون Email). با{' '}
                <code className="text-xs">member_emails</code> مچ می‌شه؛
                تطبیق‌خورده‌ها +۱۵ امتیاز حضور.
              </p>

              {error ? (
                <p className="mb-4 text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="mb-5">
                <label
                  className="mb-2 block text-sm font-medium text-dark"
                  htmlFor="att-slug"
                >
                  post slug جلسه
                </label>
                <input
                  id="att-slug"
                  required
                  value={postSlug}
                  onChange={(e) => setPostSlug(e.target.value)}
                  className="form-input w-full"
                  placeholder="session-69-…"
                  dir="ltr"
                />
              </div>

              <div className="mb-5">
                <label
                  className="mb-2 block text-sm font-medium text-dark"
                  htmlFor="att-file"
                >
                  فایل CSV
                </label>
                <input
                  id="att-file"
                  type="file"
                  accept=".csv,text/csv"
                  className="form-input w-full"
                  onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {csv ? (
                <p className="mb-4 text-xs text-muted" dir="ltr">
                  {csv.split(/\r?\n/).filter(Boolean).length} lines loaded
                </p>
              ) : null}

              <CarrotButton
                type="submit"
                variant="primary"
                loading={saving}
                disabled={!csv || !postSlug.trim()}
              >
                وارد کردن حضور
              </CarrotButton>

              {result ? (
                <div className="mt-6 rounded-xl border border-border bg-theme-light p-4 text-sm text-dark">
                  <p className="mb-1">ایمیل در CSV: {result.csv_emails ?? 0}</p>
                  <p className="mb-1">مچ‌شده: {result.matched ?? 0}</p>
                  <p className="mb-1">
                    امتیاز جدید: {result.newly_awarded ?? 0}
                  </p>
                  <p className="mb-0">
                    بدون مچ: {result.unmatched_count ?? 0}
                  </p>
                </div>
              ) : null}
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
}
