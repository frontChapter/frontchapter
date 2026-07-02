interface ConferenceFigureProps {
  src: string;
  webp?: string;
  alt: string;
}

const ConferenceFigure = ({ src, webp, alt }: ConferenceFigureProps) => (
  <figure className="my-8 md:my-10">
    <picture className="block overflow-hidden rounded-xl">
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        className="w-full rounded-xl"
        loading="lazy"
        decoding="async"
        width={1200}
        height={784}
      />
    </picture>
  </figure>
);

export default ConferenceFigure;
