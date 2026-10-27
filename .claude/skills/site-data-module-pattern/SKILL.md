---
name: site-data-module-pattern
description: Convention for static content modules in src/data/*.ts (faq, projects, services, wizard). Use when adding or editing site content (FAQ entries, portfolio projects, services, wizard options), creating a new data module, adding a project screenshot via vite-imagetools, or moving hardcoded section content out of a component. Even if the user just says "adiciona um projeto no portfólio", "muda o texto do FAQ" or "add a new service".
source: scan
---

<!-- mustard:generated -->

# Site Data Module Pattern

> Site content lives in plain TypeScript modules under `src/data/` and is imported by islands, pages and lib functions through the `@/data/*` alias.

## Convention

- Folder: `src/data/`, suffix `.ts`, fileCount 4.
- Exports: only named `export const` (4/4); no default exports (0/4); no functions or React code.
- Shape: arrays of plain objects (4/4). `wizard.ts` exports several option arrays `{ label, value, desc? }` plus an `objectives` record.
- Typing: `export interface X` + `export const xs: X[]` where the shape is shared (2/4 — `projects.ts`, `services.ts`); `faq.ts` uses `as const`; `wizard.ts` relies on inference.
- Images: `projects.ts` imports screenshots with vite-imagetools query `?w=800;1600&quality=…&format=avif;webp;png&as=picture` and types them with `PictureSource` from `@/components/ui/lazy-image`.
- Icons: `services.ts` stores `lucide-react` components typed `LucideIcon`.
- Consumers: 9 islands (`@/data/*`), `src/lib/wizard-message.ts` (maps stored values to labels), `src/pages/index.astro` (FAQ JSON-LD from `faqItems`).
- Styling fields: `services.ts` still stores Tailwind arbitrary color classes in `image`/`color` (`bg-[#A026E9]`, `text-[#5C198D]`), used by `ServicesPage.tsx`.

## Real examples

- `src/data/faq.ts`
- `src/data/projects.ts`
- `src/data/services.ts`
- `src/data/wizard.ts`
- `src/lib/wizard-message.ts`

## References

See `references/examples.md`.
