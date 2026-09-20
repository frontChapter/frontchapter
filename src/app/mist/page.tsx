import StaticRedirect, {
  buildRedirectMetadata,
} from '@/src/layouts/components/StaticRedirect';
import type { Metadata } from 'next';

const TARGET_PATH = '/events/dar-miyan-e-meh/';
const TARGET_TITLE = 'رویداد حضوری در میان مِه';

export const metadata: Metadata = buildRedirectMetadata(
  TARGET_PATH,
  TARGET_TITLE
);

export default function MistRedirectPage() {
  return <StaticRedirect targetPath={TARGET_PATH} targetTitle={TARGET_TITLE} />;
}
