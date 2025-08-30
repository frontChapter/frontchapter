'use client';

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface YoutubeProps {
  id: string;
  title: string;
  [key: string]: any;
}

const Youtube = ({ id, title, ...rest }: YoutubeProps) => {
  return (
    <div className="overflow-hidden rounded-xl">
      <LiteYouTubeEmbed id={id} title={title} {...rest} />
    </div>
  );
};

export default Youtube;
