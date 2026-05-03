# Spec 8 — Astro Pages Restantes (Spec 2/4 da migração)

### Status: approved
### Phase: PLAN
### Scope: full
### Checkpoint: 2026-05-03T17:00:00.000Z
### Approved: 2026-05-03T17:00:00.000Z (via /mustard:approve)
### Pipeline: /mustard:feature (Full scope — extensão mecânica de Spec 7)
### Model: sonnet (todos padrões já estabelecidos em Spec 7; opus em retries individuais se houver falha estrutural)

## Summary

Spec 2 de 4 que executam migração Astro. Adiciona as 3 pages restantes (`/servicos`, `/portfolio`, `/404`) ao `site-ethos-astro/`. Reusa **100% da foundation de Spec 7** (assets, ui primitives, lib, hooks, context, data, todos os 19 components Home + auxiliares). É **mecânica de extensão**, não nova arquitetura.

**Princípio de zero-risco preservado**: client/src/ continua intocado. Cada page nova é arquivo NEW em `site-ethos-astro/src/pages/`. Rollback trivial: deletar os 6 arquivos novos.

## Roadmap completo (Specs 7-10)

| Spec | Status | Escopo |
|---|---|---|
| **Spec 7** | ✓ closed (`pass_with_concerns`) | Bootstrap Astro + foundation completa + Home POC |
| **Spec 8** (esta) | draft | Pages /servicos + /portfolio + /404 + OrbitingSkills |
| **Spec 9** | pendente | Lighthouse CI port-clean + scripts perf reaproveitados + perf mobile ≥ 90 + baselines committed |
| **Spec 10** | pendente | Cutover (archive branch + delete client/server/shared + Astro vira raiz) + sync-detect/registry rerun + final QA |

## Premissa de target

Mensurável no fim do Spec 8 (perf final é Spec 9):

| Critério | Target |
|---|---|
| `/servicos`, `/portfolio`, `/404` renderizam em site-ethos-astro/ | sim |
| AuroraBackground three.js shader em /servicos com lazy-on-interaction (Spec 6 carry-over preservado) | preservado |
| OrbitingSkills animação ativa em /servicos | preservado |
| LazyImage de PortfolioPage funciona com vite-imagetools `?as=picture` | preservado |
| Theme dark/light persiste navegação entre 4 pages (NavbarIsland em cada) | sim |
| Wouter `<Link>` substituído por `<a>` em qualquer CTA inter-page | sim |
| TypeScript zero erros em site-ethos-astro/ | sim |
| Build (`pnpm --dir site-ethos-astro build`) gera `dist/` com 4 HTMLs (`index.html`, `servicos/index.html`, `portfolio/index.html`, `404.html`) | sim |
| Dev server serve as 4 paths corretamente (404 catch-all) | sim |

## Inventário de migração

### Pages (3 .astro NEW, thin wrappers)

| Astro page | Composição | Hidratação |
|---|---|---|
| `src/pages/servicos.astro` | `<Layout><ServicesPageContent client:load /></Layout>` | Single big island |
| `src/pages/portfolio.astro` | `<Layout><PortfolioPageContent client:load /></Layout>` | Single big island |
| `src/pages/404.astro` | `<Layout><NotFoundContent client:load /></Layout>` | Single big island (page pequena) |

**Decisão arquitetural — single big island per page**: ServicesPage tem ~462 lines de JSX inline (motion.section animations + grid de skills + cards de serviços). PortfolioPage tem ~252 lines (grid filtros + projects). Splitting seria refactor proibido por "lift-and-shift fiel". Trade-off: perde split granular per-section vs Home; ganha simplicidade + correctness garantida. Otimização granular fica para spec dedicada pós-cutover SE Lighthouse Spec 9 mostrar value.

### Components a copiar (3 page-content + 1 transitivo = 4 .tsx)

| Origem (client/) | Destino (site-ethos-astro/) | Operação |
|---|---|---|
| `src/pages/ServicesPage.tsx` | `src/components/ServicesPageContent.tsx` | COPY + rename + adapt |
| `src/pages/PortfolioPage.tsx` | `src/components/PortfolioPageContent.tsx` | COPY + rename + adapt |
| `src/pages/not-found.tsx` | `src/components/NotFoundContent.tsx` | COPY + rename + adapt |
| `src/components/OrbitingSkills.tsx` | `src/components/OrbitingSkills.tsx` | COPY direto (zero adapt esperado) |

