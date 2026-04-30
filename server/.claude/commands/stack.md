<!-- mustard:generated -->
# Server Stack

> Express 5 backend (TypeScript) that boots an HTTP server, registers `/api` routes, mounts Vite middleware in dev or static assets in prod, and is bundled to a single `dist/index.cjs` for production.

## Runtime

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node.js >= 18 | ESM project (`"type": "module"` in `package.json`) |
| Web framework | Express `^5.0.1` | `server/index.ts:6` `const app = express()` |
| HTTP server | `http.createServer` | Used for both Express + Vite HMR (`server/index.ts:7`, `server/vite.ts:13`) |
| Language | TypeScript `5.6.3` | `tsx` for dev, `esbuild` for prod bundle |
| Dev runner | `tsx` `^4.20.5` | `npm run dev` → `tsx server/index.ts` |
| Prod runner | `node dist/index.cjs` | Bundled CJS via esbuild |
| Build tool | `esbuild` `^0.25.0` | `script/build.ts:49` bundles server to CJS |
| Client dev middleware | `vite` `^7.1.9` | `server/vite.ts:18` `createViteServer({ middlewareMode: true })` |

## Data layer

| Layer | Choice | Notes |
|---|---|---|
| ORM | `drizzle-orm` `^0.39.3` | Schema lives in `shared/schema.ts` |
| Migrations | `drizzle-kit` `^0.31.4` | `npm run db:push` (config: `drizzle.config.ts`) |
| Driver | `pg` `^8.16.3` | Postgres only (`dialect: "postgresql"`) |
| Validation | `drizzle-zod` + `zod` | `createInsertSchema(users)` in `shared/schema.ts:12` |
| Storage interface | `MemStorage` (in-memory) | `server/storage.ts:13`. Drizzle entities declared but no Postgres-backed implementation wired yet. |

## Auth / sessions (declared, not yet wired)

`passport ^0.7.0`, `passport-local ^1.0.0`, `express-session ^1.18.1`, `connect-pg-simple ^10.0.0`, `memorystore ^1.6.7`. Present in `package.json` but **no `app.use(session(...))` or Passport strategy is currently registered** in `server/`.

## Realtime

`ws ^8.18.0` is a dependency (esbuild allowlisted at `script/build.ts:29`); no WebSocket handler is currently registered in `server/routes.ts`.

## Build chain

1. `npm run build` → `tsx script/build.ts`
2. `viteBuild()` emits the client to `dist/public/`
3. `esbuild` bundles `server/index.ts` → `dist/index.cjs` (CJS, minified, `NODE_ENV` defined as `"production"`, deps in `allowlist` bundled, others kept external).
4. `npm start` runs `NODE_ENV=production node dist/index.cjs`.

## External services

- Anthropic Messages API (`https://api.anthropic.com/v1/messages`, model `claude-3-5-haiku-20241022`) — called from `server/routes.ts:140`. Requires `ANTHROPIC_API_KEY`. Falls back to a static reply if key is absent.

## Required env vars

| Var | Used in | Required? |
|---|---|---|
| `PORT` | `server/index.ts:92` | Optional, defaults to `5000` |
| `NODE_ENV` | `server/index.ts:81` | Selects Vite dev vs static prod |
| `ANTHROPIC_API_KEY` | `server/routes.ts:131` | Optional; chat route degrades gracefully |
| `DATABASE_URL` | `drizzle.config.ts:3` | Required for `db:push` only |
