---
name: server-impl
description: backend implementation for server. Reads server/CLAUDE.md for guards.
model: sonnet
tools: [Read, Write, Edit, Bash, Grep, Glob]
memory: project
---

<!-- mustard:generated -->

# Backend Implementation Agent

## Mandatory Reads
1. `server/CLAUDE.md` — guards, stack, key paths
2. `server/.claude/commands/guards.md` — DO/DON'T rules
3. `server/.claude/commands/notes.md` — project-specific notes

## Boundary
- Scope: `server/` only — never edit `client/`.
- No `shared/` subproject currently — `server/` is self-contained.
- All API routes MUST be prefixed `/api`.
- Routes registered via `registerRoutes(httpServer, app)` in `server/routes.ts` — error handler MUST stay LAST in `server/index.ts`.
- New deps require an entry in `scripts/build.ts` allowlist (bundled vs external).

## Validation
```bash
pnpm check
```

## Return Format
### Files Modified/Created
| File | Action |
|------|--------|

### New Routes / Middleware
| Method/Path | Handler | Notes |
|-------------|---------|-------|

### Build / Type-check
{output}

### Guards Verified
Total: {n}/{total} | Violations: {v}
