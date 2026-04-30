---
name: server-bootstrap
description: Use when modifying server/index.ts, changing middleware order, adding a new top-level middleware, changing the listen port, switching between top-level await and IIFE, adjusting raw body capture, or debugging boot-time issues. Triggers on "server bootstrap", "app initialization", "middleware order", "listen port", "PORT 5000", "express.json verify", "rawBody", "top-level await".
source: scan
---
<!-- mustard:generated -->
# Server Bootstrap (server/index.ts)

> The single entrypoint. Handles parser registration, request logging, route registration, error handling, dev/prod SPA branch, and HTTP listen — in that exact order, inside an async IIFE.

## When to use

- Adding a new top-level middleware
- Changing the port or host
- Modifying the JSON `verify` hook (raw body capture)
- Refactoring the IIFE
- Wiring a new bootstrap concern (sessions, metrics, tracing)

## The bootstrap order (do not reorder)

```
:1-7   imports + create app + httpServer
:9-13  declare module "http" → IncomingMessage.rawBody type
:15-21 express.json (with verify capturing rawBody)
:23    express.urlencoded
:25-34 log() helper
:36-60 request logger middleware
:62    (async () => {
:63    await registerRoutes(httpServer, app)
:65-76 global error handler
:81-86 dev (vite) OR prod (static)
:92-102 httpServer.listen({ port, host: "0.0.0.0", reusePort: true })
:103   })();
```

## Rules

1. **No top-level `await`.** The file is bundled to CJS by esbuild (`script/build.ts:51-54`); TLA breaks. Use the IIFE.
2. **Port reads `process.env.PORT` with `5000` fallback** (`server/index.ts:92`). Never hardcode.
3. **Listen on `host: "0.0.0.0"` and `reusePort: true`** (`server/index.ts:96-97`) — required by the deployment target.
4. **Raw body** is exposed via `req.rawBody` (`server/index.ts:9-21`). Useful for webhook signature verification (Stripe, GitHub). Don't remove the `verify` hook even if no current route uses it — removing it breaks future webhook routes.
5. **`express.urlencoded({ extended: false })`** — keep it `false` unless a route requires nested objects from form posts.
6. **The `log()` helper is exported** (`server/index.ts:25`) so other modules (e.g. `server/vite.ts`) can use the same time format.
7. **Add new middleware to the right slot:**
   - Before parsers: only if it inspects raw bytes
   - Between parsers and request logger: auth, rate limit, request id
   - Between request logger and `registerRoutes`: rare; only if you want logs but want to short-circuit before route handlers
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
httpServer.listen(
  { port, host: "0.0.0.0", reusePort: true },
  () => { log(`serving on port ${port}`); },
);
```

`reusePort: true` enables SO_REUSEPORT — required for blue/green deploys on this host.

## References

- Implementation: `server/index.ts`
- Build / CJS reasoning: `script/build.ts:51-54`
- Patterns: `server/.claude/commands/patterns.md` §P5, §P8, §P10
- Examples: `references/examples.md`