**Adaptações por arquivo (lift-and-shift fiel — sem refactor de feature):**
- Remover `usePageMeta(...)` call → extrair `title`/`description` para passar como props ao Layout no .astro
- Wouter swap: `import { Link, useLocation } from 'wouter'` → `<a href>` + `window.location.pathname` com SSR guard (mesmo Spec 7 Bloco C pattern)
- Image imports: já funcionam via vite-imagetools + env.d.ts (Spec 7); ajustar APENAS se algum padrão raro surgir (ex: dynamic import — improvável)
- ImageMetadata `.src` access: para `<img src={imported}>` no JSX, trocar para `<img src={imported.src}>` (Astro 6 pattern aplicado em Spec 7 Bloco C)

**NÃO migram nesta spec:**
- `Meteors.tsx` — verificado dead code em client/ (zero imports). Não copiar.
- Qualquer feature/section dentro das pages que não exista em client/. Lift-and-shift fiel proíbe additions.

### Files (~6-8)

| Categoria | Quantidade | Operação |
|---|---|---|
| Astro pages | 3 (servicos.astro, portfolio.astro, 404.astro) | NEW |
| Page content components | 3 (Services/Portfolio/NotFoundContent.tsx) | COPY + adapt |
| Components transitivos | 1 (OrbitingSkills.tsx) | COPY |
| **Total** | **7** | — |

## Boundaries

**In:**
- `site-ethos-astro/src/pages/servicos.astro`
- `site-ethos-astro/src/pages/portfolio.astro`
- `site-ethos-astro/src/pages/404.astro`
- `site-ethos-astro/src/components/ServicesPageContent.tsx`
- `site-ethos-astro/src/components/PortfolioPageContent.tsx`
- `site-ethos-astro/src/components/NotFoundContent.tsx`
- `site-ethos-astro/src/components/OrbitingSkills.tsx`

**Out:**
- Qualquer arquivo em `client/`, `server/`, `shared/`, root configs (princípio paralelismo Specs 7-9)
- Lighthouse CI infra — fica para Spec 9
- Cutover, delete de client/server/shared, mover Astro pra raiz — Spec 10
- Mudanças visuais ou de copy — proibido. Migração é lift-and-shift fiel.
- Astro `<Image>` migration nativa — vite-imagetools resolve hoje; consideração futura se Lighthouse perf gain mensurável
- Sitemap, robots.txt, schema.org JSON-LD — Spec 9/10

## Dependencies

- Spec 7 (`2026-05-02-migracao-astro`) closed ✓ — foundation completa em `site-ethos-astro/`, padrões load-bearing estabelecidos
- Stack validado em Spec 7: Astro 6.2.1 + @astrojs/react 5.0.4 + Tailwind v4 (@tailwindcss/vite) + vite-imagetools 10 + .npmrc node-linker=hoisted Win + postcss.config.cjs isolation
- Node ≥22, pnpm ≥10 (já instalados)

## Tasks

### Bloco A — Components transitivos (Wave 1)

**Agente: general-purpose**

- [ ] COPY `client/src/components/OrbitingSkills.tsx` → `site-ethos-astro/src/components/OrbitingSkills.tsx` (Copy-Item -Force ou cp em PowerShell/bash)
- [ ] Verificar OrbitingSkills.tsx por: (a) imports Wouter (improvável — é animation component); (b) imports @/components/ThemeProvider (improvável); (c) imports de lib/hook não migrados. Adaptar se necessário (zero refactor de feature).
- [ ] Verificar OrbitingSkills usa três.js: grep `from .three.|@react-three`; se sim, considerar lazy-on-interaction guard similar a AuroraBackground; se não (provável — provavelmente CSS/framer-motion), prosseguir.
- [ ] `pnpm --dir site-ethos-astro exec astro check` 0 erros após copy

### Bloco B — Page content components (Wave 2)

**Agente: general-purpose**

- [ ] COPY `client/src/pages/ServicesPage.tsx` → `site-ethos-astro/src/components/ServicesPageContent.tsx`:
  - Rename internal default export para `ServicesPageContent` (file rename + export rename)
  - Remove `usePageMeta(...)` call. Extract title/description literais para usar em servicos.astro Layout props.
  - Wouter swap (mesmo Spec 7 Bloco C pattern): grep `from ['"]wouter['"]` → swap para `<a href>` / `window.location.pathname` com SSR guard.
  - ImageMetadata `.src` access se houver `<img src={importedImage}>` direto.
