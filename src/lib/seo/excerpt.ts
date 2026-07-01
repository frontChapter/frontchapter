import config from '@config/config.json';
import { plainifySync } from './plainify';

const { summary_length } = config.settings as { summary_length: number };

/** Build a plain-text excerpt from markdown/HTML content for meta descriptions. */
export const buildExcerpt = (
  content: string,
  maxLength = summary_length
): string => {
  const plain = plainifySync(content);
  if (!plain) return '';

  if (plain.length <= maxLength) return plain;

  const truncated = plain.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}…`;
};
