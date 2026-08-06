export type Member = {
  id: string;
  telegram_id: number;
  username: string | null;
  display_name: string;
  photo_url: string | null;
  expertise: string | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  is_public: boolean;
  profile_completed_at: string | null;
  charter_accepted_at?: string | null;
  created_at: string;
};

export type MemberStats = Member & {
  points_total: number;
  level_key: LevelKey;
  badges: string[];
};

export type LevelKey = 'badge' | 'young' | 'whole' | 'senior' | 'golden';

export const LEVEL_LABELS: Record<LevelKey, string> = {
  badge: 'هویج‌نشان',
  young: 'هویج جوان',
  whole: 'هویج تمام',
  senior: 'هویج ارشد',
  golden: 'هویج طلایی',
};

export const BADGE_LABELS: Record<string, string> = {
  speaker: 'هویج سخنران',
  writer: 'هویج قلم‌به‌دست',
};

export function levelFromPoints(points: number): LevelKey {
  if (points >= 800) return 'golden';
  if (points >= 400) return 'senior';
  if (points >= 150) return 'whole';
  if (points >= 50) return 'young';
  return 'badge';
}
