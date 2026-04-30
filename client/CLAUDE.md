<!-- mustard:generated -->
# CLAUDE.md — client subproject

> Frontend marketing SPA for Ethos Software. React 19 + Vite 7 + TypeScript + Tailwind v4 + Wouter + shadcn/ui + framer-motion + three.js.

## Stack

- **Runtime:** React 19, TypeScript 5.6 (`strict`), Vite 7, Wouter 3
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) + custom `dark` variant + brand palette `#A229F2` `#531B8C` `#BA66F2`
- **UI:** shadcn/ui primitives in `src/components/ui/` over Radix UI; lucide-react icons; framer-motion 12; three.js 0.184 (dynamic import)
- **State/Data:** TanStack Query 5 (`src/lib/queryClient.ts`); static data under `src/data/`
- **Forms:** react-hook-form + zod + `@hookform/resolvers`
- **Theme:** custom `ThemeProvider` with `localStorage["ethos-theme"]` (NOT next-themes)

## Commands

```bash
pnpm dev                # Express + Vite middleware (SPA + API on :5000, hot-reload via tsx watch)
pnpm check              # tsc --noEmit (full repo)
pnpm build              # tsx script/build.ts (bundles client + server)
```

## Key Paths

| Path | Purpose |
|------|---------|
| `client/src/App.tsx` | Provider stack + Wouter `<Switch>` |
| `client/src/main.tsx` | `createRoot` entry |
| `client/src/index.css` | Tailwind v4 import, theme tokens, `.shiny-cta` keyframes |
| `client/src/pages/` | Route components (`Home`, `ServicesPage`, `PortfolioPage`, `not-found`) |
| `client/src/components/` | Marketing sections (PascalCase) + special components (`AuroraBackground`, `ThemeProvider`) |
| `client/src/components/ui/` | shadcn/Radix primitives (kebab-case) + custom `gradient-card`, `shiny-button` |
| `client/src/context/WizardContext.tsx` | Reserved global wizard provider |
| `client/src/hooks/` | `use-mobile`, `use-toast` |
| `client/src/lib/utils.ts` | `cn()` |
| `client/src/lib/queryClient.ts` | Shared TanStack `QueryClient` + `apiRequest()` |
| `client/src/data/projects.ts` | Portfolio data source |
| `vite.config.ts` (repo root) | Vite root = `client/`; aliases `@`, `@shared`, `@assets` |
| `tsconfig.json` (repo root) | Mirrors Vite aliases under `paths` |

## Guards

- DO use the `@/` alias for everything in `client/src/`. Never relative-import past one level.
- DO compose with shadcn primitives in `client/src/components/ui/`; DON'T edit them in place — wrap.
- DO use `cn(...)` from `@/lib/utils` for className merge; DON'T concat strings with `+`.
- DO add `data-testid` to every interactive element (buttons, inputs, links, selectable cards).
- DO use Wouter (`Link`, `useLocation`); DON'T add react-router.
- DO use the custom `useTheme()` from `@/components/ThemeProvider`; DON'T import next-themes.
- DO dynamically `import("three")` for any WebGL component, with reduced-motion / low-end fallback.
- DON'T introduce new color tokens outside `#A229F2` / `#531B8C` / `#BA66F2` / `#1a0a2e` without updating `index.css` HSL vars.
- DON'T weaken `tsconfig.json` `strict: true`.

## Scan References

| File | Description |
|------|-------------|
| `.claude/commands/stack.md` | Technology stack, tooling, build chain |
| `.claude/commands/modules.md` | Pages, sections, primitives, hooks, context, lib, data |
| `.claude/commands/patterns.md` | 12 recurring code patterns with file:line references |
| `.claude/commands/guards.md` | DO/DON'T rules for imports, theming, primitives, animations |
| `.claude/commands/recipes.md` | 9 recipes: new page, section, primitive, project, form, wizard step, etc. |
| `.claude/commands/notes.md` | Manual notes (never overwritten) |
