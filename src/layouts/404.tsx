import { markdownify } from '@lib/utils/textConverter';
import type { RegularPageData } from '@lib/contentParser';
import { CarrotEmptyState } from './components/carrot';

interface NotFoundProps {
  data: RegularPageData;
}

const NotFound = ({ data }: NotFoundProps) => {
  const { frontmatter, content } = data;

  return (
    <section className="section">
      <div className="container">
        <div className="flex min-h-[50vh] items-center justify-center py-12">
          <CarrotEmptyState
            tone="error"
            title={frontmatter.title ?? 'هویج گم شد'}
            description="چیزی در باغ به‌هم ریخت یا این صفحه پیدا نشد. نگران نباش — از مسیرهای آشنا دوباره شروع کن."
          >
            {content ? (
              <div className="content mb-8 text-text">
                {markdownify({
                  content,
                  tag: 'div',
                  className: 'content',
                })}
              </div>
            ) : null}
          </CarrotEmptyState>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
