<!-- mustard:generated at:2026-09-22T21:31:20.206Z -->

# cn() Utility — real examples from this codebase

> Excerpts verbatim do working tree (linhas indicadas). Re-extrair se o arquivo mudar.

## Definition

Source: `src/lib/utils.ts`

Lines 1-6

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Base classes + caller className last

Source: `src/components/ui/card.tsx`

Lines 1-18

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ethos-panel rounded-3xl border bg-card text-card-foreground",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";
```

## cva output + caller className

Source: `src/components/ui/sheet.tsx`

Lines 58-79

```tsx
const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, hideClose = false, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {!hideClose && (
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm bg-primary p-1 text-white ring-offset-background transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </SheetPrimitive.Close>
      )}
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName
```

## Conditional class inside cn()

Source: `src/components/ui/gradient-card.tsx`

Lines 1-34

```tsx
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GradientCard({
  children,
  className,
  onClick,
}: GradientCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "ethos-panel relative overflow-hidden rounded-3xl border border-border bg-card",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

## Custom CSS class + caller className

Source: `src/components/ui/shiny-button.tsx`

Lines 23-35

```tsx
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={cn("shiny-cta", className)}
      style={{ padding: "0.85rem 2rem", ...style }}
    >
      <span>{children}</span>
    </button>
  );
}
```

## Merging two caller props

Source: `src/components/ui/lazy-image.tsx`

Lines 105-122

```tsx
    const aspectRatio = width && height ? `${width} / ${height}` : undefined;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={cn(className, imgClassName)}
        style={{ aspectRatio, ...style }}
        data-testid="lazy-image"
        {...rest}
      />
    );
```

## Counter-example: template string (no merge)

Source: `src/components/ui/menu-toggle.tsx`

Lines 9-11

```tsx
export function MenuToggle({ open, strokeWidth = 2, className = "" }: MenuToggleProps) {
  return (
    <span className={`flex flex-col items-center justify-center gap-[5px] pointer-events-none ${className}`}>
```
