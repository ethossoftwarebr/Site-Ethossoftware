# Spec 7 — Astro Bootstrap + Home POC (Spec 1/4 da migração)

### Status: implementing
### Phase: EXECUTE
### Scope: full
### Checkpoint: 2026-05-03T15:00:00.000Z
### Approved: 2026-05-03T00:00:00.000Z (via /mustard:approve)
### Pipeline: /mustard:feature (Full scope — primeiro de 4 specs sequenciais que migram React SPA → Astro SSG)
### Model: opus (decisão arquitetural; setup de novo stack; Sonnet em retries mecânicos)

## Summary

**Primeira de 4 specs** que executam a migração completa para Astro. Esta spec entrega o **Proof-of-Concept funcional**: projeto Astro paralelo (`site-ethos-astro/`) com **toda fundação portada** (assets, libs, primitives, hooks) **+ Home page rendendo** com paridade visual e de animação.

A escolha de fazer Home como POC é deliberada: Home usa quase todos os componentes feature do projeto (Hero, Stats, Services, Mission, Benefits, Portfolio, Testimonials, EthosIA, ClientCarousel, FAQ, WizardSection, Navbar, Footer, AuroraBackground, WhatsAppButton). Se Home funcionar, Specs 8-10 são extensão mecânica do mesmo pattern.

**Princípio de zero-risco**: projeto novo nasce em diretório irmão. Repo atual permanece intocado. Se POC não convencer (visual, ergonomia de código, performance), abort = `rm -rf site-ethos-astro/` e zero impacto em produção.

## Roadmap completo (Specs 7-10)

| Spec | Escopo | Pré-requisito |
|---|---|---|
| **Spec 7** (esta) | Bootstrap Astro paralelo + foundation completa + Home page POC | Spec 6 closed-partial ✓ |
| **Spec 8** | Páginas restantes: `/servicos`, `/portfolio`, `/404` + meta tags + visual diff de cada uma | Spec 7 fechada |
| **Spec 9** | Lighthouse CI adaptado (port-clean fix) + scripts perf reaproveitados + Lighthouse mobile ≥ 90 + baselines reais committed | Spec 8 fechada |
| **Spec 10** | Cutover (archive branch + delete client/server/shared + Astro vira raiz) + CLAUDE.md atualizado + sync-detect/registry rerun + final QA | Spec 9 fechada |

Cada spec aprovada individualmente. Cada uma tem entrega visível e rollback trivial até Spec 10 (cutover).

## Premissa de target

POC mensurável (não números absolutos finais — esses são responsabilidade do Spec 9):

| Critério | Target |
|---|---|
| Home renderiza em `site-ethos-astro/` com `pnpm dev` | sim |
| Hero, Aurora, todas sections aparecem visualmente como atual | paridade 100% |
| Animações framer-motion ativas (entrance, stagger, hover) | preservadas |
| AuroraBackground three.js shader funcional + lazy-on-interaction | preservado (Spec 6 carry-over) |
| WizardSection multi-step funcional | preservado |
| Theme dark/light com toggle funcional, sem FOUC | sim |
| Lighthouse mobile na Home (informativo, não-bloqueante) | sinalizar baseline pra Spec 9 |
| TypeScript zero erros | sim |
| Build (`pnpm build`) gera `dist/` estático válido | sim |

## Inventário de migração (Spec 7 escopo)

### Foundation (movem inteiros — escopo amplo)

| Origem | Destino | Operação |
|---|---|---|
| `client/src/assets/**` (36 arquivos) | `site-ethos-astro/src/assets/**` | `git mv` preservando estrutura brand/clients/screenshots/images |
| `client/src/lib/utils.ts` | `site-ethos-astro/src/lib/utils.ts` | move |
| `client/src/hooks/use-mobile.tsx` | `site-ethos-astro/src/hooks/use-mobile.tsx` | move |
| `client/src/hooks/use-toast.ts` | `site-ethos-astro/src/hooks/use-toast.ts` | move |
| `client/src/hooks/use-page-meta.ts` | avaliar — pode ser eliminado (Astro tem `<head>` per-page nativo) | decisão na execução |
| `client/src/lib/queryClient.ts` + `@tanstack/react-query` | avaliar drop — Grep antes; se zero usos em islands, deletar | decisão na execução |
| `client/src/context/WizardContext.tsx` | `site-ethos-astro/src/context/WizardContext.tsx` | move |
| `client/src/data/projects.ts` (com `?quality=55` Spec 6) | `site-ethos-astro/src/data/projects.ts` | move + ajustar imports de imagem para Astro Image se necessário |
| `client/src/components/ui/**` (60 primitives shadcn) | `site-ethos-astro/src/components/ui/**` | move em massa, intactos |
| `client/src/index.css` (Tailwind v4 import + HSL tokens + `.shiny-cta` keyframes) | `site-ethos-astro/src/styles/global.css` | rebatizar |

