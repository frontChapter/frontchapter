export interface Stat {
  value: string;
  label: string;
}

export interface GalleryImage {
  src: string;
  jpgSrc?: string;
  alt: string;
  label?: string;
}

export interface Speaker {
  name: string;
  talk?: string;
  talkSubtitle?: string;
  role: string;
  company?: string;
  companyLogo?: string;
  image: string;
  linkedin?: string;
}

export interface LinkItem {
  label: string;
  href: string;
}
