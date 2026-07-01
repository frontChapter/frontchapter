export function splitPostTitle(
  title: string,
  variant: 'full' | 'compact' = 'full'
): string[] {
  if (variant === 'compact') {
    if (title.includes(' - ')) {
      const [head, ...tail] = title.split(' - ');
      return [head, tail.join(' - ')];
    }

    const colonIndex = title.indexOf(':');
    if (colonIndex !== -1) {
      const session = title.slice(0, colonIndex + 1).trim();
      const topic = title.slice(colonIndex + 1).trim();
      return topic ? [session, topic] : [title];
    }

    return [title];
  }

  if (title.includes(' - ')) {
    const [head, ...tail] = title.split(' - ');
    const subtitle = tail.join(' - ');
    const colonIndex = head.indexOf(':');

    if (colonIndex !== -1) {
      const session = head.slice(0, colonIndex + 1).trim();
      const topic = head.slice(colonIndex + 1).trim();

      if (topic) {
        return [session, topic, subtitle];
      }
    }

    return [head, subtitle];
  }

  const colonIndex = title.indexOf(':');
  if (colonIndex !== -1) {
    const session = title.slice(0, colonIndex + 1).trim();
    const topic = title.slice(colonIndex + 1).trim();
    return topic ? [session, topic] : [title];
  }

  return [title];
}
