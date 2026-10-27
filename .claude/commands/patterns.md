<!-- mustard:generated -->

# Patterns — Site Ethossoftware

> Padrões de código recorrentes com referência a arquivos reais e contagem por Grep (working tree 2026-09-22). Cada padrão com cluster ≥3 arquivos tem skill dedicada em `.claude/skills/site-*`.

## 1. Astro Page Pattern → `site-astro-page-pattern`

- Frontmatter: `import Layout` primeiro → islands via `@/components/*` → `ogImageAsset` (mesma PNG de marca, 4/4) → `const title` + `const description` (4/4) → `const canonical` (3/4; 404 omite).
- `Layout.astro` agora SEMPRE emite `<link rel="canonical">`, OG e Twitter: `canonical` cai para `new URL(Astro.url.pathname, Astro.site)` e `ogImage` para o asset de marca default. Nova prop `structuredData` (objeto ou array) → JSON-LD junto do `Organization` fixo. `index.astro` monta `FAQPage` a partir de `@/data/faq`.
- Hidratação: `client:load` ×4 (Navbar/NavbarIsland + Hero), `client:visible` ×15 (seções + page content + EthosIA), `client:idle` ×6 (Footer, WhatsAppButton). `404.astro` renderiza `NotFoundContent` SEM diretiva (HTML estático, zero JS).
- `<html lang="pt-BR">` sem classe de tema; `<slot name="head" />` para injeção por página (404 → noindex).
- Refs: `src/pages/index.astro`, `src/pages/servicos.astro`, `src/pages/portfolio.astro`, `src/pages/404.astro`, `src/layouts/Layout.astro`.

## 2. React Island Pattern → `site-react-island-pattern`

| Convenção (22 arquivos em `src/components/*.tsx`)         | Contagem                          |
| --------------------------------------------------------- | --------------------------------- |
| `export default function Name()` (nome = arquivo)         | 20/22                             |
| usa classes `ethos-*` (container/section/eyebrow/heading) | 13/22                             |
| `<section>` como raiz de seção                            | 13/22                             |
| framer-motion                                             | 13/22                             |
| import alias `@/`                                         | 14/22                             |
| importa `@/components/ui/*`                               | 11/22                             |
| `data-testid` em interativos                              | 10/22                             |
| importa `@/data/*`                                        | 9/22                              |
| lucide-react                                              | 6/22                              |
| Props interface/type                                      | 2/22 (AuroraBackground, Sparkles) |
| `cn()`                                                    | 1/22 (Navbar)                     |
| `'use client'` / `import React`                           | 0/22                              |

- Anatomia de seção: `<section className="ethos-section …">` → `<div className="ethos-container">` → header com `ethos-eyebrow` + `ethos-heading` (+ `ethos-copy`) → lista `.map()` de `const` module-level ou de `@/data/*`.
- Cores via tokens de tema (`text-primary`, `bg-secondary`, `text-muted-foreground`, `border-border`). Hex hardcoded praticamente eliminado (só `OrbitingSkills.tsx`, órfão).
- Mockups de produto: `ethos-product-blob` decorativos (`aria-hidden`) + `ethos-product-card` com `LazyImage` de `projects[n]`.
- `NavbarIsland.tsx` é wrapper trivial de `Navbar` usado só em `index.astro`.
- Refs: `src/components/Hero.tsx`, `Testimonials.tsx`, `Mission.tsx`, `Benefits.tsx`, `FAQ.tsx`, `WizardSection.tsx`, `Footer.tsx`.

## 3. Motion Section Pattern → `site-motion-section-pattern`

- Scroll-reveal: `initial` + `whileInView` + `viewport={{ once: true }}` (10/22 com `whileInView`). Movimento curto: `y: 12–30`, `duration 0.35–0.7`; stagger por `delay: index * 0.06–0.08` (5/22).
- Troca de conteúdo/steps/modais: `<AnimatePresence mode="wait">` + `initial/animate/exit` (5/22: WizardSection, ServicesHome, ServicesPage, PortfolioPage, EthosIA).
- Removidos no refactor 54cf921: `Variants` tipados (0/22), `whileHover`/`whileTap` (0/22), parallax `useScroll`/`useTransform` (0/22). Loop infinito só em EthosIA.
- Refs: `src/components/Testimonials.tsx`, `Mission.tsx`, `Benefits.tsx`, `FAQ.tsx`, `WizardSection.tsx`.

## 4. UI Primitive Pattern → `site-ui-primitive-pattern`

| Convenção           | Contagem (de 12)                           |
| ------------------- | ------------------------------------------ |
| `cn()` merge        | 9/12                                       |
| `React.forwardRef`  | 7/12 (lazy-image usa `forwardRef` nomeado) |
| `displayName`       | 6/12                                       |
| `import * as React` | 6/12                                       |
| Radix-wrapped       | 5/12                                       |
| `cva` variantes     | 3/12 (button, sheet, toast)                |
| default export      | 0/12                                       |

- `button.tsx`: base cva agora carrega a identidade (`ethos-button-shadow`, `bg-primary`, `rounded-lg`); variantes `default/destructive/outline/secondary/ghost` são strings vazias (só `link` e `size` diferenciam).
- `card.tsx`: base `ethos-panel rounded-3xl`. `shiny-button.tsx`: `cn("shiny-cta", className)`.
- Órfãos (sem import no repo): `deferred-section.tsx`, `gradient-card.tsx`, `toaster.tsx`, `tooltip.tsx`.
- Refs: `src/components/ui/button.tsx`, `card.tsx`, `accordion.tsx`, `sheet.tsx`, `toast.tsx`, `tooltip.tsx`.

## 5. cn() Utility Pattern → `site-cn-utility-pattern`

- `cn(...inputs: ClassValue[]) = twMerge(clsx(inputs))`. `className` do caller por ÚLTIMO. Aceita condicionais (`onClick && "cursor-pointer"` em gradient-card).
- Refs: `src/lib/utils.ts`, `src/components/ui/card.tsx`, `sheet.tsx`, `gradient-card.tsx`, `shiny-button.tsx`, `lazy-image.tsx`.

## 6. Data Module Pattern → `site-data-module-pattern`

- 4/4 arquivos só com `export const` nomeados (sem default); 2/4 declaram `export interface` + anotação `X[]` (projects, services); `faq.ts` usa `as const`.
- Consumidos por 9 islands, `src/lib/wizard-message.ts` e `src/pages/index.astro` (JSON-LD FAQ).
- Refs: `src/data/faq.ts`, `src/data/projects.ts`, `src/data/services.ts`, `src/data/wizard.ts`.

## Lib / Tests / Hooks (sem skill dedicada — <3 arquivos por convenção)

- Lógica pura em `src/lib/*.ts` com teste co-localizado `*.test.ts` (vitest, `describe/it/expect`): `chat-schema.ts`, `wizard-message.ts`.
- API route importa schema de `@/lib/chat-schema` e prompt de `@/lib/chat-content`. Ref: `src/pages/api/chat.ts`.
- Hooks: `use-toast.ts` (store reducer shadcn), `use-mobile.tsx` (matchMedia 768, órfão).
