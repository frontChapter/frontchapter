import { marked } from 'marked';

const htmlEntityDecoder = (htmlWithEntities: string) => {
  const entityList: Record<string, string> = {
    '&nbsp;': ' ',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
  };

  return htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string) => entityList[entity] ?? entity
  );
};

/** Strip markdown/HTML for use in meta tags and JSON-LD (server-safe). */
export const plainifySync = (content: string | null | undefined): string => {
  if (!content) return '';

  const mdParsed = marked.parseInline(String(content), { async: false });
  const filterBrackets = mdParsed.replace(/<\/?[^>]+(>|$)/gm, '');
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, '');

  return htmlEntityDecoder(filterSpaces).trim();
};
