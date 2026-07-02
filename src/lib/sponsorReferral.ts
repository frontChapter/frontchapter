export const withSponsorReferral = (url: string): string => {
  const parsed = new URL(url);
  parsed.searchParams.set('utm_source', 'frontchapter');
  parsed.searchParams.set('utm_medium', 'referral');
  parsed.searchParams.set('utm_campaign', 'sponsors');
  parsed.searchParams.set('ref', 'frontchapter');
  return parsed.toString();
};
