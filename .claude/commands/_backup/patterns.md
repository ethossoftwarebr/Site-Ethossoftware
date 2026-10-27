<!-- mustard:generated -->

# Patterns — Site Ethossoftware

> Padrões de código recorrentes com referência a arquivos reais e contagem por Grep. Cada padrão tem uma skill dedicada em `.claude/skills/site-*`. Gerado por `/scan --full -enrich`.

## 1. Astro Page Pattern → `site-astro-page-pattern`

- Cada página `.astro` importa `Layout` primeiro → island(s) via `@/components/*` → `ogImageAsset` (mesma PNG de marca, 4/4) → `const title` + `const description` (4/4) → `const canonical` (3/4; 404 omite).
- Hidratação por diretiva: `client:load` ×5 (islands de conteúdo único / first paint), `client:visible` ×11 (seções por scroll), `client:idle` ×2 (widgets trailing — Footer, WhatsAppButton).
- SEO centralizado em `Layout.astro`: OG/Twitter só renderizam quando `ogImage` truthy; `<link canonical>`/`og:url` só quando `canonical` truthy. `<html lang="pt-BR" class="dark">` fixo. Slot nomeado `<slot name="head" />` para injeção por página (404 injeta noindex).
- Refs: `src/pages/index.astro`, `src/pages/servicos.astro`, `src/pages/portfolio.astro`, `src/pages/404.astro`, `src/layouts/Layout.astro`.

## 2. React Island Pattern → `site-react-island-pattern`

| Convenção                                         | Contagem                                 |
| ------------------------------------------------- | ---------------------------------------- |
| `export default function Name()` (nome = arquivo) | 21/23                                    |
| framer-motion                                     | 18/23                                    |
| lucide-react icons                                | 17/23                                    |
| import alias `@/`                                 | 15/23                                    |
| `data-testid` em interativos                      | 11/23                                    |
| Props interface/type                              | 3/23 (islands leem `const` module-level) |
| `'use client'` / `import React`                   | 0/23                                     |

- Conteúdo declarado como `const` arrays module-level + `.map()`. Classes condicionais via template literal inline (`cn()` só em Navbar — 1/23).
- Refs: `src/components/Hero.tsx`, `Testimonials.tsx`, `Footer.tsx`, `WizardSection.tsx`, `Benefits.tsx`, `Navbar.tsx`.

## 3. Motion Section Pattern → `site-motion-section-pattern`

- Scroll-reveal: `initial` + `whileInView` + `viewport={{ once: true }}` (12/23). `animate` reservado para mount/idle loops; `AnimatePresence mode="wait"` para troca de steps. `Variants` tipados module-level.
- Refs: `src/components/Testimonials.tsx`, `Footer.tsx`, `WizardSection.tsx`, `Hero.tsx`, `Benefits.tsx`.

## 4. UI Primitive Pattern → `site-ui-primitive-pattern`

| Convenção          | Contagem (de 12)            |
| ------------------ | --------------------------- |
| `cn()` merge       | 9/12                        |
| `React.forwardRef` | 7/12                        |
| Radix-wrapped      | 5/12                        |
| `displayName`      | 6/12                        |
| `cva` variantes    | 3/12 (button, sheet, toast) |

- Ref tipada como `React.ElementRef<typeof X.Part>`, props `React.ComponentPropsWithoutRef<...>`. `displayName` reusa `Primitive.Part.displayName` (Radix) ou string literal. Exports nomeados; `xVariants` exportado junto do componente.
- Refs: `src/components/ui/button.tsx`, `card.tsx`, `accordion.tsx`, `sheet.tsx`, `toast.tsx`, `tooltip.tsx`.

## 5. cn() Utility Pattern → `site-cn-utility-pattern`

- `cn(...inputs: ClassValue[]) = twMerge(clsx(inputs))` em `src/lib/utils.ts`. `className` do caller sempre por ÚLTIMO para overrides vencerem. Nunca re-implementar merge (não adicionar outro wrapper clsx/twMerge).
- Refs: `src/lib/utils.ts`, `src/components/ui/card.tsx`, `sheet.tsx`, `gradient-card.tsx`, `lazy-image.tsx`.

## Data / Context / Hooks (sem skill dedicada)

- Data (`src/data/*.ts`): `const` arrays de option objects + `interface` tipada; `projects.ts` importa imagens via `vite-imagetools`.
- Context (`WizardContext.tsx`): `createContext` + Provider + hook `useX` via `useContext`.
- Hooks: `use-mobile` (matchMedia + breakpoint 768), `use-toast` (reducer + listeners store, estilo shadcn).
