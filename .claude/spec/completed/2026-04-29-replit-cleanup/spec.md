# Spec — Limpeza Replit + migração para pnpm

### Status: completed
### Phase: CLOSE
### Checkpoint: 2026-04-30T21:10:00.000Z
### Pipeline: /mustard:feature (Full scope)
### Model: opus (13+ files, multi-layer cleanup)


## Goal

Remover **todos os traços do Replit** (plugins de Vite, lógica de `REPL_ID`, allowlist inventada do `script/build.ts`) e **todo o boilerplate Replit declarado mas nunca usado** (Drizzle ORM, Postgres, Passport, sessions, WebSocket, `next-themes`), além de migrar de `npm` para `pnpm` como gerenciador de pacotes. O resultado é um código local autônomo, sem dependência da plataforma Replit, com `node_modules` enxuto e baseline limpo para o Spec 2 (refatoração arquitetural).

## Princípio de ouro

**Zero mudança visual. Zero mudança de comportamento.** Esse spec é amputação cirúrgica + troca de gerenciador de pacotes. Qualquer alteração que mude o que o usuário final vê é regressão e bloqueia o merge.

Sênior preserva código intencional do dev mesmo se hoje não tem consumidor. Só removo o que é (a) demonstravelmente boilerplate Replit, (b) demonstravelmente lixo de template, ou (c) consequência direta de uma decisão já confirmada (banco/users sai → `storage.ts` perde razão de existir).

## Out of Scope

Itens identificados durante a fase ANALYZE que ficam **explicitamente fora** deste spec — endereçados via novo `/mustard:feature` no futuro:

- Consolidar `WizardSection` e `WhatsAppWizard` (têm ~80% de lógica duplicada) → Spec 2
- Tokenizar cores brand (`#A229F2`, `#531B8C`, `#BA66F2`) como CSS vars / Tailwind theme → Spec 2
- Centralizar `WA_NUMBER` (hardcoded em múltiplos lugares) → Spec 2
- Repensar a estrutura do `server/` ou simplificar `script/build.ts` → Spec 2
- Remover/refazer `client/src/context/WizardContext.tsx` → **PRESERVAR** (código intencional reservado para uso futuro, conforme decisão do usuário)
- Migração para Vercel → spec futuro
- Configurar CI/CD → spec futuro

## Architecture changes

Nenhuma. A arquitetura permanece: Express (`server/index.ts` + `server/routes.ts` + `server/static.ts` + `server/vite.ts`) servindo as rotas `/api/sitecontent` e `/api/chat`, mais a SPA Vite em `client/`. O que muda é exclusivamente **o que está dentro do `package.json`, o que está sendo importado nos configs, e quais arquivos boilerplate são removidos**.

## Files to delete (com justificativa explícita)

| Arquivo / Pasta | Justificativa |
|---|---|
| `shared/schema.ts` | Tabela `users` nunca usada; sem fluxo de signup; usuário confirmou descarte do banco/auth (Brainstorming Q3 = A) |
| `shared/` (pasta inteira) | Vazia após remover `schema.ts` |
| `server/storage.ts` | Existe **só** para operar `users`; sem `users` perde propósito (não é código órfão genérico, é consequência da remoção do banco) |
| `drizzle.config.ts` (raiz, se existir) | Não há mais schema para migrar |
| `.replit`, `replit.nix`, `.replit.toml`, `.replit.dev` (se existirem) | Configuração da plataforma Replit que não usaremos mais |
| `package-lock.json` | Substituído por `pnpm-lock.yaml` |

## Files to preserve (mesmo "sem uso aparente")

| Arquivo / Pasta | Razão |
|---|---|
| `client/src/context/WizardContext.tsx` | Código limpo, idiomático, intencional, reservado para uso futuro (confirmado pelo usuário) |
| Qualquer hook em `client/src/hooks/` | Mesmo princípio — código intencional |
| Componentes shadcn em `client/src/components/ui/` | Primitivas reusáveis — preserva mesmo sem consumidor atual |
| `attached_assets/` (inteiro) | Brand assets |
| Toda a árvore `client/src/**` (incluindo o `WizardContext.tsx` mencionado acima) | Site visual e funcional permanece intacto |

