# Spec — Performance + SEO baseline (preparação para crescimento)

### Status: completed
### Phase: CLOSE
### Scope: full
### Checkpoint: 2026-05-01T03:30:00.000Z
### Pipeline: /mustard:feature (Full scope — 4 blocos, ~18 arquivos, novos patterns)
### Model: opus (decisões arquiteturais — manualChunks strategy, image pipeline, per-route meta convention; reverte para sonnet em retries)

## Summary

Site institucional vai crescer (mais features de design, mais imagens, mais animações). Esta spec estabelece o baseline para que crescimento NÃO degrade performance nem SEO. 4 blocos paralelos:

- **Bloco A — Bundle splitting:** lazy routes (Wouter), `manualChunks` (three.js + framer-motion + radix em vendor chunks separados), Suspense boundary global. Build atual emite warning de chunks > 500KB.
- **Bloco B — Image pipeline:** `vite-imagetools` (build-time WebP/AVIF + responsive `srcset`), componente `<LazyImage>` com aspect-ratio placeholder (CLS=0), migrate dos screenshots/clients/brand atuais.
- **Bloco C — SEO per-route + cleanup:** hook `usePageMeta` (title + description + canonical + OG por rota), `sitemap.xml`, remover Replit refs do `vite-plugin-meta-images.ts` (usa `process.env.SITE_URL` + fallback hardcoded), `theme-color`, font preload, Twitter handles.
- **Bloco D — Animation/perf polish:** Sparkles + AuroraBackground com `IntersectionObserver` (pause offscreen), audit framer-motion variants para extrair p/ module-level (evita recriar a cada render), garantir `prefers-reduced-motion` em todas animações pesadas.

**Princípio de ouro:** zero mudança visual percebida em desktop com hardware moderno. Animações continuam idênticas quando ativas; só não rodam quando offscreen ou em low-power. SEO existente (JSON-LD rico, noscript fallback) preservado integralmente.

## Entity Info

N/A — entity-registry vazio.

## Files (~18)

| Path | Operação | Bloco |
|---|---|---|
| `client/src/App.tsx` | rewrite com `lazy()` + `<Suspense>` | A |
| `vite.config.ts` | adicionar `build.rollupOptions.output.manualChunks` strategy | A |
| `client/src/components/AuroraBackground.tsx` | verificar dynamic-import three; ajustar se eager | A,D |
| `package.json` | adicionar `vite-imagetools` em devDeps | B |
| `client/src/components/ui/lazy-image.tsx` | NEW — componente reutilizável | B |
| `client/src/components/ClientCarousel.tsx` | migrar 16 imports de logo p/ LazyImage com responsive srcset | B |
| `client/src/data/projects.ts` | atualizar imports p/ usar query string `?w=800;1600&format=webp;avif;png&as=picture` | B |
| `client/src/components/About.tsx` | migrar 1 image p/ LazyImage | B |
| `client/src/hooks/use-page-meta.ts` | NEW — hook que seta document.title + meta description + canonical + OG title/description | C |
| `client/src/pages/Home.tsx` | chamar `usePageMeta` no topo | C |
| `client/src/pages/ServicesPage.tsx` | chamar `usePageMeta` no topo | C |
| `client/src/pages/PortfolioPage.tsx` | chamar `usePageMeta` no topo | C |
| `client/src/pages/not-found.tsx` | chamar `usePageMeta` (noindex) | C |
| `client/public/sitemap.xml` | NEW — 3 rotas + lastmod | C |
| `client/public/robots.txt` | adicionar `Sitemap:` directive | C |
| `client/index.html` | adicionar `theme-color`, font preload (preload + as=style), Twitter handles, canonical default | C |
| `vite-plugin-meta-images.ts` | trocar `REPLIT_*` env por `SITE_URL` + fallback `https://ethossoftware.com.br` | C |
| `client/src/components/Sparkles.tsx` | adicionar IntersectionObserver para pausar canvas offscreen | D |
| `client/src/components/AuroraBackground.tsx` | idem (se ainda renderiza shader continuamente) | D |
| `client/src/components/Footer.tsx`, `OrbitingSkills.tsx`, `WizardSection.tsx` | extrair `Variants` constants para fora do componente (module-level) se atualmente recriadas a cada render | D |

## Boundaries

**In:** todos os paths em `## Files`.

