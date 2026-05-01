/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

// Ambient module declarations for vite-imagetools `?...&as=picture` queries.
// This file MUST remain a global script (no top-level `import`/`export`)
// so that `declare module "*..."` augments the global module scope.
declare module "*&as=picture" {
  const value: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  export default value;
}

declare module "*?as=picture" {
  const value: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  export default value;
}
