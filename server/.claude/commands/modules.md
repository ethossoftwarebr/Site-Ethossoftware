<!-- mustard:generated -->
# Server Modules

> Five files compose the backend: bootstrap, routes, dev middleware, prod static handler, and storage. Each has a single responsibility.

## File map

| File | LOC | Exports | Purpose |
|---|---|---|---|
| `server/index.ts` | 103 | `log()` | Bootstraps Express, mounts JSON+urlencoded parsers, request logger, registers routes, error handler, picks dev (Vite) vs prod (static) and listens on `PORT`. |
| `server/routes.ts` | 175 | `registerRoutes(httpServer, app)` | Registers two `/api` routes: `GET /api/sitecontent` (returns marketing copy) and `POST /api/chat` (proxy to Anthropic Messages API). Holds `SYSTEM_PROMPT` + `SITE_CONTENT` constants. |
| `server/static.ts` | 19 | `serveStatic(app)` | Production fallback: serves `dist/public/` static files and SPA-fallback to `index.html`. |
| `server/vite.ts` | 58 | `setupVite(server, app)` | Dev fallback: spins up Vite in middleware mode with HMR on `/vite-hmr`, transforms `client/index.html` per request, hot-busts `main.tsx` cache via `nanoid`. |
| `server/storage.ts` | 38 | `IStorage`, `MemStorage`, `storage` | In-memory user store implementing `IStorage`. Declares CRUD seam for future Postgres implementation. |

## Cross-file relationships

```
server/index.ts
 ├── imports registerRoutes   ← server/routes.ts
 ├── imports serveStatic      ← server/static.ts
 ├── dynamic-imports setupVite ← server/vite.ts (only when NODE_ENV !== "production")
 └── (none)                    ← server/storage.ts is currently unused by routes
shared/schema.ts
 └── consumed by              → server/storage.ts (User, InsertUser types)
```

## Routes registered

Extracted from `server/routes.ts`:

| Method | Path | Handler location | Notes |
|---|---|---|---|
| GET | `/api/sitecontent` | `routes.ts:118` | Returns `SITE_CONTENT` (text/plain, UTF-8). Sets `Access-Control-Allow-Origin: *`. |
| POST | `/api/chat` | `routes.ts:124` | Body: `{ messages: [{role, content}, ...] }`. Forwards to Claude API; falls back to friendly WhatsApp message on missing key or error. |

## Middleware order (server/index.ts)

1. `express.json({ verify })` — captures `req.rawBody` (`index.ts:15-21`)
2. `express.urlencoded({ extended: false })` (`index.ts:23`)
3. Request logger (`index.ts:36-60`) — captures `res.json` body and logs only `/api*` requests
4. **Routes** (`registerRoutes` — `index.ts:63`)
5. **Error handler** (`index.ts:65-76`) — registered LAST before the dev/prod catch-all
6. Dev: Vite middleware OR Prod: static (`index.ts:81-86`)

## Dead/unused code

- `server/storage.ts` is exported but no route in `server/routes.ts` calls `storage.*`. Keep until first auth/CRUD route lands.
