<!-- mustard:generated -->
# Server Patterns

> Recurring shapes used across `server/`. Every entry references a real file:line so you can match the existing convention exactly.

## P1 — Route registration via `registerRoutes(httpServer, app)`

All `/api` handlers are attached inside one async exported function rather than scattered top-level `app.get` calls.

- Definition: `server/routes.ts` — `export async function registerRoutes(httpServer: Server, app: Express): Promise<Server>`
- Caller: `server/index.ts:12` — `await registerRoutes(httpServer, app)`
- Rationale: keeps bootstrap order deterministic (parsers → routes → error handler → catch-all).

## P2 — Centralized Express error handler registered LAST among non-catch-all middleware

Standard Express 4-arg signature; reads `err.status || err.statusCode || 500`, never sends if `headersSent`.

- Location: `server/index.ts:14-20`
- Critical ordering: registered AFTER `registerRoutes` (`server/index.ts:12`) and BEFORE Vite/static (`server/index.ts:22-27`).

## P3 — Dev-vs-prod split for SPA serving

`NODE_ENV === "production"` decides whether to mount static (`server/static.ts`) or dynamically import + setup Vite (`server/vite.ts`). The Vite import is dynamic so `vite` is not pulled in at prod cold-start.

- Location: `server/index.ts:22-27`
- Dev: `setupVite(httpServer, app)` mounts `vite.middlewares` then a catch-all that re-reads + transforms `client/index.html` per request (`server/vite.ts`)
- Prod: `serveStatic(app)` serves `dist/public/` then a catch-all to `index.html` (`server/static.ts`)
- Catch-all uses Express 5 syntax: `"/{*path}"` (`server/static.ts:16`, `server/vite.ts:34`)

## P4 — IIFE async bootstrap

The whole post-middleware setup runs inside `(async () => { ... })()` so we can `await` route registration and the dynamic Vite import.

- Location: `server/index.ts:11-34`
- Top-level `await` is intentionally NOT used because the file is bundled to CJS by esbuild (`scripts/build.ts:33`).

## P5 — Single-port listener with conditional host

API and SPA share one port (`PORT`, default `5000`). Host defaults to `0.0.0.0` in prod and `127.0.0.1` in dev; overridable via `HOST` env var.

- Location: `server/index.ts:29-33`

## P6 — External API proxy with graceful degradation

`POST /api/chat` calls Anthropic's Messages API. If the key is missing OR the upstream fails, returns a friendly fallback message (HTTP 200) instead of erroring.

- Location: `server/routes.ts`
- Always try/catch around `fetch`; never let an upstream error reach the global error handler if a user-facing fallback is appropriate.
