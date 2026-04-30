<!-- mustard:generated -->
# Guards — client

> DO / DON'T rules enforced for the client subproject. Violations break theming, type-checking, or the build.

## Imports & Aliases

- DO use the `@/` alias for anything inside `client/src/` (`@/components/...`, `@/lib/utils`, `@/hooks/...`).
- DO use `@assets/*` for files in `attached_assets/` (Replit uploads).
- DO use `@shared/*` for cross-package types in `shared/`.
- DON'T use deep relative paths like `../../components/ui/button` — the alias is mandatory.
- DON'T introduce a new alias without updating BOTH `vite.config.ts:26` AND `tsconfig.json:18`.

## Routing

- DO use Wouter (`Link`, `Switch`, `Route`, `useLocation`) for all in-app navigation. Reference: `client/src/App.tsx:1`, `client/src/components/Navbar.tsx:3`.
- DON'T add `react-router-dom` — Wouter is the chosen router.
- DO register every new page route inside the `<Switch>` in `client/src/App.tsx:14`.
- DON'T forget the catch-all `<Route component={NotFound} />` must remain last.

## shadcn/ui Primitives

- DO compose with primitives from `client/src/components/ui/*`. Examples: `Button`, `Sheet`, `Dialog`, `Card`.
- DON'T edit a file in `client/src/components/ui/` to add app-specific behavior — instead build a new component that wraps the primitive.
- DO use `cva` + `forwardRef` + `cn()` when adding a new primitive, mirroring `client/src/components/ui/button.tsx:7`.
- DON'T regenerate primitives from `npx shadcn add` blindly — they have local Replit-flavor edits (see `// @replit` comments in `button.tsx:14`).

## Styling & Theming

- DO use Tailwind utilities everywhere — no inline `style={{}}` for layout/spacing.
- DON'T introduce new color tokens outside the brand palette (`#A229F2`, `#531B8C`, `#BA66F2`, `#1a0a2e`) without checking `client/src/index.css:34`.
- DO read theme via `useTheme()` from `@/components/ThemeProvider`. The dark class is added/removed on `<html>`.
- DON'T import `next-themes` — the custom `ThemeProvider` is canonical.
- DO express dark-mode variants with the `dark:` prefix (works because of `@custom-variant dark (&:is(.dark *))` in `client/src/index.css:4`).
- DO compose classes with `cn(...)` from `@/lib/utils`. Reference: `client/src/lib/utils.ts:4`.
- DON'T concatenate class strings with `+` — `cn()` handles conflicts via `tailwind-merge`.

## Animation

- DO use `framer-motion` (`motion.div`, `AnimatePresence`, `useScroll`, `useTransform`).
- DO gate heavy animations on `prefers-reduced-motion` and capability checks. Reference: `client/src/components/AuroraBackground.tsx:25`.
- DON'T import `three` statically — always `await import("three")` so it splits into its own chunk. Reference: `client/src/components/AuroraBackground.tsx:42`.

## Data & State

- DO use the shared `queryClient` from `@/lib/queryClient` for any TanStack Query usage. Reference: `client/src/lib/queryClient.ts:44`.
- DON'T instantiate a second `QueryClient` — providers are mounted once in `client/src/App.tsx:26`.
- DO put marketing data (projects, services lists) under `client/src/data/` as typed `const` exports. Reference: `client/src/data/projects.ts:9`.
- DON'T fetch from the same domain without `credentials: "include"` — `apiRequest()` already handles this.

## Testing Hooks

- DO add `data-testid="..."` to every interactive button, link, input, and selectable card so the `/qa` agent can target it. Examples: `client/src/components/WizardSection.tsx:285`, `client/src/components/Navbar.tsx:127`.
- DON'T rename existing `data-testid` values — they may be referenced by external test scripts.

## File Layout

- DO place page components in `client/src/pages/` and route them from `App.tsx`.
- DO place reusable marketing sections in `client/src/components/` (PascalCase filename).
- DO place shadcn primitives in `client/src/components/ui/` (kebab-case filename).
- DON'T mix marketing and primitive concerns in the same file.

## TypeScript

- DO keep `strict: true` — never weaken `tsconfig.json:9`.
- DO type props with an inline `interface` directly above the component (e.g. `WhatsAppWizard.tsx:97`).
- DON'T use `any` — at minimum use `unknown` and narrow with `typeof`/`in`.

## Build / Dev

- DO test in dev with `npm run dev:client` (Vite, port 5000).
- DO type-check with `npm run check` (`tsc --noEmit`) before committing.
- DON'T hardcode absolute file paths — use `import.meta.dirname` + `path.resolve` (Vite already does this for aliases).

## Accessibility

- DO add `aria-label` to icon-only buttons. Reference: `client/src/components/ThemeToggle.tsx:20`.
- DO add `aria-hidden="true"` to decorative absolute-positioned elements. Reference: `client/src/components/AuroraBackground.tsx:175`.
- DON'T autoplay audio or rely on color alone — the brand purple must always pair with text/icon.
