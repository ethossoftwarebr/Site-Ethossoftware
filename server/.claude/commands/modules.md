<!-- mustard:generated -->
# Server Modules

> Four files compose the backend: bootstrap, routes, dev middleware, and prod static handler. Each has a single responsibility.

## File map

| File | LOC | Exports | Purpose |
|---|---|---|---|
| `server/index.ts` | 35 | — | Bootstraps Express, mounts `express.json()` (sole body parser), registers `/api` routes, error handler, picks dev (Vite) vs prod (static), and listens on `PORT` (host conditional via `HOST` env). |
| `server/routes.ts` | 175 | `registerRoutes(httpServer, app)` | Registers two `/api` routes: `GET /api/sitecontent` (returns marketing copy) and `POST /api/chat` (proxy to Anthropic Messages API). Holds `SYSTEM_PROMPT` + `SITE_CONTENT` constants. |
| `server/static.ts` | 19 | `serveStatic(app)` | Production fallback: serves `dist/public/` static files and SPA-fallback to `index.html`. |
| `server/vite.ts` | 58 | `setupVite(server, app)` | Dev fallback: spins up Vite in middleware mode with HMR on `/vite-hmr`, transforms `client/index.html` per request, hot-busts `main.tsx` cache via `nanoid`. |

## Cross-file relationships

```
server/index.ts
 ├── imports registerRoutes   ← server/routes.ts
 ├── imports serveStatic      ← server/static.ts
 └── dynamic-imports setupVite ← server/vite.ts (only when NODE_ENV !== "production")
```

## Routes registered

Extracted from `server/routes.ts`:

| Method | Path | Handler location | Notes |
|---|---|---|---|
| GET | `/api/sitecontent` | `routes.ts:117` | Returns `SITE_CONTENT` (text/plain, UTF-8). Sets `Access-Control-Allow-Origin: *`. |
| POST | `/api/chat` | `routes.ts:123` | Body: `{ messages: [{role, content}, ...] }`. Forwards to Claude API; falls back to friendly WhatsApp message on missing key or error. |

## Middleware order (server/index.ts)

1. `express.json()` (`index.ts:9`)
2. **Routes** (`registerRoutes` — `index.ts:12`)
3. **Error handler** (`index.ts:14-20`) — registered LAST before catch-all
4. Dev: Vite middleware OR Prod: static (`index.ts:22-27`)
