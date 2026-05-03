# Site Ethossoftware - Project Context

> Framework rules: See [.claude/CLAUDE.md](./.claude/CLAUDE.md)

## Stack

Astro 6.2.1 + React 19 Islands + Tailwind v4 + Radix UI + Three.js (Aurora) + framer-motion + vite-imagetools.
Hybrid output: static pages + serverless API routes via `@astrojs/vercel@10.0.6`.

## Layout

| Path | Purpose |
|------|---------|
| `src/pages/` | Astro pages (.astro routes) |
| `src/pages/api/` | Serverless API routes (chat, sitecontent) |
| `src/components/` | React/Astro components |
| `src/lib/` | Shared TS modules (chat-content, etc) |
| `public/` | Static assets |

## Deploy

Vercel via `@astrojs/vercel` adapter. Build → `.vercel/output/` (static + functions).

## Commands

```bash
pnpm dev          # local dev :4321
pnpm build        # production build → .vercel/output/
pnpm preview      # preview built site
pnpm perf:lh      # Lighthouse mobile
pnpm perf:compare:cross  # Compare LH vs baseline
pnpm perf:baseline       # Snapshot LH baselines
```

## Env Vars

- `ANTHROPIC_API_KEY` — required for `/api/chat` (Ethos.IA proxy). Sem var: chat retorna fallback WhatsApp message.

## Entity Registry

`.claude/entity-registry.json` (auto-generated; consultado por mustard pipelines).

## Ignore Paths

`node_modules/`, `dist/`, `.vercel/`, `.astro/`, `attached_assets/`, `site-ethos-astro/` (cutover leftover).