**Out:**
- `server/` — site é SPA + API estática; nenhuma mudança backend
- `tsconfig.json`, `.npmrc`, `.gitignore` — corretos
- `client/src/index.css`, `tailwind.config.*` — não tocar
- `package.json` — apenas adicionar `vite-imagetools` em devDeps (1 linha); NÃO mexer em outras deps nem scripts
- Specs em `.claude/spec/completed/`
- JSON-LD em `client/index.html` linhas 26-189 (já rico, preservar integralmente)
- noscript content linhas 198-253 (preservar integralmente)
- Componentes UI em `client/src/components/ui/` — só ADICIONAR `lazy-image.tsx`; não modificar primitives

## Dependencies

- Spec 3 `completed` (✓ confirmado)
- Branch `main` limpa antes de começar
- Acesso ao registry npm para `pnpm add -D vite-imagetools`

## Tasks

### client-impl Agent (Wave 1) — Bloco A (Bundle splitting)

- [x] `App.tsx`: trocar `import Home from "@/pages/Home"` por `const Home = lazy(() => import("@/pages/Home"))`; idem ServicesPage, PortfolioPage, NotFound
- [x] Wrap `<Router />` com `<Suspense fallback={<RouteLoader />}>`; `RouteLoader` é minimalista (manter splash uniforme — pode ser apenas div com mesma cor de fundo do Hero, evita flash branco)
- [x] Inspecionar `AuroraBackground.tsx`: confirmar que `import("three")` é dinâmico dentro de `useEffect`/`onMount`; se não, ajustar
- [x] `vite.config.ts`: adicionar em `build.rollupOptions.output`:
  ```ts
  manualChunks: (id) => {
    if (id.includes("node_modules/three")) return "three";
    if (id.includes("node_modules/framer-motion")) return "motion";
    if (id.includes("node_modules/@radix-ui")) return "radix";
    if (id.includes("node_modules/lucide-react")) return "icons";
    if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) return "react-core";
  }
  ```
- [x] Validar: `pnpm build` — main chunk DEVE estar abaixo de 300KB minified (alvo: < 250KB); three.js DEVE estar em chunk separado `three-*.js`

### client-impl Agent (Wave 1) — Bloco B (Image pipeline) (mesmo agente — sequencial após Bloco A pra reaproveitar contexto)

- [x] `pnpm add -D vite-imagetools` (raiz do repo)
- [x] `vite.config.ts`: adicionar `imagetools()` plugin no array `plugins`
- [x] Criar `client/src/components/ui/lazy-image.tsx`:
  - Props: `src` (string), `alt` (required), `width`, `height`, `className`, `priority?: boolean` (controla `loading` e `fetchpriority`)
  - Renderiza `<picture>` com `<source>` AVIF + WebP + fallback PNG/JPG
  - `loading={priority ? "eager" : "lazy"}`, `decoding="async"`, `fetchpriority={priority ? "high" : "auto"}`
  - Aspect-ratio CSS via `style={{ aspectRatio }}` calculado de width/height (CLS=0)
  - `data-testid="lazy-image"`
- [x] `client/src/data/projects.ts`: trocar imports diretos por imports com query strings `vite-imagetools`:
  ```ts
  import projContacnet from "@/assets/screenshots/screenshot-1772062900110.png?w=800;1600&format=avif;webp;png&as=picture";
  ```
  E exportar tipo `Picture` ou similar; o consumer (`PortfolioPage` ou seções) renderiza via `<LazyImage src={projContacnet} alt="..." />`
- [x] `ClientCarousel.tsx`: trocar 16 logo imports para usar tamanhos menores (`?w=200;400&format=avif;webp;png&as=picture`); render via `<LazyImage>`. Logos são pequenos — não precisam srcset gigante
- [x] `About.tsx` (1 imagem brand): usar `<LazyImage>` com `priority` se for above-the-fold
- [x] Validar: `pnpm build` — `dist/public/assets/` deve emitir múltiplas variações (.avif, .webp, .png) por imagem; visual no carousel + portfolio inalterado

### client-impl Agent (Wave 1) — Bloco C (SEO per-route + cleanup) (continuação)

- [x] Criar `client/src/hooks/use-page-meta.ts`:
  ```ts
  type PageMeta = {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    noindex?: boolean;
  };
  export function usePageMeta(meta: PageMeta) { ... }
  ```
  Implementação via `useEffect`: seta `document.title`, atualiza/cria `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:url">`, `<meta name="robots">` quando `noindex`
