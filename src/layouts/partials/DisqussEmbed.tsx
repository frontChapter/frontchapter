'use client';
import config from '@config/config.json';
import { SITE_URL } from '@lib/seo/constants';
import { DiscussionEmbed } from 'disqus-react';

interface DisqussEmbedProps {
  slug: string;
  title: string;
}

const DisqussEmbed = ({ slug, title }: DisqussEmbedProps) => {
  const { disqus } = config;
  const url = `${SITE_URL}/posts/${slug}`;

  return (
    <DiscussionEmbed
      shortname={disqus.shortname}
      config={{
        ...disqus.settings,
        url,
        identifier: slug,
        title,
      }}
    />
  );
};

export default DisqussEmbed;
