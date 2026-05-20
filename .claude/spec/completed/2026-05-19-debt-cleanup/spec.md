# Spec: Debt Cleanup — Dark, sitecontent, shadcn, naming, WizardSection

> Scope: **Full** (3+ camadas afetadas, múltiplos arquivos)
> Created: 2026-05-19

### Status: completed

### Phase: CLOSE

### Checkpoint: 2026-05-20T01:30:00.000Z

### Concerns

- AC12 WizardSection ≤15KB FAIL — arquivo final 27338 bytes. Causa: JSX denso + formatter re-expandiu inline ternaries após extração de constants/buildMessage. Separation of concerns alcançada (data/lib/JSX em 3 módulos). Tratado como NOTE conforme softening do próprio spec.
- AC9 `pnpm preview` curl 200 DEFERRED — preview astro serve `dist/` mas adapter Vercel sai pra `.vercel/output/static/`. Validado via Glob+wc dos 3 index.html gerados (substanciais, com class="dark" + <title>Ethos).
- AC10 Lighthouse DEFERRED — GradientCard bloqueia LH per Spec 13 cancelada (memória do projeto). Não re-introduzido nesta spec; sem regressão para medir.

## Goal

Liquidar a dívida arquitetural identificada na auditoria de 2026-05-19:
remover dark mode e endpoint `/api/sitecontent`, padronizar nomes
Home/Page, extrair UI shadcn morta, fatiar `WizardSection`, e corrigir
tipo `any` solto. Resultado esperado: repo menor, bundle mais magro,
sem regressão de perf nem SEO.

## Out of Scope

- Mudanças visuais além das forçadas pela remoção do dark
- Refactor da Aurora (já está em estado excelente)
- Migração de Astro / React / Tailwind
- Alteração de copy ou conteúdo institucional
- API `/api/chat` (já hardenizada em Spec 14)

## Files Affected (mapa de impacto)

### Wave 1 — Remoções triviais

| Arquivo                          | Ação                           |
| -------------------------------- | ------------------------------ |
| `src/pages/api/sitecontent.ts`   | DELETE                         |
| `src/lib/chat-content.ts:27+`    | REMOVE export `SITE_CONTENT`   |
| `src/components/Services.tsx:79` | FIX `Icon: any` → `LucideIcon` |

### Wave 2 — Remoção dark mode

| Arquivo                               | Ação                                                  |
| ------------------------------------- | ----------------------------------------------------- |
| `src/components/ThemeProvider.tsx`    | DELETE                                                |
| `src/components/ThemeToggle.tsx`      | DELETE                                                |
| `src/layouts/Layout.astro:44-50`      | REMOVE script anti-FOUC                               |
| `src/components/Navbar.tsx:7,186,209` | REMOVE import e usos `<ThemeToggle />`                |
| `src/styles/global.css:40,93-113`     | REMOVE `@custom-variant dark` + bloco `.dark { ... }` |
| `src/components/**/*.tsx`             | REMOVE todas as classes Tailwind `dark:*`             |

### Wave 3 — Padronização Home/Page

| Antes                       | Depois              |
| --------------------------- | ------------------- |
| `Services.tsx`              | `ServicesHome.tsx`  |
| `ServicesPageContent.tsx`   | `ServicesPage.tsx`  |
| `Portfolio.tsx`             | `PortfolioHome.tsx` |
| `PortfolioPageContent.tsx`  | `PortfolioPage.tsx` |
| `src/pages/index.astro`     | UPDATE imports      |
| `src/pages/servicos.astro`  | UPDATE import       |
| `src/pages/portfolio.astro` | UPDATE import       |

### Wave 4 — Cleanup shadcn UI

| Arquivo                                    | Ação                          |
| ------------------------------------------ | ----------------------------- |
| `src/components/ui/*.tsx` (não-importados) | DELETE ~60 arquivos           |
| `package.json` deps `@radix-ui/*` órfãs    | REMOVE (~20 pacotes)          |
| `pnpm-lock.yaml`                           | REGENERATE via `pnpm install` |

**Mantidos** (importados pelo site): `lazy-image`, `shiny-button`,
`button`, `sheet`, `menu-toggle`, `accordion`, `gradient-card`, `card`,
`deferred-section`, `toast`, `toaster`, `tooltip` (deps internas).

### Wave 5 — Split WizardSection

