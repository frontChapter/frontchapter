import { slug } from 'github-slugger';
import { marked } from 'marked';
import React from 'react';

export const slugify = (content: string): string | null => {
  if (!content) return null;

  return slug(content);
};

// markdownify
interface MarkdownifyProps {
  content: string;
  tag?: string;
  className?: string;
}

export const markdownify = ({ content, tag, className }: MarkdownifyProps) => {
  if (!content) return null;

  const html =
    tag === 'div' ? marked.parse(content) : marked.parseInline(content);
  const Tag = tag || 'span';
  // Use React.createElement for dynamic tag and props
  return React.createElement(Tag, {
    className,
    dangerouslySetInnerHTML: { __html: html },
  });
};

export const humanize = (content: string): string | null => {
  if (!content) return null;

  return content
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

// plainify
export const plainify = async (content: any) => {
  if (!content) return null;

  const mdParsed = await marked.parseInline(String(content));
  const filterBrackets = mdParsed.replace(/<\/?[^>]+(>|$)/gm, '');
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, '');
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string) => {
  const entityList: Record<string, string> = {
    '&nbsp;': ' ',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
  };
  const htmlWithoutEntities = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string) => {
      return entityList[entity] ?? entity;
    }
  );
  return htmlWithoutEntities;
};
