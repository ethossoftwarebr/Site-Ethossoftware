<!-- mustard:generated -->
# Server Guards

> DO / DON'T rules for editing `server/`. Each rule cites the file/line that establishes it.

## DO

- **DO** register every API route under the `/api` prefix (`server/routes.ts`).
- **DO** add new routes inside `registerRoutes(...)` in `server/routes.ts` — never call `app.get/post` from a different module.
- **DO** keep the global error handler registered LAST among non-catch-all middleware, BEFORE Vite/static setup (`server/index.ts:14` precedes `:22-27`).
- **DO** read the port from `process.env.PORT` with fallback `5000` (`server/index.ts:29`).
- **DO** read the host from `process.env.HOST`, defaulting to `0.0.0.0` in prod and `127.0.0.1` in dev (`server/index.ts:30`).
- **DO** use the Express 5 catch-all syntax `"/{*path}"` (not `"*"`). See `server/static.ts:16` and `server/vite.ts:34`.
- **DO** check `res.headersSent` before sending an error response (`server/index.ts:18`).
- **DO** use `try/catch` around any `await fetch(...)` to an external API; return a user-friendly fallback (`server/routes.ts`).
- **DO** add new bundled-into-prod npm packages to the `allowlist` in `scripts/build.ts:7-13`. Anything not in the allowlist stays external and must be installed at runtime.

## DON'T

- **DON'T** use top-level `await` in `server/index.ts`. The IIFE at `:11` exists because esbuild emits CJS (`scripts/build.ts:33`) where TLA breaks.
- **DON'T** import `vite` (or anything in `server/vite.ts`) at the top of `server/index.ts`. It is dynamically imported only when `NODE_ENV !== "production"` (`server/index.ts:25`) so prod cold start stays small.
- **DON'T** log secrets, raw request bodies, password hashes, or API keys.
- **DON'T** hardcode API keys. Read from `process.env.*` and degrade gracefully when absent.
- **DON'T** mutate `process.env.NODE_ENV` at runtime. The dev/prod branch in `server/index.ts:22` runs once.
- **DON'T** register middleware AFTER `setupVite` / `serveStatic` — both end with a catch-all that swallows everything.
- **DON'T** use `__dirname` in dev code. `server/static.ts` uses `__dirname` because that file only runs in the esbuild CJS bundle (where `__dirname` exists). Dev-only code (`server/vite.ts`) uses `import.meta.dirname`. Keep that split.
- **DON'T** add a second `httpServer.listen(...)` call. The single listener at `server/index.ts:31` is shared with Vite HMR (`server/vite.ts:14`).
- **DON'T** introduce a separate Express app for `/api`. One process, one app, one port — that is the deployment contract.
- **DON'T** register `express.urlencoded(...)`. `POST /api/chat` is JSON-only; `express.json()` at `server/index.ts:9` is the sole body parser.

## Conventions

- Errors logged with `console.error("Internal Server Error:", err)` (`server/index.ts:17`).
- Response Content-Type for non-JSON: set explicitly via `res.setHeader("Content-Type", ...)`.
