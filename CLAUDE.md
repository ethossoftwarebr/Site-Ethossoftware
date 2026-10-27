# Site Ethossoftware - Project Context

> Framework rules: See [.claude/CLAUDE.md](./.claude/CLAUDE.md)

## Stack

Astro 6.2.1 + React 19 Islands + Tailwind v4 + Radix UI + framer-motion + vite-imagetools + zod + `@astrojs/sitemap`.
Tooling: Biome (lint/format), Vitest, `astro check`.
Output: `output: 'static'` (SSG) + 1 on-demand route (`src/pages/api/chat.ts`, `prerender = false`) via `@astrojs/vercel@10.0.6`.

## Layout

| Path                    | Purpose                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| `src/pages/`            | Astro pages (.astro routes)                                          |
| `src/pages/api/`        | Serverless API route (`chat.ts` — Ethos.IA proxy)                    |
| `src/layouts/`          | Shared `Layout.astro` (SEO meta, OG, JSON-LD)                        |
| `src/components/`       | React islands (sections)                                             |
| `src/components/ui/`    | shadcn-style UI primitives                                           |
| `src/data/`             | Static content modules (faq, projects, services, wizard)             |
| `src/lib/`              | Shared TS modules (chat-content, chat-schema, wizard-message, utils) |
| `src/hooks/`            | React hooks                                                          |
| `src/styles/global.css` | Design tokens (`--ethos-*`) + `ethos-*` classes                      |
| `public/`               | Static assets                                                        |

## Deploy

Vercel via `@astrojs/vercel` adapter. Build → `.vercel/output/` (static + functions).

## Commands

```bash
pnpm dev          # local dev :4321
pnpm build        # production build → .vercel/output/
pnpm preview      # preview built site
pnpm check        # astro check (types)
pnpm lint         # biome lint
pnpm format       # biome format --write
pnpm test         # vitest run
pnpm validate     # check + lint + test + build (gate do CI)
pnpm perf:lh      # Lighthouse mobile
pnpm perf:compare:cross  # Compare LH vs baseline
pnpm perf:baseline       # Snapshot LH baselines
```

## Env Vars

- `ANTHROPIC_API_KEY` — required for `/api/chat` (Ethos.IA proxy). Sem var: chat retorna fallback WhatsApp message.

## Scan References

| File                           | Description                       |
| ------------------------------ | --------------------------------- |
| `.claude/commands/stack.md`    | Stack, estrutura, tooling         |
| `.claude/commands/patterns.md` | Padrões recorrentes com refs      |
| `.claude/commands/guards.md`   | Regras DO/DON'T                   |
| `.claude/commands/notes.md`    | Notas manuais (nunca sobrescrito) |

## Entity Registry

`.claude/entity-registry.json` (auto-generated; consultado por mustard pipelines).

## Ignore Paths

`node_modules/`, `dist/`, `.vercel/`, `.astro/`.