- [ ] COPY `client/src/pages/PortfolioPage.tsx` → `site-ethos-astro/src/components/PortfolioPageContent.tsx`:
  - Mesma adaptação (rename + usePageMeta drop + Wouter swap + .src se aplicável)
  - Validar projects.ts imports funcionam via vite-imagetools + env.d.ts (já preparados Spec 7)
- [ ] COPY `client/src/pages/not-found.tsx` → `site-ethos-astro/src/components/NotFoundContent.tsx`:
  - Mesma adaptação (provavelmente página simples)
- [ ] `pnpm --dir site-ethos-astro exec astro check` 0 erros após 3 copies (warnings/hints OK)

### Bloco C — Astro pages (Wave 3)

**Agente: general-purpose**

- [ ] Criar `site-ethos-astro/src/pages/servicos.astro`:
  - Frontmatter: `import Layout from '@/layouts/Layout.astro'; import ServicesPageContent from '@/components/ServicesPageContent';` + ogImageAsset
  - Layout props: `title="Ethos Software | Serviços — Desenvolvimento de Software sob Medida"`, description (do ServicesPage usePageMeta original), `canonical="https://ethossoftware.com.br/servicos"`, `ogImage={ogImageAsset.src}`
  - Body: `<ServicesPageContent client:load />` dentro do `<Layout>`
- [ ] Criar `site-ethos-astro/src/pages/portfolio.astro`:
  - Análogo: `title="Ethos Software | Portfólio — Cases de Software, Sites e Apps"`, description correspondente, `canonical=".../portfolio"`
  - Body: `<PortfolioPageContent client:load />`
