---
name: client-page-composition
description: Use when adding a new top-level page to the Ethos client (e.g. /servicos, /portfolio, /contato), wiring it into the Wouter <Switch>, or composing pages from Navbar + sections + Footer + floating CTAs. Triggers on "new page", "add route", "page component", "wire route".
source: scan
---
<!-- mustard:generated -->

# Client Page Composition

> Conventions for assembling a top-level Ethos page: provider stack assumed, brand-themed `<main>`, sticky `Navbar`, scroll-restored content, `Footer`, floating WhatsApp + EthosIA buttons.

## When to use

- Adding a new route under `client/src/pages/`
- Refactoring an existing page's outer layout
- Wiring a page into Wouter's `<Switch>` in `client/src/App.tsx`

## Invariants

1. The file lives in `client/src/pages/<Name>.tsx` with a default-exported function component.
2. The outer element is `<main className="min-h-screen ... bg-background selection:bg-[#A229F2]/20 selection:text-[#531B8C]">`.
3. On mount, scroll to top with `useEffect(() => window.scrollTo({ top: 0, behavior: "instant" }), [])` — except `Home`, which honors hash navigation.
4. Decorative blurred radial backgrounds are absolutely positioned at `-z-10` with brand colors at low opacity (`bg-[#A229F2]/15 blur-[120px]`).
5. The visible chrome order is fixed: `<Navbar />` → content sections → `<Footer />` → `<WhatsAppButton />` → `<EthosIA />`.
6. The route is registered in `client/src/App.tsx` BEFORE the catch-all `<Route component={NotFound} />`.

## Steps

1. Create the file (PascalCase) under `client/src/pages/`.
2. Import marketing chrome via `@/components/...`.
3. Assemble the `<main>` per the structure above.
4. Add a `<Route path="/your-path" component={YourPage} />` to `client/src/App.tsx`.
5. (Optional) Append to `navLinks` in `client/src/components/Navbar.tsx` for top-nav exposure.
6. Type-check with `npm run check`.

## References

- Reference page: `client/src/pages/PortfolioPage.tsx:11`
- Service page (with dark hero variant): `client/src/pages/ServicesPage.tsx:155`
- Home (hash-on-mount + section flex stack): `client/src/pages/Home.tsx:18`
- Wouter wiring: `client/src/App.tsx:12`
- Real code in `references/examples.md`.
