interface ConferenceFigureProps {
  src: string;
  webp?: string;
  alt: string;
  compact?: boolean;
}

const ConferenceFigure = ({
  src,
  webp,
  alt,
  compact = false,
}: ConferenceFigureProps) => (
  <figure className={compact ? 'm-0 h-full' : 'my-8 md:my-10'}>
    <picture
      className={`block overflow-hidden rounded-xl ${compact ? 'h-full min-h-[220px]' : ''}`}
    >
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        className={`w-full rounded-xl ${compact ? 'h-full min-h-[220px] object-cover' : ''}`}
        loading="lazy"
        decoding="async"
        width={1200}
        height={784}
      />
    </picture>
  </figure>
);

export default ConferenceFigure;
