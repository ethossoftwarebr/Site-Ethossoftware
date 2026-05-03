import { forwardRef, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Preferred codec order for `<picture>` — browser picks the first supported format. */
const FORMAT_ORDER = ["avif", "webp", "jpg", "jpeg", "png"];

/**
 * Output shape from `vite-imagetools` query string `?...&as=picture`.
 * Plugin generates AVIF + WebP sources plus a fallback `img` (PNG/JPG).
 */
export interface PictureSource {
  sources: Record<string, string>;
  img: {
    src: string;
    w: number;
    h: number;
  };
}

type LazyImageSrc = string | PictureSource;

interface LazyImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "loading"> {
  src: LazyImageSrc;
  alt: string;
  /** Width in pixels — used to compute aspect-ratio (CLS=0). Required for `string` src. */
  width?: number;
  /** Height in pixels — used to compute aspect-ratio (CLS=0). Required for `string` src. */
  height?: number;
  /** Above-the-fold images. `true` => eager + high fetchpriority. */
  priority?: boolean;
  /** Standard `sizes` attribute for responsive selection from `srcset`. */
  sizes?: string;
  className?: string;
  imgClassName?: string;
}

function isPicture(src: LazyImageSrc): src is PictureSource {
  return typeof src !== "string" && "sources" in src && "img" in src;
}

/**
 * <LazyImage> — drop-in replacement for `<img>` that:
 * - Accepts both plain string `src` and `vite-imagetools` `?as=picture` output
 * - Renders `<picture>` with AVIF + WebP sources + fallback when given Picture object
 * - Sets `aspect-ratio` CSS to reserve layout space (eliminates CLS)
 * - `lazy` + `async` decoding by default; `priority` switches to eager + high
 */
export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  function LazyImage(
    {
      src,
      alt,
      width,
      height,
      priority = false,
      sizes,
      className,
      imgClassName,
      style,
      ...rest
    },
    ref,
  ) {
    const loading = priority ? "eager" : "lazy";
    const fetchPriority = priority ? "high" : "auto";

    if (isPicture(src)) {
      const w = src.img.w;
      const h = src.img.h;
      const aspectRatio = w && h ? `${w} / ${h}` : undefined;

      return (
        <picture
          className={cn(className)}
          style={{ aspectRatio, ...style }}
          data-testid="lazy-image"
        >
          {Object.entries(src.sources)
            .sort(([a], [b]) => FORMAT_ORDER.indexOf(a) - FORMAT_ORDER.indexOf(b))
            .map(([format, srcset]) => (
              <source
                key={format}
                type={`image/${format}`}
                srcSet={srcset}
                sizes={sizes}
              />
            ))}
          <img
            ref={ref}
            src={src.img.src}
            alt={alt}
            width={w}
            height={h}
            loading={loading}
            decoding="async"
            // @ts-expect-error - fetchpriority is valid HTML5 but not yet in React types
            fetchpriority={fetchPriority}
            className={cn("w-full h-full", imgClassName)}
            {...rest}
          />
        </picture>
      );
    }

    const aspectRatio = width && height ? `${width} / ${height}` : undefined;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        // @ts-expect-error - fetchpriority is valid HTML5 but not yet in React types
        fetchpriority={fetchPriority}
        className={cn(className, imgClassName)}
        style={{ aspectRatio, ...style }}
        data-testid="lazy-image"
        {...rest}
      />
    );
  },
);
