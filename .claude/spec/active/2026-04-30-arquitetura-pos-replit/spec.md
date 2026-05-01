# Spec — Arquitetura pós-Replit (server enxuto + assets convencionais + scripts consolidados + fixes TS)

### Status: implementing
### Phase: EXECUTE
### Scope: full
### Checkpoint: 2026-04-30T21:33:50.000Z
### Pipeline: /mustard:feature (Full scope)
### Model: opus (12+ files, 4 blocos paralelos, alguns padrões novos — assets migration)

## Summary

Após Spec 1 (de-Replit + pnpm) o site rodou no Windows fora do Replit pela primeira vez. O processo expôs **boilerplate de SaaS** que o Replit gerou pra um projeto que é, na verdade, **site institucional**: 2 endpoints, sem login, sem banco, sem sessão, sem realtime. Este spec elimina o excesso e devolve o projeto pra forma proporcional ao propósito.

Quatro blocos:
- **A — Server enxuto:** `server/index.ts` 100 → ~30 linhas. Remove rawBody capture, urlencoded, custom logger, middleware logando body de response.
- **B — Assets convencionais:** `attached_assets/` (invenção Replit) → `client/public/` + `client/src/assets/` (convenções Vite).
- **C — Scripts consolidados:** `script/` (singular) → `scripts/` (plural padrão); `scripts/post-merge.sh` (hook Mustard) → `.claude/scripts/`.
- **D — Fixes TS pré-existentes:** 7 erros em 4 arquivos client/ (framer-motion v12 ease typing, JSX namespace React 19, useState inference, SparklesProps).

**Princípio de ouro:** zero mudança visual, zero mudança de comportamento observável. Igual Spec 1.

## Entity Info

N/A — `entity-registry.json` vazio (projeto não tem entidades de domínio; só componentes UI e endpoints).

## Files (~12)

| Path | Operação | Bloco |
|---|---|---|
| `server/index.ts` | rewrite (~30 linhas) | A |
| `server/static.ts` | auditar + simplificar se possível | A |
| `server/vite.ts` | auditar + simplificar se possível | A |
| `server/CLAUDE.md` | atualizar Stack + guards | A |
| `client/src/components/ClientCarousel.tsx` | fix SparklesProps L45 | D |
| `client/src/components/Footer.tsx` | fix ease typing L49,94,108,126 (4×) | D |
| `client/src/components/OrbitingSkills.tsx` | fix JSX namespace L17 | D |
| `client/src/components/WizardSection.tsx` | fix useState generic L432 | D |
| `attached_assets/*` | mover (importados → `client/src/assets/`; URL → `client/public/`) | B |
| `client/src/components/**` que importam `@assets/...` | atualizar imports | B |
| `vite.config.ts` | remover alias `@assets` se desnecessário | B |
| `script/build.ts` | mover → `scripts/build.ts` | C |
| `scripts/post-merge.sh` | mover → `.claude/scripts/post-merge.sh` | C |
| `package.json` | atualizar `build` script para novo path | C |

## Boundaries

**In:** todos os paths listados em `## Files`.

**Out:**
- `client/src/pages/`, `client/src/data/`, `client/src/lib/`, `client/src/hooks/`, `client/src/context/` — não tocar
- `client/src/index.css`, `tailwind.config.*` — não tocar
- Nenhum arquivo em `node_modules/`, `dist/`, `.claude/.harness/`
- `tsconfig.json`, `.npmrc`, `.gitignore` — já corretos pós-Spec 1
- Não adicionar/remover nenhuma dep do `package.json`

## Dependencies

- Spec 1 (`2026-04-29-replit-cleanup`) precisa estar `completed` (✓ confirmado, em `.claude/spec/completed/`)
- Branch limpa antes de começar (sem mudanças não-commitadas que possam interferir)

## Tasks

### server-impl Agent (Wave 1)

- [x] Reescrever `server/index.ts` na forma alvo (96 → 35 linhas; IIFE preservado para CJS-safety)
- [x] Remover `declare module "http" { rawBody: unknown }` + `verify` callback do `express.json`
- [x] Remover `app.use(express.urlencoded(...))` (POST /api/chat é JSON)
- [x] Remover função `log()` custom + middleware que captura `res.json` body
- [x] Tornar `host` conditional: prod=`0.0.0.0`, dev=`127.0.0.1`, override via `HOST` env var (também removeu `reusePort:true` — Windows não suporta)
- [x] Auditar `server/static.ts` e `server/vite.ts` — mantido `http.createServer + httpServer.listen` porque `setupVite` precisa do `http.Server` para HMR upgrade events
- [x] Atualizar `server/CLAUDE.md` Stack + guards refletindo o servidor enxuto
- [x] Validar: `pnpm dev` sobe + `curl -sI` → 200 + `/api/sitecontent` 200 + `/api/chat` fallback (testado em :5050; :5000 tinha processo stale)

### client-impl Agent (Wave 1) (parallel-safe — não consome nada do server)

- [x] Fix `ClientCarousel.tsx:45` — `SparklesProps` estendido com 7 aliases opcionais em `Sparkles.tsx` (preserva visual; props ignoradas em runtime)
- [x] Fix `Footer.tsx:49,94,108,126` (4×) — anotação `Variants` permite framer-motion v12 narrowar Bezier tuple sem `as const`
- [x] Fix `OrbitingSkills.tsx:17` — `import type { JSX } from "react"` adicionado
- [x] Fix `WizardSection.tsx:432` — removido `"value" in s ?` morto (ambos branches já tinham `value`)
- [x] Validar: `pnpm check` → 7 erros → 0

### client-impl Agent (Wave 2)

