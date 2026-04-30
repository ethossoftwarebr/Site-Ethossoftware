---
name: server-dev-vs-prod-vite
description: Use when changing how the SPA is served, debugging "page not found" issues, modifying the Vite dev middleware, changing static file serving, switching between dev and production behavior, or adjusting the dynamic import of vite. Triggers on "serve the SPA", "Vite middleware", "static files", "catch-all", "index.html fallback", "HMR", "dev vs prod", "client build not loading".
source: scan
---
<!-- mustard:generated -->
# Dev vs Prod SPA Serving

> A single `NODE_ENV === "production"` check at `server/index.ts:81` decides whether to mount Vite middleware (`server/vite.ts`) or static assets (`server/static.ts`). Both end with an Express 5 catch-all (`"/{*path}"`) that swallows everything not handled earlier.

## When to use

- "My SPA returns 404 for client-side routes" → catch-all not registered correctly
- Changing where the production build is served from
- Modifying HMR or dev-only behavior
- Adding a new top-level mount that conflicts with the catch-all

## The split (server/index.ts:81-86)

```ts
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
} else {
  const { setupVite } = await import("./vite");
  await setupVite(httpServer, app);
}
```

**Note:** the import of `./vite` is **dynamic** — `vite` is a heavy dep and we don't want it loaded in production cold start. Don't change this to a top-level static import.

## Production: server/static.ts

```ts
export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(`Could not find the build directory: ${distPath}, ...`);
  }
  app.use(express.static(distPath));
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
```

- Uses `__dirname` (CJS) — works because `server/static.ts` only runs inside the esbuild CJS bundle (`script/build.ts:51`).
- `dist/public/` is produced by `viteBuild()` at `script/build.ts:39`.

## Development: server/vite.ts

```ts
const vite = await createViteServer({
  ...viteConfig,
  configFile: false,
  customLogger: { ...viteLogger, error: (msg, options) => { viteLogger.error(msg, options); process.exit(1); } },
  server: { middlewareMode: true, hmr: { server, path: "/vite-hmr" }, allowedHosts: true },
  appType: "custom",
});

app.use(vite.middlewares);

app.use("/{*path}", async (req, res, next) => {
  const url = req.originalUrl;
  try {
    const clientTemplate = path.resolve(import.meta.dirname, "..", "client", "index.html");
    let template = await fs.promises.readFile(clientTemplate, "utf-8");
    template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
    const page = await vite.transformIndexHtml(url, template);
    res.status(200).set({ "Content-Type": "text/html" }).end(page);
  } catch (e) {
    vite.ssrFixStacktrace(e as Error);
    next(e);
  }
});
```

- HMR shares the existing `httpServer` over `/vite-hmr`.
- `index.html` is re-read from disk per request (so file edits show up without restart).
- `nanoid` cache-busts `main.tsx` so HMR picks up cold reloads.
- Uses `import.meta.dirname` (ESM) — only valid because dev runs through `tsx` (ESM-aware).
- On Vite logger error, the process exits with code 1 (`server/vite.ts:24-27`) — matches the dev contract that compile errors should crash, not silently degrade.

## Rules

1. **NEVER replace the dynamic import** of `./vite` in `server/index.ts:84` with a static one. That would pull all of Vite into the prod bundle.
2. **NEVER add `app.use(...)` AFTER `setupVite`/`serveStatic`** — the catch-all swallows everything.
3. **Catch-all syntax is Express 5** `"/{*path}"`. Plain `"*"` will throw with `path-to-regexp` v8.
4. **`server/static.ts` uses `__dirname`** intentionally (CJS bundle). **`server/vite.ts` uses `import.meta.dirname`** (ESM). Don't unify them — they run in different contexts.
5. **Production requires `dist/public/`.** If `serveStatic` throws "Could not find the build directory", you forgot `npm run build` (or your deploy didn't ship `dist/public`).
6. **HMR path is `/vite-hmr`** — if you add a WebSocket route, don't conflict with this path.

## References

- Split decision: `server/index.ts:81-86`
- Static: `server/static.ts:5-19`
- Dev: `server/vite.ts:11-58`
- Build: `script/build.ts:38-61`
- Examples: `references/examples.md`
