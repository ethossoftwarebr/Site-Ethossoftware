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
| Dev runner | `tsx` `^4.20.5` | `pnpm dev` → `tsx server/index.ts` |
| Prod runner | `node dist/index.cjs` | Bundled CJS via esbuild |
| Build tool | `esbuild` `^0.25.0` | `scripts/build.ts:29` bundles server to CJS |
| Client dev middleware | `vite` `^7.1.9` | `server/vite.ts` `createViteServer({ middlewareMode: true })` |

## Build chain

1. `pnpm build` → `tsx scripts/build.ts`
2. `viteBuild()` emits the client to `dist/public/`
3. `esbuild` bundles `server/index.ts` → `dist/index.cjs` (CJS, minified, `NODE_ENV` defined as `"production"`, deps in `allowlist` bundled, others kept external).
4. `pnpm start` runs `NODE_ENV=production node dist/index.cjs`.

## External services

- Anthropic Messages API (`https://api.anthropic.com/v1/messages`, model `claude-3-5-haiku-20241022`) — called from `server/routes.ts`. Requires `ANTHROPIC_API_KEY`. Falls back to a static reply if key is absent.

## Required env vars

| Var | Used in | Required? |
|---|---|---|
| `PORT` | `server/index.ts:29` | Optional, defaults to `5000` |
| `HOST` | `server/index.ts:30` | Optional; prod=`0.0.0.0`, dev=`127.0.0.1` |
| `NODE_ENV` | `server/index.ts:22`, `server/index.ts:30` | Selects Vite dev vs static prod |
| `ANTHROPIC_API_KEY` | `server/routes.ts` | Optional; chat route degrades gracefully |
