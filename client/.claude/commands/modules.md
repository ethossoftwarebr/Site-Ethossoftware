<!-- mustard:generated -->
# Modules — client

> Inventory of routes, marketing sections, shadcn primitives, hooks, context, data and lib utilities.

## Pages (`client/src/pages/`)

| File | Route | Purpose |
|------|-------|---------|
| `Home.tsx:18` | `/` | Single-page composition: Navbar + 11 sections + Footer + WhatsAppButton + EthosIA |
| `ServicesPage.tsx:145` | `/servicos` | Service catalog with tabs, process timeline, Aurora WebGL hero, OrbitingSkills, CTA |
| `PortfolioPage.tsx:11` | `/portfolio` | Filterable project grid backed by `data/projects.ts` |
| `not-found.tsx:4` | `*` (fallback) | Minimal 404 card |

Wired in `client/src/App.tsx:12` via Wouter `<Switch>`.

## Marketing Sections (`client/src/components/`)

Atomic page-level sections — each is self-contained, mounts on Home and/or sub-pages.

| Component | File | Notes |
|-----------|------|-------|
| `Navbar` | `Navbar.tsx:86` | Theme-aware sticky nav + mobile `Sheet`, scroll-spy via IntersectionObserver |
| `Hero` | `Hero.tsx:18` | Parallax `useScroll`, floating Lucide icons, `ShinyButton` CTA |
| `ClientCarousel` | `ClientCarousel.tsx` | embla-carousel client logos |
| `Services` | `Services.tsx:135` | Grid of `GradientCard` + framer modal detail |
| `Benefits`, `About`, `Mission`, `Stats`, `Instagram`, `Testimonials`, `FAQ`, `Footer` | `*.tsx` | Static content sections |
| `Portfolio` | `Portfolio.tsx` | Featured slice of `data/projects.ts` (full grid lives in `PortfolioPage`) |
| `WizardSection` | `WizardSection.tsx:171` | 7-step inline lead wizard generating WhatsApp deep-link |
| `WhatsAppWizard` | `WhatsAppWizard.tsx:101` | 5-step modal variant of the wizard |
| `WhatsAppButton` | `WhatsAppButton.tsx` | Floating CTA button |
| `EthosIA` | `EthosIA.tsx` | Floating AI assistant launcher |
| `AuroraBackground` | `AuroraBackground.tsx:20` | three.js shader background with WebGL fallback |
| `OrbitingSkills` | `OrbitingSkills.tsx` | Animated tech-stack orbit (services page) |
| `Meteors`, `Sparkles` | `Meteors.tsx`, `Sparkles.tsx` | Decorative animated layers |
| `ThemeProvider`, `ThemeToggle` | `ThemeProvider.tsx:19`, `ThemeToggle.tsx:12` | Light/dark context + button |

## shadcn/ui Primitives (`client/src/components/ui/`)

60+ Radix-based primitives. Treat as a frozen design-system layer; extend by composition, never edit directly. Highlights:

- Form & inputs: `button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `slider.tsx`, `form.tsx`, `field.tsx`, `input-group.tsx`, `input-otp.tsx`, `label.tsx`
- Overlays: `dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `popover.tsx`, `tooltip.tsx`, `hover-card.tsx`, `alert-dialog.tsx`, `command.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `menubar.tsx`
- Display: `card.tsx`, `accordion.tsx`, `tabs.tsx`, `table.tsx`, `chart.tsx`, `avatar.tsx`, `badge.tsx`, `alert.tsx`, `progress.tsx`, `skeleton.tsx`, `spinner.tsx`, `separator.tsx`, `aspect-ratio.tsx`, `scroll-area.tsx`
- Navigation: `breadcrumb.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `sidebar.tsx`, `menu-toggle.tsx`
- Toast/notifications: `toast.tsx`, `toaster.tsx`, `sonner.tsx`
- Custom (project-specific, not from shadcn): `gradient-card.tsx:11`, `shiny-button.tsx:14`

## Hooks (`client/src/hooks/`)

| Hook | File | Purpose |
|------|------|---------|
| `useIsMobile()` | `use-mobile.tsx:5` | `<768px` matchMedia listener (used by Sidebar primitive) |
| `useToast()` / `toast()` | `use-toast.ts:171` | Reducer-based toast queue paired with `Toaster` |

## Context (`client/src/context/`)

| Provider | File | API |
|----------|------|-----|
| `WizardProvider` / `useWizard()` | `WizardContext.tsx:15` | `{ isOpen, openWizard, closeWizard }` |

> Note: `WizardContext` is defined but the running app uses `WizardSection` (inline) and `WhatsAppWizard` (self-managed `onClose` prop). The context is reserved for future global wizard control.

## Lib (`client/src/lib/`)

| File | Exports |
|------|---------|
| `utils.ts:4` | `cn(...inputs)` — `clsx + tailwind-merge` |
| `queryClient.ts:44` | `queryClient`, `apiRequest()`, `getQueryFn({ on401 })` |

## Data (`client/src/data/`)

| File | Exports |
|------|---------|
| `projects.ts:17` | `projects: Project[]`, `categories: string[]` (consumed by `Portfolio` and `PortfolioPage`) |

## Assets

- `client/src/assets/images/*` — local PNGs for services / portfolio
- `@assets/*` (alias → `attached_assets/`) — Replit-uploaded screenshots used in `data/projects.ts:1`
- `client/public/` — `favicon.png`, `opengraph.jpg`, `robots.txt`, `llms.txt`
