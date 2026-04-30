<!-- mustard:generated -->
# Examples — client-theme-toggle

> Real snippets pulled from the codebase.

## ThemeProvider (`client/src/components/ThemeProvider.tsx:19`)

```tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("ethos-theme") as Theme | null;
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("ethos-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## ThemeToggle button with `light` over-dark variant (`client/src/components/ThemeToggle.tsx:12`)

```tsx
export function ThemeToggle({ className = "", variant = "ghost", light = false }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  return (
    <Button
      size="icon"
      variant={variant}
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      data-testid="button-theme-toggle"
      className={`${light ? "text-white/80 hover:text-white border-white/20" : ""} ${className}`}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}
```

## Tailwind dark variant in CSS (`client/src/index.css:4`)

```css
@custom-variant dark (&:is(.dark *));
```

## Theme-aware Navbar usage (`client/src/components/Navbar.tsx:184`)

```tsx
<ThemeToggle light={isTransparent} />
```

`isTransparent` toggles based on whether the user is on a dark-hero page AND hasn't scrolled past the hero (`Navbar.tsx:102`).

## Dark variant tokens (`client/src/index.css:57`)

```css
.dark {
  --background: 270 50% 5%;
  --foreground: 260 80% 97%;
  --card: 265 45% 9%;
  /* ... */
  --primary: 280 75% 62%;
  --primary-foreground: 0 0% 100%;
}
```
