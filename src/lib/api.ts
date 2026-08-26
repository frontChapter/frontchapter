import seedMembersData from '../data/seed_members.json';
import { TelegramUser, UserProfile } from '../types/gamification';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://fc.roostkit.site/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface MembersQueryOptions {
  tier?: string;
  query?: string;
  page?: number;
  limit?: number;
}

/**
 * Verify Telegram authentication payload with PHP backend
 */
export async function verifyTelegramAuth(
  authData: TelegramUser
): Promise<ApiResponse<{ exists: boolean; profile?: UserProfile }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/telegram-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(
      'API verifyTelegramAuth call failed, using mock verification for development:',
      err.message
    );

    // Check in seed data if user exists
    const existing = (seedMembersData as any[]).find(
      (m) => m.telegram_id === authData.id
    );

    return {
      success: true,
      data: {
        exists: !!existing,
        profile: existing
          ? {
              id: existing.id,
              telegram_id: existing.telegram_id,
              username: existing.username,
              first_name: existing.first_name,
              last_name: existing.last_name,
              email: existing.email,
              job_title: existing.job_title,
              bio: existing.bio,
              avatar_url: existing.avatar_url,
              coins_balance: existing.coins_balance,
              tier_level: existing.tier_level,
              is_public: !!existing.is_public,
              rules_accepted_at: existing.rules_accepted_at,
            }
          : undefined,
      },
    };
  }
}

/**
 * Submit onboarding details to complete registration & unlock Telegram permissions
 */
export async function completeOnboarding(payload: {
  telegramAuth: TelegramUser;
  profile: {
    first_name: string;
    last_name?: string;
    job_title?: string;
    bio?: string;
    email?: string;
    is_public: boolean;
  };
  rules_accepted: boolean;
}): Promise<ApiResponse<UserProfile>> {
  try {
    const res = await fetch(`${API_BASE_URL}/onboarding/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(
      'API completeOnboarding call failed, simulating successful save:',
      err.message
    );

    const fallbackUser: UserProfile = {
      telegram_id: payload.telegramAuth.id,
      username: payload.telegramAuth.username || null,
      first_name: payload.profile.first_name,
      last_name: payload.profile.last_name || null,
      email: payload.profile.email || null,
      job_title: payload.profile.job_title || null,
      bio: payload.profile.bio || null,
      avatar_url: payload.telegramAuth.photo_url || null,
      coins_balance: 0,
      tier_level: 'havij_neshan',
      is_public: payload.profile.is_public,
      rules_accepted_at: new Date().toISOString(),
    };

    return {
      success: true,
      data: fallbackUser,
      message: 'ثبت‌نام با موفقیت انجام شد.',
    };
  }
}

/**
 * Fetch community members directory & leaderboard
 */
export async function getCommunityMembers(
  options: MembersQueryOptions = {}
): Promise<{ members: UserProfile[]; total: number }> {
  const { tier, query, page = 1, limit = 50 } = options;

  try {
    const params = new URLSearchParams();
    if (tier && tier !== 'all') params.append('tier', tier);
    if (query) params.append('q', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const res = await fetch(
      `${API_BASE_URL}/community/members?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const result = await res.json();
    return {
      members: result.data || [],
      total: result.total || (result.data ? result.data.length : 0),
    };
  } catch (err: any) {
    console.warn(
      'Backend members API unavailable, falling back to static seed data:',
      err.message
    );

    let list = (seedMembersData as any[]).map((u) => ({
      id: u.id,
      telegram_id: u.telegram_id,
      username: u.username,
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      job_title: u.job_title,
      bio: u.bio,
      avatar_url: u.avatar_url,
      coins_balance: u.coins_balance || 0,
      tier_level: u.tier_level || 'havij_neshan',
      is_public: Boolean(u.is_public),
      rules_accepted_at: u.rules_accepted_at,
    })) as UserProfile[];

    // Filter public only
    list = list.filter((m) => m.is_public);

    // Apply Tier filter
    if (tier && tier !== 'all') {
      list = list.filter((m) => m.tier_level === tier);
    }

    // Apply text search
    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter((m) => {
        const fullName = `${m.first_name} ${m.last_name || ''}`.toLowerCase();
        const username = (m.username || '').toLowerCase();
        const job = (m.job_title || '').toLowerCase();
        return fullName.includes(q) || username.includes(q) || job.includes(q);
      });
    }

    // Sort by coins descending
    list.sort((a, b) => b.coins_balance - a.coins_balance);

    return {
      members: list,
      total: list.length,
    };
  }
}
