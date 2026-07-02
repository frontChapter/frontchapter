import shortcodes from '@layouts/shortcodes/all';
import 'highlight.js/styles/default.css';
import type { ComponentType } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface MDXContentProps {
  content: string;
  components?: Record<string, ComponentType<unknown>>;
}

const MDXContent = ({ content, components }: MDXContentProps) => {
  const mdxOptions = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  };

  return (
    <>
      {/* @ts-ignore */}
      <MDXRemote
        source={content}
        components={{ ...shortcodes, ...components }}
        options={{ mdxOptions }}
      />
    </>
  );
};

export default MDXContent;
