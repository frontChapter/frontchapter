'use client';

import { useEffect, useState } from 'react';
import type { RegularPageData } from '@lib/contentParser';
import { CarrotButton, CarrotEmptyState } from './components/carrot';

interface NotFoundProps {
  data: RegularPageData;
}

const LEGACY_POST_REGEX = /\/(posts\/)?post-\d+/i;

const NotFound = ({ data }: NotFoundProps) => {
  const { frontmatter } = data;
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (LEGACY_POST_REGEX.test(pathname)) {
        setRedirecting(true);
        window.location.replace('/posts/');
      }
    }
  }, []);

  return (
    <>
      {/* Instant client-side redirect for legacy demo posts before hydration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if (/\\/(posts\\/)?post-\\d+/i.test(window.location.pathname)) {
                window.location.replace('/posts/');
              }
            } catch (e) {}
          `,
        }}
      />

      <section className="section">
        <div className="container">
          <div className="flex min-h-[50vh] items-center justify-center py-12">
            {redirecting ? (
              <CarrotEmptyState
                tone="empty"
                title="در حال انتقال به آرشیو مطالب"
                description="این صفحه آزمایشی قدیمی حذف شده است. در حال انتقال شما به صفحه مقالات و جلسات فرانت‌چپتر هستیم..."
                action={
                  <CarrotButton href="/posts/" variant="primary">
                    مشاهده مطالب فرانت‌چپتر
                  </CarrotButton>
                }
              />
            ) : (
              <CarrotEmptyState
                tone="error"
                title={frontmatter.title ?? 'خطای ۴۰۴'}
                description="چیزی در باغ به‌هم ریخت یا این صفحه پیدا نشد. نگران نباش — از مسیرهای زیر می‌تونی ادامه بدی:"
                action={
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <CarrotButton href="/" variant="primary">
                      بازگشت به خانه
                    </CarrotButton>
                    <CarrotButton href="/posts/" variant="secondary">
                      آرشیو دورهمی‌ها و مقالات
                    </CarrotButton>
                    <CarrotButton href="/conferences/" variant="ghost">
                      همایش‌ها
                    </CarrotButton>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
