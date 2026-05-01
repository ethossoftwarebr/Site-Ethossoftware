# Spec — Lighthouse Performance 82 → 90+ (LCP, TBT, FCP attack plan)

### Status: pending-approval
### Phase: PLAN
### Scope: full
### Checkpoint: 2026-05-01T03:45:00.000Z
### Pipeline: /mustard:feature (Full scope — 6 blocos, ~16 arquivos, novos patterns: prerender + self-hosted fonts + critical CSS)
### Model: opus (decisões arquiteturais críticas — prerender approach, font hosting, defer mount strategy)

## Summary

Pós-Spec 4 o site tem main chunk 64KB, three.js lazy, imagens AVIF/WebP, SEO per-route. Lighthouse Performance manual ficou em **82**. Esta spec ataca os 3 metrics mais prováveis de estar abaixo:

- **LCP > 2.5s** (Largest Contentful Paint) — provável: hero image não tem preload + priority; font swap atrasa first text paint; SPA shell branco antes do hydrate
- **TBT > 300ms** (Total Blocking Time) — provável: JS de motion + radix bloqueando main thread no boot; AuroraBackground (three.js) inicializa cedo demais
- **FCP > 1.8s** (First Contentful Paint) — provável: Google Fonts CDN ping + render-blocking CSS + SPA root vazio

6 blocos atacando cada vetor. Princípio de ouro: **zero regressão visual percebida em desktop com hardware moderno**. Cada bloco é atômico — se algum quebra alguma coisa, rollback isolado.

## Diagnóstico esperado (executar como Step 0)

**Antes de tudo**, capturar Lighthouse breakdown atual nas 3 rotas. Salvar como JSON em `dist/lighthouse-baseline-{route}.json`. Inputs: usar `pnpm exec lighthouse http://localhost:5000 --output=json --output-path=...` (Chrome headless). Isso permite priorizar — se LCP já está abaixo de 2.5s, Bloco C tem prioridade reduzida; se TBT está em 600ms, Bloco D vira prioritário.

Baseline obrigatório antes de EXECUTE iniciar — orchestrator captura inline na fase ANALYZE.

## Entity Info

N/A — entity-registry vazio.

## Files (~16)

| Path | Operação | Bloco |
|---|---|---|
| `scripts/prerender.ts` | NEW — Puppeteer-based static HTML prerender por rota | A |
| `scripts/build.ts` | edit — chamar prerender após `viteBuild()` | A |
| `server/static.ts` | edit — fallback resolution: tentar `dist/public/{route}/index.html` antes de `dist/public/index.html` | A |
| `package.json` | edit — adicionar `puppeteer` em devDeps | A |
| `client/public/fonts/Outfit-{400,600,700}.woff2` | NEW — fontes auto-hospedadas (downloads do Google Fonts em build-time ou commit direto) | B |
| `client/src/index.css` | edit — `@font-face` declarations apontando para `/fonts/...woff2`; manter fallback `system-ui` | B |
| `client/index.html` | edit — remover `<link href="...fonts.googleapis.com...">` + adicionar `<link rel="preload" as="font" href="/fonts/Outfit-400.woff2" type="font/woff2" crossorigin>` para weight crítico | B |
| `client/src/components/Hero.tsx` (ou primeira section) | edit — passar `priority` prop ao primeiro `<LazyImage>` se houver imagem de fundo | C |
| `client/index.html` | edit — adicionar `<link rel="preload" as="image" imagesrcset="..." imagesizes="...">` para LCP image (depende do que diagnóstico identificar) | C |
| `client/src/components/AuroraBackground.tsx` | edit — defer mount via `requestIdleCallback` (fallback `setTimeout(100)`) após FCP; renderizar div vazio até lá | C,D |
| `client/src/pages/Home.tsx` | edit — wrap heavy below-fold sections (WizardSection, OrbitingSkills, ClientCarousel) em `<DeferredSection>` (lazy-mount via IntersectionObserver+rootMargin) | D |
| `client/src/components/ui/deferred-section.tsx` | NEW — componente que só monta children quando aproxima do viewport (rootMargin: 200px) | D |
| `client/src/components/{WizardSection,OrbitingSkills,ClientCarousel}.tsx` | audit — confirmar que não há side-effects no module-level que rodam mesmo lazy | D |
| `vite.config.ts` | edit — `imagetools()` defaults para AVIF q=50 + WebP q=75 (atualmente default 80); adicionar `manualChunks` mais granular se diagnóstico mostrar | E |
| `client/src/components/**.tsx` que importam de `lucide-react` | audit — confirmar imports são individuais (`import { X } from "lucide-react"`); SE algum arquivo faz `import * as Icons from "lucide-react"` (improvável mas verificar), refatorar | E |
| `client/index.html` | edit — extrair critical CSS (above-fold) e inline em `<style>` no `<head>`; CSS restante carrega normal | F |
| `vite.config.ts` | edit — adicionar plugin `vite-plugin-critical` ou similar (se aprovado); OU script custom em `scripts/extract-critical-css.ts` | F |

