# Enhancement: repo-cleanup

### Status: completed | Phase: CLOSE | Scope: light

### Checkpoint: 2026-05-04T14:14:00Z

## Summary

Remover leftovers Replit/diagnose pré-cutover Astro + workflow Lighthouse CI dormente (sem PR-flow no repo). Zero alteração em runtime — só dead weight do filesystem. Desbloqueia Specs 12-14 com repo enxuto.

## Boundaries

- `.github/` — diretório completo (workflow Lighthouse CI nunca disparou; sem PR-flow)
- `scripts/build.ts` — leftover Replit (express + dist/, projeto agora é `astro build`)
- `scripts/prerender.ts` — leftover Replit (puppeteer SPA prerender, não usado)
- `scripts/diagnose-hydration.cjs` — auto-descrito "Throwaway QA diag"
- `scripts/diagnose-three-lazy.cjs` — diag throwaway de Three.js lazy
- `scripts/perf-baseline.cjs` — standalone reader não referenciado em package.json nem em outros scripts
- `.claude/agents/{client,server}-{impl,explorer}.md` — agents stale (client/ e server/ deletados em Spec 10) [já deletados pelo /scan anterior, unstaged]
- `.claude/entity-registry.json` — regenerado por sync-registry (colateral cleanup) [já modificado, unstaged]

## Não-escopo (NEVER touch)

- `src/**` — código de runtime
- `package.json` deps + scripts (mas validar que scripts: não referencia deletados)
- `astro.config.mjs`
- `scripts/run-lighthouse-mobile.cjs` (em uso: `pnpm perf:lh`, `pnpm perf:baseline`)
- `scripts/compare-lighthouse.cjs` (em uso: `pnpm perf:compare:cross`)
- `lighthouse-baselines/*.json` (referência das Specs 7-9)

## Checklist

### Cleanup Agent (single wave)

- [x] Deletar `.github/` (recursivo)
- [x] Deletar `scripts/build.ts`
- [x] Deletar `scripts/prerender.ts`
- [x] Deletar `scripts/diagnose-hydration.cjs`
- [x] Deletar `scripts/diagnose-three-lazy.cjs`
- [x] Deletar `scripts/perf-baseline.cjs`
- [x] Verificar nenhuma referência residual em `package.json`, `astro.config.mjs`, ou `tsconfig.json` aos arquivos deletados
- [x] Validar AC1-AC6

## Results

- AC1 ✓ `pnpm install --frozen-lockfile` — Done in 2.5s
- AC2 ✓ `pnpm build` — Server built in 22.86s (Complete!)
- AC3 ✓ package.json — no refs to deleted files (grep exit 1)
- AC4 ✓ src/ + astro.config.mjs + tsconfig.json — no refs (Grep "No files found")
- AC5 ✓ git status — 10 deletions + entity-registry M + spec novo (todos esperados)
- AC6 ✓ run-lighthouse-mobile.cjs, compare-lighthouse.cjs, lighthouse-baselines/ preservados

Build warnings detectados (fora do escopo desta spec):

- Unused `Fingerprint` import em src/components/Services.tsx (dead code, alvo da Spec 13)
- Chunk >500KB (alvo das Specs 12/13 — JS bundle reduction)

## Files (~9)

- `.github/workflows/lighthouse-ci.yml` (delete)
- `.github/` (delete dir)
- `scripts/build.ts` (delete)
- `scripts/prerender.ts` (delete)
- `scripts/diagnose-hydration.cjs` (delete)
- `scripts/diagnose-three-lazy.cjs` (delete)
- `scripts/perf-baseline.cjs` (delete)
- `.claude/agents/{client,server}-{impl,explorer}.md` (already deleted, will be staged)
- `.claude/entity-registry.json` (already modified, will be staged)

## Acceptance Criteria

- **AC1**: `pnpm install --frozen-lockfile` — exit 0 (pnpm-lock.yaml inalterado)
- **AC2**: `pnpm build` — exit 0 (build Astro completo, sem erro de import dos scripts deletados)
- **AC3**: `grep -E "(build\.ts|prerender\.ts|diagnose-hydration|diagnose-three-lazy|perf-baseline\.cjs)" package.json` — exit 1 (nenhuma referência)
- **AC4**: `grep -rE "scripts/(build|prerender|diagnose-hydration|diagnose-three-lazy|perf-baseline)" src/ astro.config.mjs tsconfig.json 2>/dev/null` — exit 1 (nenhuma referência em runtime/config)
- **AC5**: `git status --porcelain | grep -vE "^.D |^ D |^M  \.claude/entity-registry\.json" | wc -l` — output `0` (apenas remoções + entity-registry regenerado; sem arquivos novos não-relacionados)
- **AC6**: `scripts/run-lighthouse-mobile.cjs`, `scripts/compare-lighthouse.cjs`, `lighthouse-baselines/*.json` ainda existem (preservados)

## Concerns

(none)
