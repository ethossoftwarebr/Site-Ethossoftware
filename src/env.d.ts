/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ANTHROPIC_API_KEY?: string;
  readonly ANTHROPIC_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Type declarations for `vite-imagetools` query-string imports.
 * Astro's `astro/client` types declare bare image imports as `ImageMetadata`,
 * but query-string variants (e.g. `?as=picture`, `?as=metadata`) need to map
 * to the actual `vite-imagetools` output shape.
 *
 * Pattern: any image import ending with `&as=picture` returns the
 * `<picture>`-friendly object consumed by `@/components/ui/lazy-image`'s
 * `PictureSource` interface.
 */
declare module "*&as=picture" {
  const picture: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  export default picture;
}

declare module "*?as=picture" {
  const picture: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  export default picture;
}
