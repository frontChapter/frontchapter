'use client';

import { CarrotLoader } from '@layouts/components/carrot';
import { getSupabase } from '@lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** OAuth PKCE return URL — exchanges ?code= for a session, then /join/ */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const supabase = getSupabase();
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const oauthError = url.searchParams.get('error_description');

        if (oauthError) {
          throw new Error(oauthError);
        }

        if (code) {
          const { error: exchangeErr } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) throw exchangeErr;
        } else {
          // Hash fragment / already-detected session fallback
          const { data, error: sessionErr } = await supabase.auth.getSession();
          if (sessionErr) throw sessionErr;
          if (!data.session) {
            throw new Error('کد ورود یافت نشد');
          }
        }

        if (!cancelled) router.replace('/join/');
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'ورود ناموفق بود');
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main
      id="main-content"
      className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-20"
    >
      {error ? (
        <div className="max-w-md text-center">
          <p className="mb-4 text-red-600" role="alert">
            {error}
          </p>
          <a href="/join/" className="text-primary underline">
            بازگشت به صفحه عضویت
          </a>
        </div>
      ) : (
        <CarrotLoader variant="grow" label="در حال تکمیل ورود…" />
      )}
    </main>
  );
}
