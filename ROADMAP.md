# ROADMAP — Site Ethossoftware

> Diagnóstico de engenharia sênior + plano de evolução. Análise estrutural, de renderização, design/UX, acessibilidade e SEO, alinhada às práticas de mercado de 2026 (Astro 6/7, Core Web Vitals INP, WCAG 2.2 AA, JSON-LD/AI-SEO).
>
> **Gerado por:** `/scan --full -enrich` + auditoria multi-agente (performance · arquitetura · design/UX/a11y · pesquisa de mercado).
> **Data:** 2026-07-12 · **Stack:** Astro 6.2.1 (static) · React 19 islands · Tailwind v4 · framer-motion · Three.js · Vercel serverless.

> **Atualização em 2026-09-08:** P0-01 a P0-07 e a fundação de qualidade P1-01 a P1-03 foram implementados na branch `site-audit-roadmap-p0-03`. `pnpm validate` está verde (Astro/TypeScript, Biome, 8 testes e build), e o build gera o sitemap. As metas numéricas de Lighthouse e a inspeção visual/teclado continuam pendentes: o Chrome do Windows não abriu corretamente via WSL e o navegador Linux do Puppeteer não foi instalado por completo. O scorecard abaixo permanece como baseline anterior, não como medição do código atual.

| Spec | Implementação | Validação restante |
| --- | --- | --- |
| P0-01 CLS | Concluída | Lighthouse e inspeção visual |
| P0-02 LCP SSR | Concluída | Lighthouse e inspeção visual |
| P0-03 código morto | Concluída no commit `7f394fc` | Nenhuma |
| P0-04 dados de Services | Concluída | Nenhuma além de revisão visual |
| P0-05 SEO técnico | Concluída | Rich Results Test após deploy |
| P0-06 hidratação | Concluída para as rotas previstas | Lighthouse/TBT após deploy |
| P0-07 acessibilidade | Correções críticas concluídas | Auditoria manual e Lighthouse a11y |
| P1-01 a P1-03 | Vitest, CI e Biome concluídos | Ativar proteção da branch no GitHub |

---

## 1. Sumário Executivo

O site é **tecnicamente bem fundado** — pipeline de imagens responsivas (AVIF/WebP) correto, Three.js corretamente code-split e deferido, TypeScript em modo `strict`, validação zod + allowlist na API de chat. A arquitetura de islands é a escolha certa.

Porém, para um site que é o **cartão de visitas de uma software house**, há três classes de problema que impedem a "experiência grandiosa" e a qualidade de sistema pretendidas:

| #   | Problema-âncora                                | Evidência                                                                                     | Impacto                                                                     |
| --- | ---------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | **Home com Perf 0.55 e CLS 0.676**             | `lighthouse-baselines/baseline-home.json`; blobs decorativos em `src/pages/index.astro:35-38` | Primeira impressão ruim, penalidade de ranking, layout "pulando"            |
| 2   | **Código morto com número de WhatsApp ERRADO** | `WhatsAppWizard.tsx:17` (`5562994826949`) ≠ resto do site (`556294667304`)                    | Risco de lead vazar para número inexistente se reativado; 433 linhas mortas |
| 3   | **Zero fundação de qualidade**                 | sem testes, sem CI, sem lint, sem structured data, sem sitemap                                | Regressões silenciosas; invisibilidade em SEO/AI                            |

**Recomendação:** executar as ondas **P0 (Fundação & Primeira Impressão)** antes de qualquer feature nova. São majoritariamente correções cirúrgicas de alto impacto e baixo custo.

---

## 2. Scorecard Atual

### Core Web Vitals (Lighthouse mobile, mediana de 3 runs — `lighthouse-baselines/`)

