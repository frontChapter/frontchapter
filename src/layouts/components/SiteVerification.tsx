import { getAnalyticsConfig } from '@lib/analytics/config';

const SiteVerification = () => {
  const { googleSiteVerification, bingSiteVerification, yandexVerification } =
    getAnalyticsConfig();

  return (
    <>
      {googleSiteVerification && (
        <meta
          name="google-site-verification"
          content={googleSiteVerification}
        />
      )}
      {bingSiteVerification && (
        <meta name="msvalidate.01" content={bingSiteVerification} />
      )}
      {yandexVerification && (
        <meta name="yandex-verification" content={yandexVerification} />
      )}
    </>
  );
};

export default SiteVerification;
