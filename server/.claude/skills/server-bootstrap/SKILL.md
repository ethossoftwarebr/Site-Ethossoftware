---
name: server-bootstrap
description: Use when modifying server/index.ts, changing middleware order, adding a new top-level middleware, changing the listen port, or debugging boot-time issues. Triggers on "server bootstrap", "app initialization", "middleware order", "listen port", "PORT 5000", "top-level await".
source: scan
---
<!-- mustard:generated -->
# Server Bootstrap (server/index.ts)

> The single entrypoint. Handles JSON parser registration, route registration, error handling, dev/prod SPA branch, and HTTP listen — in that exact order, inside an async IIFE.

## When to use

- Adding a new top-level middleware
- Changing the port or host
- Refactoring the IIFE
- Wiring a new bootstrap concern (sessions, metrics, tracing)

## The bootstrap order (do not reorder)

```
:1-4   imports
:6-7   const app + httpServer
:9     express.json() — sole body parser
:11    (async () => {
:12    await registerRoutes(httpServer, app)
:14-20 global error handler
:22-27 dev (vite) OR prod (static)
:29    const port = process.env.PORT || "5000"
:30    const host = HOST env or prod/dev default
:31-33 httpServer.listen({ port, host }, ...)
:34    })();
```

## Rules

1. **No top-level `await`.** The file is bundled to CJS by esbuild (`scripts/build.ts:33`); TLA breaks. Use the IIFE at `:11`.
2. **Port reads `process.env.PORT` with `5000` fallback** (`server/index.ts:29`). Never hardcode.
3. **Host is conditional** (`server/index.ts:30`): prod = `0.0.0.0`, dev = `127.0.0.1`; override via `HOST` env var.
4. **`express.json()` at `:9` is the sole body parser.** Do NOT add `express.urlencoded()` — all API routes are JSON-only.
5. **Add new middleware to the right slot:**
   - Before `:9` parsers: only if it inspects raw bytes
   - Inside IIFE before `registerRoutes` (`:12`): auth, rate limit, request id
   - **NEVER after `setupVite`/`serveStatic`** — catch-all swallows everything

## Adding to the IIFE — example

```ts
(async () => {
  await registerRoutes(httpServer, app);

  // NEW: register a metrics router under /metrics
  app.use("/metrics", await createMetricsRouter());

  app.use((err, _req, res, next) => { /* existing handler */ });
  // ...
})();
```

## Listen block (don't change without reason)

```ts
const port = parseInt(process.env.PORT || "5000", 10);
const host = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
httpServer.listen({ port, host }, () => {
  console.log(`\n  Ethos Software — listening on http://${host}:${port}\n`);
});
```

## References

- Implementation: `server/index.ts`
- Build / CJS reasoning: `scripts/build.ts:33`
- Patterns: `server/.claude/commands/patterns.md` §P4, §P5
- Examples: `references/examples.md`
