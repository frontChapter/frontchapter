"use client";
/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ImageFallbackProps extends React.ComponentProps<typeof Image> {
  fallback: string;
}

const ImageFallback: React.FC<ImageFallbackProps> = (props) => {
  const { src, fallback, ...rest } = props;
  // Next.js StaticImport type
  type StaticImageData = {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  };
  type StaticRequire = { default: StaticImageData };
  type StaticImport = StaticRequire | StaticImageData;

  const getSrc = useCallback((src: string | StaticImport): string => {
    if (typeof src === "string") return src;
    if (typeof src === "object" && src !== null) {
      if ("default" in src && typeof src.default === "object" && "src" in src.default) {
        return src.default.src;
      }
      if ("src" in src && typeof src.src === "string") {
        return src.src;
      }
    }
    return "";
  }, []);
  const [imgSrc, setImgSrc] = useState<string>(getSrc(src));

  useEffect(() => {
    setImgSrc(getSrc(src));
  }, [src, getSrc]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallback);
      }}
    />
  );
};

export default ImageFallback;