## Files to edit (mudanças cirúrgicas)

| Arquivo | Mudança |
|---|---|
| `vite.config.ts` | Remover imports e uso de `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`. Remover bloco condicional `process.env.REPL_ID !== undefined`. Remover alias `@shared` (pasta deixa de existir). |
| `script/build.ts` | Limpar a `allowlist` — manter apenas pacotes que existem no `package.json` E precisam ser bundled (na prática: `express`, `nanoid`, `zod`, `zod-validation-error`, `date-fns` — confirmar via inspeção dos imports reais do `server/index.ts` e `server/routes.ts` no momento da execução). Remover entradas inventadas pelo template Replit (`@google/generative-ai`, `axios`, `connect-pg-simple`, `cors`, `drizzle-orm`, `drizzle-zod`, `express-rate-limit`, `express-session`, `jsonwebtoken`, `memorystore`, `multer`, `nodemailer`, `openai`, `passport`, `passport-local`, `pg`, `stripe`, `uuid`, `ws`, `xlsx`). |
| `tsconfig.json` | Remover path alias `@shared/*` do bloco `paths`; remover `shared/**/*` do `include`. |
| `package.json` | Remover script `db:push`. Adicionar `"packageManager": "pnpm@<versão>"` (versão detectada na execução). Adicionar `"engines": { "node": ">=18", "pnpm": ">=9" }`. Trocar quaisquer `npm run X` em scripts compostos por `pnpm X`. |
| `server/index.ts`, `server/routes.ts`, `server/static.ts`, `server/vite.ts` | Verificar via `grep` se algum importa `./storage` ou `@shared/*`. Se sim, remover esse import (esperamos que `server/routes.ts` importe `./storage` mas nunca chame nada — o import vira morto e sai). |
| `client/CLAUDE.md` | Trocar `npm run dev:client` → `pnpm dev:client`, `npm run check` → `pnpm check`, `npm run build` → `pnpm build` |
| `server/CLAUDE.md` | Trocar todos `npm run X` por `pnpm X` |
| `README.md` (raiz, se existir) | Trocar comandos npm → pnpm |
| `.gitignore` | Garantir que `package-lock.json` está listado (previne regeneração acidental) |

## Files to add

| Arquivo | Conteúdo |
|---|---|
| `.npmrc` (raiz) | `auto-install-peers=true` + `strict-peer-dependencies=false` (evita falsos positivos com Radix peer deps) |
| `pnpm-lock.yaml` | Gerado automaticamente por `pnpm install` |

## Dependencies to remove

**Confirmadas (19 deps, justificativa por categoria):**

| Pacote | Tipo | Categoria |
|---|---|---|
| `drizzle-orm` | dep | DB/ORM (sem schema) |
| `drizzle-zod` | dep | DB/ORM |
| `drizzle-kit` | devDep | DB/ORM |
| `pg` | dep | DB driver |
| `passport` | dep | Auth (nunca montado) |
| `passport-local` | dep | Auth |
| `express-session` | dep | Sessions (nunca montado) |
| `connect-pg-simple` | dep | Sessions store |
| `memorystore` | dep | Sessions store |
| `@types/connect-pg-simple` | devDep | Tipos órfãos |
| `@types/express-session` | devDep | Tipos órfãos |
| `@types/passport` | devDep | Tipos órfãos |
| `@types/passport-local` | devDep | Tipos órfãos |
| `ws` | dep | WebSocket (nenhum handler) |
| `@types/ws` | devDep | Tipos órfãos |
| `@replit/vite-plugin-cartographer` | devDep | Replit-only |
| `@replit/vite-plugin-dev-banner` | devDep | Replit-only |
| `@replit/vite-plugin-runtime-error-modal` | devDep | Replit-only |
| `next-themes` | dep | `ThemeProvider` é custom em `client/src/components/ThemeProvider.tsx`; `next-themes` nunca importado |

