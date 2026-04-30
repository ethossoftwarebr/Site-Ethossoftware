<!-- mustard:generated -->
# Stack — client (frontend)

> Marketing single-page app for Ethos Software, served from `client/` and bundled by Vite at the monorepo root.

## Runtime

- **React 19** (`react@^19.2.0`, `react-dom@^19.2.0`) — function components only
- **TypeScript 5.6** — `strict: true`, `moduleResolution: bundler`, `jsx: preserve`
- **Vite 7** (root `vite.config.ts:8`) — dev server on port `5000` (`npm run dev:client`)
- **Wouter 3** (`react-router` alternative) — declarative `<Switch>/<Route>` (`client/src/App.tsx:14`)

## Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin (`vite.config.ts:12`)
- **PostCSS** with `tailwindcss` + `autoprefixer` (`postcss.config.js:1`)
- **`@import "tailwindcss"`** + custom variant `@custom-variant dark (&:is(.dark *))` (`client/src/index.css:1`)
- HSL CSS variables on `:root` and `.dark` (`client/src/index.css:34`, `:57`)
- Brand palette hard-coded as hex: `#A229F2` `#531B8C` `#BA66F2` `#1a0a2e`
- `tw-animate-css` + `tailwindcss-animate` for keyframes
- Custom `.shiny-cta` class with `@property` color/angle definitions (`client/src/index.css:111`)

## UI Layer

- **shadcn/ui** primitives in `client/src/components/ui/*` (60+ files) wrapping Radix UI
- **Radix UI** packages: dialog, dropdown-menu, accordion, tabs, tooltip, slider, etc.
- **lucide-react** for icons (used by every section component)
- **framer-motion 12** for entrance animations and `AnimatePresence`
- **three.js 0.184** dynamically imported by `client/src/components/AuroraBackground.tsx:42`
- **embla-carousel-react** (carousel primitive in `client/src/components/ui/carousel.tsx`)
- **sonner** + custom toast (`client/src/components/ui/sonner.tsx`, `client/src/hooks/use-toast.ts`)
- **vaul** for drawer

## Data / Forms

- **TanStack Query 5** (`@tanstack/react-query`) — `client/src/lib/queryClient.ts:44` configures `staleTime: Infinity`, `retry: false`, default `queryFn` over `fetch`
- **react-hook-form** + **@hookform/resolvers** + **zod** for form validation
- Static data lives in `client/src/data/projects.ts:17`

## Path Aliases (resolved by Vite + tsconfig)

| Alias | Target |
|-------|--------|
| `@/*` | `client/src/*` |
| `@shared/*` | `shared/*` |
| `@assets/*` | `attached_assets/*` |

## Build & Tooling

```bash
npm run dev:client          # Vite dev server, port 5000
npm run build               # tsx script/build.ts (bundles client + server)
npm run check               # tsc --noEmit
```

- `tsx` runs the build script and the Express dev server
- `esbuild` bundles the server output for `dist/index.cjs`
- `@replit/vite-plugin-runtime-error-modal` + cartographer + dev-banner active in dev only (`vite.config.ts:11`)

## Theme

- Custom `ThemeProvider` (`client/src/components/ThemeProvider.tsx:19`) — persists to `localStorage["ethos-theme"]`
- Toggles `.dark` on `<html>`; CSS vars in `client/src/index.css` flip values
- `next-themes` is installed but not used (custom provider is the source of truth)

## Notable Conventions

- Every interactive node carries `data-testid="..."` for QA hooks
- Pure-CommonJS server, but client is ESM (`"type": "module"` at root)
- The Vite root is `client/`, but `package.json` lives at the monorepo root (`vite.config.ts:38`)
