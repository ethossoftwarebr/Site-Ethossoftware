<!-- mustard:generated -->
# Server Patterns

> Recurring shapes used across `server/`. Every entry references a real file:line so you can match the existing convention exactly.

## P1 — Route registration via `registerRoutes(httpServer, app)`

All `/api` handlers are attached inside one async exported function rather than scattered top-level `app.get` calls.

- Definition: `server/routes.ts:113` — `export async function registerRoutes(httpServer: Server, app: Express): Promise<Server>`
- Caller: `server/index.ts:63` — `await registerRoutes(httpServer, app)`
- Rationale: keeps bootstrap order deterministic (parsers → logger → routes → error handler → catch-all).

## P2 — Request logger middleware that captures JSON body

Wraps `res.json` to capture the response body, then logs once on `finish`. Only logs paths under `/api`.

- Location: `server/index.ts:36-60`
- Format: `${time} [express] ${METHOD} ${path} ${status} in ${ms}ms :: ${jsonBody}`
- Time format helper: `log()` at `server/index.ts:25-34` (12-hour clock)

## P3 — Centralized Express error handler registered LAST

Standard Express 4-arg signature; reads `err.status || err.statusCode || 500`, never sends if `headersSent`.

- Location: `server/index.ts:65-76`
- Critical ordering: registered AFTER `registerRoutes` and BEFORE Vite/static (`server/index.ts:65` then `:81`).

## P4 — Dev-vs-prod split for SPA serving

`NODE_ENV === "production"` decides whether to mount static (`server/static.ts`) or dynamically import + setup Vite (`server/vite.ts`). The Vite import is dynamic so `vite` is not pulled in at prod cold-start.

- Location: `server/index.ts:81-86`
- Dev: `setupVite(httpServer, app)` mounts `vite.middlewares` then a catch-all that re-reads + transforms `client/index.html` per request (`server/vite.ts:32-57`)
- Prod: `serveStatic(app)` serves `dist/public/` then a catch-all to `index.html` (`server/static.ts:13-18`)
- Catch-all uses Express 5 syntax: `"/{*path}"` (`server/static.ts:16`, `server/vite.ts:34`)

## P5 — IIFE async bootstrap

The whole post-middleware setup runs inside `(async () => { ... })()` so we can `await` route registration and the dynamic Vite import.

- Location: `server/index.ts:62-103`
- Top-level `await` is intentionally NOT used because the file is bundled to CJS by esbuild (`scripts/build.ts:51`).

## P6 — Storage seam (`IStorage` interface + class implementation + singleton)

Pattern for data access: define interface, provide implementation, export a singleton instance.

- Interface: `server/storage.ts:7-11`
- Implementation: `server/storage.ts:13-36` (`MemStorage`)
- Singleton: `server/storage.ts:38` — `export const storage = new MemStorage()`
- Schema source of truth: `shared/schema.ts` — types imported via `@shared/schema` path alias.

## P7 — Drizzle table declaration with Zod insert schema

`pgTable` for the table, `createInsertSchema(...).pick(...)` for the validated insert payload, then `z.infer` + `$inferSelect` for the TypeScript types.

- Example: `shared/schema.ts:6-19`

## P8 — Raw body capture for webhook signature verification

`express.json({ verify })` stores the raw buffer on `req.rawBody`. Module-augments `http.IncomingMessage` to type it.

- Location: `server/index.ts:9-21`
- Use case: required if a webhook (Stripe, etc.) is later added that needs HMAC verification.

## P9 — External API proxy with graceful degradation

`POST /api/chat` calls Anthropic's Messages API. If the key is missing OR the upstream fails, returns a friendly fallback message (HTTP 200) instead of erroring.

- Location: `server/routes.ts:124-172`
- Always try/catch around `fetch`; never let an upstream error reach the global error handler if a user-facing fallback is appropriate.

## P10 — Single-port, dual-purpose listener

API and SPA share one port (`PORT`, default `5000`). Listen with `host: "0.0.0.0"` and `reusePort: true`.

- Location: `server/index.ts:92-102`