| Rota      | Perf    | LCP  | INP-proxy (TBT) | CLS          | Meta 2026                         |
| --------- | ------- | ---- | --------------- | ------------ | --------------------------------- |
| **home**  | 🔴 0.55 | 4.2s | 200ms           | 🔴 **0.676** | LCP ≤2.5s · CLS <0.1 · INP <200ms |
| servicos  | 🟡 0.79 | 3.8s | 260ms           | 🟢 0.005     |                                   |
| portfolio | 🟡 0.80 | 3.8s | 260ms           | 🟢 0         |                                   |
| 404       | 🟢 1.00 | 1.4s | 0ms             | 🟢 0         |                                   |

### Maturidade de Engenharia

| Dimensão                  | Estado                                              | Nota |
| ------------------------- | --------------------------------------------------- | ---- |
| TypeScript                | `strict` ativo, ~0 `any` reais                      | 🟢   |
| Testes automatizados      | **nenhum**                                          | 🔴   |
| CI/CD                     | **nenhum workflow**                                 | 🔴   |
| Lint/Format               | **nenhuma config**                                  | 🔴   |
| Design tokens             | tokens existem mas **370 hex hardcoded** os ignoram | 🔴   |
| Acessibilidade (WCAG 2.2) | várias falhas AA (foco, motion, semântica)          | 🔴   |
| SEO técnico               | sem JSON-LD, sem sitemap, sem robots                | 🔴   |
| Segurança API             | zod + allowlist ✅ / sem rate-limit, sem timeout    | 🟡   |
| Otimização de imagem      | pipeline AVIF/WebP correto                          | 🟢   |
| Code-splitting (Three.js) | deferido corretamente                               | 🟢   |

---

## 3. Diagnóstico Detalhado por Dimensão

### 3.1 Renderização & Performance

- **[P0] CLS 0.676 na home** — 4 blobs decorativos com `top`/`right` em **porcentagem** relativos ao `<main>` (`index.astro:35-38`). Como `<main>` cresce conforme 10 islands `client:visible` montam progressivamente + 39 imagens lazy, os blobs "saltam". Causa única de quase todo o CLS.
- **[P0] LCP escondido atrás de JS** — o H1/parágrafo do Hero está dentro de `motion.div initial={{opacity:0}}` (`Hero.tsx:138-141`), SSR-renderizado invisível; só aparece após React+framer-motion hidratarem (`renderDelay` ~2s do LCP de 4.2s).
- **[P1] Sobre-hidratação** — `/servicos` e `/portfolio` hidratam a página inteira como um único `client:load` (`servicos.astro:18`, `portfolio.astro:18`), ao contrário da home que escalona `visible`/`idle` corretamente. O `404.astro:17` hidrata um card estático sem interatividade.
- **[P1] framer-motion é o maior custo de JS** — 20 arquivos importam `motion` (chunk `proxy` = 122KB). A maioria são reveals de scroll simples (não precisam de spring physics) → candidatos a CSS + IntersectionObserver.
- **[P1] Fontes sem preload** — 5 pesos `@font-face` (Outfit) em `global.css:4-37`, nenhum `<link rel=preload>` no `Layout.astro`. Considerar fonte variável (1 request vs 5).
- **[P1] `src/assets` = 17MB** — 8 PNGs-fonte >1MB (`service-ai.png` 1.57MB etc.). Comprimir na origem antes do pipeline.
- **[✅ positivo]** Three.js (`AuroraBackground.tsx:198-221`) faz `import("three")` sob demanda + pausa RAF via IntersectionObserver; fora do caminho crítico. Pipeline de imagens `<picture>` AVIF→WebP→PNG com `width/height` (CLS-safe).

### 3.2 Arquitetura & Qualidade de Código

