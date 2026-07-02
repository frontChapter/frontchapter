import { withSponsorReferral } from '@lib/sponsorReferral';
import Image from 'next/image';

const sponsors1402 = [
  {
    name: 'لیارا',
    logo: '/images/1402/sponsors/liara.svg',
    url: 'https://liara.ir',
    width: 120,
  },
  {
    name: 'راکت',
    logo: '/images/1402/sponsors/roocket-event.svg',
    url: 'https://roocket.ir',
    width: 160,
  },
  {
    name: 'پچیم',
    logo: '/images/1402/sponsors/pachim.svg',
    url: 'https://pachim.sh',
    width: 120,
  },
];

const ConferenceSponsors = () => (
  <div className="conference-sponsors not-prose mt-6">
    <ul className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
      {sponsors1402.map((sponsor) => (
        <li key={sponsor.name}>
          <a
            href={withSponsorReferral(sponsor.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="block opacity-80 transition-opacity hover:opacity-100"
            aria-label={`وب‌سایت ${sponsor.name}`}
          >
            <Image
              src={sponsor.logo}
              alt={`لوگوی ${sponsor.name}`}
              width={sponsor.width}
              height={48}
              className="h-10 w-auto object-contain md:h-12"
            />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default ConferenceSponsors;
