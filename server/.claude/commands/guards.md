<!-- mustard:generated -->
# Server Guards

> DO / DON'T rules for editing `server/`. Each rule cites the file/line that establishes it.

## DO

- **DO** register every API route under the `/api` prefix. The request logger only emits log lines for paths starting with `/api` (`server/index.ts:49`).
- **DO** add new routes inside `registerRoutes(...)` in `server/routes.ts` — never call `app.get/post` from a different module. (`server/routes.ts:113`)
- **DO** keep the global error handler registered LAST among non-catch-all middleware, BEFORE Vite/static setup (`server/index.ts:65` precedes `:81`).
- **DO** read the port from `process.env.PORT` with fallback `5000` (`server/index.ts:92`).
- **DO** listen on `host: "0.0.0.0"` with `reusePort: true` (`server/index.ts:96-97`) — required by the deployment target.
- **DO** use the Express 5 catch-all syntax `"/{*path}"` (not `"*"`). See `server/static.ts:16` and `server/vite.ts:34`.
- **DO** check `res.headersSent` before sending an error response (`server/index.ts:71-73`).
- **DO** use `try/catch` around any `await fetch(...)` to an external API; return a user-friendly fallback (`server/routes.ts:139-171`).
- **DO** keep schema in `shared/schema.ts` and import server-side via the `@shared/*` path alias (`server/storage.ts:1`).
- **DO** add new bundled-into-prod npm packages to the `allowlist` in `script/build.ts:7-33`. Anything not in the allowlist stays external and must be installed at runtime.
- **DO** wrap response logging body with the `res.json` interceptor pattern (`server/index.ts:41-45`) if you need to log new payloads — don't log raw request bodies (PII risk).

## DON'T

- **DON'T** use top-level `await` in `server/index.ts`. The IIFE at `:62` exists because esbuild emits CJS (`script/build.ts:53`) where TLA breaks.
- **DON'T** import `vite` (or anything in `server/vite.ts`) at the top of `server/index.ts`. It's dynamically imported only when `NODE_ENV !== "production"` (`server/index.ts:84`) so prod cold start stays small.
- **DON'T** log secrets or full request bodies. The current logger captures `res.json` payloads — review before adding routes that return tokens, password hashes, or API keys.
- **DON'T** hardcode API keys. Read from `process.env.*` and degrade gracefully when absent (see `server/routes.ts:131-137`).
- **DON'T** mutate `process.env.NODE_ENV` at runtime. The dev/prod branch in `server/index.ts:81` runs once.
- **DON'T** register middleware AFTER `setupVite` / `serveStatic` — both end with a catch-all that swallows everything.
- **DON'T** use `__dirname` in dev code. `server/static.ts:6` uses `__dirname` because that file only runs in the esbuild CJS bundle (where `__dirname` exists). Dev-only code (`server/vite.ts:39`) uses `import.meta.dirname`. Keep that split.
- **DON'T** call `storage.*` directly from a route without first replacing `MemStorage` with a Postgres-backed Drizzle implementation if persistence is required — `MemStorage` resets on every restart (`server/storage.ts:13-36`).
- **DON'T** run `db:push` without `DATABASE_URL` set. `drizzle.config.ts:3-4` will throw.
- **DON'T** add a second `httpServer.listen(...)` call. The single listener at `server/index.ts:93` is shared with Vite HMR (`server/vite.ts:14`).
- **DON'T** introduce a separate Express app for `/api`. One process, one app, one port — that is the deployment contract.

## Conventions

- Errors logged with `console.error("Internal Server Error:", err)` (`server/index.ts:69`); operational logs via `log(...)` from `server/index.ts:25`.
- Time format in logs: 12-hour with seconds (`server/index.ts:26-31`). Don't change without checking downstream log parsers.
- Response Content-Type for non-JSON: set explicitly via `res.setHeader("Content-Type", ...)` (`server/routes.ts:119`).
