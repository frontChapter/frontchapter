import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import type { Frontmatter } from '@lib/contentParser';
import { conferencePath } from '@lib/conferences.paths';
import type { GalleryImage, Speaker, Stat } from '../types/content';

export { conferencePath };

type YearKey = 'yearOne' | 'yearThree' | 'yearFour';

interface ConferenceRegistryEntry {
  slug: string;
  yearKey: YearKey;
}

const CONFERENCE_REGISTRY: ConferenceRegistryEntry[] = [
  { slug: '1400', yearKey: 'yearOne' },
  { slug: '1402', yearKey: 'yearThree' },
  { slug: '1403', yearKey: 'yearFour' },
];

export interface ConferenceMedia {
  video: string;
  video_label: string;
  video_poster?: string;
  gallery: Array<{ src: string; label: string }>;
}

export interface ConferenceProfile {
  slug: string;
  title: string;
  description: string;
  year: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  stats: Stat[];
  speakers?: {
    title: string;
    list: Speaker[];
  };
  images?: GalleryImage[];
  video?: {
    src: string;
    label: string;
    poster?: string;
  };
  galleryTitle?: string;
  media?: ConferenceMedia;
  extraContent: string;
}

const getHomepageFrontmatter = (): Frontmatter => {
  const pageData = fs.readFileSync('src/content/_index.md', 'utf-8');
  return matter(pageData).data;
};

const getConferenceExtraContent = (slug: string): string => {
  const filePath = path.join('src/content/conferences', `${slug}.md`);
  if (!fs.existsSync(filePath)) return '';
  return matter(fs.readFileSync(filePath, 'utf-8')).content.trim();
};

const buildConferenceProfile = (
  entry: ConferenceRegistryEntry,
  frontmatter: Frontmatter
): ConferenceProfile | null => {
  const year = frontmatter[entry.yearKey];
  const conference = year?.conference;

  if (!conference?.title || !conference.startDate) {
    return null;
  }

  return {
    slug: entry.slug,
    title: conference.title,
    description: conference.description ?? '',
    year: year.year,
    startDate: conference.startDate,
    endDate: conference.endDate,
    locationName: conference.locationName ?? 'ایران',
    stats: year.stats ?? [],
    speakers: year.speakers,
    images: year.images,
    video: year.video,
    galleryTitle: year.galleryTitle,
    media: conference.images,
    extraContent: getConferenceExtraContent(entry.slug),
  };
};

export const getAllConferences = (): ConferenceProfile[] => {
  const frontmatter = getHomepageFrontmatter();

  return CONFERENCE_REGISTRY.map((entry) =>
    buildConferenceProfile(entry, frontmatter)
  )
    .filter(
      (conference): conference is ConferenceProfile => conference !== null
    )
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
};

export const getConferenceBySlug = (
  slug: string
): ConferenceProfile | undefined => {
  const entry = CONFERENCE_REGISTRY.find((item) => item.slug === slug);
  if (!entry) return undefined;

  const frontmatter = getHomepageFrontmatter();
  return buildConferenceProfile(entry, frontmatter) ?? undefined;
};
