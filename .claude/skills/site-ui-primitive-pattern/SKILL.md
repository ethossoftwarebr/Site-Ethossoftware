---
name: site-ui-primitive-pattern
description: Convention for authoring shadcn-style UI primitives in src/components/ui/*.tsx. Use when adding a new UI primitive, wrapping a Radix component, creating a reusable component with style variants, or adding a forwardRef component. Covers cva variants, React.forwardRef, cn() class merge, and displayName.
source: scan
---

<!-- mustard:generated -->

# UI Primitive Pattern (src/components/ui)

> shadcn/ui-style primitives: `React.forwardRef` components that merge a base Tailwind class string with an incoming `className` via `cn()`, optionally wrap a `@radix-ui/*` primitive, and optionally derive variants with `cva`. Named exports, explicit `displayName`.

## Convention

| Aspect         | Rule (majority observed)                                                                                                                                                  | Frequency           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Ref forwarding | Wrap with `React.forwardRef<ElementType, PropsType>`                                                                                                                      | 7/12 files          |
| Class merge    | Always pass classes through `cn(...)` from `@/lib/utils`; incoming `className` merged LAST so callers can override                                                        | 9/12 files          |
| displayName    | Set explicitly after definition                                                                                                                                           | 6/12 files          |
| Radix wrapping | Import `* as XPrimitive from "@radix-ui/react-*"`, re-export unstyled parts directly (e.g. `const Tooltip = TooltipPrimitive.Root`), style only the parts needing classes | 5/12 files          |
| Variants       | Use `cva(base, { variants, defaultVariants })` + `VariantProps<typeof xVariants>`; export the variants fn alongside the component                                         | 3/12 files          |
| Exports        | Named exports only (no default). Compound components export every subpart in one `export { ... }`                                                                         | all primitive files |
| Imports        | `import * as React from "react"` (namespace form) in Radix-based files                                                                                                    | radix files         |

### forwardRef typing (Radix)

When wrapping Radix, type the ref as `React.ElementRef<typeof XPrimitive.Part>` and props as `React.ComponentPropsWithoutRef<typeof XPrimitive.Part>`. See `accordion.tsx`, `sheet.tsx`, `toast.tsx`, `tooltip.tsx`.

### displayName source

Radix-wrapped parts reuse the primitive's name: `X.displayName = XPrimitive.Part.displayName`. Plain (non-Radix) primitives use a string literal: `Button.displayName = "Button"`. Both forms are present; match whichever base you wrap.

### cva shape

`cva(baseClasses, { variants: { variant: {...}, size: {...} }, defaultVariants: {...} })`. Apply in the component as `cn(xVariants({ variant, size, className }))` (button) or `cn(xVariants({ side }), className)` (sheet/toast). Export the variants function: `export { Button, buttonVariants }`.

### Non-primitive helpers

Not every `ui/*.tsx` file is a Radix primitive. `gradient-card.tsx`, `shiny-button.tsx`, `menu-toggle.tsx` are plain function components (framer-motion / styling wrappers) that still use `cn()` for className merging. `deferred-section.tsx` and `lazy-image.tsx` are behavior utilities. When the component has no variants and no Radix base, a plain `export function Name(props)` is acceptable — but still merge `className` via `cn()`.

## Real examples

- `src/components/ui/button.tsx` (cva + Slot + forwardRef + string displayName)
- `src/components/ui/card.tsx` (compound forwardRef, no Radix, string displayName)
- `src/components/ui/accordion.tsx` (Radix wrap, ElementRef typing, primitive displayName)
- `src/components/ui/sheet.tsx` (cva variants + Radix dialog + compound)
- `src/components/ui/toast.tsx` (cva + VariantProps intersection)
- `src/components/ui/tooltip.tsx` (re-export unstyled parts + one styled forwardRef)

## References

See `references/examples.md`.
