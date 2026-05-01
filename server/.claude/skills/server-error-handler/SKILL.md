---
name: server-error-handler
description: Use when modifying the global Express error handler, adding error normalization, changing error response shape, or debugging why errors return wrong status codes. Triggers on "error handler", "500 error", "error middleware", "next(err)", "errors not caught", "express error response". Enforces ordering rules and headersSent guard.
source: scan
---
<!-- mustard:generated -->
# Server Error Handler

> The global error handler lives at `server/index.ts:14-20`. It MUST stay registered AFTER `registerRoutes(...)` and BEFORE the dev/prod catch-all (`setupVite` / `serveStatic`).

## When to use

- Adding error normalization (e.g. mapping Zod errors to 400)
- Changing the response shape `{ message }`
- Wiring observability (Sentry, structured logging) into errors
- Debugging "why does my error return 500 with empty body?" (likely `headersSent`)

## Current implementation

```ts
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Internal Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
});
```

## Ordering rules (critical)

In `server/index.ts`:

1. `express.json()` parser (`:9`)
2. `await registerRoutes(...)` (`:12`)
3. **error handler** (`:14-20`) ← this one
4. `setupVite` OR `serveStatic` (`:22-27`)
5. `httpServer.listen(...)` (`:31-33`)

If you flip 3 and 4 the catch-all at `server/static.ts:16` / `server/vite.ts:34` will swallow the request before the error handler ever sees it.

## Rules

1. **Always check `res.headersSent`** before sending. The handler currently does this at `server/index.ts:18`. If true, delegate to `next(err)` so Express closes the connection.
2. **Always pass 4 args** (`err, req, res, next`) — Express identifies error-handling middleware by arity.
3. **Use `console.error`** with the prefix `"Internal Server Error:"` so logs are greppable.
4. **Don't leak `err.stack` to clients.** Only `{ message }` is exposed. Stack stays in server logs.
5. **Read status from `err.status || err.statusCode || 500`** (not just `err.status`). Some libs use `statusCode`.
6. **For known error types** (`ZodError`, custom `HttpError`), normalize BEFORE this handler — either inside the route via `try/catch` + `next(new HttpError(400, msg))`, or via a dedicated error-mapping middleware registered between routes and this one.

## Extension example: Zod normalization

```ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: fromZodError(err).message });
  }
  next(err); // delegate to the existing global handler
});
```
Insert ABOVE the global handler (between `registerRoutes` and `:14`).

## References

- Implementation: `server/index.ts:14-20`
- Patterns: `server/.claude/commands/patterns.md` §P2
- Guards: `server/.claude/commands/guards.md`
- Examples: `references/examples.md`