## Boundaries

**In:** todos os paths em `## Files`.

**Out:**
- `server/index.ts`, `server/routes.ts`, `server/vite.ts` — backend já enxuto, zero mudança
- `tsconfig.json`, `.npmrc`, `tailwind.config.*` — corretos
- `client/src/index.css` (regiões além de `@font-face`) — não tocar tokens de cor/spacing
- `package.json` deps além de `puppeteer` (devDep) — sem outras adições
- JSON-LD + noscript em `client/index.html` — preservar integralmente
- Componentes shadcn em `client/src/components/ui/` — só adicionar `deferred-section.tsx`
- `usePageMeta` hook + sitemap.xml + meta-images plugin — corretos pós-Spec 4
- LazyImage component — corrigir só se diagnóstico mostrar bottleneck
- Specs em `.claude/spec/completed/`

## Dependencies

- Spec 4 (`2026-05-01-perf-seo-baseline`) `completed` (✓ confirmado)
- Branch `main` limpa antes de começar
- Ambiente Node ≥22 (engines.node alinhado pós-Spec 4 fix-loop)
- Acesso a registry para `pnpm add -D puppeteer` (~150MB Chromium download — confirmar disco antes)
- Lighthouse CLI instalado globalmente OU via `pnpm dlx lighthouse` (confirmar antes do diagnóstico)

## Tasks

### Pre-EXECUTE — Diagnóstico Lighthouse (orchestrator inline ou agent dispatch)

- [ ] `pnpm dev` num shell separado
- [ ] `pnpm dlx lighthouse http://localhost:5000 --only-categories=performance --output=json --output-path=dist/lighthouse-baseline-home.json --quiet --chrome-flags="--headless"`
- [ ] Idem para `/servicos` e `/portfolio`
- [ ] Extrair `audits.largest-contentful-paint.numericValue`, `audits.total-blocking-time.numericValue`, `audits.first-contentful-paint.numericValue`, `audits.speed-index.numericValue` de cada
- [ ] Identificar maior offender (LCP / TBT / FCP) — registrar em `## Concerns` da spec
- [ ] Ajustar prioridade dos blocos na ordem da execução real

### prerender Agent (Wave 1) — Bloco A (Static prerender)