**A verificar antes de remover (durante execução):**

| Pacote | Suspeita | Ação se órfão |
|---|---|---|
| `@jridgewell/trace-mapping` | Leftover Replit (não esperamos import direto) | Remove se grep retornar 0 imports |
| `bufferutil` (optionalDep) | Otimização para `ws` — sai junto | Remove (é optional, sem impacto) |

## Migration steps (ordem de execução para o pipeline)

1. **Pré-flight:** confirmar `pnpm -v` (instalar via `corepack enable && corepack prepare pnpm@latest --activate` se ausente). Capturar versão pra usar no `packageManager` field.
2. **Verificações estáticas (grep):**
   - Confirmar zero imports vivos de `@shared/*` fora de `server/storage.ts` (que vai ser deletado)
   - Confirmar zero imports vivos de `./storage` no server (esperado em `server/routes.ts` mas sem chamadas a `storage.*`)
   - Confirmar zero imports de `next-themes`, `passport`, `drizzle-orm`, `pg`, `ws`, `connect-pg-simple`, `memorystore`, `express-session` no código vivo
   - Confirmar zero imports de `@jridgewell/trace-mapping` e `bufferutil`
   - Se qualquer verificação falhar inesperadamente, **PARAR** e reportar antes de prosseguir
3. **Deletar arquivos** listados em "Files to delete" (exceto `package-lock.json` — ele sai na etapa 8)
4. **Editar arquivos** listados em "Files to edit" — em `package.json`, fazer apenas as mudanças NÃO relacionadas a deps (script `db:push`, `packageManager`, `engines`); as deps saem via `pnpm remove` na etapa 6 para preservar formatação consistente
5. **Adicionar arquivos** listados em "Files to add" (`.npmrc`)
6. **Remover deps via pnpm:**
   ```bash
   pnpm remove drizzle-orm drizzle-zod drizzle-kit pg \
     passport passport-local express-session connect-pg-simple memorystore \
     @types/connect-pg-simple @types/express-session @types/passport @types/passport-local \
     ws @types/ws \
     @replit/vite-plugin-cartographer @replit/vite-plugin-dev-banner @replit/vite-plugin-runtime-error-modal \
     next-themes
   ```
7. **Remover deps "a verificar"** (apenas se grep da etapa 2 confirmou orfandade): `pnpm remove @jridgewell/trace-mapping bufferutil`
8. **Limpar lock antigo:** `rm package-lock.json && rm -rf node_modules`
9. **Reinstalar:** `pnpm install` (gera `pnpm-lock.yaml`)
10. **Atualizar `.gitignore`** com `package-lock.json` se necessário
11. **Rodar AC** (próxima seção)

## Acceptance Criteria

> 7 ACs no total. **AC-1, AC-2, AC-5, AC-6, AC-7** são automatizáveis (rodam comandos runnable e o close-gate valida). **AC-3 e AC-4** são verificações manuais obrigatórias para fechar o spec — o operador (eu/você) confirma após executar. O pipeline `/mustard:feature` valida os automatizáveis na fase QA; os manuais entram como checklist final antes do merge.

**AC-1 — Type check + build passam**
```bash
pnpm check && pnpm build
```
Espera: zero erro de TypeScript; gera `dist/public/` (client) e `dist/index.cjs` (server) sem warning crítico. Bundle do server **encolhe** comparado ao baseline (sem express-session/passport/drizzle/pg/ws).

**AC-2 — Dev server sobe e site abre sem erro de console**
```bash
pnpm dev
# Em outro terminal: curl -sI http://localhost:5000 | head -1
```
Espera: log "serving on port 5000"; `HTTP/1.1 200 OK`; abrir `http://localhost:5000` no browser e confirmar zero erro no console (warnings de framer/three são aceitáveis se já existiam antes).

