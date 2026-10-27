---
name: site-react-island-pattern
description: Conventions for top-level React feature islands in src/components/*.tsx (Hero, Testimonials, Mission, Benefits, FAQ, Footer, WizardSection). Use when adding a new section component, creating a new island, building a marketing/landing block, or restyling a section with the ethos-* design classes and theme tokens. Even if the user just says "cria uma seção nova na home" or "add a block like Testimonials".
source: scan
---

<!-- mustard:generated -->

# Site React Island Pattern

> How top-level islands in `src/components/*.tsx` are written (distinct from the shadcn primitives in `src/components/ui/`).

## Convention

Scope: 22 top-level files in `src/components/` (excludes `ui/`).

| Aspect        | Convention (majority observed)                                                                                                        | Evidence                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Export        | `export default function Name()` — file name equals component name                                                                   | 20/22; exceptions `AuroraBackground.tsx`, `Sparkles.tsx` (named export, both unused) |
| Props         | none — sections are self-contained                                                                                                    | only 2/22 declare a Props type (the two exceptions above)                |
| Section root  | `<section className="ethos-section …">` then `<div className="ethos-container">`                                                     | `<section>` 13/22, `ethos-container` 13/22, `ethos-section` 11/22        |
| Header        | `ethos-eyebrow` label + `ethos-heading` h2 (+ `ethos-copy` paragraph)                                                                | eyebrow 12/22, heading 10/22, copy 6/22                                  |
| Colors        | theme tokens: `text-primary`, `text-foreground`, `text-muted-foreground`, `bg-secondary`, `bg-card`, `border-border`                 | `text-muted-foreground` 17/22, `border-border` 14/22; hex only in `OrbitingSkills.tsx` |
| Data          | shared content from `@/data/*`; section-local content as module-level `const` arrays, rendered with `.map()`                        | `@/data/*` 9/22; Testimonials, Mission, Benefits, Footer declare local arrays |
| Product visual| decorative `ethos-product-blob` divs (`aria-hidden`) + `ethos-product-card` holding a `LazyImage` of `projects[n]`                    | `ethos-product-card` 7/22                                                |
| Imports       | `@/` alias for internal modules; `@/components/ui/*` primitives                                                                      | alias 14/22; ui 11/22                                                    |
| className     | plain strings / template literals; `cn()` only in `Navbar.tsx`                                                                        | 1/22                                                                     |
| Test hooks    | interactive elements carry `data-testid`                                                                                              | 10/22                                                                    |
| Hydration     | no `'use client'`, no `import React`; hydration comes from `client:*` in the `.astro` page                                           | 0/22                                                                     |

`NavbarIsland.tsx` is a 5-line wrapper that renders `Navbar` and is only used by `src/pages/index.astro`.

## Real examples

- `src/components/Testimonials.tsx`
- `src/components/Mission.tsx`
- `src/components/Hero.tsx`
- `src/components/Benefits.tsx`
- `src/components/FAQ.tsx`
- `src/components/Footer.tsx`
- `src/components/NavbarIsland.tsx`

## References

See `references/examples.md`.
