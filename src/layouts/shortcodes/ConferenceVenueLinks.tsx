import Button from './Button';

const venueLinks = {
  '1402': {
    instagram: 'https://instagram.com/arikehariyaei_org',
    mapQuery: 'مجموعه+اریکه+آریایی+آمل',
    instagramLabel: 'اینستاگرام مجموعه',
  },
  '1403': {
    instagram: null,
    mapQuery: 'سینما+فرهنگ+مرکز+اسناد+و+کتابخانه+ملی+شیراز',
    instagramLabel: null,
  },
};

interface ConferenceVenueLinksProps {
  variant?: '1402' | '1403';
}

const ConferenceVenueLinks = ({
  variant = '1402',
}: ConferenceVenueLinksProps) => {
  const links = venueLinks[variant] ?? venueLinks['1402'];

  return (
    <div className="not-prose mt-6 flex flex-wrap gap-3">
      {links.instagram && (
        <Button href={links.instagram} rel="follow">
          {links.instagramLabel}
        </Button>
      )}
      <Button
        href={`https://www.google.com/maps/search/?api=1&query=${links.mapQuery}`}
        rel="follow"
      >
        نمایش در نقشه
      </Button>
    </div>
  );
};

export default ConferenceVenueLinks;
