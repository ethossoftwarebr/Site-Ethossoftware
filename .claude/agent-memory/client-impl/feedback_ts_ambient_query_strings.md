---
name: TS ambient module declarations for query-string imports must be in a script (not module) file
description: When declaring ambient modules with wildcards like `*?as=picture`, the .d.ts file MUST be a script file (no top-level import/export) — adding `import type` at the top breaks the wildcard match
type: feedback
---

When using `vite-imagetools` (or any plugin with query-string imports like `?as=picture`), TypeScript needs ambient module declarations:

```ts
declare module "*&as=picture" {
  const value: { sources: Record<string, string>; img: { src: string; w: number; h: number } };
  export default value;
}
```

**Why:** Adding `import type { PictureSource } from "..."` at the top of `vite-env.d.ts` makes the file a *module* (ES module), and `declare module` inside a module file is interpreted as module augmentation, NOT global ambient declaration. The wildcard pattern `*&as=picture` then fails to match imports like `@/assets/foo.png?w=800&format=avif&as=picture`.

**How to apply:** Keep `vite-env.d.ts` as a *script* file (no `import`/`export` at top level). Inline the type literal inside `declare module` instead of importing a named type. Use triple-slash references (`/// <reference types="..." />`) for type imports — those don't make the file a module.

This bit us mid-Bloco-B of the perf-seo-baseline spec; tsc returned 7 `Cannot find module` errors until the import was inlined.
