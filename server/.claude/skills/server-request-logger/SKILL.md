---
name: server-request-logger
description: Use when modifying the request logging middleware, adding response-body capture, changing log format, troubleshooting why requests aren't appearing in logs, or adding observability to the Express backend. Triggers on "log requests", "request logger", "log the response", "add logging middleware", "why isn't my route logging".
source: scan
---
<!-- mustard:generated -->
# Server Request Logger

> The custom middleware at `server/index.ts:36-60` logs only paths starting with `/api`. It captures the `res.json` body by wrapping the function, then emits a single line on `res.on("finish")`.

## When to use

- A new route isn't appearing in logs (likely missing `/api` prefix)
- You want to extend the log line (add a field, redact a value)
- You're adding a new logging concern (request id, user id) — this is the right hook
- You're auditing log output for PII / secret leakage

## How it works

```ts
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});
```

## Rules

1. **Only `/api*` paths log.** Move endpoints under `/api` if you want them logged.
2. **The response body is included in the log if you call `res.json(...)`.** Plain `res.send(...)` is NOT captured.
3. **DO NOT log secrets.** Before adding a route that returns tokens, password hashes, or API keys, add a redaction step here OR avoid `res.json` for the sensitive payload.
4. **The `log()` helper** is exported from `server/index.ts:25-34`. Call signature: `log(message, source = "express")`.
5. **Time format is 12-hour** with seconds (`hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true`). Don't change without checking downstream log parsers.
6. **Don't move this middleware** below `setupVite` / `serveStatic` — both end in catch-alls that prevent `finish` ordering you may depend on. Current order in `server/index.ts:36` (after parsers, before routes) is correct.

## Extension example: add request id

```ts
import { randomUUID } from "crypto";

app.use((req, res, next) => {
  (req as any).id = randomUUID();
  res.setHeader("x-request-id", (req as any).id);
  next();
});
// Then in the existing logger, prepend ` [${(req as any).id}]` to logLine.
```

## References

- Implementation: `server/index.ts:36-60`
- Helper: `server/index.ts:25-34`
- Examples: `references/examples.md`
- Patterns: `server/.claude/commands/patterns.md` §P2
