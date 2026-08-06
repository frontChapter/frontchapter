'use client';

import { CarrotButton } from '@layouts/components/carrot';
import { getSupabase } from '@lib/supabase/client';
import { useEffect, useState } from 'react';

type Props = {
  memberId: string;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
};

function profileSparse(p: Omit<Props, 'memberId'>): boolean {
  return !(
    p.bio?.trim() ||
    p.github_url?.trim() ||
    p.linkedin_url?.trim() ||
    p.website_url?.trim()
  );
}

/** Owner-only nudge when gate done but optional bio/links still empty */
const MemberCompleteProfileBanner = ({
  memberId,
  bio,
  github_url,
  linkedin_url,
  website_url,
}: Props) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!profileSparse({ bio, github_url, linkedin_url, website_url })) {
      setShow(false);
      return;
    }

    let cancelled = false;
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setShow(data.session?.user.id === memberId);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (cancelled) return;
      setShow(
        Boolean(session?.user.id === memberId) &&
          profileSparse({ bio, github_url, linkedin_url, website_url })
      );
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [memberId, bio, github_url, linkedin_url, website_url]);

  if (!show) return null;

  return (
    <div
      className="mb-8 rounded-xl border border-border bg-theme-light px-4 py-4 sm:px-5"
      role="status"
    >
      <p className="mb-3 text-sm text-dark">
        پروفایلت هنوز معرفی و لینک نداره — اختیاریه، ولی به بقیه کمک می‌کنه
        راحت‌تر باهات ارتباط بگیرن.
      </p>
      <CarrotButton
        href="/join/?complete=1"
        variant="secondary"
        className="text-sm"
      >
        تکمیل پروفایل
      </CarrotButton>
    </div>
  );
};

export default MemberCompleteProfileBanner;