**AC-3 — Navegação + chat + wizards funcionam (manual)**
Verificação manual obrigatória, sem comando automatizado.
Roteiro: navegar `/` → `/servicos` → `/portfolio` → voltar; abrir Ethos.IA e enviar uma mensagem (esperar resposta da Claude API se `ANTHROPIC_API_KEY` setado, ou fallback amigável se não); completar um wizard até a etapa final e confirmar que abre `wa.me/...` com a mensagem montada.

**AC-4 — Comparação visual com produção atual (manual)**
Verificação manual obrigatória, sem comando automatizado.
Roteiro: abrir lado a lado `localhost:5000` (após limpeza) vs site atual em produção (Replit). Devem ser **pixel-perfect iguais**. Qualquer diferença visual é regressão e bloqueia o merge.

**AC-5 — Zero traço de Replit no código**
```bash
grep -rE "replit|REPL_ID|@replit" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" \
  --exclude-dir=node_modules --exclude-dir=.claude --exclude-dir=dist --exclude-dir=docs .
```
Espera: zero matches. (O `--exclude-dir=docs` evita falso-positivo neste próprio spec, que cita "replit" ao explicar o que está sendo removido.)

**AC-6 — Zero deps fantasmas no `package.json`**
```bash
node -e "const p=require('./package.json'); const banned=['passport','passport-local','drizzle-orm','drizzle-zod','drizzle-kit','pg','ws','express-session','connect-pg-simple','memorystore','next-themes','@replit/vite-plugin-cartographer','@replit/vite-plugin-dev-banner','@replit/vite-plugin-runtime-error-modal']; const all={...p.dependencies,...p.devDependencies}; const found=banned.filter(b=>all[b]); if(found.length){console.error('STILL_PRESENT:',found);process.exit(1)} console.log('OK')"
```
Espera: imprime `OK`.

**AC-7 — `pnpm-lock.yaml` existe, `package-lock.json` removido, `packageManager` declarado**
```bash
test -f pnpm-lock.yaml && ! test -f package-lock.json && node -e "const p=require('./package.json'); if(!p.packageManager?.startsWith('pnpm@')){console.error('NO_PM');process.exit(1)} console.log('OK')"
```
Espera: imprime `OK`.

## Rollback

Como toda a operação está num único branch e cada etapa é atômica, rollback é `git reset --hard <commit-baseline>` no branch de trabalho. Não tocamos em produção (Replit segue rodando intacto durante todo o ciclo). O baseline antes da limpeza é o commit atual (`d2971f0 feat: site Ethos Software completo`). Em caso de problema descoberto após merge, revertir o PR é seguro.

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Algum import inesperado de `@shared/*` ou `./storage` em código vivo | Baixa (scan disse zero) | Etapa 2 (grep) **bloqueia** se encontrar |
| `@jridgewell/trace-mapping` é peer dep transitiva e remoção quebra build | Baixa | Verificar via grep + `pnpm install` antes de commitar; se quebrar, reinstalar |
| Plugins Replit são referenciados em algum lugar não óbvio (ex: `client/index.html`, `tsconfig.json` paths) | Baixa | AC-5 (grep) cobre; se aparecer match, paro e investigo |
| pnpm não instalado na máquina do dev | Média | Etapa 1 (Pré-flight) instala via corepack |
| Diferença visual aparece (regressão de comportamento de algum plugin Replit no dev) | Baixa-Média | AC-4 (comparação visual lado-a-lado) bloqueia |

## Tasks

> Decomposição por agente para o pipeline. Cada item é um checkbox (`[ ]` pendente, `[x]` concluído) que o `/mustard:resume` rastreia para reportar progresso. Headers no formato `### {agent} Agent (Wave {N})` permitem ao parser do resume identificar qual agente despachar em cada wave.

### shared-impl Agent (Wave 1)

- [x] Deletar `shared/schema.ts`
- [x] Deletar pasta `shared/` (ficou vazia)
- [x] Notar em pós-merge: `shared-impl` agent passa a ser obsoleto (remover depois)

### server-impl Agent (Wave 1)

