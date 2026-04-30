---
name: server-route-registration
description: Use when adding a new API route, modifying an existing /api endpoint, refactoring server/routes.ts, or wiring up a new HTTP handler in the Express backend. Triggers on phrases like "add a route", "new endpoint", "expose an API", "POST /api/...", "GET /api/...". Enforces the registerRoutes() centralization pattern and the /api prefix rule.
source: scan
---
<!-- mustard:generated -->
# Server Route Registration

> All `/api` handlers in this project MUST be added inside the single `registerRoutes(httpServer, app)` function in `server/routes.ts`. Never call `app.get/post` from any other module.

## When to use

- Adding a new HTTP endpoint under `/api`
- Modifying an existing handler in `server/routes.ts`
- Reviewing a PR that introduces new routes
- Refactoring route logic into helpers

## Rules

1. **All routes go inside `registerRoutes`** at `server/routes.ts:113`. Do NOT spread `app.get(...)` calls across multiple files.
2. **All public routes MUST start with `/api`**. The request logger at `server/index.ts:49` only logs paths matching `/api*`. Routes outside `/api` will be silently swallowed by the SPA catch-all in dev (`server/vite.ts:34`) and prod (`server/static.ts:16`).
3. **Add new handlers ABOVE `return httpServer`** at the end of the function.
4. **Validate input early.** If you accept a body, check shape and return `400` immediately:
   ```ts
   if (!messages || !Array.isArray(messages)) {
     return res.status(400).json({ error: "messages array required" });
   }
   ```
5. **Wrap `await fetch(...)` and any I/O in `try/catch`.** Return a friendly fallback (HTTP 200) for user-facing degradations or `next(err)` to surface to the global handler.
6. **Set explicit `Content-Type` for non-JSON responses** (`res.setHeader("Content-Type", "text/plain; charset=utf-8")`).
7. **Do NOT call `app.use(errorHandler)` or `app.use(catchAll)` from inside `registerRoutes`.** Those live in `server/index.ts` (`:65` and `:81-86`) and depend on registration order.

## Quick template

```ts
app.get("/api/<resource>", async (req, res, next) => {
  try {
    // 1. validate
    // 2. call storage / external API
    // 3. respond
    res.json({ /* ... */ });
  } catch (err) {
    next(err);
  }
});
```

## Don't

- Don't return raw error messages to the client (`err.message` may leak internals). Prefer a fixed shape `{ message: "..." }`.
- Don't log password hashes, tokens, or full request bodies — the logger captures `res.json` payloads (`server/index.ts:41-45`).
- Don't introduce a router from a different file unless you also wire `app.use("/api/...", router)` inside `registerRoutes`.

## References

- Existing routes: `references/examples.md`
- Pattern reference: `server/.claude/commands/patterns.md` §P1
- Full recipe: `server/.claude/commands/recipes.md` §R1
