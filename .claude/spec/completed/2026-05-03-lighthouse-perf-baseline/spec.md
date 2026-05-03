# Spec 9 — Lighthouse Perf Baseline + Port-Clean Comparison (Spec 3/4 da migração)

### Status: completed
### Phase: CLOSE
### Scope: full
### Checkpoint: 2026-05-03T20:05:00.000Z
### Closed: 2026-05-03T20:05:00.000Z (review APPROVED root + components, QA overall=pass, AC-3 PASS, AC-4 aspiracional CONCERN deferred Spec 10)
### Approved: 2026-05-03T18:45:00.000Z (via /mustard:approve)
### Pipeline: /mustard:feature (Full scope — extensão de infra perf existente)
### Model: sonnet (refactor mecânico de scripts já validados em Spec 5/6 + AC pattern já estabelecido em Spec 6)

## Summary

Spec 3 de 4 que executam migração Astro. Mede performance de site-ethos-astro/ (Astro :4321) vs baseline client/ (:5000) em paridade — "port-clean comparison". Reusa **3 scripts perf existentes** (refactor para param-aware: `run-lighthouse-mobile.cjs`, `compare-lighthouse.cjs`, `perf-baseline.cjs`) + LHCI infra existente. Commita baselines em `lighthouse-baselines/` (convenção existente do projeto).

**Princípio zero-risco preservado**: client/ continua intocado em código. Scripts ganham env vars com defaults backward-compat (sem env = comportamento Spec 6 = client :5000). site-ethos-astro/ source code está fechado por Spec 8 — só aceita ajuste pontual SE Astro Image API ou config impactar perf.

## Roadmap completo (Specs 7-10)

| Spec | Status | Escopo |
|---|---|---|
| **Spec 7** | ✓ closed (`pass_with_concerns`) | Bootstrap Astro + foundation completa + Home POC |
| **Spec 8** | ✓ closed (review APPROVED, 3W+4N concerns) | Pages /servicos + /portfolio + /404 + OrbitingSkills |
| **Spec 9** (esta) | draft | Lighthouse CI port-clean + perf baseline Astro vs client + scripts perf reaproveitados |
| **Spec 10** | pendente | Cutover (archive branch + delete client/server/shared + Astro vira raiz) + sync-detect/registry rerun + final QA |

## Premissa de target — IMPORTANTE

**Conflito reconciliado entre pedido do usuário e memory `project_perf_target_realistic.md`:**