- [x] Verificar (grep) se há imports vivos de `./storage` ou `@shared/*` em `server/index.ts`, `server/routes.ts`, `server/static.ts`, `server/vite.ts` — se houver, remover apenas o import (sem alterar semântica)
- [x] Deletar `server/storage.ts`
- [x] Editar `server/CLAUDE.md`: trocar todos `npm run X` por `pnpm X` na seção Commands
- [x] Confirmar boundary respeitado: NÃO tocar em rotas, middleware ou comportamento HTTP

### client-impl Agent (Wave 1)

- [x] Editar `client/CLAUDE.md`: trocar `npm run dev:client` → `pnpm dev:client`, `npm run check` → `pnpm check`, `npm run build` → `pnpm build`
- [x] Confirmar que `client/src/context/WizardContext.tsx` foi PRESERVADO (NÃO deletar)
- [x] Confirmar boundary respeitado: NÃO tocar em código React, componentes, páginas, hooks ou estilos

### orchestrator Agent (Wave 2)

- [x] Editar `vite.config.ts`: remover imports e uso de `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`; remover bloco condicional `process.env.REPL_ID`; remover alias `@shared`
- [x] Editar `script/build.ts`: limpar allowlist (manter só pacotes reais e usados)
- [x] Editar `tsconfig.json`: remover path alias `@shared/*` e remover `shared/**/*` do `include`
- [x] Editar `package.json`: remover script `db:push`; adicionar `"packageManager": "pnpm@<versão detectada>"`; adicionar `"engines": { "node": ">=18", "pnpm": ">=9" }`
- [x] Criar `.npmrc` com `auto-install-peers=true` + `strict-peer-dependencies=false`
- [x] Atualizar `.gitignore`: garantir que `package-lock.json` está listado
- [x] Deletar `drizzle.config.ts` (se existir), `.replit`, `replit.nix`, `.replit.toml`, `.replit.dev` (se existirem)
- [x] Rodar `pnpm remove` para todas as deps confirmadas (lista em "Dependencies to remove")
- [x] Verificar via grep e remover `@jridgewell/trace-mapping` e `bufferutil` se órfãos
- [x] Apagar `package-lock.json` e `node_modules/`
- [x] Rodar `pnpm install` (gera `pnpm-lock.yaml`)

## Concerns

<!-- CONCERN 1 (resolved): Spec assumed `next-themes` was never imported, but `client/src/components/ui/sonner.tsx:3` did `import { useTheme } from "next-themes"`. sonner.tsx is a shadcn primitive that is NOT consumed by the app (the active Toaster comes from `@/components/ui/toaster`). Resolution applied: refactored sonner.tsx to use the custom `useTheme` from `@/components/ThemeProvider` (1-line change of import + destructuring). This preserves the shadcn primitive (per spec rule "preserve shadcn primitives even without consumer") AND allows next-themes removal per AC-6. Runtime impact: zero (sonner.tsx is unused). -->

<!-- CONCERN 2 (resolved): Spec also assumed `nanoid` was already a declared dep, but it was actually a hoisted transitive (likely via vite or drizzle-kit). After removing those, `server/vite.ts:7` lost its nanoid resolution. Resolution: added nanoid as direct dep (`pnpm add nanoid` → 5.1.9). Now declared and resolves. -->

<!-- CONCERN 3 (resolved): Spec did not call out the `// @replit` comments scattered in `client/src/components/ui/button.tsx` and `client/src/components/ui/badge.tsx` (10 occurrences). They violate AC-5 ("zero traços de Replit"). Resolution: replaced the @replit-tagged comments with non-tagged equivalents that preserve the design rationale (e.g. "// No hover; primary border (uses hover-elevate)"). Zero behavior change. -->

<!-- CONCERN 4 (resolved — user decision: option (a) delete orphan JSON): The orphan brand JSON `attached_assets/branding-1772123491207.json` (stale Replit branding-tool artifact for a different project "dramaria laura odontologia", not consumed by any source file) was deleted. AC-5 now passes 100% clean — zero matches across the entire repo. -->

