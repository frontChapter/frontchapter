import Link from 'next/link';
import React from 'react';
import { getSpeakerSlugByName, speakerPath } from '@lib/speakers';

interface AuthorLinkProps {
  name: string;
  className?: string;
  linked?: boolean;
}

const AuthorLink: React.FC<AuthorLinkProps> = ({
  name,
  className = '',
  linked = true,
}) => {
  const slug = getSpeakerSlugByName(name);

  if (!linked || !slug) {
    return <span className={className}>{name}</span>;
  }

  return (
    <Link
      href={speakerPath(slug)}
      className={`transition-colors hover:text-primary ${className}`}
    >
      {name}
    </Link>
  );
};

interface AuthorNamesProps {
  name: string;
  className?: string;
}

export const AuthorNames: React.FC<AuthorNamesProps> = ({
  name,
  className = '',
}) => {
  if (!name || name === 'فرانت چپتر') {
    return <span className={className}>{name}</span>;
  }

  if (!name.includes(' و ')) {
    return <AuthorLink name={name} className={className} />;
  }

  const parts = name.split(' و ');
  return (
    <span className={className}>
      {parts.map((part, index) => (
        <React.Fragment key={part}>
          {index > 0 && ' و '}
          <AuthorLink
            name={part.trim()}
            linked={Boolean(getSpeakerSlugByName(part.trim()))}
          />
        </React.Fragment>
      ))}
    </span>
  );
};

export default AuthorLink;
