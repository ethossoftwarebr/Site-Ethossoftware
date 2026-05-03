# Ethos Software — Site institucional

Site institucional da [Ethos Software](https://ethossoftware.com.br), construído com Astro 6 + React Islands e deployado no Vercel.

## Tech Stack

| Tecnologia | Versão |
|---|---|
| Astro | 6.2.1 |
| React | 19.2.5 |
| Tailwind CSS | v4 |
| Radix UI | primitives |
| Three.js | 0.184 |
| framer-motion | latest |
| @astrojs/vercel adapter | 10.0.6 |

## Setup

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

## Build

```bash
pnpm build      # output → .vercel/output/
pnpm preview    # preview built site locally
```

## Deploy

Vercel via `@astrojs/vercel` adapter (hybrid: static pages + serverless functions).

**Env var obrigatória:**
- `ANTHROPIC_API_KEY` — necessária para `/api/chat` (Ethos.IA proxy). Sem a var, o chat retorna fallback com link WhatsApp.

## Performance

```bash
pnpm perf:lh             # Lighthouse mobile (rotas: home, servicos, portfolio, 404)
pnpm perf:compare:cross  # Comparar vs baselines commitados
pnpm perf:baseline       # Snapshot baselines → lighthouse-baselines/
```

## Histórico de specs

Ver `.claude/spec/completed/` para histórico das decisões de arquitetura (Specs 1-9).