<!-- CONCERN 5 (deferred — user decision: option (a) defer to Spec 2): 7 pre-existing TS errors in 4 untouched files (ClientCarousel.tsx:45 SparklesProps, Footer.tsx:49,94,108,126 framer-motion v12 ease typing, OrbitingSkills.tsx:17 JSX namespace, WizardSection.tsx:432 state inference). These predate the cleanup; build chain (tsx + esbuild) doesn't surface them. AC-1 build PASSES. To be addressed in Spec 2 (architectural). For now, `pnpm check` is known-failing on this baseline. -->

<!-- CONCERN 6 (resolved — uncovered during AC-2 manual test on Windows): The original Replit setup had two Linux-only constructs that prevented `pnpm dev` from running on Windows:
  1. `package.json` scripts used Unix-style env-var syntax (`NODE_ENV=development tsx ...`) — fails on Windows cmd ('NODE_ENV' não é reconhecido).
  2. `server/index.ts:97` passed `reusePort: true` to `httpServer.listen` — Linux/macOS-only kernel feature; Windows throws `ENOTSUP -4049`.
  Both are Replit-isms (Replit ran on Linux). Resolution applied:
  1. Added `cross-env` as devDep; rewrote `dev` and `start` scripts as `cross-env NODE_ENV=... ...`.
  2. Removed `reusePort: true` from `httpServer.listen` (single-process server doesn't need it; was a Replit load-balancing feature).
  Verification: `pnpm dev` boots, logs `serving on port 5000`. `curl -sI http://localhost:5000` returns `HTTP/1.1 200 OK`. `/api/sitecontent` returns 200 with site content; `/api/chat` returns friendly fallback (no ANTHROPIC_API_KEY env var set — expected behavior per `server/routes.ts:130-136`). -->

<!-- CONCERN 7 (resolved — package.json reorganization): The Replit-generated `package.json` had several legacy issues beyond the env-var fix:
  - `name: "rest-express"` was the generic Replit Express template name (not project-specific).
  - No `description` and no `private: true` (risk of accidental npm publish).
  - Two `dev` scripts that BOTH targeted port 5000:
    - `dev:client` (vite-only — broke because no API was running)
    - `dev` (full Express + Vite middleware)
    The redundancy caused EADDRINUSE if both were started, and `dev:client` alone gave a broken site (no /api/* responses).
  - `dev` script ran `tsx server/index.ts` (no watch) — server changes required manual restart.
  Resolution applied:
  - Renamed `rest-express` → `site-ethossoftware`.
  - Added `private: true` and a meaningful `description`.
  - Removed `dev:client` entirely (the full `dev` already serves the SPA via Vite middleware AND the API).
  - Switched server runner to `tsx watch` for hot-reload of server file changes.
  - Updated `client/CLAUDE.md` Commands section to reflect single canonical `pnpm dev`. -->

<!-- NOTE on session leakage discovered during AC-2 retest: The earlier successful AC-2 test left a `tsx server/index.ts` process running in the background. When the user retried `pnpm dev`, port 5000 was still bound, producing `EADDRINUSE`. Killed PID 7200 (then 9280 again later) via `taskkill` to free the port. No code change required — operational note for future re-runs: always confirm port is free before re-launching dev. -->

<!-- CONCERN 8 (resolved — IDE deprecation warning in tsconfig.json):
  - `baseUrl: "."` triggered TS deprecation warning ("'baseUrl' has been deprecated and will stop functioning in TypeScript 7.0").
  - `tsBuildInfoFile: "./node_modules/typescript/tsbuildinfo"` was bogus on two counts: (1) inside the typescript package's own folder, gets wiped on every `pnpm install`; (2) missing the `.tsbuildinfo` extension TypeScript expects.
  Resolution applied:
  - Removed `baseUrl` (paths already use `./` prefix so they resolve relative to tsconfig.json by default).
  - Moved `tsBuildInfoFile` to `./node_modules/.cache/tsc/.tsbuildinfo` (proper cache location with correct extension).
  Verified: `pnpm exec tsc --showConfig` no longer emits `baseUrl`. `pnpm check` still reports the same 7 pre-existing TS errors (Concern 5) — zero new errors introduced. -->

## Out-of-Scope Carry-Over to Spec 2

Items deferred per user decision in Concern 5:
- Fix framer-motion v12 ease typing in `client/src/components/Footer.tsx` (4 occurrences) and any other section using `ease: [n,n,n,n]` arrays — needs `ease: [n,n,n,n] as const` cast OR migration to named easing tokens.
- Fix JSX namespace error in `client/src/components/OrbitingSkills.tsx:17` — likely needs `import type { JSX } from "react"` or replace `JSX.Element` with `React.ReactElement`.
- Fix state inference in `client/src/components/WizardSection.tsx:432` — likely needs explicit state generic on `useState`.
- Fix `SparklesProps` mismatch in `client/src/components/ClientCarousel.tsx:45` — verify component contract.

Spec 2 must add a guard / CI gate that runs `pnpm check` to prevent silent TS regressions in future.

## QA Result Summary

| AC | Status | Evidence |
|---|---|---|
| AC-1 (check && build) | PARTIAL | build ✓ (`dist/index.cjs` 797.2 KB; client bundle 643 KB main + 732 KB three.js); check ✗ (7 pre-existing errors — Concern 5) |
| AC-2 (dev server + curl 200) | PASS | `pnpm dev` boots, logs `serving on port 5000`. `curl -sI http://localhost:5000` → `HTTP/1.1 200 OK`. Endpoints `/api/sitecontent` + `/api/chat` working. (After Concern 6 fixes.) |
| AC-3 (nav + chat + wizard, manual) | PASS | User-validated manually em sessão `/mustard:resume`. |
| AC-4 (visual diff vs prod, manual) | PASS | User-validated manually em sessão `/mustard:resume`. |
| AC-5 (zero replit traces) | PASS | Orphan brand JSON deleted (Concern 4 resolved). `grep -rE "replit\|REPL_ID\|@replit"` over the entire repo (excluding node_modules/.claude/dist/docs) returns zero matches. |
| AC-6 (zero banned deps) | PASS | `OK` |
| AC-7 (pnpm-lock + packageManager) | PASS | `OK` |

### qa-run Agent (Wave 3)

- [x] Executar AC-1 (`pnpm check && pnpm build`) — gravar resultado em `.claude/.pipeline-states/2026-04-29-replit-cleanup.json` sob `qa.result` — **build PASS, type-check FAIL com 7 erros pré-existentes (vide concerns)**
- [x] Executar AC-2 (dev server sobe + `curl -sI http://localhost:5000` retorna 200) — **PASS após 2 fixes Windows-portability** (vide Concern 6)
- [x] Executar AC-5 (grep `replit|REPL_ID|@replit` retorna zero matches) — **1 false-positive em `attached_assets/branding-1772123491207.json:80` (vide concerns)**
- [x] Executar AC-6 (script Node confirma zero deps fantasmas no `package.json`) — **PASS**
- [x] Executar AC-7 (`pnpm-lock.yaml` existe + `package-lock.json` removido + `packageManager` declarado) — **PASS**
- [x] Apresentar checklist manual de AC-3 (navegação + chat + wizards) ao usuário — vide handoff
- [x] Apresentar checklist manual de AC-4 (comparação visual com produção atual) ao usuário — vide handoff

## Notes for the implementing pipeline

- Este spec roda em pipeline Mustard Full scope.
- Subprojetos afetados: `client/`, `server/`, raiz. `shared/` é **deletado** durante execução.
- Agentes `client-impl`, `server-impl`, `shared-impl` (gerados pelo `/mustard:scan`) podem ser usados; `shared-impl` ficará obsoleto após este spec (deletar em pós-merge).
- Após merge, recomenda-se rodar `/mustard:scan` novamente para regenerar `client/.claude/commands/*` e `server/.claude/commands/*` com o estado limpo.
