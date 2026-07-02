import { getAnalyticsConfig } from '@lib/analytics/config';

const gtmInitScript = (gtmId: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;

const ga4InitScript = (gaId: string) =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${gaId}');`;

export const GtmHead = () => {
  const { gtmId } = getAnalyticsConfig();
  if (!gtmId) return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: gtmInitScript(gtmId),
      }}
    />
  );
};

export const GtmBodyNoscript = () => {
  const { gtmId } = getAnalyticsConfig();
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
};

export const Ga4Head = () => {
  const { gaId } = getAnalyticsConfig();
  if (!gaId) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: ga4InitScript(gaId),
        }}
      />
    </>
  );
};