### Componentes feature (escopo Spec 7 = só os usados na Home)

Movem inteiros de `client/src/components/*.tsx` → `site-ethos-astro/src/components/*.tsx`:

| Componente | Strategy de hidratação |
|---|---|
| `Hero.tsx` | `client:load` (CTA + framer entrance) |
| `Navbar.tsx` | `client:load` (sticky scroll + theme toggle) |
| `AuroraBackground.tsx` (com lazy-on-interaction Spec 6) | `client:visible` |
| `Stats.tsx` | `client:visible` |
| `Services.tsx` | `client:visible` |
| `Mission.tsx` | `client:visible` |
| `Benefits.tsx` | `client:visible` |
| `Portfolio.tsx` (versão preview na Home) | `client:visible` |
| `Testimonials.tsx` | `client:visible` |
| `EthosIA.tsx` | `client:visible` |
| `ClientCarousel.tsx` | `client:visible` (embla autoplay) |
| `FAQ.tsx` | `client:visible` |
| `WizardSection.tsx` + `WhatsAppWizard.tsx` (consumidor de WizardContext) | `client:load` no WizardSection (provê contexto) |
| `Footer.tsx` | `client:load` |
| `WhatsAppButton.tsx` | `client:load` |
| `ThemeProvider.tsx` | adaptado SSR-safe (inline script anti-FOUC + Provider hidratado) |
| `ThemeToggle.tsx` | parte do Navbar/Footer islands |

**NÃO migram nesta spec (deferidos para Spec 8):**
- OrbitingSkills.tsx, Meteors.tsx — usados em ServicesPage / PortfolioPage / 404, não na Home

> **Atualizado em Bloco D (CONCERN-8)**: spec original listava About + Instagram + Sparkles como deferidos, mas inspeção de `client/src/pages/Home.tsx` mostrou que About (line 70) e Instagram (line 72) ESTÃO na Home, e Sparkles é importado transitivamente por ClientCarousel. Os 3 foram migrados em Spec 7 conforme princípio "lift-and-shift fiel". AuroraBackground e Stats foram copiados em Bloco B/C (foundation completa) mas NÃO compõem index.astro pois Home.tsx não os usa — disponíveis para Spec 8.

### Files (~110 nesta spec)

| Categoria | Quantidade | Operação |
|---|---|---|
| Bootstrap (config files) | 5 (astro.config.mjs, tsconfig.json, package.json, tailwind.config.ts, src/layouts/Layout.astro) | NEW |
| Páginas | 1 (`src/pages/index.astro`) | NEW |
| Componentes feature usados na Home | 17 .tsx | move |
| UI primitives | 60 .tsx | move |
| Foundation (lib/hooks/context/data) | 5-7 arquivos | move |
| CSS | 1 (global.css) | move + rebatizar |
| Assets imagens | 36 | move |
| **Total operações filesystem** | **~125** | — |

## Boundaries

**In:**
- Tudo descrito em "## Inventário de migração".
- Novo diretório `site-ethos-astro/` na raiz do repo (paralelo, não destrutivo).
- Decisões inline durante execução: drop ou manter `queryClient`, drop ou manter `use-page-meta`, sintaxe de Astro Image vs vite-imagetools query strings.

**Out:**
- Páginas que não são Home (servicos, portfolio, 404) — ficam para Spec 8.
- Componentes não-Home (About, Instagram, OrbitingSkills, Meteors, Sparkles) — ficam para Spec 8.
- Lighthouse CI infra — fica para Spec 9.
- Cutover, delete de `client/`/`server/`/`shared/`, mover Astro pra raiz — ficam para Spec 10.
- Mudanças de design visual ou de copy — proibido. Migração é lift-and-shift fiel.
- Adição de features novas (blog, CMS, i18n, contact form, analytics) — Specs 11+.
- Rewrite de qualquer componente em vanilla JS ou para outra biblioteca — todos React permanecem React.

## Dependencies

