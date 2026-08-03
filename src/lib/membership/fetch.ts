import { createClient } from '@supabase/supabase-js';
import type { MemberStats } from './types';
import { memberSlug, parseMemberSlug } from './slug';

export type MemberActivity = {
  id: string;
  activity_type: string;
  points: number;
  created_at: string;
};

export type MemberTitle = {
  year_month: string;
  rank: number;
  score: number;
};

export type MemberProfile = MemberStats & {
  telegram_id: number;
  telegram_joined_at: string | null;
};

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase env for member fetch');
  }
  return createClient(url, key);
}

const PROFILE_SELECT =
  'id, telegram_id, username, display_name, photo_url, expertise, bio, linkedin_url, github_url, website_url, is_public, telegram_joined_at, profile_completed_at, created_at, points_total, level_key, badges';

/** Public completed profiles — build-time + client directory */
export async function listPublicMembers(): Promise<MemberProfile[]> {
  const { data, error } = await client()
    .from('member_stats')
    .select(PROFILE_SELECT)
    .eq('is_public', true)
    .not('profile_completed_at', 'is', null)
    .order('points_total', { ascending: false });

  if (error) throw error;
  return (data as MemberProfile[]) ?? [];
}

export async function getPublicMemberBySlug(
  slug: string
): Promise<MemberProfile | null> {
  const parsed = parseMemberSlug(slug);
  let q = client()
    .from('member_stats')
    .select(PROFILE_SELECT)
    .eq('is_public', true)
    .not('profile_completed_at', 'is', null);

  if (parsed.kind === 'telegram_id') {
    q = q.eq('telegram_id', parsed.value);
  } else {
    q = q.ilike('username', parsed.value);
  }

  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return (data as MemberProfile) ?? null;
}

export async function getMemberActivities(
  memberId: string,
  limit = 20
): Promise<MemberActivity[]> {
  const { data, error } = await client()
    .from('activity_log')
    .select('id, activity_type, points, created_at')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as MemberActivity[]) ?? [];
}

export async function getMemberTitles(
  memberId: string
): Promise<MemberTitle[]> {
  const { data, error } = await client()
    .from('monthly_active_titles')
    .select('year_month, rank, score')
    .eq('member_id', memberId)
    .order('year_month', { ascending: false })
    .limit(12);

  if (error) throw error;
  return (data as MemberTitle[]) ?? [];
}

export function staticParamsFromMembers(
  members: MemberProfile[]
): { slug: string }[] {
  return members.map((m) => ({ slug: memberSlug(m) }));
}
