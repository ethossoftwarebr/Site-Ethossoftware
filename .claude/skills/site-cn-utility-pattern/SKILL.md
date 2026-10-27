---
name: site-cn-utility-pattern
description: Convention for merging Tailwind class names via the cn() helper in src/lib/utils.ts. Use when adding a className prop to any component, composing conditional Tailwind classes, merging cva variant output with caller classes, or creating a new ui component that accepts caller-supplied styling. Even if the user just says "deixa o className sobrescrever" or "merge these classes".
source: scan
---

<!-- mustard:generated -->

# cn() Class-Merge Utility

> `cn(...inputs)` in `src/lib/utils.ts` runs `clsx` (conditionals/arrays) then `tailwind-merge` (last conflicting utility wins). Components that accept `className` merge it through `cn()`.

## Convention

| Aspect          | Rule                                                                   | Evidence                                    |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| Definition      | `cn(...inputs: ClassValue[])` returns `twMerge(clsx(inputs))`          | `src/lib/utils.ts`                          |
| Import          | `import { cn } from "@/lib/utils"` (alias, never relative)             | 9/9 consumers in `src/components/ui/`       |
| Caller override | caller `className` is the LAST argument                                | card, sheet, gradient-card, shiny-button    |
| With variants   | `cn(xVariants({ ... }), className)`                                    | sheet, toast                                |
| Conditionals    | falsy-guarded entries inside `cn(...)`, e.g. `onClick && "cursor-pointer"` | gradient-card                           |
| Custom CSS      | global CSS class + caller class, e.g. `cn("shiny-cta", className)`     | shiny-button                                |
| Scope           | 9/12 `ui/*.tsx`; only 1/22 islands (`Navbar.tsx`)                      | grep `cn(`                                  |

### When to use

Use `cn()` whenever a caller-supplied `className` may conflict with base utilities. Section islands with fixed styling keep plain string / template-literal classes — `menu-toggle.tsx` concatenates with a template string and therefore does not dedupe conflicts.

### Do NOT

- Do not add another clsx/twMerge wrapper — reuse `cn`.
- Do not put the caller `className` before base classes.
- Do not import from a relative path.

## Real examples

- `src/lib/utils.ts`
- `src/components/ui/card.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/gradient-card.tsx`
- `src/components/ui/shiny-button.tsx`
- `src/components/ui/lazy-image.tsx`

## References

See `references/examples.md`.
