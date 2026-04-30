---
name: client-theme-toggle
description: Use when adding or modifying theme-aware UI in the Ethos client, building a light/dark variant of a component, integrating with the custom ThemeProvider, or detecting current theme. Triggers on "dark mode", "theme toggle", "useTheme", "light/dark", "theme provider", "theme-aware".
source: scan
---
<!-- mustard:generated -->

# Client Theme Toggle

> The Ethos client uses a hand-rolled `ThemeProvider` (NOT next-themes). It persists `"light" | "dark"` to `localStorage["ethos-theme"]` and toggles `.dark` on `<html>`.

## When to use

- Adding a new component that must look different in light vs dark
- Reading the current theme imperatively (e.g. to swap an SVG color)
- Adding the toggle button to a new chrome surface

## API

```ts
import { useTheme } from "@/components/ThemeProvider";
const { theme, toggle } = useTheme();
// theme: "light" | "dark"
// toggle: () => void
```

The provider is mounted once at the top of the tree in `client/src/App.tsx:25`. Do not nest a second `ThemeProvider`.

## Conventions

1. Prefer Tailwind class-based theming with the `dark:` prefix (e.g. `text-foreground dark:text-white`). The custom variant is wired in `client/src/index.css:4` via `@custom-variant dark (&:is(.dark *))`.
2. Use the `useTheme()` hook only for cases where Tailwind cannot express the variation (icon swap, conditional library prop).
3. The toggle component is `<ThemeToggle />` from `@/components/ThemeToggle`. It accepts `light={true}` to render a white-on-dark version (use over dark hero sections).
4. Persisted key is `"ethos-theme"` — never read/write that key directly; always go through the provider.
5. The provider's initial state checks `localStorage` first, then `prefers-color-scheme`.

## Anti-patterns

- DON'T `import { useTheme } from "next-themes"` — that package is installed but unused.
- DON'T toggle `document.documentElement.classList` manually — go through `toggle()`.
- DON'T call `localStorage.setItem("ethos-theme", ...)` from anywhere except the provider.

## References

- Provider source: `client/src/components/ThemeProvider.tsx:19`
- Toggle button: `client/src/components/ThemeToggle.tsx:12`
- Provider mount: `client/src/App.tsx:25`
- Real consumers: `client/src/components/Navbar.tsx:184`
- Real code in `references/examples.md`.
