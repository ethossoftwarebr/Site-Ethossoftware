<!-- mustard:generated -->
# Server Subproject

> Express 5 + TypeScript backend. Bootstraps an HTTP server, registers `/api` routes, mounts Vite middleware in dev or static assets in prod, and ships as a single bundled `dist/index.cjs` in production.

## Stack

- **Runtime:** Node.js >= 18, TypeScript 5.6, ESM project (`"type": "module"`)
- **Framework:** Express `^5.0.1` on `http.createServer`
- **Dev runner:** `tsx` (`pnpm dev` → `cross-env NODE_ENV=development tsx watch server/index.ts`)
- **Prod build:** `esbuild` bundles `server/index.ts` → `dist/index.cjs` (CJS, minified) — see `script/build.ts`
- **External APIs:** Anthropic Messages API (`claude-3-5-haiku-20241022`) for `POST /api/chat`

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
| `server/index.ts` | Express bootstrap, JSON parser, error handler, port wiring, dev/prod split |
| `server/routes.ts` | `registerRoutes()` — declares all `/api` endpoints (`/api/sitecontent`, `/api/chat`) |
| `server/static.ts` | Production static serving from `dist/public/` |
| `server/vite.ts` | Dev-only Vite middleware (HMR on `/vite-hmr`) |
| `script/build.ts` | esbuild + Vite production build orchestrator |

## Guards

- All API routes MUST be under `/api`. Register inside `registerRoutes(...)` in `server/routes.ts` — never call `app.get/post` from a different module.
- The global error handler MUST stay registered LAST among non-catch-all middleware (`server/index.ts:14`), BEFORE Vite/static (`server/index.ts:22-27`).
- Port MUST come from `process.env.PORT` with `5000` fallback (`server/index.ts:29`).
- Host is conditional: prod = `0.0.0.0`, dev = `127.0.0.1`; override via `HOST` env var (`server/index.ts:30`).
- Use Express 5 catch-all syntax `"/{*path}"` (`server/static.ts:16`, `server/vite.ts:34`).
- NEVER use top-level `await` in `server/index.ts` — bundled to CJS (`script/build.ts:33`); use the IIFE pattern at `server/index.ts:11`.
- NEVER import `vite` at the top of `server/index.ts`; dynamic-import inside the dev branch (`server/index.ts:25`).
- NEVER log secrets, raw request bodies, password hashes, or API keys.
- Bundling new deps into `dist/index.cjs` requires adding them to the `allowlist` in `script/build.ts:7-13`; otherwise they stay external.
- `POST /api/chat` is JSON-only (`express.json()` is the sole body parser registered).

## Scan References

| File | Description |
|------|-------------|
| `.claude/commands/stack.md` | Express stack, build chain, env vars |
| `.claude/commands/modules.md` | Per-file responsibilities, route table, middleware order |
| `.claude/commands/patterns.md` | Recurring patterns (route registration, error handler, dev/prod split) |
| `.claude/commands/guards.md` | DO/DON'T rules with file:line references |
| `.claude/commands/recipes.md` | Recipes: add a route, add middleware, proxy an external API |
| `.claude/commands/notes.md` | Manual notes (never overwritten) |
