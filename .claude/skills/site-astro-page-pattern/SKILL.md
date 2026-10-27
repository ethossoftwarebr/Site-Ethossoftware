---
name: site-astro-page-pattern
description: Convention for authoring Astro route pages in src/pages/*.astro and the shared Layout.astro. Use when adding a new page, creating a new route, wiring a React island into a page, picking client:load vs client:visible vs client:idle, adding SEO meta, canonical, OG image or JSON-LD structured data. Even if the user just says "cria uma página nova", "add a route" or "coloca essa seção na home".
source: scan
---

<!-- mustard:generated -->

# Astro Page Pattern

> Every route wraps the shared Layout, sets SEO consts in frontmatter, and hydrates React islands via client:* directives only when they need interactivity.

## Convention

- Folder: `src/pages/` — 4 `.astro` routes (index, servicos, portfolio, 404) + `api/chat.ts` (serverless, see guards).
- Frontmatter order (4/4): `import Layout from '@/layouts/Layout.astro'` first → islands via `@/components/*` → `ogImageAsset` from `@/assets/brand/image_1772683408265.png` → `const title` + `const description`.
- `const canonical = 'https://ethossoftware.com.br/...'` in 3/4 pages; `404.astro` omits it.
- Body: one `<Layout title description ogImage={ogImageAsset.src} canonical>`; `index.astro` also passes `structuredData`.
- Content pages (servicos, portfolio) share the same shell: `Navbar client:load` → page component `client:visible` → `Footer client:idle` → `WhatsAppButton client:idle` → `EthosIA client:visible`.
- Homepage uses `NavbarIsland client:load` + `Hero client:load`, then 11 sections `client:visible` inside `<main>`.

### Layout props (`src/layouts/Layout.astro`)

| Prop             | Type                   | Behaviour                                                            |
| ---------------- | ---------------------- | -------------------------------------------------------------------- |
| `title`          | string?                | default `'Ethos Software'`                                           |
| `description`    | string?                | default `'Desenvolvimento de software sob medida'`                   |
| `ogImage`        | string?                | falls back to the brand asset; always resolved to an absolute URL    |
| `canonical`      | string?                | falls back to `new URL(Astro.url.pathname, Astro.site)`; always rendered |
| `structuredData` | object or object[]     | appended after the fixed `Organization` JSON-LD                      |

Layout renders `<html lang="pt-BR">` (no theme class), imports `@/styles/global.css`, always emits canonical + OG + Twitter meta, and exposes `<slot name="head" />` (404 injects `robots noindex, nofollow`).

### Hydration directives (counts across 4 pages)

| Directive        | Count | Used for                                                       |
| ---------------- | ----- | -------------------------------------------------------------- |
| `client:load`    | 4     | Navbar / NavbarIsland, Hero (first paint)                      |
| `client:visible` | 15    | below-the-fold sections, page content components, EthosIA chat |
| `client:idle`    | 6     | Footer, WhatsAppButton                                         |
| none             | 1     | `NotFoundContent` in 404 — static HTML, no JS shipped          |

## Real examples

- `src/pages/index.astro`
- `src/pages/servicos.astro`
- `src/pages/portfolio.astro`
- `src/pages/404.astro`
- `src/layouts/Layout.astro`

## References

See `references/examples.md`.
