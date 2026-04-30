---
name: client-shadcn-primitive
description: Use when adding or modifying a shadcn/ui primitive under client/src/components/ui/, wrapping a Radix UI package, or authoring a brand-specific design-system component. Triggers on "new primitive", "ui component", "button variant", "shadcn", "radix wrapper", "design system component".
source: scan
---
<!-- mustard:generated -->

# Client shadcn/ui Primitive

> The contract for adding a primitive to `client/src/components/ui/`: cva variants, forwardRef, cn() merge, named exports, kebab-case filename.

## When to use

- Adding a new file under `client/src/components/ui/`
- Wrapping a freshly installed `@radix-ui/react-*` package
- Refactoring a primitive to add a new `variant` or `size`
- Creating a brand-specific component (`ShinyButton`, `GradientCard`) that lives next to shadcn primitives

## Hard rules

1. Filename is **kebab-case** (`button-group.tsx`, `gradient-card.tsx`).
2. The component is wrapped with `React.forwardRef<RefType, PropsType>(...)`.
3. Variants are described with `cva` from `class-variance-authority`; the `cva` factory is exported alongside the component (`buttonVariants`).
4. Every render path passes className through `cn(...)` from `@/lib/utils`.
5. Asserting `displayName` is required (`MyComp.displayName = "MyComp"`).
6. Named exports only — no `default export`.
7. NEVER edit a primitive in place to add page-specific behavior — wrap it from `client/src/components/`.

## When NOT to use this skill

- For one-off animated decorations: prefer `client-marketing-section`.
- For three.js/WebGL backgrounds: see `client-three-aurora-background`.

## References

- Reference primitive: `client/src/components/ui/button.tsx:7`
- Simple ref/cn wrapper: `client/src/components/ui/card.tsx:5`
- Brand-specific custom primitive: `client/src/components/ui/shiny-button.tsx:14`, `client/src/components/ui/gradient-card.tsx:11`
- Real code in `references/examples.md`.
