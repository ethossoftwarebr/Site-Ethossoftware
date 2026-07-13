<!-- mustard:generated -->

# Stack — Site Ethossoftware

> Technology stack, structure e tooling do site (Astro static + React islands + serverless API). Gerado por `/scan --full -enrich`.

## Runtime & Build

| Camada        | Detalhe (fonte: `astro.config.mjs`, `package.json`)   |
| ------------- | ----------------------------------------------------- |
| Framework     | Astro 6 — `output: 'static'`                          |
| Adapter       | `@astrojs/vercel` (`vercel()`, sem opções)            |
| Integrations  | `react()` apenas                                      |
| Image service | sharp — `astro/assets/services/sharp`                 |
| Vite plugins  | `@tailwindcss/vite` (Tailwind v4) + `vite-imagetools` |
| Site          | `https://ethossoftware.com.br`                        |

## UI Layer

- **Islands React 19**: componentes em `src/components/*.tsx`, hidratados pelas páginas `.astro` via `client:*`.
- **UI primitives**: `src/components/ui/*.tsx` — estilo shadcn (cva + `React.forwardRef` + Radix wrap + `cn()`).
- **Radix**: react-slot, react-accordion, react-dialog (sheet), react-toast, react-tooltip.
- **Estilo**: Tailwind v4 (via vite plugin), `class-variance-authority`, `cn()` = `twMerge(clsx(...))` em `src/lib/utils.ts`.
- **Motion**: `framer-motion` (18/23 islands).
- **Ícones**: `lucide-react` (17/23 islands).
- **Path alias**: `@/` para todos os imports internos.

## Data / Estado

- `src/data/*.ts` — arrays de `const` tipados (`{label, value, icon?, desc?}`); `projects.ts` importa imagens via `vite-imagetools` (`?as=picture`), exporta `Project[]` + `categories[]`.
- `src/context/WizardContext.tsx` — `createContext` + Provider + hook `useX` (estado open/close).
- `src/hooks/` — `use-mobile` (matchMedia, breakpoint 768), `use-toast` (store reducer estilo shadcn).
- `src/lib/` — `utils.ts` (`cn`), `chat-content.ts`, `wizard-message.ts` (funções puras / constantes).

## API / Serverless

- `src/pages/api/chat.ts` — única rota serverless. Vira function via `export const prerender = false` (opt-out do `output:'static'`).
- Proxy não-streaming para `https://api.anthropic.com/v1/messages` (anthropic-version `2023-06-01`, max_tokens 1024).
- Validação com **zod**; env dual-source `import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY`; modelo default `claude-haiku-4-5-20251001`.

## Estrutura

| Path                                               | Conteúdo                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `src/pages/`                                       | 4 rotas `.astro` (index, servicos, portfolio, 404) + `api/chat.ts` |
| `src/layouts/Layout.astro`                         | Layout único — centraliza `<head>`/SEO                             |
| `src/components/`                                  | 23 islands de feature                                              |
| `src/components/ui/`                               | 12 primitivos UI                                                   |
| `src/lib/` `src/data/` `src/hooks/` `src/context/` | módulos compartilhados                                             |

## Commands

```bash
pnpm dev      # astro dev :4321
pnpm build    # astro build → .vercel/output/
pnpm preview  # preview build
pnpm perf:lh  # Lighthouse mobile (home,servicos,portfolio,404)
```
