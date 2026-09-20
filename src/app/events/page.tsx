import StaticRedirect, {
  buildRedirectMetadata,
} from '@/src/layouts/components/StaticRedirect';
import type { Metadata } from 'next';

const TARGET_PATH = '/conferences/';
const TARGET_TITLE = 'رویدادهای حضوری فرانت‌چپتر';

export const metadata: Metadata = buildRedirectMetadata(
  TARGET_PATH,
  TARGET_TITLE
);

export default function EventsRedirectPage() {
  return <StaticRedirect targetPath={TARGET_PATH} targetTitle={TARGET_TITLE} />;
}
