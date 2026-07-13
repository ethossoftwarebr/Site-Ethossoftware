---
name: site-react-island-pattern
description: Conventions for top-level React feature islands in src/components/*.tsx (Hero, Testimonials, Footer, WizardSection). Use when adding a new section component, creating a new island, or building a marketing/landing block for the Ethos site.
source: scan
---

<!-- mustard:generated -->

# Site React Island Pattern

> How top-level section islands in `src/components/*.tsx` are written (distinct from the shadcn primitives in `src/components/ui/`).

## Convention

Scope: the 23 top-level components in `src/components/` (excludes `src/components/ui/`).

| Aspect       | Convention                                                                                                                                                                     | Evidence                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Export       | `export default function Name()` — one component per file, named same as file                                                                                                  | 21/23 files. The 2 exceptions (`AuroraBackground.tsx`, `Sparkles.tsx`) are reusable visual primitives exported as named `export function`.                  |
| Props        | No props — sections are self-contained and read their own data                                                                                                                 | Only 3/23 declare an `interface`/`type ...Props`; the section islands (Hero, Testimonials, Benefits, Footer, WizardSection) take zero args.                 |
| Data source  | Content arrays declared as module-level `const` above the component, then `.map()`ed in JSX                                                                                    | Seen in Hero (`floatingIcons`), Testimonials (`testimonials`), Benefits (`benefits`), Footer, WizardSection (imports from `@/data/wizard`).                 |
| Imports      | Path alias `@/` for internal modules                                                                                                                                           | 15/23 files use `@/...`; e.g. `@/components/ui/button`, `@/lib/wizard-message`, `@/data/wizard`.                                                            |
| Icons        | `lucide-react` named imports, rendered `<Icon className="w-N h-N ..." />`                                                                                                      | 17/23 files import from `lucide-react`.                                                                                                                     |
| className    | Plain Tailwind string literals; conditional classes via inline template literals (`` `... ${sel ? "a" : "b"}` ``)                                                              | 22/23 use `className=`. `cn()` from `@/lib/utils` is used in only 1/23 (`Navbar.tsx`) — do NOT reach for `cn()` by default; template literals are the norm. |
| Root element | Section islands render a single top-level `<section>` (Footer uses `<footer>`); decorative absolutely-positioned blur/grid divs first, then a `container mx-auto px-4` wrapper | Hero, Testimonials, Benefits, WizardSection, Footer.                                                                                                        |
| Brand colors | Hardcoded hex `#A229F2` / `#BA66F2` / `#531B8C` in Tailwind arbitrary values alongside theme tokens (`text-foreground`, `bg-card`, `text-muted-foreground`)                    | 18/23 files hardcode `#A229F2`.                                                                                                                             |
| Test hooks   | Interactive elements carry `data-testid="..."`                                                                                                                                 | 11/23 files (all the interactive ones: Footer links, WizardSection buttons/inputs).                                                                         |
| Hydration    | No `'use client'` directive and no default `React` import; islands are hydrated by `client:*` directives in the `.astro` page, not from inside the component                   | 0/23 have `'use client'`; 0/23 `import React`.                                                                                                              |

## Real examples

- `src/components/Hero.tsx`
- `src/components/Testimonials.tsx`
- `src/components/Footer.tsx`
- `src/components/WizardSection.tsx`
- `src/components/Benefits.tsx`
- `src/components/Navbar.tsx`

## References

See `references/examples.md`.