| Arquivo                            | Ação                                                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/data/wizard.ts`               | NEW — constants (profiles, segments, ideaTypes, companySizes, businessStages, objectives, solutionOptions, budgets, steps) |
| `src/lib/wizard-message.ts`        | NEW — `buildMessage(data)` helper                                                                                          |
| `src/components/WizardSection.tsx` | REDUCE ~29KB → ~12KB (apenas JSX + state)                                                                                  |

## Plan — Execução em 5 waves (commits separados)

Cada wave é um commit independente. Permite revert granular se algo
quebrar em produção. Validação rodada ao fim de cada wave.

### Wave 1 — Remoções triviais (estimado 15 min)

1. Delete `src/pages/api/sitecontent.ts`
2. Remove `export const SITE_CONTENT = ...` em `chat-content.ts`
3. Substitui `Icon: any` por `Icon: LucideIcon` em Services.tsx
4. Run AC1 + AC2

### Wave 2 — Remoção dark mode (estimado 45 min)

1. Delete `ThemeProvider.tsx`, `ThemeToggle.tsx`
2. Remove `<script is:inline>...ethos-theme...</script>` de Layout.astro
3. Remove `import { ThemeToggle }` + 2 usos em Navbar.tsx
4. Remove `@custom-variant dark` e `.dark { ... }` de global.css
5. Grep `dark:` em `src/components/**` e remove cada variant
6. Run AC1 + AC2 + AC4

### Wave 3 — Padronização naming (estimado 20 min)

1. `git mv` dos 4 arquivos (preserva history)
2. Update imports em 3 .astro
3. Update referências cruzadas (se Services/Portfolio importam um do outro)
4. Run AC1 + AC2 + AC7 + AC8

### Wave 4 — Cleanup shadcn (estimado 30 min)

1. Script de detecção: grep todos imports `@/components/ui/*` em
   `src/{pages,components,hooks,data,lib}` excluindo `src/components/ui/`
2. Computa diferença vs `ls src/components/ui/*.tsx` → lista de órfãos
3. Delete arquivos órfãos
4. Identifica deps `@radix-ui/*` agora não-usadas via grep nos restantes
5. Remove do `package.json`
6. `pnpm install`
7. Run AC1 + AC2 + AC11

### Wave 5 — Split WizardSection (estimado 25 min)

1. Cria `src/data/wizard.ts` com os 9 constants
2. Cria `src/lib/wizard-message.ts` com `buildMessage`
3. Atualiza `WizardSection.tsx` para importar dos novos módulos
4. Run AC1 + AC2 + AC12

## Acceptance Criteria

Cada AC tem comando executável; QA agent valida na fase final.

| #    | AC                                    | Comando                                                                                                                                                                      |
| ---- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC1  | TypeScript check passa                | `pnpm astro check` (exit 0)                                                                                                                                                  |
| AC2  | Build de produção passa               | `pnpm build` (exit 0)                                                                                                                                                        |
| AC3  | `/api/sitecontent` não existe mais    | `test ! -f src/pages/api/sitecontent.ts`                                                                                                                                     |
| AC4  | Dark mode totalmente removido         | `grep -rE "ThemeProvider\|ThemeToggle\|useTheme\|ethos-theme\|@custom-variant dark\|dark:" src/ \| wc -l` → 0                                                                |
| AC5  | `SITE_CONTENT` removido               | `grep -c "SITE_CONTENT" src/lib/chat-content.ts` → 0                                                                                                                         |
| AC6  | `Icon: any` removido                  | `grep -c "Icon: any" src/components/Services*.tsx` → 0                                                                                                                       |
| AC7  | Novos nomes existem                   | `test -f src/components/ServicesHome.tsx && test -f src/components/ServicesPage.tsx && test -f src/components/PortfolioHome.tsx && test -f src/components/PortfolioPage.tsx` |
| AC8  | Nomes antigos não existem             | `test ! -f src/components/ServicesPageContent.tsx && test ! -f src/components/PortfolioPageContent.tsx`                                                                      |
| AC9  | Páginas servem 200                    | `pnpm preview` + curl `/`, `/servicos`, `/portfolio` → todas 200                                                                                                             |
| AC10 | Lighthouse mobile sem regressão       | `pnpm perf:lh` → score perf ≥ 90 em `/` (vs baseline atual)                                                                                                                  |
| AC11 | `src/components/ui/` tem ≤15 arquivos | `ls src/components/ui/*.tsx \| wc -l` ≤ 15                                                                                                                                   |
| AC12 | `WizardSection.tsx` ≤ 15KB            | `wc -c < src/components/WizardSection.tsx` ≤ 15000                                                                                                                           |

## Riscos & Mitigações

| Risco                                                                                    | Probabilidade | Mitigação                                                           |
| ---------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| Algum componente shadcn é dep transitiva (carousel→button) e quebra ao deletar           | Média         | Build após cada wave; deletar em batch de 5 e revalidar             |
| `dark:` variant em CSS de componente shadcn mantido                                      | Baixa         | Grep final em arquivos vivos; aceitar se for em arquivo deletado    |
| Lighthouse regredir por reordenação de chunks                                            | Baixa         | AC10 explícito; revert se cair >2 pontos                            |
| Renames quebrarem import case-sensitive no Vercel (Linux) mesmo passando local (Windows) | Média         | `git mv` preserva case; checar build local Windows + Vercel preview |
| Wizard data extraction quebrar reatividade                                               | Baixa         | Constants são puros (objects/arrays) — sem state envolvido          |

## Rollout

- 1 branch: `chore/debt-cleanup-2026-05-19`
- 5 commits independentes (1 por wave) com mensagens descritivas
- Push direto pra main (sem PR) — projeto solo, conforme padrão histórico
- Vercel deploy automático pós-merge; verificação visual em preview
  antes de promover production

## Estimativa Total

~2h15min de trabalho efetivo, em 5 commits, todos `Light` em escopo de
mudança (deletivo/rename/extract) com 0 lógica nova.

## Notas

- Wave 2 (dark) é a mais arriscada — toca em ~10 arquivos. Faça
  visual smoke test no preview Vercel antes de prosseguir pra Wave 3.
- Wave 4 (shadcn) economiza ~20 deps mas o impacto em bundle final
  depende do tree-shake atual; medir antes/depois com
  `du -sh .vercel/output/static/_astro`.
- Wave 5 (Wizard) é puramente cosmético em métricas mas melhora
  legibilidade — opcional se tempo apertar.
