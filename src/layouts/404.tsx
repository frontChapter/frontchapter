import { markdownify } from '@lib/utils/textConverter';

import type { RegularPageData } from '@lib/contentParser';

interface NotFoundProps {
  data: RegularPageData;
}

const NotFound = ({ data }: NotFoundProps) => {
  const { frontmatter, content } = data;

  return (
    <section className="section">
      <div className="container">
        <div className="flex h-[40vh] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4">{frontmatter.title ?? '404'}</h1>
            {markdownify({
              content: content,
              tag: 'div',
              className: 'content',
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
