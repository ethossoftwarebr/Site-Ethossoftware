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

Requisitos: Node.js 24 e pnpm 10.33.0.

```bash
pnpm install --frozen-lockfile
pnpm dev        # http://localhost:4321
```

Copie `.env.example` para `.env` e preencha apenas as variáveis necessárias no ambiente local.

## Qualidade e build

```bash
pnpm check      # tipos TypeScript e componentes Astro
pnpm lint       # análise estática com Biome
pnpm test       # testes unitários com Vitest
pnpm build      # build de produção → .vercel/output/
pnpm validate   # executa todos os gates acima
pnpm preview    # preview local do build
```

O mesmo pipeline roda no GitHub Actions em pull requests e em pushes para `main`.

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

No WSL, se o Chrome não for detectado automaticamente, informe um executável Linux compatível:

```bash
LH_CHROME_PATH=/caminho/para/chrome pnpm perf:lh
```

## Histórico de specs

Ver `.claude/spec/completed/` para histórico das decisões de arquitetura (Specs 1-9).