- **[P0] `WhatsAppWizard.tsx` (433 linhas) = código morto com número errado** — não importado em lugar algum; duplica `WizardSection.tsx` com cópias inline dos dados e `WHATSAPP_NUMBER` divergente (`5562994826949` vs `556294667304`).
- **[P1] `WizardContext.tsx` = código morto** — `WizardProvider`/`useWizard` nunca usados.
- **[P1] Duplicação de conteúdo em Services** — `ServicesHome.tsx:19` e `ServicesPage.tsx:35` mantêm cada um seu próprio `const services=[...]`, **já divergentes** em taxonomia. Portfolio faz certo (fonte única `src/data/projects.ts`).
- **[P0] Zero testes + zero CI** — nenhum `*.test.*`, nenhum runner, nenhum `.github/workflows`. Único gate é `astro check` manual.
- **[P1] Sem lint/format** — nenhum ESLint/Biome/Prettier. A deriva dos Services é sintoma disso.
- **[P1] API `/api/chat` sem rate-limit nem timeout** — `fetch` à Anthropic (`chat.ts:65`) sem `AbortController`; endpoint sem throttle por IP (risco de queimar budget).
- **[P2]** `nanoid` dependência não usada · sem `.env.example` · `typescript: "^6.0.3"` (verificar se não é typo de `^5.x`).

### 3.3 Design, UX & Acessibilidade

- **[P0] 370 ocorrências de hex de marca hardcoded** (`#A229F2`/`#BA66F2`/`#531B8C`) em 20/23 componentes, ignorando `--primary` (`global.css:75`). Rebrand/tema exige find-replace global.
- **[P0] Zero `useReducedMotion`** — parallax, loops infinitos e pings ignoram `prefers-reduced-motion` (WCAG 2.3.3). Risco vestibular.
- **[P0] FAQ remove indicador de foco** — `FAQ.tsx:78` usa `focus:outline-none` sem `focus-visible:ring` (WCAG 2.4.7). Teclado fica sem foco visível.
- **[P1] Sheet mobile sem `SheetTitle`** — `Navbar.tsx:235` (`hideClose`) → Radix Dialog sem nome acessível; leitor de tela recebe diálogo sem rótulo.
- **[P1] Wizard sem semântica de seleção** — grupos single-select como `<button>` puros, sem `role=radiogroup`/`aria-pressed`; progress bar sem `role=progressbar`; label do passo `hidden sm:block` (mobile sem rótulo textual).
- **[P2] CTAs do Hero idênticas** — "Começar Meu Projeto" e "Falar com Especialista" abrem a mesma URL (`Hero.tsx:174-192`), via `<button onClick=window.open>` em vez de `<a href>`.
- **[P2]** "Close" em inglês (`ui/sheet.tsx:72`) num site pt-BR.
- **[✅ positivo]** WizardSection é um mecanismo de conversão forte (perfilamento progressivo → mensagem WhatsApp pré-preenchida), acima do "site de agência genérico".

### 3.4 SEO Técnico

- **[P0] Nenhum structured data** — zero JSON-LD. Falta `Organization`/`LocalBusiness` (com `sameAs`, `logo`, contato) e `FAQPage` (conteúdo já existe em `FAQ.tsx:10-43`). Em 2026, JSON-LD também alimenta citações em AI Overviews (ChatGPT/Perplexity).
- **[P0] Sem `sitemap.xml` e sem `robots.txt`** — `public/` só tem favicons e fontes; `@astrojs/sitemap` não instalado; `site:` já configurado mas não aproveitado.
- **[P1] OG/canonical frágeis** — bloco OG só renderiza `{ogImage && ...}` (`Layout.astro:26-40`); sem imagem/descrição default → página que esquecer de passar `ogImage` perde todo o Open Graph.

### 3.5 Contexto de Mercado 2026 (aplicado)

- **CWV:** LCP ≤2.5s · **INP <200ms** (substituiu FID) · CLS <0.1, no p75 de usuários reais. Instrumentar **Vercel Speed Insights** (RUM), não confiar só em Lighthouse lab.
- **Astro:** static-first é a postura recomendada; **server islands (`server:defer`)** para fragmentos personalizados/lentos (ideal para o widget de chat); **View Transitions** (`<ClientRouter />`) já estáveis; `astro:assets` + CSP estável no Astro 6.
- **React 19:** React Compiler 1.0 (obsoleta `useMemo`/`useCallback` manuais); Actions para forms. Cuidado: **estado não cruza islands** — compartilhar via URL/cookies/eventos.
- **Acessibilidade:** WCAG 2.2 AA é baseline (EAA em vigor na UE desde jun/2025).
- **Vercel:** adapter serverless + `edgeMiddleware`; Speed Insights/Analytics nativos.

