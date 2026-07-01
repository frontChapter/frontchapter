export const isExternalHref = (href: string) =>
  href.startsWith('http://') || href.startsWith('https://');

export const externalLinkProps = (href: string) => {
  if (!isExternalHref(href)) {
    return {};
  }

  return {
    target: '_blank' as const,
    rel: 'noopener noreferrer',
  };
};