A memory documenta que Spec 5 (client React SPA) chegou a ceiling estrutural ~52-60 mobile, e diz **"em specs futuras de perf, usar deltas vs baseline atual como AC, nunca números absolutos"**. Isso foi escrito no contexto pré-Astro. Astro muda algumas das causas raízes (CSR completo → SSG, Suspense fallback → islands independentes, hydration mismatch React #418 → HTML estático). Bundle JS persiste (three.js + radix), mas com -10% delta validado em Spec 7.

**Resolução híbrida — 2 camadas de AC:**

| Camada | Critério | Tipo | Bloqueia close? |
|---|---|---|---|
| Primária | Astro avg score ≥ client avg score (delta ≥ 0 em todas pages medidas) | regression gate | sim — bloqueia |
| Aspiracional | Astro avg score mobile ≥ 90 (Performance) | aspiracional | não — vira CONCERN com plano para Spec 10/pós-cutover |

A camada primária honra a memory (deltas). A aspiracional honra o pedido do usuário sem prometer o que Spec 5 mostrou ser inviável. Se Astro entregar ≥ 90 → ótimo, validado empiricamente. Se entregar 60-89 → ainda close-pass se delta ≥ 0, mas Spec 10 ou pós-cutover ganha tarefa documentada (ex: Astro Image API conf, code splitting per-island granular).

| Critério | Target |
|---|---|
| Scripts perf existentes refatorados (env-aware) sem regressão para client | sim |
| 4 pages medidas em Astro :4321 (`/`, `/servicos`, `/portfolio`, `/404`) | sim |
| 3 pages medidas em client :5000 (`/`, `/servicos`, `/portfolio`) — `/404` N/A em SPA Wouter | sim |
| Baselines committed em `lighthouse-baselines/baseline-astro-{page}.json` (NEW path) + `lighthouse-baselines/baseline-{page}.json` (existente, client) | sim |
| Astro avg score ≥ client avg score (regression gate primário) | obrigatório |
| Astro avg score mobile ≥ 90 (aspiracional informativo) | concern se falhar |
| Bundle JS inicial Astro ≤ client (manter delta Spec 7: -59KB / -10%) | sim |
| AC-4 herdada Spec 8 (lazy three.js diagnose em Astro /servicos) PASS | sim |
| `.github/workflows/lighthouse-ci.yml` roda port-clean (Astro :4321) em PR | sim |
| client/, server/, shared/ intocados | sim |

## Inventário (~7-10 files)

### Modify (refactor backward-compat — Spec 6 ACs preservadas)

| Arquivo | Mudança | Risco |
|---|---|---|
| `scripts/run-lighthouse-mobile.cjs` | Adicionar suporte a `LH_PORT`, `LH_ROUTES` (csv), `LH_OUT_DIR` env vars; defaults preservam comportamento atual (client :5000, 3 routes, dist/) | Médio — testar com Spec 6 invocation |
| `scripts/compare-lighthouse.cjs` | Adicionar suporte a `LH_BASELINE_DIR`, `LH_FINAL_DIR`, `LH_ROUTES` env; default preserva comportamento atual; suporte a comparison cross-baseline (astro vs client baselines) | Médio — Spec 6 AC-7/AC-9 hardcoded checks devem continuar funcionando para client run |
| `scripts/perf-baseline.cjs` | Idem env-aware (a confirmar via inspeção; assumir refactor similar) | Baixo |
| `.lighthouserc.json` | Atualizar URLs para usar env var `LH_BASE_URL` (ou fork em `.lighthouserc.astro.json`); preset mobile (atualmente desktop) | Médio — decisão arquitetural Bloco C |
| `.github/workflows/lighthouse-ci.yml` | Adicionar job port-clean: build site-ethos-astro/ + start preview :4321 + run Lighthouse → assert delta ≥ 0 vs baseline; manter job client (legacy) ou migrar | Alto — mudança CI, decisão Bloco C |
| `package.json` (root) | Adicionar scripts: `perf:lh:client`, `perf:lh:astro`, `perf:compare:cross`, `perf:baseline:astro` | Baixo |

### NEW (committed)

| Arquivo | Conteúdo | Origem |
|---|---|---|
| `lighthouse-baselines/baseline-astro-home.json` | Lighthouse mobile run de Astro :4321 / | gerado em Bloco D |
| `lighthouse-baselines/baseline-astro-servicos.json` | idem /servicos | Bloco D |
| `lighthouse-baselines/baseline-astro-portfolio.json` | idem /portfolio | Bloco D |
| `lighthouse-baselines/baseline-astro-404.json` | idem /404 | Bloco D |

### Conditional (só se Astro Image API impactar Perf < 90)

| Arquivo | Mudança | Trigger |
|---|---|---|
| `site-ethos-astro/astro.config.mjs` | Confirmar `image.service: passthrough` ou `sharp` config; adicionar se ausente | Spec 7 carry-over apontou Lighthouse Perf 28 sem Astro Image API config — verificar antes de medir |

### Out (intocados)

- `client/`, `server/`, `shared/`, root configs não-perf
- ~~`site-ethos-astro/src/**` (estrutura fechada por Spec 8)~~ — **REVISADO 2026-05-03T19:25Z**: T3 Bloco D revelou CLS regression load-bearing (servicos -16, portfolio -10) causada por decorative blob em `ServicesPageContent.tsx` + `PortfolioPageContent.tsx`. Carve-out perf-driven aprovado pelo usuário (Option A). Boundary expandida para fix CLS pontual nesses 2 components. Resto de `site-ethos-astro/src/**` continua intocado.
- Cutover, delete client/server/shared, mover Astro pra raiz — Spec 10
- Mudanças visuais — proibido (CLS fix deve ser visualmente idêntico — só `contain`/`transform` CSS hints)

## Concerns

<!-- CONCERN 2026-05-03T19:19Z (T3 Bloco D measurement): -->
- **AC-3 primary FAIL inicial**: home +8 OK, servicos -16 FAIL, portfolio -10 FAIL. Root cause: CLS=1.027/1.023 (decorative blob `div.absolute top-[40%] right-[-5%] w-[500px] h-[500px]`) hydrate-shift no `client:load`. Decisão usuário (Option A): fix CSS pontual (contain/transform layer) em Spec 8 components → re-mede.
- **404 route methodology**: `astro preview` serve real HTTP 404 em `/random-404-test` (não custom `/404.html`). Decisão usuário (multi-select): hit `/404.html` direto + marcar 404 N/A no cross-compare (precedent client SPA Wouter).
- **AC-4 Spec 8 herdada**: `diagnose-three-lazy.cjs` false-FAIL — script procura `/assets/three-*.js` mas Astro emite `/_astro/three.module.*.js`. Decisão usuário: patch script path detection (cross-stack /_astro/ + /assets/).

## Boundaries

**In:**
- `scripts/run-lighthouse-mobile.cjs` (modify)
- `scripts/compare-lighthouse.cjs` (modify)
- `scripts/perf-baseline.cjs` (modify, conditional)
- `.lighthouserc.json` (modify)
- `.github/workflows/lighthouse-ci.yml` (modify)
- `package.json` (modify — scripts only)
- `lighthouse-baselines/baseline-astro-{home,servicos,portfolio,404}.json` (new)
- `site-ethos-astro/astro.config.mjs` (conditional, only if Image API gap diagnosed)

**Out:**
- `client/`, `server/`, `shared/`
- `site-ethos-astro/src/**`
- Cutover (Spec 10)

## Dependencies

- Spec 7 (`2026-05-02-migracao-astro`) closed ✓
- Spec 8 (`2026-05-03-astro-pages-restantes`) closed ✓ — 4 pages presentes em site-ethos-astro/
- Spec 6 (`2026-05-02-lazy-three-perf-ci`) — scripts perf base, AC pattern (delta gate); preservar backward-compat
- Lighthouse v13 (ESM-only — pattern dynamic import já estabelecido)
- chrome-launcher (já instalado)
- @lhci/cli (já instalado)
- sharp (vite-imagetools já depende; reuso para Astro Image API se necessário)

## Tasks

### Bloco A — Refactor scripts param-aware (Wave 1)

**Agente: general-purpose**

- [x] Read os 3 scripts (`run-lighthouse-mobile.cjs`, `compare-lighthouse.cjs`, `perf-baseline.cjs`) inteiramente para mapear constantes hardcoded.
- [x] Refactor `run-lighthouse-mobile.cjs`: aceitar env vars `LH_PORT` (default 5000), `LH_ROUTES` (csv "home,servicos,portfolio", default mantém Spec 6), `LH_OUT_DIR` (default dist/), `LH_OUT_PREFIX` (default "lighthouse-final"). Backward-compat: invocação sem env = comportamento idêntico Spec 6. **Note**: `404` route maps to `/random-404-test` (Risk register Astro catch-all).
- [x] Refactor `compare-lighthouse.cjs`: aceitar env vars `LH_BASELINE_DIR` (default "lighthouse-baselines"), `LH_BASELINE_PREFIX` (default "baseline"), `LH_FINAL_DIR` (default "dist"), `LH_FINAL_PREFIX` (default "lighthouse-final"), `LH_ROUTES`. Adicionar modo cross-baseline (`LH_BASELINE_PREFIX="baseline"` + `LH_FINAL_PREFIX="baseline-astro"` compara client vs astro). Preservar AC-7/AC-9 Spec 6 quando env vazio. **Note**: cross-mode lê AMBOS de `lighthouse-baselines/` via `LH_FINAL_DIR=lighthouse-baselines`.
- [x] Refactor `perf-baseline.cjs` analogamente (env-aware). **Note**: `/ 3` hardcoded substituído por `/ routeCount` para correctness.
- [x] Smoke run com env vazio (client :5000) → confirmar saídas idênticas a Spec 6.
- [x] Smoke run com `LH_PORT=4321` (sem servidor — espera erro de conexão) → confirmar param flow OK (não crash de undefined).
- [x] Atualizar `package.json` scripts: adicionar `perf:lh:client` (sem env), `perf:lh:astro` (env LH_PORT=4321 + LH_ROUTES=home,servicos,portfolio,404 + LH_OUT_PREFIX=lighthouse-astro), `perf:compare:cross` (env LH_BASELINE_PREFIX=baseline + LH_FINAL_PREFIX=baseline-astro). **Note**: `cross-env@^10.1.0` já em devDependencies; `perf:baseline:astro` adicionado também.

### Bloco B — Astro Image API audit (Wave 2 — gate condicional)

**Agente: general-purpose**

- [x] Read `site-ethos-astro/astro.config.mjs` — verificar `image.service` config. **Result**: linhas 17-19 já contêm `image: { service: { entrypoint: 'astro/assets/services/sharp' } }` (Spec 7 setup).
- [x] Se `image.service` ausente OU `passthrough` (não otimiza): adicionar `image: { service: { entrypoint: 'astro/assets/services/sharp' } }` (sharp já é dep transitiva de vite-imagetools — confirmar via package.json site-ethos-astro/). **N/A** — config já correta.
- [x] Se já configurado corretamente (Sharp default Astro 6): pular bloco — flag como "skipped, already optimal" no return. **GATE DECISION**: skipped, already optimal. Zero files changed.
- [x] Rebuild `pnpm --dir site-ethos-astro build` e confirmar dist/ não regrediu (size). **Result**: build exit 0, 8.67s, 4 pages, dist/_astro JS = 1,282 KB (referência AC-5).

### Bloco C — Lighthouse infra port-clean (Wave 2, paralelo a Bloco B)

**Agente: general-purpose**

- [x] Update `.lighthouserc.json`: trocar `preset: desktop` para `preset: mobile`; URLs como env-driven (`LHCI_TARGET_BASE` ou similar) OU forking para `.lighthouserc.astro.json` separado (decisão: forking é mais explícito, manter dois arquivos). **Done**: linha 12 preset mobile.
- [x] Criar `.lighthouserc.astro.json`: URLs `http://localhost:4321/{,servicos,portfolio,404}`, preset mobile, numberOfRuns: 3, assertions: `categories:performance >= 0.50` (mesmo Spec 6) + assertion adicional `categories:accessibility >= 0.90` (Astro tem chance real de Acc 90+). **Done**: 4 URLs (path catch-all `/random-404-test`), preset mobile, runs 3, assertions performance≥0.50 + accessibility≥0.90.
- [x] Update `.github/workflows/lighthouse-ci.yml`: adicionar job `lighthouse-astro` que (a) `pnpm --dir site-ethos-astro build`, (b) `pnpm --dir site-ethos-astro preview &` (background, espera 5s), (c) `LH_PORT=4321 LH_ROUTES=home,servicos,portfolio,404 LH_OUT_PREFIX=lighthouse-astro pnpm perf:lh:astro`, (d) `pnpm perf:compare:cross` para regression gate. Manter job client legado. **Done**: job lighthouse-astro paralelo (no `needs: lhci`), curl-wait :4321 30s timeout, timeout-minutes 20, `if: always()` no compare step. Job lhci client preservado.
- [x] Smoke local: `pnpm perf:lh:astro` (com Astro preview rodando local) → gerar `dist/lighthouse-astro-{4 pages}.json`. **Documented for Bloco D** (não executado aqui — responsabilidade T3).

### Bloco D — Baselines + measure + commit (Wave 3)

**Agente: general-purpose**

- [x] **Client baseline run** (refresh): com client/ dev rodando `:5000`, executar `pnpm perf:lh:client` para regenerar `dist/lighthouse-final-{home,servicos,portfolio}.json` (3 pages — /404 N/A em SPA Wouter). Copiar para `lighthouse-baselines/baseline-{page}.json` (sobrescrever existentes — refresh com versão atual do client/). **Result**: home=46, servicos=53, portfolio=47.
- [x] **Astro baseline run**: com Astro preview rodando `:4321` (`pnpm --dir site-ethos-astro preview`), executar `pnpm perf:lh:astro` → `dist/lighthouse-astro-{4 pages}.json`. Copiar para `lighthouse-baselines/baseline-astro-{page}.json` (NEW). **Result post fix-loop**: home=55, servicos=79, portfolio=80, 404=100.
- [x] **Compare**: `pnpm perf:compare:cross` → relatório de deltas Astro vs client per-page + avg. **Result**: home +9, servicos +26, portfolio +33 (404 N/A precedent SPA).
- [x] **AC primary check**: avg score Astro ≥ avg score client em todas 3 pages comuns (home/servicos/portfolio). Se sim → AC-3 PASS. **PASS** — todos deltas ≥ 0 (média +23 pts pós fix-loop CLS).
- [x] **AC aspiracional check**: avg score Astro ≥ 90? **CONCERN** — avg=71.3 (home 55 puxa pela Aurora/Three.js bundle). Documentado para Spec 10/pós-cutover (não bloqueia close).
- [x] **AC-4 Spec 8 herdada**: `node scripts/diagnose-three-lazy.cjs http://localhost:4321/servicos` exit 0. **PASS** — `/_astro/three.module.CuzN0wor.js` detectado (T3-FIX-B regex cross-stack), threeRequests_beforeInteraction=0, afterScroll=1.
- [x] **Commit baselines**: stage e commit os 4 NEW + 3 refreshed baseline files (separadamente do code change para histórico claro). **Done** — commit `3c8bedf` (7 baseline files only; T3-FIX-A/B code changes pendentes para /complete).

### qa-run Agent (Wave QA)

- [x] Executar AC-1..AC-N (definidos abaixo) — qa-run.js overall=pass, 4/4 ACs pass (AC-1/-2/-3/-5).
- [x] Bundle size delta JS inicial Astro vs client (verificar manter -10% Spec 7) — AC-5 PASS (Astro ≤ client).
- [x] Reportar concerns de paridade ou regression — § Concerns inline (CLS fix-loop, 404 N/A precedent, AC-4 aspiracional 71.3 < 90 deferred Spec 10, AC-7 CI deferred to first PR).

## Acceptance Criteria

> **Notas qa-run**: cada AC abaixo termina exatamente no fechamento de backtick para parse correto pelo `qa-run.js` (regex `Command: \`...\`$`). Comentários explicativos ficam ANTES do bullet ou em sub-bullet indented (não parseado). AC-6 herdada e AC-4/AC-7 aspiracionais ficam em § Deferred (não rodam via qa-run; status documentado por execução em Bloco D).

- [x] AC-1: Scripts perf refatorados sem regressão Spec 6 (env-aware sem syntax error) — Command: `node -c scripts/run-lighthouse-mobile.cjs && node -c scripts/compare-lighthouse.cjs && node -c scripts/perf-baseline.cjs`
- [x] AC-2: Astro baselines presentes (4 arquivos) — Command: `node -e "['home','servicos','portfolio','404'].every(p=>require('fs').existsSync('lighthouse-baselines/baseline-astro-'+p+'.json'))?process.exit(0):process.exit(1)"`
- [x] AC-3: Astro avg score ≥ client avg score (regression gate primário cross-baseline) — Command: `pnpm perf:compare:cross`
- [x] AC-5: Bundle JS inicial Astro ≤ client (manter -10% delta Spec 7) — Command: `node -e "const fs=require('fs');const path=require('path');const sumJs=d=>{const r=(p,acc=0)=>fs.statSync(p).isDirectory()?fs.readdirSync(p).reduce((a,f)=>r(path.join(p,f),a),acc):(p.endsWith('.js')?acc+fs.statSync(p).size:acc);return r(d)};const a=sumJs('site-ethos-astro/dist/_astro');const c=sumJs('dist/public/assets');process.stdout.write('astro='+a+' client='+c+' delta='+(a-c));process.exit(a<=c?0:1)"`

### Deferred (não-runnable em qa-run — evidence-by-execution em Bloco D)

- **AC-6 (AC-4 herdada Spec 8 — diagnose three lazy)**: Requires Astro preview running. Status: PASS evidenced T3 fix-loop run via `node scripts/diagnose-three-lazy.cjs http://localhost:4321/servicos` exit 0 (`/_astro/three.module.CuzN0wor.js` lazy detected).
- **AC-4 (aspiracional Astro avg score ≥ 90 mobile)**: Informativo. T3 fix-loop measured avg=71.3 → CONCERN (Spec 10/pós-cutover bundle work). Não bloqueia close.
- **AC-7 (CI workflow port-clean)**: validação real só em PR/push triggering Actions. Local dry-run não disponível (`act` não instalado). DEFERRED para primeiro PR pós-merge.

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Refactor de `compare-lighthouse.cjs` quebra AC-7/AC-9 hardcoded de Spec 6 (client run) | Alta | Bloco A step "Smoke run com env vazio" valida backward-compat antes de avançar |
| Astro `:4321` colide com env PORT em CI (server expressa porta 5000 default) | Baixa | Astro preview default :4321 é diferente de server :5000; LH_PORT=4321 explícito |
| `/404` no Astro tem peculiaridade de routing — Lighthouse pode hit '/non-existent-${ts}' antes de catch-all | Baixa | Spec 8 T3 dev smoke validou 404 catch-all com title correto; baseline run deve hit '/random-404-test' literal |
| Astro Image API config gap → Lighthouse Perf < 60 (Spec 7 carry-over previu Perf 28) | Média | Bloco B audit pré-medição; ajuste pontual aceito apenas se este gap diagnosticado |
| Bundle size delta inverso (Astro > client) por mudanças de Spec 8 (lift-and-shift completo, mais code total) | Baixa | Spec 7 mediu -10% com Home only; Spec 8 adicionou ServicesPageContent (462L) + PortfolioPageContent (254L) → delta pode estreitar; AC-5 valida que ainda ≤ client. Se falhar, Bloco B pode ajudar via Image API. |
| Spec 5 ceiling ~52-60 mobile pode persistir em Astro porque three.js + radix continuam carregados | Alta | É exatamente porque AC primário é "delta ≥ 0", não "≥ 90". AC aspiracional vira CONCERN documentado se falhar. |
| `pnpm perf:compare:cross` modo é semanticamente diferente do compare-lighthouse Spec 6 (que compara baseline-X vs final-X same-prefix) | Média | Bloco A step explícito sobre cross-mode (`LH_BASELINE_PREFIX` ≠ `LH_FINAL_PREFIX`); precisa garantir que cross-mode lê de `lighthouse-baselines/` em ambos os lados, não de `dist/` |
| GitHub Actions workflow Linux paths vs Windows local dev (caminhos relativos) | Média | Sempre paths relativos a repo root nos scripts; testar workflow em PR antes de merge |

## Rollback

Antes do cutover Spec 10:
- Revert env-aware refactor: `git checkout HEAD~N -- scripts/run-lighthouse-mobile.cjs scripts/compare-lighthouse.cjs scripts/perf-baseline.cjs .lighthouserc.json .github/workflows/lighthouse-ci.yml package.json`
- `rm lighthouse-baselines/baseline-astro-*.json`
- `rm .lighthouserc.astro.json` (se criado)
- client/ e site-ethos-astro/ source intocados — sem rollback necessário

## Notes

- **Approval Gate**: Esta spec exige `/mustard:approve` antes de EXECUTE (mesmo padrão Spec 7/8).
- **Decisão arquitetural — AC dual (regression gate + aspiracional)**: reconcilia memory `project_perf_target_realistic.md` (deltas como AC primário) com pedido do usuário (≥ 90). Honra ambos. Documentado em § Premissa.
- **Decisão arquitetural — fork `.lighthouserc.astro.json`**: dois arquivos é mais explícito que env interpolation em LHCI config; mantém legibilidade.
- **Decisão arquitetural — backward-compat scripts**: env vars com defaults preservam Spec 6 client invocations. Zero risco para AC-7/AC-9 já validados.
- **Carry-over de Spec 7**: bundle JS inicial -59KB / -10% mantém-se como referência. AC-5 valida.
- **Carry-over de Spec 8**: AC-4 herdada (lazy three.js) revalida em Astro :4321.
- **Convenção lighthouse-baselines/**: o usuário pediu `.lighthouse-baselines.json` (single file) mas convenção do projeto é `lighthouse-baselines/baseline-{route}.json` (per-page). Spec adota convenção existente — discutir em /mustard:approve se preferência diferente.
- **Pós-Spec 9**: Spec 10 cutover desbloqueado se AC primário (delta ≥ 0) PASS. AC aspiracional (≥ 90) que falhe vira tarefa pós-cutover, não bloqueia Spec 10.
- **Cutover único permanece em Spec 10**: nenhuma alteração no plano original.
