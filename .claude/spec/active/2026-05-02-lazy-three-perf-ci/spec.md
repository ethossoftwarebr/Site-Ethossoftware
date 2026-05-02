# Spec — three.js lazy-on-interaction + Lighthouse CI + per-image quality

### Status: approved
### Phase: PLAN
### Scope: full
### Checkpoint: 2026-05-02T01:00:00.000Z
### Approved: 2026-05-02T01:00:00.000Z (verbal — usuário autorizou aprovação inline para iniciar EXECUTE em sessão fresca via /mustard:resume)
### Pipeline: /mustard:feature (Full scope — 3 blocos, ~10 arquivos, novos patterns: scroll-triggered three.js, lighthouse CI workflow)
### Model: opus (Bloco 1 decisão de UX trigger + Bloco 2 setup CI; Sonnet em retries mecânicos)

## Summary

Spec 5 fechou com score mobile 52 avg (baseline 48). AC 90+ não foi atingida — bundle 1.15MB pré-gzip + createRoot CSR são limites estruturais sem migração SSR. Spec 6 ataca duas frentes complementares:

1. **three.js fora da janela LCP**: AuroraBackground hoje monta em `requestIdleCallback` (~100ms pós-LCP em mobile 4x throttle). Mover para "primeiro scroll OU 3s timeout" tira 732KB de chunk três.js da medição inicial. Esperado: +5-10 score.

2. **Lighthouse CI continuous monitoring**: Toda PR roda Lighthouse mobile+desktop nas 3 rotas, compara contra baseline JSON committed em `lighthouse-baselines/` (fora de dist/), bloqueia merge se regressão > 3 pontos. Estabelece o caminho de "sempre melhorando" que motivou esta sequência de specs.

3. **Per-image quality manual**: Imagens > 200KB no bundle (screenshots em /portfolio principalmente — várias estão em 700-860KB PNG fallback) recebem `?quality=N&format=webp` por-import. Resolve a limitação vite-imagetools v10 que travou Bloco E em Spec 5.

Princípio: cada bloco é atômico, mensurável, reversível. Nenhum requer rewrite arquitetural.

## Premissa de target

Spec 5 errou ao usar "82 → 90+" (medição desktop) como target mobile. Spec 6 usa **deltas mensuráveis vs Spec 5 baseline**:

| Métrica | Spec 5 final | Spec 6 target | Estiramento |
|---|---|---|---|
| Score avg mobile | 52 | **60+** | 70+ |
| LCP avg | 11229ms | **< 8000ms** | < 6500ms |
| TBT avg | 247ms | **< 200ms** | < 150ms |
| Mobile score variance entre rotas | 12 (45-57) | < 8 | < 5 |

Targets stretch são "se sair tudo perfeito". Targets primários são realistas e suficientes para declarar sucesso.

## Entity Info

N/A — entity-registry vazio.

## Files (~10)

| Path | Operação | Bloco |
|---|---|---|
| `client/src/components/AuroraBackground.tsx` | edit — substituir `requestIdleCallback` por scroll-trigger + 3s timeout fallback | 1 |
| `lighthouse-baselines/baseline-{home,servicos,portfolio}.json` | NEW — committed baselines (fora de dist/) | 2 |
| `.lighthouserc.json` | NEW — Lighthouse CI config (mobile + desktop, 3 rotas, budgets) | 2 |
| `.github/workflows/lighthouse-ci.yml` | NEW — CI workflow rodando lhci em PRs | 2 |
| `package.json` | edit — adicionar `@lhci/cli` em devDeps + script `perf:check` | 2 |
| `scripts/extract-baseline.cjs` → `scripts/perf-baseline.cjs` | rename + edit — escreve em `lighthouse-baselines/` em vez de `dist/` | 2 |
| `scripts/compare-lighthouse.cjs` | edit — lê de `lighthouse-baselines/` em vez de hardcoded values | 2 |
| `client/src/components/{Hero,...,Portfolio}.tsx` | audit — identificar imagens > 200KB importadas; adicionar `?quality=` por-import | 3 |
| `client/src/data/projects.ts` | edit (provável) — projetos do portfolio têm refs de imagens | 3 |
| `client/.gitignore` ou root `.gitignore` | edit (se necessário) — garantir `dist/` ignorado mas `lighthouse-baselines/` versionado | 2 |

