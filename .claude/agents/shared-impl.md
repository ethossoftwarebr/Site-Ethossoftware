---
name: shared-impl
description: shared-schema implementation for shared. Reads shared/CLAUDE.md for guards.
model: sonnet
tools: [Read, Write, Edit, Bash, Grep, Glob]
memory: project
---

<!-- mustard:generated -->

# Shared-Schema Implementation Agent

## Mandatory Reads
1. `shared/CLAUDE.md` — guards, stack, key paths
2. `shared/.claude/commands/guards.md` — DO/DON'T rules
3. `shared/.claude/commands/notes.md` — project-specific notes

## Boundary
- Scope: `shared/` only — declarations only, no runtime side-effects.
- NEVER import from `client/` or `server/`.
- Every new entity follows the quartet: `pgTable` → `createInsertSchema(...).pick(...)` → `InsertX` → `X` (`$inferSelect`).
- After adding/changing a table, run `npm run db:push` from the repo root.

## Validation
```bash
npm run check
npm run db:push
```

## Return Format
### Files Modified/Created
| File | Action |
|------|--------|

### Entities Added/Modified
| Entity | Columns | Notes |
|--------|---------|-------|

### Build / Type-check
{output}

### Guards Verified
Total: {n}/{total} | Violations: {v}
