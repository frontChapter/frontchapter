import GSAPWrapper from '@/src/layouts/components/GSAPWrapper';
import AdminAttendance from '@/src/layouts/AdminAttendance';
import { buildPageMetadata } from '@lib/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'ورود حضور جلسه',
  meta_title: 'ورود حضور جلسه | ادمین فرانت‌چپتر',
  description: 'آپلود CSV حضور Google Meet برای امتیاز حضور.',
  canonical: '/admin/attendance/',
  noindex: true,
});

const Page = () => (
  <GSAPWrapper>
    <main id="main-content">
      <AdminAttendance />
    </main>
  </GSAPWrapper>
);

export default Page;