- [ ] Grep `attached_assets` em `client/src/**` para listar todos consumidores (paths exatos + linha)
- [ ] Categorizar cada arquivo: importado em código (`import ... from "@assets/..."`) vs referenciado por URL pública (favicon, ogImage)
- [ ] Mover importados → `client/src/assets/<categoria>/` (logos/, screenshots/, brand/)
- [ ] Mover públicos → `client/public/` (mantém nome, vai pra raiz do site)
- [ ] Atualizar imports nos componentes (`@assets/X` → `@/assets/<categoria>/X` ou import relativo)
- [ ] Validar: `pnpm dev` + abrir browser + confirmar imagens carregam

### orchestrator Agent (Wave 2) (paralelo ao client-impl Wave 2 — paths disjuntos)

- [ ] Mover `script/build.ts` → `scripts/build.ts`
- [ ] Mover `scripts/post-merge.sh` → `.claude/scripts/post-merge.sh`
- [ ] Atualizar `package.json` script `build` para `tsx scripts/build.ts`
- [ ] Atualizar caller de `post-merge.sh` em `.claude/settings.json` (se houver)
- [ ] Remover alias `@assets` de `vite.config.ts` (após Wave 2 client-impl confirmar zero consumers)
- [ ] Apagar `attached_assets/` (deve estar vazia)
- [ ] Apagar `script/` (deve estar vazia)
- [ ] Validar: `pnpm build` gera `dist/index.cjs` + `dist/public/`

### qa-run Agent (Wave 3)

- [ ] Executar AC-1..AC-7
- [ ] Apresentar checklist manual ao usuário (nav + chat + wizard + visual diff)

## Concerns

<!-- CONCERN: server-impl (Wave 1) — Skill files em `server/.claude/skills/` (server-bootstrap, server-request-logger, server-session-setup, server-drizzle-storage) ainda referenciam código pré-Spec 1 (Drizzle, Passport, MemStorage, rawBody, etc.). Out-of-scope desta spec. Endereçar via `/scan` regen futuro ou nova spec dedicada. -->

## Acceptance Criteria

Testable, binary (pass/fail) criteria. Each MUST be executable and independent.

- [ ] AC-1: Type check zero erros — Command: `pnpm check`
- [ ] AC-2: Production build OK — Command: `pnpm build`
- [ ] AC-3: Dev server boot + curl 200 — Command: `node -e "const{spawn}=require('child_process');const c=spawn('pnpm',['dev'],{shell:true});setTimeout(async()=>{const r=await fetch('http://localhost:5000');c.kill();process.exit(r.ok?0:1)},10000)"`
- [ ] AC-4: `server/index.ts` enxuto (≤ 40 linhas) — Command: `node -e "const fs=require('fs');const n=fs.readFileSync('server/index.ts','utf8').split('\\n').length;process.exit(n<=40?0:1)"`
- [ ] AC-5: Zero `rawBody` no repo — Command: `node -e "const{execSync}=require('child_process');try{execSync('grep -r rawBody --include=*.ts --include=*.tsx --exclude-dir=node_modules --exclude-dir=.claude --exclude-dir=dist .',{stdio:'pipe'});process.exit(1)}catch{process.exit(0)}"`
- [ ] AC-6: `attached_assets/` deletada — Command: `node -e "process.exit(require('fs').existsSync('attached_assets')?1:0)"`
- [ ] AC-7: `script/` deletada + `scripts/build.ts` existe — Command: `node -e "const fs=require('fs');process.exit((!fs.existsSync('script')&&fs.existsSync('scripts/build.ts'))?0:1)"`

### Manual Verification (operator)

Após AC-1..AC-7 PASS:
- Nav `/` → `/servicos` → `/portfolio` → voltar
- Abrir Ethos.IA + enviar mensagem
- Completar um wizard até `wa.me/...`
- Comparar visualmente vs commit pré-Spec 2

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Mover `attached_assets/` quebra import oculto | Média | Grep exaustivo (etapa 1 do Wave 2 client) + build após cada batch |
| Simplificação `server/index.ts` quebra logging que algum operador usa | Baixa | Sem consumer externo declarado; é local |
| `Footer.tsx` ease typing fix muda visualmente animação | Baixa | Named easing tem comportamento próximo; verificação manual cobre |
| `host: "127.0.0.1"` em dev quebra acesso de outros devices na LAN | Baixa-Média | Override via `HOST=0.0.0.0 pnpm dev` |
| Mover `post-merge.sh` quebra hook Mustard | Baixa | Atualizar caller em `.claude/settings.json` no mesmo commit |
| Wave 2 paralelo (assets + scripts) cria conflito em `vite.config.ts` | Baixa | client-impl edita só consumers; orchestrator só edita alias `@assets` no fim, depois do client confirmar zero consumers |

## Rollback

Cada bloco é atômico. Se Wave 1 quebra: `git restore server/ client/src/components/{Footer,OrbitingSkills,WizardSection,ClientCarousel}.tsx`. Se Wave 2 quebra: `git restore` nos paths afetados + restaurar `attached_assets/` e `script/` via `git checkout HEAD~ -- attached_assets/ script/`.

## Notes

- Spec é Full scope (12 arquivos, 4 blocos, 2 waves de implementação + QA).
- `client-impl` aparece em Wave 1 (Bloco D) e Wave 2 (Bloco B) — mesmo agente em momentos diferentes (não dispatch paralelo dentro de subproject).
- Wave 1 paralelo: server-impl + client-impl (Bloco D) — independentes, frontend não consome novos endpoints.
- Wave 2 paralelo: client-impl (Bloco B) + orchestrator (Bloco C) — paths disjuntos. Atenção ao race em `vite.config.ts` (mitigado).
