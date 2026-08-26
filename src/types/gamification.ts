export type TierLevel =
  | 'havij_neshan'
  | 'havij_doost'
  | 'havij_joo'
  | 'havij_baz'
  | 'havij_khah'
  | 'havij_tala';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface UserProfile {
  id?: number;
  telegram_id: number;
  username?: string | null;
  first_name: string;
  last_name?: string | null;
  email?: string | null;
  job_title?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  coins_balance: number;
  tier_level: TierLevel;
  is_public: boolean;
  is_restricted?: boolean;
  rules_accepted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLogItem {
  id: number;
  user_id: number;
  admin_telegram_id?: number | null;
  action_type:
    | 'ONBOARDING_COMPLETED'
    | 'USEFUL_REPLY'
    | 'MEET_ATTENDANCE'
    | 'WORKSHOP_ATTENDANCE'
    | 'ANNUAL_CONF_ATTENDANCE'
    | string;
  coins_amount: number;
  meta_reference?: string | null;
  description?: string | null;
  created_at: string;
}

export interface TierInfo {
  key: TierLevel;
  level: number;
  title: string;
  minCoins: number;
  maxCoins: number | null; // null for highest tier (50+)
  tag: string;
  badgeEmoji: string;
  perks: string;
  description: string;
}

export const TIERS_CONFIG: Record<TierLevel, TierInfo> = {
  havij_neshan: {
    key: 'havij_neshan',
    level: 0,
    title: 'هویج‌نشان',
    minCoins: 0,
    maxCoins: 9,
    tag: '🥕 هویج‌نشان',
    badgeEmoji: '🥕',
    perks: 'دسترسی ارسال پیام در گروه و نمایش پروفایل عمومی',
    description: 'شروع سفر هویجی و عضو رسمی کامیونتی',
  },
  havij_doost: {
    key: 'havij_doost',
    level: 1,
    title: 'هویج‌دوست',
    minCoins: 10,
    maxCoins: 19,
    tag: '🥕 هویج‌دوست',
    badgeEmoji: '🥕',
    perks: 'نمایش ویژه در دایرکتوری اعضای فعال کامیونتی',
    description: 'مشارکت در دورهمی‌ها و پاسخ به سوالات دوستان',
  },
  havij_joo: {
    key: 'havij_joo',
    level: 2,
    title: 'هویج‌جو',
    minCoins: 20,
    maxCoins: 29,
    tag: '🥕 هویج‌جو',
    badgeEmoji: '🥕',
    perks: 'حق رأی در نظرسنجی‌ها و انتخاب موضوعات جلسات',
    description: 'حضور مستمر در رویدادها و تبادل دانش تخصصی',
  },
  havij_baz: {
    key: 'havij_baz',
    level: 3,
    title: 'هویج‌باز',
    minCoins: 30,
    maxCoins: 39,
    tag: '🥕 هویج‌باز',
    badgeEmoji: '🥕',
    perks: 'اولویت در بخش پرسش و پاسخ میت‌آپ‌های آنلاین',
    description: 'فعالیت درخشان و بازوی فنی کامیونتی',
  },
  havij_khah: {
    key: 'havij_khah',
    level: 4,
    title: 'هویج‌خواه',
    minCoins: 40,
    maxCoins: 49,
    tag: '🥕 هویج‌خواه',
    badgeEmoji: '🥕',
    perks: 'رزرو زودهنگام بلیت همایش‌های سالانه فرانت‌چپتر',
    description: 'از یاران قدیمی و همراهان پرانرژی جامعه',
  },
  havij_tala: {
    key: 'havij_tala',
    level: 5,
    title: 'هویج‌طلا',
    minCoins: 50,
    maxCoins: null,
    tag: '👑 هویج‌طلا',
    badgeEmoji: '👑',
    perks: 'نقش ویژه VIP و اولویت کاندیداتوری برای ارائه و سخنرانی',
    description: 'بالاترین سطح اعتبار و افتخار در فرانت‌چپتر',
  },
};

export const TIERS_ORDERED: TierInfo[] = [
  TIERS_CONFIG.havij_neshan,
  TIERS_CONFIG.havij_doost,
  TIERS_CONFIG.havij_joo,
  TIERS_CONFIG.havij_baz,
  TIERS_CONFIG.havij_khah,
  TIERS_CONFIG.havij_tala,
];

export function getTierFromCoins(coins: number): TierInfo {
  if (coins >= 50) return TIERS_CONFIG.havij_tala;
  if (coins >= 40) return TIERS_CONFIG.havij_khah;
  if (coins >= 30) return TIERS_CONFIG.havij_baz;
  if (coins >= 20) return TIERS_CONFIG.havij_joo;
  if (coins >= 10) return TIERS_CONFIG.havij_doost;
  return TIERS_CONFIG.havij_neshan;
}

export function getNextTierProgress(coins: number): {
  currentTier: TierInfo;
  nextTier: TierInfo | null;
  coinsNeeded: number;
  progressPct: number;
} {
  const currentTier = getTierFromCoins(coins);
  const nextTierIndex =
    TIERS_ORDERED.findIndex((t) => t.key === currentTier.key) + 1;

  if (nextTierIndex >= TIERS_ORDERED.length) {
    return {
      currentTier,
      nextTier: null,
      coinsNeeded: 0,
      progressPct: 100,
    };
  }

  const nextTier = TIERS_ORDERED[nextTierIndex];
  const tierMin = currentTier.minCoins;
  const tierTarget = nextTier.minCoins;
  const progressInTier = Math.max(0, coins - tierMin);
  const tierSpan = tierTarget - tierMin;
  const progressPct = Math.min(
    100,
    Math.round((progressInTier / tierSpan) * 100)
  );
  const coinsNeeded = Math.max(0, tierTarget - coins);

  return {
    currentTier,
    nextTier,
    coinsNeeded,
    progressPct,
  };
}
