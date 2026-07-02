import Button from './Button';

const ConferenceVenueLinks = () => (
  <div className="not-prose mt-6 flex flex-wrap gap-3">
    <Button href="https://instagram.com/arikehariyaei_org" rel="follow">
      اینستاگرام مجموعه
    </Button>
    <Button
      href="https://www.google.com/maps/search/?api=1&query=مجموعه+اریکه+آریایی+آمل"
      rel="follow"
    >
      نمایش در نقشه
    </Button>
  </div>
);

export default ConferenceVenueLinks;
