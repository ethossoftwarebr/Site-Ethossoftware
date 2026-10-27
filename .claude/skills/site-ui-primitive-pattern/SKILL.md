---
name: site-ui-primitive-pattern
description: Convention for authoring shadcn-style UI primitives in src/components/ui/*.tsx. Use when adding a new UI primitive, wrapping a Radix component, creating a reusable component with style variants, adding a forwardRef component, or touching Button/Card/Sheet/ShinyButton styling. Covers cva variants, React.forwardRef, cn() class merge, displayName, and the global button CSS override. Even if the user just says "cria um componente de ui" or "add a variant to Button".
source: scan
---

<!-- mustard:generated -->

# UI Primitive Pattern (src/components/ui)

> shadcn/ui-style primitives: `React.forwardRef` components that merge base Tailwind classes with an incoming `className` via `cn()`, optionally wrap `@radix-ui/*`, optionally derive variants with `cva`. Named exports only.

## Convention

| Aspect         | Rule (majority observed)                                                                                          | Frequency (of 12) |
| -------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------- |
| Class merge    | `cn(...)` from `@/lib/utils`, caller `className` last                                                             | 9/12              |
| Ref forwarding | `React.forwardRef<Element, Props>` (lazy-image uses named `forwardRef` import)                                    | 7/12              |
| displayName    | set after definition                                                                                              | 6/12              |
| React import   | `import * as React from "react"`                                                                                  | 6/12              |
| Radix wrapping | `import * as XPrimitive from "@radix-ui/react-*"`; unstyled parts re-exported directly (`const Sheet = SheetPrimitive.Root`) | 5/12   |
| Variants       | `cva(base, { variants, defaultVariants })` + `VariantProps<typeof xVariants>`; export `xVariants`                 | 3/12              |
| Exports        | named only; compound parts in one `export { ... }`                                                                 | 12/12 (0 default) |

### Typing and displayName

- Radix parts: ref `React.ElementRef<typeof XPrimitive.Part>`, props `React.ComponentPropsWithoutRef<typeof XPrimitive.Part>`, `X.displayName = XPrimitive.Part.displayName` (accordion, sheet, toast, tooltip).
- Non-Radix: string literal displayName (`Button`, `Card`).

### Brand styling (post 54cf921)

- `button.tsx` base cva string now carries the brand look (`ethos-button-shadow`, `bg-primary`, `rounded-lg`, white text); `default/destructive/outline/secondary/ghost` variants are empty strings — only `link` and `size` change output.
- `src/styles/global.css` forces every `<button>` to `--ethos-purple` with `!important`, so variant classes cannot override button colors.
- `card.tsx` base uses `ethos-panel rounded-3xl`; `shiny-button.tsx` renders `.shiny-cta` defined in `global.css`.

### Non-primitive helpers

`shiny-button.tsx`, `gradient-card.tsx`, `menu-toggle.tsx` are plain `export function` components (no cva/forwardRef). `lazy-image.tsx` (imagetools `<picture>`) and `deferred-section.tsx` are behavior utilities. Currently unused anywhere: `deferred-section.tsx`, `gradient-card.tsx`, `toaster.tsx`, `tooltip.tsx`.

## Real examples

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/accordion.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/toast.tsx`
- `src/components/ui/tooltip.tsx`

## References

See `references/examples.md`.