- Spec 6 (`2026-05-02-lazy-three-perf-ci`) `completed-partial` ✓ — carry-over: `AuroraBackground.tsx` lazy-on-interaction + `projects.ts` per-image quality.
- Node ≥22 (já instalado).
- pnpm ≥10 (já instalado).
- Astro 5.x estável (verificar versão exata via web validation antes do bootstrap).
- `@astrojs/react` integration para React 19 islands.
- Tailwind v4 + Astro 5 compat — verificar via web validation; se incompat, fallback Tailwind v3 documentado em risk register.
- Branch `main` no estado atual com mudanças Spec 6 a serem commitadas antes do bootstrap (decisão T0).

## Tasks

### Pre-EXECUTE — Validações + commit Spec 6

- [x] Web validation: versão estável Astro 5 (publicado em https://astro.build/blog/) e compat com React 19 → Astro 5.x estável; `@astrojs/react` 5.0.4 com suporte completo React 19 (incl. `useActionState`)
- [x] Web validation: Tailwind v4 + Astro 5 — `@astrojs/tailwind` integration ou plugin alternativo (`@tailwindcss/vite`) → **decisão: `@tailwindcss/vite`** (`@astrojs/tailwind` deprecated; Astro 5.2+ `astro add tailwind` instala plugin Vite v4 nativamente)
- [x] Web validation: Astro Image API atual — sintaxe para preservar quality/format do vite-imagetools → `<Image>`/`<Picture>` aceitam `quality` e `format` inline; per-image takes precedence over service config; sharp default suporta encoder options (mozjpeg, webp.effort, avif.effort)
- [x] Decisão: commitar Spec 6 work em `main` antes de bootstrap, OU levar uncommited junto com Spec 7 work — **default: commitar Spec 6 antes** (limpa git status, isola escopos)
- [x] `git status` confirma working tree limpo após commit Spec 6 work

### Bloco A — Bootstrap Astro + Layout (Wave 1)

**Agente: general-purpose**

- [x] `pnpm create astro@latest site-ethos-astro --template minimal --typescript strict --no-install --no-git` → fallback para `npm create astro` (pnpm dlx bug Windows)
- [x] `cd site-ethos-astro && pnpm install` → após `.npmrc` com `node-linker=hoisted` (resolve symlink Windows) + `ignore-workspace=true`
- [x] `pnpm astro add react` (integration `@astrojs/react@5.0.4`)
- [x] `pnpm astro add tailwind` → instalou `@tailwindcss/vite@4.2.4` + `tailwindcss@4.2.4` em deps
- [x] Configurar `astro.config.mjs`: `output: 'static'`, `integrations: [react()]`, `vite: { plugins: [tailwindcss()] }`, `image: { service: { entrypoint: 'astro/assets/services/sharp' } }`, `site` comentado
- [x] Configurar `tsconfig.json`: extends `astro/tsconfigs/strict`, `baseUrl: "."`, paths `"@/*": ["./src/*"]`
- [x] Criar `src/layouts/Layout.astro`: `<html lang="pt-BR">` + meta charset/viewport/description + title via Astro.props + inline anti-FOUC script (`localStorage['ethos-theme'] === 'dark'` → `documentElement.classList.add('dark')`, com try/catch) + body slot + import `@/styles/global.css`
- [x] Validar bootstrap → `pnpm --dir site-ethos-astro build` exit 0, `dist/index.html` gerado; `astro check` 0 erros (AC-3 dev server validation diferida para QA T5)

<!-- CONCERN-1: Astro 6.2.1 instalado em vez de 5.x — release stable saiu entre web validation T0 e dispatch. Verificado via web search post-dispatch: breaking changes Astro 6 (Astro.glob, ViewTransitions deprecated component, legacy content collections, Cloudflare adapter changes) NÃO intersectam nosso uso (output static, sem content collections, sem Cloudflare adapter). @astrojs/react sem mudanças em v6. Risco baixo, prosseguir. -->
<!-- CONCERN-2: TypeScript ^6.0.3 instalado pelo `astro add` (versão 6 também é major bump). Build + check passaram, mas tooling de scripts/* na raiz do monorepo continua em TS anterior. Isolamento via subprojeto evita conflito. -->
<!-- CONCERN-3: Bootstrap usou `npm create astro` em vez de `pnpm create astro` por bug pnpm dlx Windows. `.npmrc` local com `node-linker=hoisted` + `ignore-workspace=true` resolve symlink/peer-dep issues. Reprodutibilidade documentada no .npmrc. -->
<!-- CONCERN-4: Spec usa "git mv" em Bloco B (linha 50-61, 164-175) mas Notes diz "client/src/ intocado durante Specs 7-9" e rollback = "rm -rf site-ethos-astro/". RESOLUÇÃO: Bloco B usará COPY (cp/Copy-Item) em vez de git mv — preserva client/ funcional + rollback trivial. Cutover único em Spec 10 deleta client/. Trade-off: git rename detection não marca paths como renames (mas conteúdo idêntico preserva blame via similarity). -->


### Bloco B — Foundation files (Wave 2, paralelo a Bloco A.tail)

**Agente: general-purpose**

- [x] **COPY** (não git mv per CONCERN-4) `client/src/assets/**` → `site-ethos-astro/src/assets/**` (36 arquivos: brand/2, clients/16, screenshots/6, images/12)
- [x] COPY `client/src/index.css` → `site-ethos-astro/src/styles/global.css` (sobrescreveu stub Tailwind; preserva `@import "tailwindcss"` + `@theme inline` + HSL tokens + brand palette + `.shiny-cta` keyframes)
- [x] COPY `client/src/lib/utils.ts` → `site-ethos-astro/src/lib/utils.ts`
- [x] COPY hooks: `use-mobile.tsx`, `use-toast.ts` → `site-ethos-astro/src/hooks/`
- [x] Avaliar `use-page-meta.ts` → **DROPPED** (uso APENAS em pages/, zero em components; Astro `Layout.astro` recebe title/description props server-side nativamente; Bloco D passa props direto)
- [x] COPY `client/src/data/projects.ts` → `site-ethos-astro/src/data/projects.ts` (preserva `?quality=55` Spec 6; Bloco C refatora imports `?as=picture` para Astro/vite-imagetools)
- [x] COPY `client/src/context/WizardContext.tsx` → `site-ethos-astro/src/context/`
- [x] Avaliar `client/src/lib/queryClient.ts` + `@tanstack/react-query` → **DROPPED** (grep `useQuery|QueryClient|useMutation|@tanstack/react-query` em `client/src/components/**` e `client/src/hooks/**` retornou ZERO matches; provavelmente usado só em App.tsx/main.tsx providers que não migram)
- [x] COPY 60 arquivos `client/src/components/ui/**` → `site-ethos-astro/src/components/ui/**` em massa
- [x] Instalar 48 deps transitivas via `pnpm --dir site-ethos-astro add` (27 @radix-ui/react-*, framer-motion, embla-carousel-react, react-hook-form, lucide-react, zod, recharts, sonner, vaul, etc — versões ≥ client/package.json)
- [x] Build validation: `pnpm --dir site-ethos-astro build` exit 0 (1 page); `astro check` 10 erros remanescentes (todos Bloco C: 8x projects.ts vite-imagetools, 1x sonner.tsx ThemeProvider missing, 2x verbatimModuleSyntax `import type`)

### Bloco C — Componentes feature (Home subset) + ThemeProvider SSR-safe (Wave 3)

**Agente: client-impl**

- [x] **COPY** (não git mv per CONCERN-4) 16 componentes Home + ThemeProvider + ThemeToggle + **Sparkles** (transitivo: ClientCarousel importa Sparkles; era erro TS2307 não listado nos 10 herdados). 19 .tsx em `site-ethos-astro/src/components/`.
- [x] Adaptar `ThemeProvider.tsx` SSR-safe: `useState` inicial = `'light'` (sem localStorage call); useEffect on mount sincroniza com `documentElement.classList.contains('dark')` (lê o que o inline script de Layout.astro aplicou); useEffect on theme-change persiste em localStorage + classList. Sem re-render flash.
- [x] Adaptar componentes que usam Wouter:
  - Navbar: removeu `import { Link, useLocation } from 'wouter'`; `<Link>` → `<a>`; `useLocation` → `useState("/") + useEffect window.location.pathname` (SSR-safe)
  - Portfolio: removeu Wouter; `<Link>` → `<a>`
  - Footer: ajuste `logoEthos.src` (ImageMetadata.src — pattern Astro 6 React JSX)
  - Wouter NÃO foi adicionado em deps Astro
- [x] AuroraBackground double-init guard: adicionado `initRef = useRef(false)` em useEffect; previne dupla execução do shader scene em re-mount. Lazy-on-interaction Spec 6 preservado verbatim. Validação manual de double-init real fica para Bloco D (com index.astro renderizando).
- [x] WizardSection + WhatsAppWizard + WizardContext: arquitetura mantida; Provider local dentro do island `<WizardSection client:load>` provê contexto para WhatsAppWizard child. Validação funcional no Bloco D.
- [x] `pnpm --dir site-ethos-astro exec astro check` → **0 errors, 0 warnings, 109 hints** (hints `ElementRef deprecated` em primitives shadcn — fora de escopo)
- [x] **Endereçados 10 erros TS herdados de Bloco B**:
  - 8x projects.ts vite-imagetools → instalado `vite-imagetools@^10` (devDep) + adicionado `imagetools()` em `astro.config.mjs` vite.plugins; +`env.d.ts` declara `*?as=picture` modules como `PictureSource` (lift-and-shift fiel; sem refactor de projects.ts)
  - 1x sonner.tsx → resolvido pela copy de ThemeProvider em Phase 1
  - 2x verbatimModuleSyntax (pagination.tsx + sidebar.tsx) → fix surgical `import { type X }` (syntax adaptation, não refactor)

<!-- CONCERN-5: Sparkles.tsx foi copiado em Bloco C apesar de spec linha 88 listar como deferido p/ Spec 8 — ClientCarousel (na Home) importa @/components/Sparkles, então é runtime requirement do POC. Atualizar spec linha 88 em CLOSE para remover Sparkles da lista de deferidos. -->
<!-- CONCERN-6: env.d.ts pattern para `?as=picture` (vite-imagetools) em vez de refactor para Astro <Image> — preserva "lift-and-shift fiel" (spec linha 116). Trade-off: depende de vite-imagetools como build-time plugin em vez de pipeline Astro nativo. Considerar migração para Astro <Image> + getImage() para passar srcsets a React islands em spec pós-cutover, se houver perf gain mensurável. -->
<!-- CONCERN-7: ThemeProvider sync entre múltiplos islands (Navbar e Footer ambos têm ThemeToggle): cada island tem instância própria do Provider; em mount cada um lê classList atual; toggle em um NÃO atualiza state do outro até next mount. Visual (Tailwind dark variants) sempre consistente via <html class="dark">; só icone do toggle pode lag em UI cross-island. POC aceita; full sync via MutationObserver fica para polish pós-cutover se UX necessário. -->


### Bloco D — Home page (Wave 4)

**Agente: client-impl**

- [x] Criou `site-ethos-astro/src/pages/index.astro`:
  - Frontmatter: imports de Layout + 14 componentes Home + ogImageAsset; metadata title/description/canonical
  - Body: ordem espelhada de `client/src/pages/Home.tsx`: NavbarIsland, Hero, ClientCarousel, Services, Benefits, Portfolio, Testimonials, About, Mission, Instagram, WizardSection, FAQ, Footer, WhatsAppButton, EthosIA. Quatro divs background blur (brand color halos) + main wrapper.
  - Hidratação: NavbarIsland/Hero/WizardSection/Footer/WhatsAppButton `client:load`; ClientCarousel/Services/Benefits/Portfolio/Testimonials/About/Mission/Instagram/FAQ/EthosIA `client:visible`
  - WizardSection `client:load` (provê WizardContext para WhatsAppWizard child preserved)
- [x] Configurou meta tags Home: title + description + canonical + ogImage (logo brand) + Twitter card via `<slot name="head"/>` em Layout.astro extendido
- [x] Criou `NavbarIsland.tsx` wrapper `<ThemeProvider><Navbar/></ThemeProvider>` — Footer não usa useTheme (única instância de Provider, evita CONCERN-7)
- [x] Criou `postcss.config.cjs` vazio em site-ethos-astro/ — bloqueia upward search do PostCSS v3 do monorepo parent (que vaza via Vite); Astro usa `@tailwindcss/vite` direto
- [x] Copiou About.tsx + Instagram.tsx + 5 fontes Outfit (`Outfit-{400,500,600,700,900}.woff2`) para site-ethos-astro/public/fonts/ — `@font-face` em global.css já aponta para `/fonts/Outfit-*.woff2` (auto-resolve)
- [x] `pnpm --dir site-ethos-astro dev` abre http://localhost:4321 com STATUS:200; conteúdo retorna `<title>` correto + 286 brand-color hits + 16 mentions "Ethos Software" + 31 astro-island markers; zero erros no log
- [x] `pnpm --dir site-ethos-astro build` exit 0 em 7.15s; `dist/index.html` gerado com placeholders `<astro-island>` para 13 ilhas + per-island JS chunks em `dist/_astro/`
- [x] `astro check` → 0 errors, 0 warnings, 112 hints (108 ElementRef deprecated em shadcn primitives + 4 em About/Instagram — fora de escopo, lift-and-shift fiel)
- [ ] **Validação visual manual** (USER-DRIVEN): abrir lado a lado `pnpm dev` em `client/` (porta 5000) e `site-ethos-astro/` (porta 4321); comparar Home section-por-section. Lista detalhada no T5 QA report.
- [ ] **Validação funcional manual** (USER-DRIVEN): theme toggle sem FOUC; WizardSection 7-step wizard + WhatsApp link; framer-motion entrance animations on scroll. Deferida para T5 QA + user smoke test.
- [ ] `pnpm preview` (USER-DRIVEN): serve `dist/` localmente; confirmar paridade visual também em build de produção. Deferida para T5/user.

<!-- CONCERN-8: Spec original (linhas 67-83 + 87-89) listava 16 components Home + About/Instagram/Sparkles deferidos — análise de Home.tsx em Bloco D revelou 14 components ATUAIS + About/Instagram/Sparkles SÃO usados na Home. Esta spec foi corrigida (deferred reduzido a OrbitingSkills + Meteors). AuroraBackground + Stats copiados em foundation mas NÃO usados na Home (apenas ServicesPage — Spec 8). -->
<!-- CONCERN-9: 112 hints `ElementRef deprecated` em shadcn ui primitives (preexistentes em client/, surfaceiam em check Astro pq config strict). Fora de escopo desta spec — lift-and-shift fiel não permite refactor. Endereçar em spec dedicada de modernização shadcn pós-cutover, OU rodar `npx shadcn@latest sync` para upgrade global. -->
<!-- CONCERN-10: postcss.config.cjs vazio em site-ethos-astro/ blocked upward Vite search do monorepo parent's `postcss.config.js` (Tailwind v3-style usado por client/). Necessário até Spec 10 cutover (que deleta client/postcss.config.js). Documentar como Windows-monorepo gotcha. -->


### qa-run Agent (Wave QA)

- [ ] Executar AC-1..AC-9 (definidos abaixo)
- [ ] Capturar Lighthouse mobile + desktop só na Home (informativo, não-bloqueante — target 90+ é Spec 9)
- [ ] Reportar bundle size da Home (informativo — comparar com 1.15MB atual)
- [ ] Reportar quaisquer concerns de paridade visual ou comportamental

## Acceptance Criteria

- [ ] AC-1: TypeScript zero erros em `site-ethos-astro/` — Command: `cd site-ethos-astro && pnpm check`
- [ ] AC-2: Build limpo — Command: `cd site-ethos-astro && pnpm build` (exit 0; gera `dist/index.html`)
- [ ] AC-3: Dev server inicia — Command: `cd site-ethos-astro && pnpm dev` em background + `curl -sf http://localhost:4321/` retorna 200
- [ ] AC-4: 36 assets de imagem migrados — Command: `node -e "const fs=require('fs'),path=require('path');function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}const c=walk('site-ethos-astro/src/assets').filter(f=>f.match(/\\.(png|jpe?g|webp|avif)$/i)).length;console.log('count:',c);process.exit(c>=36?0:1)"`
- [ ] AC-5: 60 ui primitives migrados — Command: `node -e "console.log(require('fs').readdirSync('site-ethos-astro/src/components/ui').filter(f=>f.endsWith('.tsx')).length)"` ≥ 60
- [ ] AC-6: 16 componentes feature presentes — Command: `node -e "const need=['Hero','Navbar','AuroraBackground','Stats','Services','Mission','Benefits','Portfolio','Testimonials','EthosIA','ClientCarousel','FAQ','WizardSection','WhatsAppWizard','Footer','WhatsAppButton'];const fs=require('fs');const ok=need.every(n=>fs.existsSync('site-ethos-astro/src/components/'+n+'.tsx'));process.exit(ok?0:1)"`
- [ ] AC-7: AuroraBackground three.js carrega lazy-on-interaction (preserva Spec 6) — Command: `node scripts/diagnose-three-lazy.cjs` com URL ajustada para `http://localhost:4321/` — exit 0
- [ ] AC-8: Visual diff manual aprovado — Command: orquestrador apresenta side-by-side screenshots ou descrição comparada; usuário aprova ou rejeita por componente
- [ ] AC-9: Theme toggle dark/light funciona sem FOUC — Command: manual smoke test: hard reload em dark mode → não há flash light antes do dark aplicar

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Tailwind v4 + Astro 5 incompat (versões muito recentes) | Média | Web validation antes do bootstrap; fallback Tailwind v3 sem perda visual significativa (paleta sobrevive intacta) |
| ThemeProvider FOUC ao trocar dark/light | Média | Inline script no `<head>` aplica classe antes da hidratação; padrão documentado pela comunidade Astro |
| WizardContext provider scope quebra entre island boundaries | Média | Manter Provider dentro do mesmo island (`<WizardSection client:load>` é o root); WhatsAppWizard renderiza como child do Provider |
| Astro Image substituição por vite-imagetools quebra dimensões/qualidade | Média | Astro Image tem API similar; portar query strings 1:1 (`quality=`, `format=`); validar com build comparativo |
| Wouter `<Link>` em components → quebra ao mover (não existe em Astro) | Alta | Grep+swap para `<a>` nativo (sem perda — Astro tem fast nav); `useLocation` substitui por `window.location.pathname` com guard SSR |
| TanStack QueryClient ainda usado em algum componente (hidden dep) | Baixa | Grep `useQuery\|QueryClient` antes de remover; manter wrapper no-op se necessário |
| AuroraBackground double-init (`client:visible` + IntersectionObserver interno) | Média | Validar em Bloco D — IntersectionObserver interno deve detectar que componente já está mounted e não duplicar; ajuste se necessário |
| `ts-pattern` ou outras deps transitivas faltando após instalação Astro | Baixa | `pnpm check` pega cedo; instalar incrementalmente conforme erro de import surgir |
| Build Astro estoura por three.js dynamic import | Baixa | three.js é dynamic import, Astro não vai bundleá-lo no critical path; chunks separados |
| Performance Home Astro pior que esperado (alguma config errada) | Baixa | Diagnose comum: asset paths, image opt, third-party scripts; resolver pontualmente; Spec 9 é onde o número final importa |

## Rollback

Migração paralela:

- **Antes do cutover (este spec, e Spec 8-9)**: `rm -rf site-ethos-astro/`. Repo atual intocado. Custo: tempo de Spec 7 perdido, zero impacto em produção.
- **Pós-cutover (Spec 10)**: `git checkout archive/pre-astro-migration -- .`. Restaura todo estado pré-migração.

## Notes

- **Decisão arquitetural — POC primeiro**: Spec 7 é POC deliberado. Se ergonomia de código Astro não te convencer (você lê index.astro + Layout.astro e julga "não consigo manter isso sozinho"), abort = `rm -rf site-ethos-astro/`. Custo limitado, decisão informada.
- **Decisão arquitetural — paralelismo durante todo Specs 7-9**: nenhuma mudança no `client/src/` durante Specs 7-9. Repo de produção fica congelado. Cutover ÚNICO acontece em Spec 10. Reduz risco de divergência.
- **Decisão arquitetural — granularidade Spec 7**: bootstrap + foundation completa + Home no mesmo spec porque Home valida que TODA a foundation está correta. Pages restantes (Spec 8) reusam foundation sem mudança.
- **Decisão arquitetural — preservar 100%**: zero refactor de feature durante migração. Se um componente precisa melhorias, abrir spec separada pós-Spec-10.
- **Carry-over de Spec 6**: AuroraBackground lazy-on-interaction preservado tal qual (já é melhor para Astro do que para SPA). `projects.ts` per-image quality preservado.
- **Approval Gate**: Esta spec exige `/mustard:approve` antes de EXECUTE. Sessão pode continuar atual (context inicial maior mas suportável) OU iniciar fresca pós-aprovação via `/mustard:resume`.
- **Pós-Spec 7**: Spec 8 será draftada quando Spec 7 fechar. Princípio: cada spec é o último plano que vale na hora — não pré-otimizar.
- **Aprendizado Astro como side-effect**: durante execução, agentes incluem comentários explicativos nas decisões de hidratação (`client:load` vs `client:visible` por componente). Comentários servem como mini-tutorial Astro embedded no próprio código que você vai manter.
