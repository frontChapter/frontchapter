import { buildPageMetadata, type PageSeoInput } from '@lib/seo/metadata';

/**
 * @deprecated Prefer `export const metadata` or `generateMetadata` in App Router pages.
 * Kept for legacy layout components that cannot export metadata directly.
 */
const SeoMeta = () => null;

export { buildPageMetadata };
export type { PageSeoInput };
export default SeoMeta;
