---
name: site-cn-utility-pattern
description: Convention for merging Tailwind class names via the cn() helper in src/lib/utils.ts. Use when adding a className prop to any component, composing conditional Tailwind classes, or creating a new component that accepts caller-supplied styling. Explains why to use cn() over template strings.
source: scan
---

<!-- mustard:generated -->

# cn() Class-Merge Utility

> `cn(...inputs)` in `src/lib/utils.ts` is the single class-name composition helper. It runs `clsx` (conditional/array flattening) then `tailwind-merge` (dedupes conflicting Tailwind utilities so the last wins). Any component accepting a `className` should merge it through `cn()`.

## Convention

| Aspect          | Rule                                                                     | Evidence                        |
| --------------- | ------------------------------------------------------------------------ | ------------------------------- |
| Definition      | `cn(...inputs: ClassValue[]) => twMerge(clsx(inputs))`                   | `src/lib/utils.ts`              |
| Import          | `import { cn } from "@/lib/utils"` (path alias, not relative)            | all consumers                   |
| Caller override | Incoming `className` passed as the LAST argument so it wins conflicts    | `cn("base classes", className)` |
| With variants   | `cn(xVariants({ ... }), className)` — merge cva output then caller class | `sheet.tsx`, `toast.tsx`        |
| Scope           | Used by both Radix primitives and plain function components              | 9/12 `ui/*.tsx` files           |

### When to use

Prefer `cn()` over template-literal class strings whenever conflicting Tailwind utilities may collide (e.g. a base `p-6` that a caller wants to override with `p-2`). Template strings (backtick `${className}`) do not dedupe and let both `p-6 p-2` survive — `menu-toggle.tsx` uses a plain template string because it has no override-prone utilities. Default to `cn()`.

### Do NOT

- Do not re-implement class merging inline or add another clsx/twMerge wrapper — reuse `cn`.
- Do not put the caller `className` before the base classes; that breaks override precedence.
- Do not import from a relative path; use the `@/lib/utils` alias.

## Real examples

- `src/lib/utils.ts` (the definition)
- `src/components/ui/card.tsx` (`cn("base", className)`)
- `src/components/ui/sheet.tsx` (`cn(sheetVariants({ side }), className)`)
- `src/components/ui/gradient-card.tsx` (plain component using `cn`)
- `src/components/ui/lazy-image.tsx` (`cn(className, imgClassName)`)

## References

See `references/examples.md`.
