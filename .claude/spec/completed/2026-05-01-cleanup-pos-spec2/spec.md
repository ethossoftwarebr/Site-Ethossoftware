# Spec — Cleanup pós-Spec 2 (concerns deferidos)

### Status: completed
### Phase: CLOSE
### Scope: light
### Checkpoint: 2026-05-01T02:00:00.000Z
### Pipeline: /mustard:feature (Light scope — cleanup pattern conhecido)
### Model: sonnet (mecânico, conhecido, ≤15 arquivos)

## Summary

3 blocos paralelos endereçando os CONCERNs registrados no fechamento da Spec 2 (`.claude/spec/completed/2026-04-30-arquitetura-pos-replit/`):

- **Bloco 1 — Client polish** (3 fixes pre-existing, ~10 linhas)
- **Bloco 2 — Server commands/skills rewrite** (commands + skills preservados com refs corrigidos)
- **Bloco 3 — Delete dead server skills** (3 skills descrevendo stack ausente do código atual)

Princípio: zero mudança de comportamento runtime. Apenas docs, conventions, e cleanup de skills mortos.

## Entity Info

N/A — `entity-registry.json` vazio. Cleanup de docs e skills.

## Files (~13)

| Path | Operação | Bloco |
|---|---|---|
| `client/src/data/projects.ts` | fix import L7 (`../assets/...` → `@/assets/...`) | 1 |
| `client/src/components/Navbar.tsx` | fix L158-167,249-254 (concat `+` → `cn()`) | 1 |
| `client/src/components/WizardSection.tsx` | remover var morta `effectiveStep` L238 | 1 |
| `server/.claude/commands/guards.md` | rewrite (remove guards de patterns descontinuados, fix line refs) | 2 |
| `server/.claude/commands/patterns.md` | rewrite (remover P2/P3/P4/P5/P8/P10 que citam código removido) | 2 |
| `server/.claude/commands/recipes.md` | rewrite (R1/R3/R4 citam anchors removidos) | 2 |
| `server/.claude/commands/stack.md` | fix line refs PORT/NODE_ENV | 2 |
| `server/.claude/skills/server-bootstrap/SKILL.md` | fix refs `scripts/build.ts:NN` + `server/index.ts:NN` (atual 35 linhas) | 2 |
| `server/.claude/skills/server-dev-vs-prod-vite/SKILL.md` | fix refs `scripts/build.ts` + `server/static.ts`/`server/vite.ts` | 2 |
| `server/.claude/skills/server-error-handler/SKILL.md` | revisar/fix line refs (handler em L14) | 2 |
| `server/.claude/skills/server-route-registration/SKILL.md` | revisar/fix line refs | 2 |
| `.claude/agents/server-impl.md` | L23 `script/build.ts`→`scripts/build.ts` + L27 `npm run check`→`pnpm check` | 2 |
| `server/.claude/skills/server-drizzle-storage/` | DELETE (Drizzle ORM ausente do projeto) | 3 |
| `server/.claude/skills/server-session-setup/` | DELETE (Passport/sessions ausentes) | 3 |
| `server/.claude/skills/server-request-logger/` | DELETE (response-body interceptor removido em Spec 2 Wave 1) | 3 |

## Boundaries

**In:** todos os paths em `## Files`.

**Out:**
- `server/index.ts`, `server/routes.ts`, `server/static.ts`, `server/vite.ts` — código já correto pós-Spec 2
- `client/src/index.css`, `tailwind.config.*`, `tsconfig.json`, `package.json`, `vite.config.ts`, `.npmrc`
- `client/CLAUDE.md`, `server/CLAUDE.md` — já corretos pós-Spec 2 Wave 2b
- Specs em `.claude/spec/completed/`
- Não tocar deps em `package.json`
- Não tocar componentes client além dos 3 listados

## Dependencies

- Spec 2 (`2026-04-30-arquitetura-pos-replit`) `completed` (✓ confirmado)
- Branch `main` limpa antes de começar

## Tasks

### client-impl Agent (Wave 1) (parallel-safe — paths disjuntos do server)

**Bloco 1:**

- [x] `client/src/data/projects.ts:7` — substituir `import projAutomacaoChatbot from "../assets/images/chatbot-ui.png"` por `import projAutomacaoChatbot from "@/assets/images/chatbot-ui.png"`
- [x] `client/src/components/Navbar.tsx:158-167,249-254` — substituir concat de classes via `+` por `cn(...)` de `@/lib/utils` (já importado se preciso)
- [x] `client/src/components/WizardSection.tsx:238` — remover linha `const effectiveStep = step <= 3 && !showStageStep && step === 3 ? 2 : step;` (var nunca lida; TS strict não pega `const` não-usado mas é dead code)
- [x] Validar: `pnpm check` 0 erros + `pnpm build` OK

### server-impl Agent (Wave 1) (paralelo ao client-impl — paths disjuntos)

**Bloco 2 — Rewrite stale docs:**

