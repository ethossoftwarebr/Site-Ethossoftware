<!-- mustard:generated -->
# Server Subproject

> Express 5 + TypeScript backend. Bootstraps an HTTP server, registers `/api` routes, mounts Vite middleware in dev or static assets in prod, and ships as a single bundled `dist/index.cjs` in production.

## Stack

- **Runtime:** Node.js >= 18, TypeScript 5.6, ESM project (`"type": "module"`)
- **Framework:** Express `^5.0.1` on `http.createServer`
- **Dev runner:** `tsx` (`pnpm dev` → `NODE_ENV=development tsx server/index.ts`)
- **Prod build:** `esbuild` bundles `server/index.ts` → `dist/index.cjs` (CJS, minified) — see `script/build.ts`
- **Data:** `drizzle-orm` `^0.39.3` + `pg` `^8.16.3`; schema in `shared/schema.ts`; migrations via `drizzle-kit push`
- **Auth/sessions:** `passport`, `passport-local`, `express-session`, `connect-pg-simple`, `memorystore` — declared but **not yet wired** in `server/`
- **Realtime:** `ws` declared, no handler registered
- **External APIs:** Anthropic Messages API (`claude-3-5-haiku-20241022`) for `/api/chat`

## Commands

```bash
# Dev (Vite middleware + API on :5000)
pnpm dev

# Type check
pnpm check

# Production build (client + server bundle)
pnpm build

# Production run (after build)
pnpm start
```

## Key Paths

| Path | Role |
|---|---|
| `server/index.ts` | Express bootstrap, parsers, request logger, error handler, port wiring, dev/prod split |
| `server/routes.ts` | `registerRoutes()` — declares all `/api` endpoints |
| `server/static.ts` | Production static serving from `dist/public/` |
| `server/vite.ts` | Dev-only Vite middleware (HMR on `/vite-hmr`) |
| `server/storage.ts` | `IStorage` interface + in-memory `MemStorage` singleton |
| `shared/schema.ts` | Drizzle table declarations (consumed by `server/storage.ts`) |
| `drizzle.config.ts` | Drizzle Kit config (Postgres dialect) |
| `script/build.ts` | esbuild + Vite production build orchestrator |

## Guards

- All API routes MUST be under `/api` (request logger filter — `server/index.ts:49`).
- All routes MUST be registered inside `registerRoutes(...)` in `server/routes.ts`.
- The global error handler MUST stay registered LAST among non-catch-all middleware (`server/index.ts:65`), BEFORE Vite/static (`:81`).
- Port MUST come from `process.env.PORT` with `5000` fallback (`server/index.ts:92`); listen on `0.0.0.0` with `reusePort: true`.
- Use Express 5 catch-all syntax `"/{*path}"` (`server/static.ts:16`).
- NEVER use top-level `await` in `server/index.ts` — bundled to CJS (`script/build.ts:53`); use the IIFE pattern at `server/index.ts:62`.
- NEVER import `vite` at the top of `server/index.ts`; dynamic-import inside the prod-check (`server/index.ts:84`).
- NEVER log secrets, raw request bodies, password hashes, or API keys. The logger captures `res.json` payloads — review new routes.
- Bundling new deps into `dist/index.cjs` requires adding them to `script/build.ts:7-33` allowlist; otherwise they stay external.
- `MemStorage` is in-memory and resets on restart (`server/storage.ts`); replace before relying on persistence.

## Scan References

| File | Description |
|------|-------------|
| `.claude/commands/stack.md` | Express + Drizzle + Postgres stack, build chain, env vars |
| `.claude/commands/modules.md` | Per-file responsibilities, route table, middleware order, dependency graph |
| `.claude/commands/patterns.md` | 10 recurring patterns (route registration, request logger, error handler, dev/prod split, storage seam, etc.) |
| `.claude/commands/guards.md` | DO/DON'T rules with file:line references |
| `.claude/commands/recipes.md` | Recipes: add a route, add a Drizzle entity, add middleware, wire Passport, proxy an external API |
| `.claude/commands/notes.md` | Manual notes (never overwritten) |
