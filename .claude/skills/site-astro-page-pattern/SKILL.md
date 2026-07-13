---
name: site-astro-page-pattern
description: Convention for authoring Astro route pages in src/pages/*.astro. Use when adding a new page, creating a new route, or wiring a React island into a page. Covers Layout wrapping, title/description/ogImage/canonical props, and client:* hydration directives.
source: scan
---

<!-- mustard:generated -->

# Astro Page Pattern

> Every route wraps a shared Layout, sets SEO consts in frontmatter, and hydrates React via client:\* directives.

## Convention

Each `.astro` route follows one shape (confirmed in all 4 pages read):

Frontmatter (between the `---` fences):

1. `import Layout from '@/layouts/Layout.astro';` — always first.
2. Import the React island component(s) via the `@/components/*` alias.
3. `import ogImageAsset from '@/assets/brand/image_1772683408265.png';` — same brand OG asset in all 4 pages.
4. Declare `const title` (string) and `const description` (multi-line string). Present in 4/4 pages.
5. Declare `const canonical = 'https://ethossoftware.com.br/...'` — present in 3/4 pages (index, servicos, portfolio). 404.astro OMITS canonical intentionally.

Body: a single `<Layout>` element receiving props `title`, `description`, `ogImage={ogImageAsset.src}`, and (when present) `canonical`. Children render inside the Layout's default `<slot />`.

### Layout props (src/layouts/Layout.astro)

| Prop          | Type    | Default                                                       |
| ------------- | ------- | ------------------------------------------------------------- |
| `title`       | string? | `'Ethos Software'`                                            |
| `description` | string? | `'Desenvolvimento de software sob medida'`                    |
| `ogImage`     | string? | none (OG/Twitter tags render only when set)                   |
| `canonical`   | string? | none (`<link rel=canonical>` + `og:url` render only when set) |

Layout renders `<html lang="pt-BR" class="dark">`, imports `@/styles/global.css`, emits OG + Twitter meta only when `ogImage` is truthy, and exposes a named `<slot name="head" />` for per-page head injection. 404.astro uses that slot to inject `<meta name="robots" content="noindex, nofollow" slot="head" />`.

### Island hydration (client:\* directives)

| Directive        | When to use (observed)                                                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `client:load`    | Above-the-fold / primary component. The single page-content component on content pages (ServicesPage, PortfolioPage, NotFoundContent) and Navbar/Hero on the homepage. |
| `client:visible` | Below-the-fold sections — hydrate on scroll into view. Dominant directive on index.astro (10 uses).                                                                    |
| `client:idle`    | Deferred non-critical widgets (Footer, WhatsAppButton on index.astro).                                                                                                 |

Majority rule: a single-component content page uses `client:load` on its one island. The composed homepage uses `client:load` for the first paint, `client:visible` for the long scroll of sections, and `client:idle` for trailing widgets. Never render a React component without a `client:*` directive if it needs interactivity.

## Real examples

- `src/pages/index.astro`
- `src/pages/servicos.astro`
- `src/pages/portfolio.astro`
- `src/pages/404.astro`
- `src/layouts/Layout.astro`

## References

See `references/examples.md`.
