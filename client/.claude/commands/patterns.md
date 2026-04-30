<!-- mustard:generated -->
# Patterns — client

> Recurring code shapes detected in the client subproject. Every pattern points to a real file location.

## 1. Page Composition (Navbar + Sections + Footer + Floating CTAs)

Each page wraps content in a `<main>` with brand-themed blurred radial backgrounds, then mounts `Navbar`, content, `Footer`, `WhatsAppButton`, `EthosIA` in that order.

- `client/src/pages/Home.tsx:43`
- `client/src/pages/ServicesPage.tsx:155`
- `client/src/pages/PortfolioPage.tsx:22`

```tsx
<main className="min-h-screen relative ... selection:bg-[#A229F2]/20 selection:text-[#531B8C]">
  <div className="absolute ... bg-[#A229F2]/20 rounded-full blur-[120px] -z-10" />
  <Navbar />
  {/* sections */}
  <Footer />
  <WhatsAppButton />
  <EthosIA />
</main>
```

## 2. Marketing Section Anatomy

A marketing section is a default-exported React component returning a `<section>` (often with an `id` for scroll-spy), animated with `framer-motion`, themed with hex brand colors, and using `lucide-react` icons.

- `client/src/components/Services.tsx:135`
- `client/src/components/Hero.tsx:30`

Hallmarks:
- `motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}`
- `data-testid="section-..."` on key buttons
- Direct hex usage: `text-[#A229F2]`, `bg-[#531B8C]`, `from-[#BA66F2] to-[#A229F2]`

## 3. shadcn/ui Primitive Pattern

Primitives in `client/src/components/ui/` follow the shadcn convention: `cva`-based variants, `forwardRef`, `cn(...)` for className merge, named export.

- `client/src/components/ui/button.tsx:7` — `buttonVariants` via `cva`
- `client/src/components/ui/card.tsx:5` — `forwardRef<HTMLDivElement, ...>`

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
```

## 4. Custom Project Primitive (Brand-Specific)

Project-specific UI lives next to shadcn but doesn't follow `cva` — instead a single styled component (`ShinyButton`, `GradientCard`).

- `client/src/components/ui/shiny-button.tsx:14` — wraps the `.shiny-cta` CSS class from `index.css:128`
- `client/src/components/ui/gradient-card.tsx:11` — 3-D mouse-tracking card with `framer-motion` springs

## 5. WebGL/Three.js with Graceful Fallback

Heavy animated backgrounds are dynamically imported, gated by capability checks (reduced-motion, low cores, no WebGL), and fall back to a CSS gradient.

- `client/src/components/AuroraBackground.tsx:24` (capability check)
- `client/src/components/AuroraBackground.tsx:42` (`THREE = await import("three")`)
- `client/src/components/AuroraBackground.tsx:171` (CSS fallback when `webglFailed`)

## 6. Theme Toggle (Custom, Not next-themes)

`ThemeProvider` is a small hand-rolled context that persists to `localStorage["ethos-theme"]` and toggles `document.documentElement.classList.toggle("dark")`. Consumers call `useTheme()`.

- `client/src/components/ThemeProvider.tsx:19` (provider)
- `client/src/components/ThemeToggle.tsx:12` (Sun/Moon button)
- Wired at root in `client/src/App.tsx:25`

## 7. Multi-Step Wizard Generating WhatsApp Deep-Link

A multi-step state machine (`useState` for `step`, controlled `data` object, `canAdvance()` gate) culminating in `window.open("https://wa.me/<num>?text=" + encodeURIComponent(buildMessage(data)))`.

- `client/src/components/WizardSection.tsx:171` (7 steps, inline section)
- `client/src/components/WhatsAppWizard.tsx:101` (5 steps, modal)

Both share: `buildMessage(data)`, `framer-motion AnimatePresence` swap by `step`, branded purple gradient header, WhatsApp green CTA `bg-[#25D366] hover:bg-[#128C7E]`.

## 8. App Provider Stack at the Root

```tsx
<ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  </QueryClientProvider>
</ThemeProvider>
```

- `client/src/App.tsx:23`

Order matters: `ThemeProvider` outermost so CSS vars resolve before any Radix primitive paints.

## 9. Data-Fetching Defaults via TanStack Query

A single `queryClient` instance with project-wide overrides: `staleTime: Infinity`, `refetchOnWindowFocus: false`, `retry: false`. The default `queryFn` joins `queryKey` segments into a URL and `fetch`es with `credentials: "include"`.

- `client/src/lib/queryClient.ts:44`

> Components currently consume static data from `client/src/data/` instead of API calls — TanStack Query is wired but unused at the marketing layer.

## 10. Scroll-Spy Active Section in Nav

`Navbar` builds an `IntersectionObserver` per known section id, tracks ratios, picks the highest-visible to highlight the matching link.

- `client/src/components/Navbar.tsx:32` (`useActiveSection` hook)
- Section ids must match `SECTION_IDS` array (`Navbar.tsx:21`)

## 11. Hash-on-Mount Smooth Scroll

`Home` reads `window.location.hash`, scrolls to the matching `id`, and uses a `MutationObserver` (3 s timeout) to wait for late-mounted sections.

- `client/src/pages/Home.tsx:19`

## 12. Class Composition with `cn()`

Every component composes Tailwind classes through `cn(...inputs)` from `client/src/lib/utils.ts:4` — `twMerge(clsx(inputs))`. Never concatenate class strings directly.