_(Fontes completas registradas na auditoria: Astro docs/blog, web.dev, Google Search Central, React blog, Vercel docs.)_

---

## 4. Specs Priorizadas

> Cada spec segue o formato mustard (pronta para virar `/feature`, `/bugfix` ou `/task`). `AC` = Acceptance Criteria. Esforço em pontos relativos (S ≤2h · M ≤1 dia · L >1 dia).

### 🔴 ONDA P0 — Fundação & Primeira Impressão (fazer primeiro)

#### SPEC-P0-01 — Corrigir CLS 0.676 da home _(bugfix, S)_

- **Objetivo:** CLS da home < 0.1.
- **Escopo:** `src/pages/index.astro:35-38` — reposicionar os 4 blobs decorativos de `top/right` percentuais para unidades fixas (vh/px) ou `position: fixed` / container com `contain: layout`.
- **AC:** (1) `pnpm build` ok; (2) `pnpm perf:lh` → home CLS < 0.1; (3) inspeção visual: blobs não deslocam ao carregar seções.

#### SPEC-P0-02 — Tornar o LCP do Hero visível no SSR _(bugfix, S)_

- **Objetivo:** eliminar `renderDelay` do texto principal.
- **Escopo:** `Hero.tsx:138-141` — `initial={false}` (ou animação via CSS `@starting-style`/keyframe) para o H1/parágrafo já virem visíveis no HTML.
- **AC:** (1) HTML SSR do H1 sem `opacity:0`; (2) `pnpm perf:lh` → home LCP melhora (meta ≤2.5s combinada com P0-06); (3) sem regressão visual.

#### SPEC-P0-03 — Remover código morto e reconciliar número de WhatsApp _(bugfix, S)_

- **Objetivo:** eliminar risco de lead perdido + reduzir superfície.
- **Escopo:** apagar `src/components/WhatsAppWizard.tsx` e `src/context/WizardContext.tsx`; remover dep `nanoid`; auditar que **um único** número (`556294667304`) exista no código.
- **AC:** (1) `grep -rn "5562994826949\|WhatsAppWizard\|useWizard" src` → vazio; (2) `grep -rn "nanoid" src package.json` → vazio; (3) build ok.

#### SPEC-P0-04 — Fonte única de dados de Services _(feature Light, M)_

- **Objetivo:** acabar com a deriva de conteúdo.
- **Escopo:** criar `src/data/services.ts` (tipado, padrão de `projects.ts`); refatorar `ServicesHome.tsx` e `ServicesPage.tsx` para consumir dela.
- **AC:** (1) nenhum `const services = [` inline nos componentes; (2) mesma lista renderiza em ambas as telas; (3) `astro check` ok.

#### SPEC-P0-05 — SEO técnico base: JSON-LD + sitemap + robots _(feature Light, M)_

- **Objetivo:** visibilidade em busca e AI.
- **Escopo:** `@astrojs/sitemap` no `astro.config.mjs`; `public/robots.txt` apontando o sitemap; bloco `Organization` + `FAQPage` (JSON-LD) no `Layout.astro`/página relevante a partir do conteúdo de `FAQ.tsx`; imagem/descrição OG default no `Layout.astro`.
- **AC:** (1) build gera `/sitemap-index.xml`; (2) `public/robots.txt` presente; (3) JSON-LD valida no Rich Results Test; (4) toda página tem OG mesmo sem passar `ogImage`.

#### SPEC-P0-06 — Escalonar hidratação (servicos/portfolio/404) _(bugfix, S/M)_

