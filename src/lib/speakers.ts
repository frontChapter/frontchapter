import speakersData from '../data/speakers.json';
import type { SinglePageData } from '@lib/contentParser';

export interface SpeakerProfile {
  slug: string;
  name: string;
  avatar: string;
  linkedin?: string;
  aliases: string[];
  sessions: number[];
}

const speakers = speakersData as Record<string, SpeakerProfile>;

const COMMUNITY_AUTHOR = 'فرانت چپتر';

function canonicalAuthorName(name: string): string {
  for (const speaker of Object.values(speakers)) {
    if (speaker.name === name || speaker.aliases.includes(name)) {
      return speaker.name;
    }
  }
  return name;
}

export function getAllSpeakers(): SpeakerProfile[] {
  return Object.values(speakers).sort((a, b) =>
    a.name.localeCompare(b.name, 'fa')
  );
}

export function getSpeakerBySlug(slug: string): SpeakerProfile | undefined {
  return speakers[slug];
}

export function getSpeakerSlugByName(name: string): string | null {
  if (!name || name === COMMUNITY_AUTHOR) return null;

  const parts = name.includes(' و ')
    ? name.split(' و ').map((n) => n.trim())
    : [name];

  for (const part of parts) {
    for (const speaker of Object.values(speakers)) {
      if (speaker.name === part || speaker.aliases.includes(part)) {
        return speaker.slug;
      }
    }
  }

  return null;
}

export function authorMatchesSpeaker(
  authorName: string,
  speaker: SpeakerProfile
): boolean {
  const canonical = canonicalAuthorName(authorName);
  if (canonical === speaker.name) return true;

  if (authorName.includes(' و ')) {
    return authorName
      .split(' و ')
      .map((n) => n.trim())
      .some((part) => part === speaker.name || speaker.aliases.includes(part));
  }

  return authorName === speaker.name || speaker.aliases.includes(authorName);
}

export function getPostsForSpeaker(
  speaker: SpeakerProfile,
  posts: SinglePageData[]
): SinglePageData[] {
  return posts.filter((post) => {
    const author =
      typeof post.frontmatter.author === 'object'
        ? post.frontmatter.author?.name
        : undefined;
    if (!author || author === COMMUNITY_AUTHOR) return false;
    return authorMatchesSpeaker(author, speaker);
  });
}

export function speakerPath(slug: string) {
  return `/speakers/${slug}/`;
}

export function parseAuthorNames(name: string): string[] {
  if (!name || name === COMMUNITY_AUTHOR) return [];
  if (name.includes(' و ')) {
    return name.split(' و ').map((n) => n.trim());
  }
  return [name];
}