## Boundaries

**In:** todos os paths em `## Files`.

**Out:**
- server/**, vite.config.ts, tsconfig.json — backend e build config corretos
- client/src/components/AuroraBackground.tsx (regiões além do trigger logic) — preservar three.js init, fallback WebGL, cleanup
- DeferredSection, prerender, fonts — todos corretos pós-Spec 5
- main.tsx, App.tsx — `createRoot` + lazy() ficam (hydrateRoot é Spec 7 condicional)
- Specs em `.claude/spec/completed/`

## Dependencies

- Spec 5 (`2026-05-02-lighthouse-90-plus`) `completed-partial` (✓ confirmado)
- Branch `main` no estado pós-Spec 5
- Lighthouse devDep já instalado pós-Spec 5 (~190MB) — reusado pelo @lhci/cli
- GitHub Actions habilitado no repo (assumido — verificar antes de Bloco 2)
- Node ≥22

## Tasks

### Pre-EXECUTE — Verificar GitHub Actions disponível

- [ ] Confirmar repo tem `.github/` ou criar
- [ ] Confirmar permissions do GITHUB_TOKEN para statuses + comments em PR (default OK em repos públicos; pode requerer ajuste em privados)

### client-impl Agent (Wave 1) — Bloco 1 (three.js lazy-on-interaction)

- [ ] Identificar event triggers candidatos em `AuroraBackground.tsx`:
  - **Primary**: `window.addEventListener('scroll', initOnce, { once: true, passive: true })`
  - **Fallback timeout**: `setTimeout(initOnce, 3000)` — para usuários que não rolam (fallback dignity)
  - **Mobile**: `touchstart` evento (iOS Safari não dispara `scroll` em alguns casos antes de gesto explícito)
- [ ] Reescrever a lógica de mount:
  ```ts
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let initialized = false;

    const initOnce = () => {
      if (initialized || cancelled) return;
      initialized = true;
      init().then((fn) => {
        if (cancelled) {
          fn?.();
          return;
        }
        cleanup = fn;
      });
    };

    const onScroll = () => initOnce();
    const onTouch = () => initOnce();
    window.addEventListener('scroll', onScroll, { once: true, passive: true });
    window.addEventListener('touchstart', onTouch, { once: true, passive: true });
    const timeout = window.setTimeout(initOnce, 3000);

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouch);
      window.clearTimeout(timeout);
      cleanup?.();
    };
  }, []);
  ```
- [ ] Manter placeholder div (gradient CSS) idêntico ao atual — sem flicker visual
- [ ] Validar manual: abrir `pnpm start`, recarregar `/`, ver Network tab — `three-*.js` chunk NÃO baixa imediatamente; baixa só após scroll/touch/3s
- [ ] Validar Lighthouse: rodar `node scripts/perf-baseline.cjs` (após Bloco 2) — confirmar score sobe ≥ +5 em `/`

### library Agent / general-purpose (Wave 1, paralelo) — Bloco 2 (Lighthouse CI)

- [ ] `pnpm add -D @lhci/cli` (já depende de lighthouse instalado)
- [ ] Criar `lighthouse-baselines/` (NEW directory) — committed
- [ ] Renomear `scripts/extract-baseline.cjs` → `scripts/perf-baseline.cjs`; alterar paths para `lighthouse-baselines/baseline-{route}.json`
- [ ] Atualizar `scripts/compare-lighthouse.cjs` — ler de `lighthouse-baselines/` em vez de hardcoded
- [ ] Rodar `pnpm exec node scripts/perf-baseline.cjs` para gerar baselines committed (NÃO os destrói por build)
- [ ] Criar `.lighthouserc.json`:
  ```json
  {
    "ci": {
      "collect": {
        "url": ["http://localhost:5000/", "http://localhost:5000/servicos", "http://localhost:5000/portfolio"],
        "numberOfRuns": 3,
        "settings": { "preset": "desktop" }
      },
      "assert": {
        "assertions": {
          "categories:performance": ["error", { "minScore": 0.50 }],
          "first-contentful-paint": ["warn", { "maxNumericValue": 4000 }]
        }
      }
    }
  }
  ```
  + variant para mobile preset (ou rodar lhci 2x — desktop e mobile)
- [ ] Criar `.github/workflows/lighthouse-ci.yml`:
  ```yaml
  name: Lighthouse CI
  on: [pull_request]
  jobs:
    lhci:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: '22' }
        - uses: pnpm/action-setup@v3
        - run: pnpm install --frozen-lockfile
        - run: pnpm build
        - run: pnpm start &
        - run: |
            timeout 30 sh -c 'until curl -sf http://localhost:5000/ > /dev/null; do sleep 1; done'
        - run: pnpm exec lhci autorun --config=.lighthouserc.json
        - run: pnpm exec node scripts/compare-lighthouse.cjs
  ```
- [ ] Adicionar script `package.json`: `"perf:check": "node scripts/perf-baseline.cjs && node scripts/compare-lighthouse.cjs"`
- [ ] Validar: PR de teste roda lhci, comenta resultado, bloqueia se score < 50

### client-impl Agent (Wave 2) — Bloco 3 (Per-image quality)

- [ ] Identificar imagens > 200KB no `dist/public/assets/` pós-build atual:
  ```bash
  node -e "const fs=require('fs'); const d='dist/public/assets'; fs.readdirSync(d).filter(f=>f.match(/\\.(png|webp|avif)$/)).map(f=>({f,size:fs.statSync(d+'/'+f).size})).filter(x=>x.size>200000).sort((a,b)=>b.size-a.size).forEach(x=>console.log(Math.round(x.size/1024)+'KB',x.f))"
  ```
- [ ] Para cada imagem grande (esperado: ~10-15 imagens, principalmente screenshots em `/portfolio` e Hero em `/`):
  - Identificar onde é importada (`client/src/data/projects.ts` ou diretamente em components)
  - Adicionar `?quality=60&format=avif;webp;png` (ou ajuste fino conforme conteúdo: q=50 para fotos, q=70 para logos com texto)
- [ ] Validar:
  - `pnpm build` — `dist/public/assets` tamanhos comparados (esperar redução total ~30-40%)
  - Visual: zoom-in 100% em screenshots — sem artefatos visíveis em q=60 AVIF
  - Logos: confirmar q ≥ 70 (texto requer qualidade alta)

### qa-run Agent (Wave 3)

- [ ] Executar AC-1..AC-7
- [ ] Capturar Lighthouse final, comparar com Spec 5 final via `node scripts/compare-lighthouse.cjs`
- [ ] Reportar deltas vs Spec 5 final + vs Spec 5 baseline (cumulative)

## Acceptance Criteria

- [ ] AC-1: TS check zero erros — Command: `pnpm check`
- [ ] AC-2: Build OK — Command: `pnpm build`
- [ ] AC-3: three.js chunk NÃO baixa em `/` antes de scroll/touch/3s — Command: `node scripts/diagnose-three-lazy.cjs` (NEW — puppeteer abre `/`, monitora network, confirma `three-*.js` request inicia só após event)
- [ ] AC-4: `lighthouse-baselines/` tem 3 JSONs (home, servicos, portfolio) — Command: `node -e "const fs=require('fs');const ok=['home','servicos','portfolio'].every(r=>fs.existsSync('lighthouse-baselines/baseline-'+r+'.json'));process.exit(ok?0:1)"`
- [ ] AC-5: `.lighthouserc.json` valido (lhci consegue parsear) — Command: `pnpm exec lhci healthcheck` (ou similar — verificar API)
- [ ] AC-6: Workflow YAML valido — Command: `node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/lighthouse-ci.yml','utf8'))"` (precisa instalar js-yaml? OU validar via gh actions check)
- [ ] AC-7: Lighthouse score avg ≥ 60 — Command: `node -e "const fs=require('fs');const r=['home','servicos','portfolio'].map(x=>JSON.parse(fs.readFileSync('dist/lighthouse-final-'+x+'.json','utf8')).categories.performance.score*100);console.log('scores:',r,'avg:',(r.reduce((a,b)=>a+b,0)/3));process.exit(r.reduce((a,b)=>a+b,0)/3>=60?0:1)"`
- [ ] AC-8: TBT avg < 200ms — Command: similar pattern, audit `total-blocking-time.numericValue`
- [ ] AC-9: Total bundle de imagens em /portfolio reduzido ≥ 30% vs Spec 5 — Command: comparar `du -sh dist/public/assets/*portfolio*` antes/depois (operator manual)

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| three.js lazy quebra primeira impressão visual | Baixa | Placeholder gradient CSS já idêntico ao Aurora final color |
| Scroll trigger não dispara em iOS Safari sem gesto | Média | `touchstart` listener + 3s timeout fallback |
| Lighthouse CI workflow falha em CI Linux (Chrome headless setup) | Média | `actions/setup-chrome@v1` ou usar lighthouse's bundled chrome |
| @lhci/cli + lighthouse versions desalinhados | Baixa | Pinning ambas em devDeps |
| Per-image quality regrediu fidelidade visual | Média | Testar manualmente em zoom 100%; ajuste por-imagem se necessário |
| Branch protection rules não permitem block-on-lhci sem manual setup | Média | Documentar setup como "post-spec manual step" se aparecer |
| Three.js lazy faz Aurora não montar em desktop estático (sem scroll) | Média | 3s timeout cobre; alternativamente trigger em mousemove (desktop) |

## Rollback

- Bloco 1: `git restore client/src/components/AuroraBackground.tsx`
- Bloco 2: `git rm .lighthouserc.json .github/workflows/lighthouse-ci.yml lighthouse-baselines/*.json scripts/perf-baseline.cjs`; `pnpm remove @lhci/cli`; restore `scripts/extract-baseline.cjs scripts/compare-lighthouse.cjs`
- Bloco 3: `git restore client/src/data/projects.ts client/src/components/`

## Notes

- **Decisão arquitetural — three.js trigger**: scroll-or-touch + 3s timeout em vez de IntersectionObserver no próprio Hero. Razão: Hero já está visível no LCP window — IO dispararia imediatamente, anulando o ponto. Scroll/touch é o sinal de "usuário engajou", momento natural pra carregar visual.
- **Decisão arquitetural — Lighthouse CI**: rodar tanto mobile quanto desktop. Mobile é o stress test honesto; desktop reflete experiência da maioria dos usuários reais. Budget mobile permissivo (50+) inicialmente — sobe progressivamente com novas iterations.
- **Decisão arquitetural — per-image quality**: por-import em vez de plugin. Permite tuning fino (q=50 para fotos, q=70 para logos com texto). Mantém vite-imagetools simples.
- **NÃO incluído nesta spec (out of scope, considerar para Spec 7 se necessário):**
  - SSR full migration (Vike) — Spec 7 condicional
  - hydrateRoot — Spec 7 (mesma frente)
  - Service Worker / PWA
  - CDN deployment
  - Critical CSS inline
  - HTTP/2 push / Early Hints
- **Wave order:** Wave 1 paralelo (Bloco 1 + Bloco 2 são independentes — três.js trigger é client; CI é infra). Wave 2 (Bloco 3 depende de baselines do Bloco 2 já instalados pra medir delta). Wave 3 QA.
- **Approval Gate:** Esta spec é Full scope com 3 blocos e decisões pequenas. Recomenda-se `/mustard:approve` antes de iniciar EXECUTE. Sessão atual tem context grande — recomendado nova sessão Claude Code via `/mustard:resume`.