- [x] `server/.claude/commands/guards.md` — remover guards de patterns descontinuados (`reusePort:true`, `res.json` interceptor pattern); reescrever line refs apontando para `server/index.ts` atual (35 linhas)
- [x] `server/.claude/commands/patterns.md` — remover patterns que citam código removido (request logger middleware, response body capture, raw body, `reusePort:true`); preservar patterns ainda válidos (route registration, error handler, dev/prod split, IIFE, host conditional)
- [x] `server/.claude/commands/recipes.md` — reescrever recipes que citam logger removido / urlencoded / rawBody anchors
- [x] `server/.claude/commands/stack.md` — fix line refs PORT (`:92` → :29), NODE_ENV (`:81` → :22,30)
- [x] `server/.claude/skills/server-bootstrap/SKILL.md` — fix `script/build.ts:51-54` → `scripts/build.ts:NN`; fix line refs `server/index.ts:NN` para arquivo atual de 35 linhas (IIFE em :11)
- [x] `server/.claude/skills/server-dev-vs-prod-vite/SKILL.md` — fix `script/build.ts:38-61` → `scripts/build.ts:NN`; revisar refs `server/static.ts` e `server/vite.ts`
- [x] `server/.claude/skills/server-error-handler/SKILL.md` — fix line refs (error handler atual em `server/index.ts:14-20`)
- [x] `server/.claude/skills/server-route-registration/SKILL.md` — fix line refs (registerRoutes em `server/index.ts:12`)
- [x] `.claude/agents/server-impl.md:23` — `script/build.ts` → `scripts/build.ts`
- [x] `.claude/agents/server-impl.md:27` — `npm run check` → `pnpm check`

**Bloco 3 — Delete dead skills:**

- [x] `git rm -r server/.claude/skills/server-drizzle-storage/`
- [x] `git rm -r server/.claude/skills/server-session-setup/`
- [x] `git rm -r server/.claude/skills/server-request-logger/`

- [x] Validar: 3 dirs ausentes; `pnpm check` continua 0 (refator é só docs/skills)

## Acceptance Criteria

- [x] AC-1: TS check zero erros — Command: `pnpm check`
- [x] AC-2: Build OK — Command: `pnpm build`
- [x] AC-3: 3 skills deletados — Command: `node -e "const fs=require('fs');const dirs=['server/.claude/skills/server-drizzle-storage','server/.claude/skills/server-session-setup','server/.claude/skills/server-request-logger'];const still=dirs.filter(d=>fs.existsSync(d));process.exit(still.length===0?0:1)"`
- [x] AC-4: Zero refs em `server/.claude/` a `script/build.ts` (deve ser `scripts/build.ts`) — Command: `node -e "const{execSync}=require('child_process');try{const r=execSync('grep -r \"script/build.ts\" server/.claude/ .claude/agents/',{stdio:'pipe'}).toString();process.stderr.write('FOUND:'+r);process.exit(1)}catch(e){process.exit(e.status===1?0:2)}"`
- [x] AC-5: Zero refs a `reusePort` em `server/.claude/commands/` — Command: `node -e "const{execSync}=require('child_process');try{execSync('grep -r reusePort server/.claude/commands/',{stdio:'pipe'});process.exit(1)}catch(e){process.exit(e.status===1?0:2)}"`
- [x] AC-6: Zero `from "../assets/` em `client/src/` — Command: `node -e "const{execSync}=require('child_process');try{execSync('grep -rE \"from [\\\"\\x27]\\.\\./assets/\" client/src/',{stdio:'pipe'});process.exit(1)}catch(e){process.exit(e.status===1?0:2)}"`

## Risk register

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Reescrita de guards/patterns remove guard ainda válido | Média | Reler `server/index.ts` (35 linhas atuais), só remover guards apontando para código que NÃO existe mais; preservar tudo ainda verdadeiro |
| Deletar skills quebra dispatch de agentes que mencionam o nome | Baixa | Grep externo confirmou: 3 skills referenciados só dentro dos próprios SKILL.md + Spec 2 arquivada; zero refs em hooks/scripts/settings.json |
| `cn()` no Navbar muda comportamento runtime | Muito baixa | `cn` é dedup+concat; output idêntico para classes não-conflitantes |
| `effectiveStep` morto era usado por test/snapshot | Muito baixa | Projeto não tem tests (verificado em Spec 2) |
| `reusePort:true` mencionado em outro lugar que não os 4 commands docs | Baixa | AC-5 garante zero refs em `server/.claude/commands/`; agente também busca em `server/.claude/skills/` durante rewrite |

## Rollback

Cada bloco é atômico. `git restore <paths>` por arquivo. Skills deletados: `git restore server/.claude/skills/<name>/`.

## Notes

- Light scope: ANALYZE foi inline no orchestrator (grep externo + read server/index.ts atual + check chatbot-ui.png + listar skills). PLAN skipped (conhecido). EXECUTE → QA → CLOSE.
- Wave 1 paralelo: client-impl (Bloco 1) + server-impl (Bloco 2+3) — paths disjuntos confirmados.
- Sem migração de dependências, sem mudança visual, sem mudança de API.
