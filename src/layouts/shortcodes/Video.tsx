import React from 'react';

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  title: string;
  width?: number;
  height?: string;
  src: string;
}

function Video({
  title,
  width = 500,
  height = 'auto',
  src,
  ...rest
}: VideoProps) {
  return (
    <video
      className="overflow-hidden rounded-xl"
      width={width}
      height={height}
      controls={false}
      autoPlay
      muted
      {...rest}
    >
      <source
        src={src.match(/^http/) ? src : `/videos/${src}`}
        type="video/mp4"
      />
      {title}
    </video>
  );
}

export default Video;
