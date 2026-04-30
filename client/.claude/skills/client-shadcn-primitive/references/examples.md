<!-- mustard:generated -->
# Examples — client-shadcn-primitive

> Real snippets pulled from the codebase.

## Canonical primitive with cva (`client/src/components/ui/button.tsx:7`)

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ..." +
  " hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border border-primary-border",
        destructive: "bg-destructive text-destructive-foreground shadow-sm border-destructive-border",
        outline: " border [border-color:var(--button-outline)] shadow-xs active:shadow-none ",
        secondary: "border bg-secondary text-secondary-foreground border border-secondary-border ",
        ghost: "border border-transparent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"
export { Button, buttonVariants }
```

## Minimal forwardRef wrapper (`client/src/components/ui/card.tsx:5`)

```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
      {...props}
    />
  )
)
Card.displayName = "Card"
```

## Brand-specific primitive (`client/src/components/ui/shiny-button.tsx:14`)

```tsx
export function ShinyButton({
  children, onClick, className = "", style, "data-testid": testId,
  type = "button", disabled,
}: ShinyButtonProps) {
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