- [x] `Home.tsx`: `usePageMeta({ title: "Ethos Software - Software House em Goiânia | Sites, Sistemas e Apps", description: "...", canonical: "https://ethossoftware.com.br/" })`
- [x] `ServicesPage.tsx`: title/description/canonical específicos de serviços
- [x] `PortfolioPage.tsx`: idem para portfolio
- [x] `not-found.tsx`: `usePageMeta({ title: "Página não encontrada | Ethos Software", description: "...", noindex: true })`
- [x] Criar `client/public/sitemap.xml` com 3 URLs (/, /servicos, /portfolio), `<lastmod>` ISO date
- [x] Atualizar `client/public/robots.txt`: adicionar linha `Sitemap: https://ethossoftware.com.br/sitemap.xml`
- [x] `client/index.html` head: adicionar:
  - `<meta name="theme-color" content="#A229F2" media="(prefers-color-scheme: light)">`
  - `<meta name="theme-color" content="#1a0a2e" media="(prefers-color-scheme: dark)">`
  - `<link rel="canonical" href="https://ethossoftware.com.br/">` (default; rotas sobrescrevem via hook)
  - Font preload trick: trocar `<link href="...fonts.googleapis.com..." rel="stylesheet">` por `<link rel="preload" as="style" href="...">` + `<link rel="stylesheet" href="..." media="print" onload="this.media='all'">` + `<noscript>` fallback
  - `<meta name="twitter:site" content="@ethossoftware">` (placeholder se conta não existe; OK manter sem)
- [x] `vite-plugin-meta-images.ts`: substituir lógica de `REPLIT_*` env por:
  ```ts
  const baseUrl = process.env.SITE_URL || "https://ethossoftware.com.br";
  ```
  Eliminar função `getDeploymentUrl()` ou simplificar drasticamente. Manter resto da lógica (substituição de og:image / twitter:image).

### client-impl Agent (Wave 1) — Bloco D (Animation/perf polish)

- [x] `Sparkles.tsx`: envolver canvas em `IntersectionObserver`; quando `entry.isIntersecting === false`, `cancelAnimationFrame` do loop de render; resume quando voltar a interceptar
- [x] `AuroraBackground.tsx`: idem, se shader render é contínuo; adicionar `prefers-reduced-motion` check (se já tem, validar)
- [x] Audit `Footer.tsx`, `OrbitingSkills.tsx`, `WizardSection.tsx`: se algum tem `const variants = { ... }` declarado dentro do componente (recriado a cada render), extrair p/ module-level constant
- [x] Validar: nenhuma regressão visual; `pnpm build` OK; manual: scrollar até final da página e confirmar que canvas/Sparkles continuam suaves quando voltam à viewport

### qa-run Agent (Wave 2)

- [x] Executar AC-1..AC-8
- [x] Apresentar checklist manual: Lighthouse score (Performance ≥85, SEO ≥95, Best Practices ≥95, Accessibility ≥90), navegação `/` ↔ `/servicos` ↔ `/portfolio` (loading state visível mas sem flash branco), zoom de imagens no portfolio, animações ainda fluidas

## Acceptance Criteria

- [x] AC-1: TS check zero erros — Command: `pnpm check`
- [x] AC-2: Build OK — Command: `pnpm build`
- [x] AC-3: Main chunk < 300KB minified — Command: `node -e "const fs=require('fs');const path=require('path');const dir='dist/public/assets';const main=fs.readdirSync(dir).find(f=>f.startsWith('index-')&&f.endsWith('.js'));const size=fs.statSync(path.join(dir,main)).size;console.log('main:',main,'size:',size);process.exit(size<307200?0:1)"`
- [x] AC-4: three.js em chunk separado — Command: `node -e "const fs=require('fs');const dir='dist/public/assets';const has=fs.readdirSync(dir).some(f=>f.startsWith('three')&&f.endsWith('.js'));process.exit(has?0:1)"`
- [x] AC-5: sitemap.xml existe e tem 3 URLs — Command: `node -e "const c=require('fs').readFileSync('client/public/sitemap.xml','utf8');const n=(c.match(/<url>/g)||[]).length;console.log('urls:',n);process.exit(n>=3?0:1)"`
- [x] AC-6: zero refs a REPLIT_ no `vite-plugin-meta-images.ts` — Command: `node -e "const c=require('fs').readFileSync('vite-plugin-meta-images.ts','utf8');process.exit(c.includes('REPLIT_')?1:0)"`
- [x] AC-7: WebP/AVIF emitidos no build — Command: `node -e "const fs=require('fs');const dir='dist/public/assets';const files=fs.readdirSync(dir);const hasWebp=files.some(f=>f.endsWith('.webp'));const hasAvif=files.some(f=>f.endsWith('.avif'));console.log('webp:',hasWebp,'avif:',hasAvif);process.exit((hasWebp&&hasAvif)?0:1)"`
- [x] AC-8: usePageMeta usado nas 4 páginas — Command: `node -e "const fs=require('fs');const pages=['Home.tsx','ServicesPage.tsx','PortfolioPage.tsx','not-found.tsx'];const ok=pages.every(p=>fs.readFileSync('client/src/pages/'+p,'utf8').includes('usePageMeta'));process.exit(ok?0:1)"`

