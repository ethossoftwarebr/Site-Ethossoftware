<!-- mustard:generated -->
# Server Recipes

> Step-by-step recipes for the most common changes in `server/`. Each one points at the existing pattern to copy.

## R1 — Add a new API route

Goal: expose `GET /api/leads` (example).

1. Open `server/routes.ts`.
2. Inside `registerRoutes(httpServer, app)`, add the handler ABOVE `return httpServer`:
   ```ts
   app.get("/api/leads", async (_req, res, next) => {
     try {
       // ... your logic
       res.json({ leads: [] });
     } catch (err) {
       next(err);
     }
   });
   ```
3. **Prefix MUST be `/api`** so the catch-all does not swallow the route before it is handled.
4. If you need request validation, define a Zod schema inline in the route file or extract it to a local types module and `.parse()` the body.
5. No registration step elsewhere — `registerRoutes` is already wired at `server/index.ts:12`.

## R2 — Add a new middleware

Goal: e.g. add a security/CORS/rate-limit middleware.

1. In `server/index.ts`, decide ordering:
   - **Before `express.json()`** (`:9`): only if it inspects raw bytes (rare).
   - **After `express.json()`, inside the IIFE before `registerRoutes`** (`:12`): auth, rate limit, request id.
   - **NEVER after `setupVite`/`serveStatic`** — both end in a catch-all (`server/static.ts:16`, `server/vite.ts:34`).
2. Pattern:
   ```ts
   app.use((req, res, next) => {
     // ... logic
     next(); // or res.status(429).json({ message: "..." })
   });
   ```
3. If the middleware is async with I/O, wrap it `(req, res, next) => { fn().then(next).catch(next); }`.
4. Add `try/catch` around any `await` and surface unknown failures via `next(err)` so the global error handler (`server/index.ts:14`) handles them uniformly.

## R3 — Add a new external API proxy route

Use `POST /api/chat` (`server/routes.ts`) as the template:
1. Read the API key from `process.env.X_API_KEY` and degrade gracefully if absent.
2. Wrap `await fetch(...)` in `try/catch`; log via `console.error("X error:", err)`.
3. Return a user-friendly fallback (HTTP 200 with explanatory message) rather than 500 if the failure is non-actionable for the user.

## R4 — Make a new npm package available in the production bundle

By default esbuild keeps deps external. To bundle a dep into `dist/index.cjs`:
1. Open `scripts/build.ts:7-13`.
2. Add the package name to `allowlist`.
3. Re-run `pnpm build`.
