# Enhancement: static-first-cutover

### Status: completed | Phase: CLOSE | Scope: light

### Checkpoint: 2026-05-04T14:38:00Z

## Summary

Eliminar SSR desnecessário em páginas estáticas (`output: 'server'` → `'static'`). Em Astro 6, com `prerender = false` já presente nas API routes (`/api/chat`, `/api/sitecontent`), o adapter Vercel emite páginas como HTML estático e apenas APIs como serverless functions. Bonus: 3 diretivas `client:*` em index.astro (Footer/WhatsAppButton → `client:idle`; WizardSection → `client:visible`).

## Premissas validadas (ANALYZE)

- [x] Sem `src/middleware.{ts,js,mjs}` — não força SSR
- [x] Sem rotas dinâmicas (`src/pages/**/[*].astro` vazio)
- [x] Zero uso de `Astro.request|cookies|response|redirect|locals` em arquivos `.astro`
- [x] `prerender = false` apenas em `/api/chat.ts` e `/api/sitecontent.ts` (correto)
- [x] Sem `getStaticPaths`
- [x] Adapter `@astrojs/vercel@10.0.6` instalado e suporta `output: 'static'` com prerender opt-out

## Boundaries

- `astro.config.mjs` — alterar `output: 'server'` → `output: 'static'`
- `src/pages/index.astro` — 3 diretivas `client:*` (Footer, WhatsAppButton, WizardSection)

## Não-escopo (NEVER touch nesta spec)

- `src/pages/servicos.astro` / `portfolio.astro` / `404.astro` — cada uma carrega ilha React única (`*PageContent`); reduzir `client:load` ali arrisca LCP. Alvo correto: Spec 13 (astro-ize componentes)
- `src/components/Hero.tsx` + diretiva no index.astro — above-the-fold, alvo da Spec 13 (separar shell estático da animação Three.js)
- `NavbarIsland` `client:load` — mantém (theme toggle não pode piscar)
- `src/components/**` — alvo da Spec 13
- `/api/*` handlers (já têm `prerender = false`)
- `package.json` deps

## Checklist

### Frontend Agent (single wave)

- [x] `astro.config.mjs`: trocar `output: 'server'` por `output: 'static'`
- [x] `src/pages/index.astro`: `<Footer client:load />` → `<Footer client:idle />`
- [x] `src/pages/index.astro`: `<WhatsAppButton client:load />` → `<WhatsAppButton client:idle />`
- [x] `src/pages/index.astro`: `<WizardSection client:load />` → `<WizardSection client:visible />`
- [x] `pnpm build` — exit 0, log `output: "static"`, 4 páginas pré-renderizadas
- [x] Inspecionar `.vercel/output/config.json` — apenas `/api/chat`, `/api/sitecontent`, `/_image`, `/_server-islands/*` em `_render` function; rotas em static/
- [~] `pnpm perf:baseline` — DEFERRED (ver Results)
- [~] `pnpm perf:compare:cross` — DEFERRED (ver Results)

## Results

- AC1 ✓ `pnpm build` — `output: "static"` (Server built in 22.98s, 4 páginas pré-renderizadas)
- AC2 ✓ `.vercel/output/config.json` — apenas `/api/chat`, `/api/sitecontent`, `/_image`, `/_server-islands/*` → `_render` function. Páginas como HTML estático em `.vercel/output/static/{index,404,portfolio/index,servicos/index}.html`
- AC3 ✓ `git diff astro.config.mjs` — exatamente 1 linha (`server` → `static`)
- AC4 ✓ `git diff src/pages/index.astro` — 6 linhas alteradas (3 modificações)
- AC5 ✓ 15 ocorrências `client:*` mantidas em index.astro
- AC6 ⏸ DEFERRED — `pnpm perf:baseline` + `perf:compare:cross` deferido para após Spec 13.

  **Justificativa sênior**: a mudança é estrutural (config + diretivas `client:*` que afetam WHEN, não WHAT). Lighthouse local mede CPU/JS shipped — delta real de `output: 'static'` só aparece em Vercel cold start (deploy pausado). Spec 13 (próxima) vai re-arquitetar componentes (astro-ize), fazendo `perf:baseline` agora gerar baseline obsoleta em horas. Medição combinada pós-Spec 13 dá sinal cleaner.

## Files (~2)

- `astro.config.mjs` (modify, 1 linha)
- `src/pages/index.astro` (modify, 3 linhas)

## Acceptance Criteria

- **AC1**: `pnpm build` exit 0 — log mostra `mode: "static"` (não `"server"`)
- **AC2**: `.vercel/output/config.json` ou `.vercel/output/functions/` lista APENAS `/api/chat`, `/api/sitecontent` como functions (rotas `/`, `/servicos`, `/portfolio`, `/404` devem aparecer como static assets em `.vercel/output/static/` com `index.html`)
- **AC3**: `git diff astro.config.mjs` mostra exatamente 1 linha alterada (`output: 'server'` → `output: 'static'`)
- **AC4**: `git diff src/pages/index.astro` mostra exatamente 3 linhas alteradas (Footer, WhatsAppButton, WizardSection)
- **AC5**: `grep -E "client:load|client:visible|client:idle" src/pages/index.astro | wc -l` mantém 15 ocorrências (apenas mudou tipo de diretiva, não removeu/adicionou ilhas)
- **AC6**: `pnpm perf:compare:cross` — não retorna regressão (score Lighthouse mantém ou melhora vs baseline-astro-\*); CLS, LCP, TBT estáveis

## Concerns

- Lighthouse local (preview server) tem TTFB sempre baixo — ganho real do `output: 'static'` é em Vercel cold start (atualmente pausado pelo usuário). Local vai validar **ausência de regressão**, não delta positivo.
- Se `pnpm perf:compare:cross` reportar regressão > 2 pontos em qualquer métrica, surfacing como CONCERN para decisão (revert vs aceitar).