- **Objetivo:** reduzir TBT/INP dessas rotas.
- **Escopo:** em `servicos.astro`/`portfolio.astro` aplicar o padrão da home (`Navbar client:load`, conteúdo principal `client:load`, listas `client:visible`, `Footer`/`WhatsAppButton` `client:idle`); converter `404` para markup `.astro` puro (sem island).
- **AC:** (1) build ok; (2) `pnpm perf:lh` → TBT servicos/portfolio < 200ms; (3) 404 sem chunk JS de island.

#### SPEC-P0-07 — Acessibilidade crítica (foco, motion, diálogo) _(bugfix, S/M)_

- **Objetivo:** eliminar falhas WCAG 2.2 AA de maior severidade.
- **Escopo:** `FAQ.tsx:78` add `focus-visible:ring-2 ring-ring ring-offset-2`; `useReducedMotion()` nos loops/parallax/pings (Hero, WhatsAppButton, WizardSection) + override `prefers-reduced-motion` em `global.css`; `SheetTitle` sr-only no `Navbar.tsx:235`; traduzir "Close"→"Fechar" em `ui/sheet.tsx:72`.
- **AC:** (1) Lighthouse a11y ≥ 95 nas 4 rotas; (2) navegação por teclado mostra foco em FAQ e nav; (3) com "reduzir movimento" do SO, loops infinitos param.

---

### 🟡 ONDA P1 — Qualidade de Sistema & Robustez

#### SPEC-P1-01 — Fundação de testes (Vitest) _(feature, M)_

- **Escopo:** Vitest; testes unitários de `lib/wizard-message.ts` (`buildMessage`) e dos schemas zod de `chat.ts`; script `pnpm test`.
- **AC:** `pnpm test` verde com ≥ 6 casos cobrindo caminhos felizes e de borda.

#### SPEC-P1-02 — CI no GitHub Actions _(feature, S/M)_

- **Escopo:** workflow em PR: `astro check` + lint + `pnpm test` + `pnpm build`.
- **AC:** workflow roda em PR e bloqueia merge em falha.

#### SPEC-P1-03 — Lint/Format (Biome ou ESLint+Prettier) _(feature, S)_

- **Escopo:** config + `pnpm lint`/`pnpm format`; rodar no CI (P1-02).
- **AC:** `pnpm lint` sem erros; regra que barra hex de marca hardcoded (ver P1-06) opcional.

#### SPEC-P1-04 — Endurecer `/api/chat` _(feature Light, M)_

- **Escopo:** `AbortController` (timeout ~15s) no fetch; rate-limit por IP/sessão (Vercel KV/Upstash token bucket); logging estruturado de taxa de erro.
- **AC:** (1) requisição lenta aborta com fallback gracioso; (2) N+1 requests/janela → 429; (3) erros logados com contexto.

#### SPEC-P1-05 — Reduzir custo de framer-motion _(feature, L)_

- **Escopo:** substituir reveals de scroll (maioria dos 20 usos) por IntersectionObserver + toggle de classe CSS; manter framer-motion só onde há gesto/layout real.
- **AC:** (1) chunk `proxy` sai do caminho crítico das rotas estáticas; (2) TBT home < 150ms; (3) sem regressão visual das animações.

#### SPEC-P1-06 — Design tokens: eliminar hex hardcoded _(feature, L)_

- **Escopo:** tokens `--primary`/`--accent-light`/`--accent-dark`/`--whatsapp`; migrar 370 ocorrências para `text-primary`/`bg-primary`/gradientes tokenizados; presets de type-scale (h1/h2/h3).
- **AC:** (1) `grep -rn "#A229F2\|#BA66F2\|#531B8C" src/components` → 0; (2) troca de tema por variável reflete em todo o site.

#### SPEC-P1-07 — Preload de fontes / fonte variável _(bugfix, S)_

- **Escopo:** `<link rel=preload as=font>` para pesos above-the-fold no `Layout.astro`; avaliar Outfit variável (1 request).
- **AC:** fontes above-the-fold sem FOUT perceptível; requests de fonte reduzidos.

#### SPEC-P1-08 — Comprimir assets de origem _(task, S)_