- [ ] `pnpm add -D puppeteer` (raiz; ~150MB download)
- [ ] Criar `scripts/prerender.ts`:
  ```ts
  import puppeteer from 'puppeteer';
  import express from 'express';
  import path from 'path';
  import fs from 'fs/promises';

  const ROUTES = ['/', '/servicos', '/portfolio'];
  const PORT = 4173; // vite preview default

  // 1) start express serving dist/public
  // 2) launch puppeteer headless
  // 3) for each route: page.goto(`http://localhost:${PORT}${route}`),
  //    waitForSelector('[data-app-ready]') OR waitForNetworkIdle,
  //    extract document.documentElement.outerHTML,
  //    write to dist/public/{route_name}/index.html (root → index.html)
  // 4) close browser, kill server
  ```
- [ ] Adicionar marcador `data-app-ready="true"` no `<div id="root">` ou similar via App.tsx (set após primeira render completa, evita capturar HTML pré-hydrate)
  - Alternativa: usar `page.waitForFunction(() => document.querySelector('main') !== null, { timeout: 10000 })`
- [ ] `scripts/build.ts`: após `viteBuild()` e antes do esbuild, invocar `await prerender()`
- [ ] `server/static.ts`: modificar fallback — para `GET /servicos`, tentar primeiro `dist/public/servicos/index.html`, fallback para `dist/public/index.html` (SPA fallback). Idem `/portfolio`.
- [ ] Validar:
  - `pnpm build` gera `dist/public/index.html`, `dist/public/servicos/index.html`, `dist/public/portfolio/index.html`
  - Cada HTML tem `<title>` específico da rota (gerado pelo `usePageMeta` durante prerender)
  - `pnpm start` (ou `pnpm dev`) e abrir `/servicos` → view-source mostra HTML pronto (não `<div id="root"></div>` vazio)
  - Hidratação ainda funciona (sem warnings de mismatch no console)

**Decisão arquitetural:** prerender via Puppeteer post-build em vez de Vike/SSR-framework rewrite. Razões: (a) preserva Wouter + usePageMeta + LazyImage existentes; (b) ~100 linhas de script vs framework migration; (c) reversível (deletar script + restaurar build.ts).

### client-impl Agent (Wave 1, paralelo a prerender) — Bloco B (Self-hosted fonts)

- [ ] Identificar weights de Outfit usados no projeto: grep `font-weight:` em `client/src/index.css` + Tailwind classes `font-{light,normal,medium,semibold,bold,black}` em componentes. Tipicamente: 400 (normal), 600 (semibold), 700 (bold). Confirmar no diagnóstico.
- [ ] Download das fontes:
  - Opção A: commit direto de `client/public/fonts/Outfit-{weight}.woff2` (manual, ~30KB cada após subset)
  - Opção B: script build-time `scripts/fetch-fonts.ts` que baixa do Google Fonts CSS API (mais sustentável, mas adiciona deps)
  - **Recomendado:** Opção A com weights subsetados Latin (use `glyphhanger` ou `subset-font` para subset Latin se disco permitir; senão use full weight e aceita ~80KB por weight)
- [ ] `client/src/index.css`: adicionar no topo:
  ```css
  @font-face {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('/fonts/Outfit-400.woff2') format('woff2');
  }
  /* idem 600, 700 */
  ```
- [ ] `client/index.html`: REMOVER `<link rel="preload" as="style" href="...fonts.googleapis.com...">` + `<link rel="stylesheet" ...>` + noscript fallback do Google Fonts. ADICIONAR:
  ```html
  <link rel="preload" as="font" href="/fonts/Outfit-400.woff2" type="font/woff2" crossorigin>
  ```
  (apenas weight 400 — o crítico para FCP; outros weights carregam normal via @font-face)
- [ ] Validar:
  - Network tab: zero requests para `fonts.googleapis.com` ou `fonts.gstatic.com`
  - View-source: zero `<link>` a Google Fonts
  - Visual: tipografia idêntica
  - DevTools > Application > Fonts: Outfit listed e carregado de `/fonts/`

### client-impl Agent (Wave 2 — após Bloco B) — Bloco C (LCP optimization)

- [ ] Identificar LCP element via Lighthouse trace (campo `largest-contentful-paint-element`):
  - Se for `<img>`: priority + preload
  - Se for `<h1>` ou `<p>`: provavelmente já fast com font preload de Bloco B
  - Se for o background da Hero (CSS `background-image`): converter para `<img>` com priority
- [ ] Se LCP é image:
  - Componente da Hero/primeira section: `<LazyImage priority src={...} alt="..." />` (priority já existente em LazyImage props)
  - `client/index.html`: adicionar `<link rel="preload" as="image" href="/path-to-image.webp" type="image/webp">` ou `imagesrcset`/`imagesizes` se múltiplas resoluções
- [ ] AuroraBackground defer:
  - Modificar `useEffect` de mount: envolver em `requestIdleCallback(() => init(), { timeout: 200 })` com fallback `setTimeout(init, 100)` para Safari
  - Render placeholder div com gradient CSS estático até three.js carregar (mesma cor de fundo)
- [ ] Validar:
  - `pnpm build && pnpm start`, abrir Network tab, recarregar `/`
  - LCP image aparece nos primeiros 3 requests (devTools > Performance > LCP marker)
  - Aurora não inicializa nas primeiras 100ms (verificar via Performance trace)

### client-impl Agent (Wave 2) — Bloco D (Defer below-fold)

- [ ] Criar `client/src/components/ui/deferred-section.tsx`:
  ```tsx
  type Props = { children: React.ReactNode; rootMargin?: string };
  export function DeferredSection({ children, rootMargin = "200px" }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [shouldRender, setShouldRender] = useState(false);
    useEffect(() => {
      const io = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setShouldRender(true),
        { rootMargin }
      );
      if (ref.current) io.observe(ref.current);
      return () => io.disconnect();
    }, [rootMargin]);
    return <div ref={ref} data-testid="deferred-section">{shouldRender ? children : null}</div>;
  }
  ```
- [ ] `client/src/pages/Home.tsx`: identificar sections below-fold (provavelmente após Hero+Services breve preview):
  - WizardSection (lead capture, no fim da Home)
  - OrbitingSkills (heavy animation)
  - ClientCarousel (16 logos, marquee animation)
  - About section (se está below-fold)
  
  Wrap cada uma em `<DeferredSection>...</DeferredSection>`. NÃO wrap a primeira section visível (Hero) nem a segunda (Services preview).
- [ ] Audit imports module-level desses 3 componentes — se algum tem `const x = expensiveCalc()` no top do arquivo (fora do componente), refatorar para dentro. Side-effects module-level rodam mesmo se nunca renderizar.
- [ ] Validar:
  - `pnpm dev`, abrir DevTools > Performance, gravar load
  - Tasks longos pós-FCP devem reduzir
  - Scroll até final da página: sections aparecem sem flicker (rootMargin de 200px dá tempo de hidratar antes)
  - TBT no Lighthouse cai > 100ms vs baseline

### client-impl Agent (Wave 3) — Bloco E (Bundle audit + image quality)

- [ ] `pnpm exec vite build` com `--debug` ou `pnpm dlx vite-bundle-visualizer` para mapa do bundle
- [ ] Identificar deps inesperadamente grandes:
  - lucide-react: confirmar tree-shaking (cada `import { X } from "lucide-react"` deve trazer só o ícone)
  - radix-ui: já em chunk separado
  - Outros: relatar findings
- [ ] `vite.config.ts`: ajustar `imagetools()` defaults:
  ```ts
  imagetools({
    defaultDirectives: () => new URLSearchParams({ format: 'avif;webp;png', quality: '50;75;80' as any }),
  })
  ```
  (sintaxe exata depende da versão; web search se duvidar)
  - AVIF q=50 (de 80 default) — economia ~30%
  - WebP q=75 (de 80) — economia ~10%
  - PNG fallback q=80 (mantém)
- [ ] Validar:
  - `pnpm build` — comparar tamanhos `.avif` antes/depois (espera redução)
  - Visual: no zoom-in 100% as imagens AVIF não devem mostrar artefatos perceptíveis (q=50 é fine para fotos; pode ser low para logos com texto — verificar caso a caso)

### client-impl Agent (Wave 3) — Bloco F (Critical CSS inline)

- [ ] Decisão: plugin externo (`vite-plugin-critical`) vs script custom
  - Plugin externo: `pnpm add -D vite-plugin-critical` — usa Critical (Penthouse-based); ~50MB
  - Script custom: `scripts/extract-critical.ts` — usa Puppeteer (já adicionado em Bloco A) + página única para extrair acima-do-fold; ~80 linhas
  - **Recomendado:** script custom (reaproveita Puppeteer; controle fino sobre viewport)
- [ ] Script extrai CSS de above-fold (1280x720 viewport simulado), injeta inline em `<style>` no `<head>` do `dist/public/{route}/index.html` (após prerender de Bloco A)
- [ ] CSS principal continua carregando via `<link>` mas com `media="print" onload="this.media='all'"` (deferred)
- [ ] Validar:
  - View-source de `/`: `<style>` inline com regras de Hero/Navbar
  - Lighthouse: "Eliminate render-blocking resources" deve passar
  - Visual: zero FOUC (Flash of Unstyled Content)

### qa-run Agent (Wave 4)

- [ ] Executar AC-1..AC-9
- [ ] Capturar Lighthouse final nas 3 rotas, salvar `dist/lighthouse-final-{route}.json`, comparar com baseline
- [ ] Reportar deltas: LCP, TBT, FCP, Speed Index, Performance score por rota

## Acceptance Criteria

- [ ] AC-1: TS check zero erros — Command: `pnpm check`
- [ ] AC-2: Build OK + prerender executa — Command: `pnpm build`
- [ ] AC-3: Prerender HTML por rota existe — Command: `node -e "const fs=require('fs');const ok=['index.html','servicos/index.html','portfolio/index.html'].every(p=>fs.existsSync('dist/public/'+p));process.exit(ok?0:1)"`
- [ ] AC-4: Prerender HTML tem conteúdo (não shell vazio) — Command: `node -e "const fs=require('fs');const c=fs.readFileSync('dist/public/index.html','utf8');const ok=c.includes('<main')||c.includes('Ethos Software');console.log('home prerendered content:',ok);process.exit(ok?0:1)"`
- [ ] AC-5: Zero refs a fonts.googleapis.com em HTML/CSS produzidos — Command: `node -e "const{execSync}=require('child_process');try{execSync('grep -rn fonts.googleapis client/index.html client/src/index.css dist/public/',{stdio:'pipe'});process.exit(1)}catch(e){process.exit(e.status===1?0:2)}"`
- [ ] AC-6: Outfit fonts servidos de /fonts/ — Command: `node -e "const fs=require('fs');const ok=fs.existsSync('client/public/fonts')&&fs.readdirSync('client/public/fonts').filter(f=>f.endsWith('.woff2')).length>=3;process.exit(ok?0:1)"`
- [ ] AC-7: DeferredSection used in Home.tsx — Command: `node -e "const fs=require('fs');const c=fs.readFileSync('client/src/pages/Home.tsx','utf8');process.exit(c.includes('DeferredSection')?0:1)"`
- [ ] AC-8: Lighthouse Performance ≥ 90 nas 3 rotas — Command: `node -e "const fs=require('fs');const routes=['home','servicos','portfolio'];const scores=routes.map(r=>JSON.parse(fs.readFileSync('dist/lighthouse-final-'+r+'.json','utf8')).categories.performance.score*100);console.log(scores);process.exit(scores.every(s=>s>=90)?0:1)"`
- [ ] AC-9: LCP < 2.5s nas 3 rotas — Command: `node -e "const fs=require('fs');const routes=['home','servicos','portfolio'];const lcps=routes.map(r=>JSON.parse(fs.readFileSync('dist/lighthouse-final-'+r+'.json','utf8')).audits['largest-contentful-paint'].numericValue);console.log('LCPs (ms):',lcps);process.exit(lcps.every(l=>l<2500)?0:1)"`

### Manual Verification (operator)

Após AC-1..AC-9 PASS:
- Abrir DevTools > Network > Disable cache → reload `/` → confirmar:
  - Zero requests a `fonts.googleapis.com` / `fonts.gstatic.com`
  - LCP image entre os primeiros 5 recursos
  - Aurora não inicializa nas primeiras 200ms
- View-source `/`, `/servicos`, `/portfolio`:
  - HTML tem conteúdo (não `<div id="root"></div>` vazio)
  - `<title>` específico de cada rota
  - Critical CSS inline em `<style>` no `<head>`
- Scroll suave ao final de `/` — sections de WizardSection/OrbitingSkills/Carousel hidratam sem flicker
- Verificar `pnpm start` (production build) na porta 5000 — comportamento idêntico ao dev mas mais rápido

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Puppeteer download (~150MB) falha em rede instável | Média | `pnpm add -D puppeteer` retry; documentar em CLAUDE.md como devDep pesada; CI pode usar `puppeteer-core` + Chromium pré-instalado se necessário |
| Hidratação React 19 mismatch entre prerender e client | Média | Marcar `data-app-ready` só APÓS primeira render completa; testar com `console.warn` patch em dev para flagrar mismatches |
| Self-host fonts mostra FOUT/FOIT diferente do Google Fonts | Baixa-Média | `font-display: swap` mantém comportamento; Outfit é texto-only sem ícones especiais |
| Subset Latin perde glifo usado em algum lugar (ex: "ç", "ã", "õ") | Baixa | Subset incluir Latin Extended; testar visual em palavras como "Goiânia", "São", "ação" |
| `requestIdleCallback` não disponível em Safari iOS < 16 | Média | Fallback `setTimeout(init, 100)` já no plano |
| DeferredSection causa scroll-jank quando section monta | Baixa | `rootMargin: 200px` dá buffer; pré-allocar height via `min-height` placeholder se necessário |
| AVIF q=50 visível em logos com texto (ClientCarousel) | Média | Manter q=75 para imagens com texto; q=50 só para fotos/screenshots; ajustar via query string `?quality=75&format=...` por imagem |
| Critical CSS extraction perde regras dinâmicas (theme toggle) | Média | Critical extraído em both-themes (light + dark); ou usar fallback: critical = light + carregar CSS completo deferred |
| Server.static.ts mudança quebra SPA fallback p/ rota não-prerendered | Média | Manter fallback p/ `/index.html` quando `dist/public/{route}/index.html` não existe (não-prerendered = SPA-only) |

## Rollback

Cada bloco é atômico:
- A: `git restore scripts/build.ts server/static.ts package.json`; `pnpm remove puppeteer`; `git rm scripts/prerender.ts`; `node -e "require('fs').rmSync('dist', {recursive:true, force:true})"` para limpar prerender artifacts
- B: `git restore client/src/index.css client/index.html`; `git rm -r client/public/fonts/`
- C: `git restore client/src/components/{Hero,AuroraBackground}.tsx client/index.html`
- D: `git restore client/src/pages/Home.tsx`; `git rm client/src/components/ui/deferred-section.tsx`
- E: `git restore vite.config.ts`
- F: `git restore client/index.html scripts/build.ts`; `git rm scripts/extract-critical.ts`

## Notes

- **Decisão arquitetural — prerender approach:** Puppeteer post-build em vez de Vike/SSR rewrite. Reaproveita Wouter + usePageMeta + LazyImage existentes; ~100 linhas de script vs framework migration. Trade-off: prerender é mais lento (Puppeteer boot ~2s) mas roda só no build, não em runtime.
- **Decisão arquitetural — fonts hosting:** self-host com weights subsetados em vez de Google Fonts CDN. Trade-off: +60-200KB no repo (depende do subset) mas elimina ping a CDN externo (-100-300ms na cascata).
- **Decisão arquitetural — defer mount:** IntersectionObserver com `rootMargin: 200px` em vez de `loading="lazy"` (que só funciona para `<img>`). Trade-off: small JS overhead vs grande TBT reduction.
- **Decisão arquitetural — critical CSS:** custom Puppeteer script reaproveitando deps de Bloco A. Risco: manutenção (Critical/Penthouse libs têm suporte mais maduro). Se script ficar frágil, swap para `vite-plugin-critical` em PR de polish.
- **NÃO incluído nesta spec (out of scope, considerar para spec dedicada se necessário):**
  - Service Worker / PWA (perceived performance via cache)
  - HTTP/2 Server Push ou 103 Early Hints (depende de hosting; nosso Express simples não suporta nativamente)
  - CDN deployment (Cloudflare Pages / Vercel) — infra concern
  - Vike/SSR full migration (only se prerender não atingir 90+)
  - Long Animation Frames API monitoring (telemetria contínua)
- **Wave order:** Wave 1 paralelo (prerender + fonts são independentes) → Wave 2 paralelo (LCP + defer também independentes mas dependem de fonts pra LCP precisão) → Wave 3 paralelo (bundle + critical são independentes) → Wave 4 QA.
- **Approval Gate:** Esta spec é Full scope com 6 blocos e múltiplas decisões arquiteturais. Requer `/mustard:approve` antes de iniciar EXECUTE. Após approve, recomenda-se nova sessão Claude Code (esta sessão tem context grande pós-Specs 1-4).
