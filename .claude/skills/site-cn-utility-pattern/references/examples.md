# cn() Utility — Verbatim Excerpts

## Definition

Source: `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Base classes + caller className last

Source: `src/components/ui/card.tsx`

```tsx
import { cn } from "@/lib/utils";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
```

## Merge cva variant output then className

Source: `src/components/ui/sheet.tsx`

```tsx
<SheetPrimitive.Content
  ref={ref}
  className={cn(sheetVariants({ side }), className)}
  {...props}
>
```

## Plain (non-Radix) component still using cn

Source: `src/components/ui/gradient-card.tsx`

```tsx
import { cn } from "@/lib/utils";

<motion.div
  ref={cardRef}
  className={cn("relative rounded-[24px] overflow-hidden cursor-pointer", className)}
  /* ... */
>
```

## Two caller-supplied class props merged

Source: `src/components/ui/lazy-image.tsx`

```tsx
<img
  ref={ref}
  className={cn(className, imgClassName)}
  /* ... */
/>
```

## Counter-example — plain template string (no override risk)

Source: `src/components/ui/menu-toggle.tsx`

```tsx
<span className={`flex flex-col items-center justify-center gap-[5px] pointer-events-none ${className}`}>
```