- [ ] Criar `site-ethos-astro/src/pages/404.astro`:
  - `title="404 — Página Não Encontrada | Ethos Software"`
  - canonical opcional (404 não index'a; idealmente sem canonical OU canonical aponta para Home)
  - Body: `<NotFoundContent client:load />`
  - Astro convention: este file gera `dist/404.html` — most static hosts (Vercel/Netlify/CloudFront/Pages) servem auto em 404
- [ ] `pnpm --dir site-ethos-astro build` exit 0; verificar:
  - `dist/index.html` (Home — Spec 7) ✓
  - `dist/servicos/index.html` (NEW)
  - `dist/portfolio/index.html` (NEW)
  - `dist/404.html` (NEW)
- [ ] Dev server smoke: `pnpm --dir site-ethos-astro dev` background; curl/Invoke-WebRequest em /, /servicos, /portfolio retornam 200; curl em path inexistente retorna 404 com NotFound page renderizado

### qa-run Agent (Wave QA)

- [ ] Executar AC-1..AC-8 (definidos abaixo)
- [ ] Lighthouse mobile em /servicos e /portfolio (informativo, target 90+ é Spec 9)
- [ ] Bundle size delta para cada page (informativo)
- [ ] Reportar concerns de paridade visual ou comportamental

## Acceptance Criteria

- [ ] **AC-1: TypeScript zero erros** — Command: `pnpm --dir site-ethos-astro exec astro check` retorna 0 errors (warnings/hints OK)
- [ ] **AC-2: Build limpo gera 4 HTMLs** — Command: `pnpm --dir site-ethos-astro build` exit 0 + `node -e "['dist/index.html','dist/servicos/index.html','dist/portfolio/index.html','dist/404.html'].every(p=>require('fs').existsSync('site-ethos-astro/'+p))?process.exit(0):process.exit(1)"`
- [ ] **AC-3: Dev server serve 4 paths** — Command: dev server background + curl `/`, `/servicos`, `/portfolio` retornam 200; curl `/<random-string>` retorna 404 com `<title>404` no HTML
- [ ] **AC-4: AuroraBackground three.js lazy-on-interaction em /servicos** — Command: `node scripts/diagnose-three-lazy.cjs http://localhost:4321/servicos` exit 0 (carrega three.js só após user input)
- [ ] **AC-5: OrbitingSkills.tsx presente** — Command: `node -e "process.exit(require('fs').existsSync('site-ethos-astro/src/components/OrbitingSkills.tsx')?0:1)"`
- [ ] **AC-6: 3 page content components presentes** — Command: `node -e "['ServicesPageContent','PortfolioPageContent','NotFoundContent'].every(n=>require('fs').existsSync('site-ethos-astro/src/components/'+n+'.tsx'))?process.exit(0):process.exit(1)"`
- [ ] **AC-7: Visual diff manual aprovado** — usuário side-by-side em 3 pages: client porta 5000 (`/servicos`, `/portfolio`, `/<random>`) vs Astro porta 4321 (mesmas 3 paths). Tolerância: pequenas diferenças de timing de animação OK.
- [ ] **AC-8: Theme persiste navegação entre pages** — manual: navegar Home → /servicos → /portfolio → /404 com theme dark; cada page deve manter dark sem flash (NavbarIsland em cada page hidrata ThemeProvider que sincroniza com classList aplicado pelo inline anti-FOUC script)

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| ServicesPage tem top-level `document`/`window` access que crasha em SSR (Astro builds React islands at build time pra HTML inicial) | Média | client:load directive não SSR'a o island content em build (Astro renderiza placeholder), mas se houver `useState(() => document.X)` initial sem guard, ainda crash. Adicionar `typeof window === 'undefined'` guard onde necessário durante adapt. |
| usePageMeta dropped quebra title/description SE faz algo além de meta basic (ex: schema.org JSON-LD inline) | Baixa | Layout.astro suporta title/description/ogImage/canonical via props + slot name="head" pra extras; se houver schema.org no usePageMeta, migrar para slot |
| Wouter Link em CTAs internos de ServicesPage/PortfolioPage não swap'd | Alta | Bloco B explicit grep + replace; Spec 7 já provou pattern |
| AuroraBackground em /servicos com client:load (vs client:visible em Spec 7 Home tentativa) double-init | Média | Spec 7 Bloco C adicionou initRef guard (lazy-on-interaction Spec 6 preservado); validar manualmente no AC-4 |
| OrbitingSkills usa biblioteca não instalada em site-ethos-astro/ deps | Baixa | Bloco A check via `pnpm check`; instalar dep com `pnpm --dir site-ethos-astro add X` se erro de import |
| /portfolio LazyImage com vite-imagetools quebra em build | Baixa | Spec 7 já validou pattern em Home Portfolio (preview); /portfolio (full) usa mesmo LazyImage primitive |
| 404 path testing — Astro dev server vs production hosts diferem | Baixa | Astro dev serve dist/404.html para paths inexistentes; production hosts (Vercel/Netlify) auto-config; documentar como host-dependent quirk em Notes |
| Inline JSX em pages tem hooks/effects que esperam ThemeProvider context (não wrapped no island) | Média | NavbarIsland wrapper de Spec 7 só envolve Navbar; se ServicesPageContent acessa useTheme, criar ServicesPageIsland.tsx wrapper análogo (escalation: criar wrapper extra como decisão Bloco B) |

## Rollback

Antes do cutover Spec 10:
- `rm -rf site-ethos-astro/src/pages/{servicos,portfolio,404}.astro`
- `rm site-ethos-astro/src/components/{ServicesPageContent,PortfolioPageContent,NotFoundContent,OrbitingSkills}.tsx`
- `git revert HEAD~N..HEAD` (N = número de commits Spec 8)
- client/ permanece 100% intocado em qualquer cenário

## Notes

- **Approval Gate**: Esta spec exige `/mustard:approve` antes de EXECUTE (mesmo padrão Spec 7).
- **Decisão arquitetural — single big island per page**: ServicesPage/PortfolioPage têm muito inline JSX. Splitting seria refactor proibido. Trade-off: perde split granular (cada page hidrata como bloco). Lighthouse Spec 9 vai indicar se ganhos de splitting valem refactor pós-cutover.
- **Decisão arquitetural — Meteors deferido permanente**: dead code em client/ (zero imports). Não copiar.
- **Decisão arquitetural — usePageMeta drop continua**: Layout.astro já handle nativamente. 3 page-content components extraem literals para passar como Astro.props.
- **Carry-over de Spec 7**: foundation 100% reusada; padrões load-bearing aplicados sem variação (NavbarIsland, env.d.ts, anti-FOUC, .npmrc Win, postcss isolation, Wouter swap, ImageMetadata.src, vite-imagetools).
- **Pós-Spec 8**: Spec 9 (Lighthouse CI port-clean + perf 90+) será draftada. Spec 9 valida PERF (target 90+); Spec 8 valida ESTRUTURA (lift-and-shift completo).
- **Cutover único permanece em Spec 10**: nenhuma alteração no plano original.
