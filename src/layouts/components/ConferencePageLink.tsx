'use client';

import Link from 'next/link';
import { conferencePath } from '@lib/conferences.paths';
import { IoArrowBack } from 'react-icons/io5';

interface ConferencePageLinkProps {
  slug: string;
  className?: string;
}

const ConferencePageLink = ({
  slug,
  className = '',
}: ConferencePageLinkProps) => (
  <Link
    href={conferencePath(slug)}
    className={`inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 ${className}`}
  >
    مشاهده صفحه همایش
    <IoArrowBack className="h-4 w-4 rotate-180" aria-hidden="true" />
  </Link>
);

export default ConferencePageLink;