- **Escopo:** comprimir os 8 PNGs >1MB em `src/assets/images/` antes do pipeline; confirmar que todos usam `?as=picture`.
- **AC:** `du -sh src/assets` reduzido significativamente; nenhuma `<img>` servindo PNG cru.

---

### 🟢 ONDA P2 — Diferenciação & Experiência "Grandiosa"

#### SPEC-P2-01 — Vercel Speed Insights + Analytics (RUM) _(feature, S)_

- **AC:** CWV reais (INP/LCP/CLS) visíveis no dashboard Vercel, segmentados por device.

#### SPEC-P2-02 — View Transitions (`<ClientRouter />`) _(feature, M)_

- **Escopo:** navegação SPA-like entre páginas com transições suaves (estável em 2026).
- **AC:** transição sem flash entre home/servicos/portfolio; sem regressão de CWV.

#### SPEC-P2-03 — Chat EthosIA como server island _(feature, M)_

- **Escopo:** avaliar `server:defer` / carregar o widget só na primeira interação, tirando o bundle do caminho de todas as páginas.
- **AC:** rotas sem o bundle do chat até interação; chat funcional.

#### SPEC-P2-04 — Diferenciar CTAs & atribuição de leads _(feature Light, S)_

- **Escopo:** Hero primário → Wizard (lead qualificado), secundário → WhatsApp direto; mensagens `wa.me` com parâmetro de origem para atribuição; CTAs como `<a href>`.
- **AC:** cada ponto de entrada gera mensagem rastreável distinta; CTAs são âncoras (middle-click/nova aba).

#### SPEC-P2-05 — Semântica acessível do Wizard _(feature, M)_

- **Escopo:** `role=radiogroup`/`aria-checked` nos grupos single-select; `role=progressbar` + `aria-valuenow`; rótulo de passo visível no mobile.
- **AC:** leitor de tela anuncia opções e progresso; Lighthouse a11y mantém ≥ 95.

#### SPEC-P2-06 — `llms.txt` (aposta de baixo custo) _(task, S)_

- **Escopo:** `public/llms.txt` descrevendo empresa/serviços para descoberta por agentes/LLMs.
- **AC:** arquivo servido em `/llms.txt`. _(Expectativa de impacto SEO clássico: baixa.)_

---

## 5. Sequenciamento Sugerido

```
Semana 1 (P0 — cirúrgico, alto impacto):
  P0-03 (código morto) → P0-01 (CLS) → P0-02 (LCP) → P0-06 (hidratação) → P0-07 (a11y) → P0-05 (SEO) → P0-04 (dados services)
  Resultado esperado: home Perf 0.55 → ~0.85+, CLS <0.1, a11y ≥95, indexável.

Semana 2 (P1 — blindar o sistema):
  P1-03 (lint) → P1-01 (testes) → P1-02 (CI)   [gate de qualidade]
  P1-04 (API) · P1-07/P1-08 (fontes/assets)

Semana 3+ (P1/P2 — refino e diferenciação):
  P1-06 (tokens) → P1-05 (framer-motion)   [maiores, fazer com testes já no lugar]
  P2-01 (RUM) → medir → P2-02/03/04/05
```

**Regra de ouro:** não iniciar P1-05/P1-06 (refactors grandes) **antes** de P1-01/P1-02 (testes + CI) — sem rede de segurança, refactor de 370 ocorrências e de 20 componentes é arriscado.

---

## 6. Como executar

Cada spec pode ser despachada pelo pipeline mustard:

```
/mustard:bugfix   # P0-01, P0-02, P0-03, P0-06, P0-07, P1-07
/mustard:feature  # P0-04, P0-05, P1-01..06, P2-*
/mustard:task     # P1-08, P2-06
```

Os detalhes de convenção de cada camada estão nas skills geradas pelo scan: `site-astro-page-pattern`, `site-react-island-pattern`, `site-motion-section-pattern`, `site-ui-primitive-pattern`, `site-cn-utility-pattern` — e nos guards em `.claude/commands/guards.md`.