### Manual Verification (operator)

Após AC-1..AC-8 PASS:
- Rodar Lighthouse local (`pnpm dev` + Chrome DevTools > Lighthouse) nas 3 rotas
  - Performance ≥ 85, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95
- Nav `/` → `/servicos` → `/portfolio` → voltar — confirmar loading state breve mas sem flash branco
- Abrir Network tab — confirmar que three.js só carrega quando entra na home (AuroraBackground)
- Confirmar visualmente que imagens carregam progressivamente (lazy) e não há layout shift

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Lazy routes adicionam flash branco perceptível | Média | `<Suspense fallback>` mantém background do tema (não usar spinner; usar `<div className="min-h-screen bg-[hsl(var(--background))]" />`) |
| `manualChunks` quebra ordem de carga / dynamic-import edge case | Baixa | Build emite manifest; verificar via `build` output e testar `pnpm dev` + `pnpm preview` |
| `vite-imagetools` regenera e quebra paths existentes em data/projects.ts | Média | Migrar UM imagem primeiro, validar build, depois batch |
| `picture` element vs `img` muda comportamento de event handlers/refs | Baixa | LazyImage encapsula; consumer usa só `src`+`alt` |
| Hook `usePageMeta` re-monta DOM nodes a cada render | Baixa | `useEffect` com cleanup; restaurar values default no unmount; evitar múltiplas instâncias |
| Sitemap apontando pra rota errada (ex: `/servicos` vs `/servicos/`) | Baixa | Wouter sem trailing slash — sitemap segue convenção; manual test |
| Font preload tweaks quebram render fonts em Safari | Baixa-Média | Manter `<noscript>` fallback com link CSS direto; testar em Safari iOS depois |
| IntersectionObserver pause em Sparkles cria flicker quando volta a entrar | Baixa | RAF loop guarda último timestamp; resume sem reset de estado |

## Rollback

Cada bloco é atômico:
- A: `git restore vite.config.ts client/src/App.tsx`
- B: `git restore vite.config.ts package.json client/src/{data,components}/**`; `pnpm install` para remover `vite-imagetools`
- C: `git restore client/src/{hooks,pages}/** client/index.html client/public/{sitemap.xml,robots.txt} vite-plugin-meta-images.ts`; `git rm` se hook não existia
- D: `git restore client/src/components/{Sparkles,AuroraBackground,Footer,OrbitingSkills,WizardSection}.tsx`

## Notes

- **Decisão arquitetural — per-route meta tags:** custom hook `usePageMeta` em vez de `react-helmet-async` (sem suporte oficial p/ React 19 ainda; ~10KB extra; nosso caso só precisa de 5 meta tags por rota).
- **Decisão arquitetural — sem prerender/SSG:** mantemos SPA puro porque (a) noscript já é rico e crawler-visible, (b) JSON-LD já está no HTML estático, (c) Google renderiza JS, (d) prerender adiciona Puppeteer (~150MB) ou Vike (rewrite). Se Lighthouse SEO < 95 mesmo após Bloco C, abrir nova spec dedicada para SSG.
- **Decisão arquitetural — image pipeline:** `vite-imagetools` (build-time, dev-dep, ~5MB) sobre `unplugin-imagemin` ou pipeline customizado; é o de-facto standard em Vite.
- **Order:** Wave 1 paralelo → executa toda Bloco A+B+C+D no mesmo client-impl agent sequencialmente para reaproveitar context. server-impl não participa (zero mudança backend).
- Wave 2: qa-run executa AC.
- Wave 3: review (paralelo client + root) + close.
