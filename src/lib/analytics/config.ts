import config from '@config/config.json';

interface AnalyticsConfig {
  google_tag_manager_id?: string;
  google_analytics_id?: string;
  google_site_verification?: string;
  bing_site_verification?: string;
  yandex_verification?: string;
}

const analytics = (config as { analytics?: AnalyticsConfig }).analytics ?? {};
const legacyGtmId = (config.params as { tag_manager_id?: string })
  .tag_manager_id;

export interface ResolvedAnalyticsConfig {
  gtmId: string;
  gaId: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  yandexVerification: string;
}

export const getAnalyticsConfig = (): ResolvedAnalyticsConfig => ({
  gtmId:
    process.env.NEXT_PUBLIC_GTM_ID ||
    analytics.google_tag_manager_id ||
    legacyGtmId ||
    '',
  gaId: process.env.NEXT_PUBLIC_GA_ID || analytics.google_analytics_id || '',
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    analytics.google_site_verification ||
    '',
  bingSiteVerification:
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ||
    analytics.bing_site_verification ||
    '',
  yandexVerification:
    process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ||
    analytics.yandex_verification ||
    '',
});

export const hasAnalytics = (cfg: ResolvedAnalyticsConfig) =>
  Boolean(cfg.gtmId || cfg.gaId);
