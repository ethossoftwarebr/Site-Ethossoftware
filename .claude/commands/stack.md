<!-- mustard:generated -->

# Stack — Site Ethossoftware

> Technology stack, structure e tooling do site (Astro static + React islands + 1 serverless API route). Gerado por `/scan` incremental (2026-09-22, base 54cf921 + working tree).

## Runtime & Build

| Camada        | Detalhe (fonte: `astro.config.mjs`, `package.json`, `vercel.json`)                       |
| ------------- | ---------------------------------------------------------------------------------------- |
| Framework     | Astro `^6.2.1` — `output: 'static'` (SSG); rotas com `prerender = false` viram functions |
| Adapter       | `@astrojs/vercel` `10.0.6` (pinned, `vercel()` sem opções)                               |
| Integrations  | `react()` + `sitemap()` (`@astrojs/sitemap`)                                             |
| Image service | sharp — `astro/assets/services/sharp`                                                    |
| Vite plugins  | `@tailwindcss/vite` (Tailwind v4) + `vite-imagetools`                                    |
| Site          | `https://ethossoftware.com.br`                                                           |
| Vercel        | `vercel.json`: `pnpm build` → `.vercel/output`, `pnpm install --frozen-lockfile`         |
| Engines       | Node `>=22.12.0` (`package.json`); CI usa Node 24 + pnpm `10.33.0`                       |

## UI Layer

- **Islands React 19** (`react ^19.2.5`): 22 componentes em `src/components/*.tsx`, hidratados via `client:*` nas páginas `.astro`.
- **UI primitives**: 12 arquivos em `src/components/ui/*.tsx` — estilo shadcn (cva + `React.forwardRef` + Radix + `cn()`).
- **Radix**: react-slot, react-accordion, react-dialog (sheet), react-toast, react-tooltip.
- **Estilo**: Tailwind v4 + `tw-animate-css` + `class-variance-authority`; `cn()` = `twMerge(clsx(...))` em `src/lib/utils.ts`.
- **Tipografia**: `@fontsource-variable/manrope` (novo, não commitado) importado no topo de `src/styles/global.css`; `--font-sans: "Manrope Variable"`.
- **Motion**: `framer-motion ^12` (13/22 islands). **Ícones**: `lucide-react` (6/22 islands + `src/data/services.ts`).
- **Three.js** (`three ^0.184`): só em `src/components/AuroraBackground.tsx` (dynamic `import("three")`) — componente hoje sem nenhum consumidor.
- **Path alias**: `@/` → `src/` (tsconfig + `vitest.config.ts`).

## Design System (`src/styles/global.css`)

- Tema **light** único: tokens HSL em `:root` (`--primary: 277 69% 33%`, `--background`, `--card`, `--secondary`, `--accent`…) expostos via `@theme inline` como `bg-primary`, `text-muted-foreground`, `border-border`. Não há mais `.dark` nem `class="dark"` no `<html>`.
- Tokens de marca `--ethos-*` (`--ethos-purple #5c198d`, `--ethos-purple-deep #42105f`, `--ethos-purple-disabled #685b70`, `--ethos-canvas`…), escala `--text-*`, `--radius-card/product/control`, `--shadow-card/product/button`.
- Classes de componente (`@layer components`): `ethos-container`, `ethos-section`, `ethos-eyebrow`, `ethos-heading`, `ethos-copy`, `ethos-panel`, `ethos-product-card`, `ethos-product-blob(--vivid|--deep)`, `ethos-button-shadow`; `.shiny-cta` (ShinyButton).
- Override global de `button` com `!important` (bg/border `--ethos-purple`, hover `--ethos-purple-deep`, disabled `--ethos-purple-disabled`, texto branco).
- `prefers-reduced-motion`: zera animações/transições globalmente.

## Data / Estado

- `src/data/*.ts` (4): `faq.ts`, `projects.ts`, `services.ts`, `wizard.ts` — `export const` arrays nomeados; `projects.ts` importa screenshots via `vite-imagetools` (`?…&as=picture`) tipados com `PictureSource`.
- `src/hooks/` — `use-toast.ts` (store reducer shadcn, usado por `ui/toaster.tsx`), `use-mobile.tsx` (sem consumidores).
- `src/lib/` — `utils.ts` (`cn`), `chat-content.ts` (`SYSTEM_PROMPT`), `chat-schema.ts` (zod), `wizard-message.ts` (`buildMessage`), + 2 testes `*.test.ts`.
- `src/context/` foi removido (7f394fc — `WizardContext` + `WhatsAppWizard` eliminados).

## API / Serverless

- `src/pages/api/chat.ts` — ÚNICA rota API (não existe `sitecontent`). `export const prerender = false` → Vercel function.
- Schemas em `src/lib/chat-schema.ts` (`chatMessageSchema`, `chatBodySchema`), testados em `chat-schema.test.ts`.
- Proxy não-streaming para `https://api.anthropic.com/v1/messages` (`anthropic-version 2023-06-01`, `max_tokens 1024`); modelo default `claude-haiku-4-5-20251001` (`ANTHROPIC_MODEL` opcional). Env tipado em `src/env.d.ts`; exemplo em `.env.example`.

## Estrutura

| Path                                | Conteúdo                                                               |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `src/pages/`                        | 4 rotas `.astro` (index, servicos, portfolio, 404) + `api/chat.ts`     |
| `src/layouts/Layout.astro`          | Layout único — `<head>`/SEO/JSON-LD centralizados                      |
| `src/components/`                   | 22 islands (inclui `NavbarIsland.tsx` wrapper)                         |
| `src/components/ui/`                | 12 primitivos                                                          |
| `src/data/` `src/lib/` `src/hooks/` | módulos compartilhados                                                 |
| `src/styles/global.css`             | tokens + classes `ethos-*`                                             |
| `src/assets/`                       | brand, clients, images, screenshots (processados por imagetools/sharp) |
| `scripts/*.cjs`                     | Lighthouse runner + comparador                                         |
| `.github/workflows/ci.yml`          | CI: check → lint → test → build                                        |

## Tooling

| Ferramenta  | Config                              | Notas                                                                        |
| ----------- | ----------------------------------- | ---------------------------------------------------------------------------- |
| Biome 2     | `biome.json`                        | lint + format (2 espaços, lineWidth 100, aspas duplas, `;`, trailing commas) |
| Vitest 5    | `vitest.config.ts`                  | env node, `src/**/*.test.ts`, coverage `src/lib/**/*.ts`                     |
| astro check | `@astrojs/check`                    | typecheck (TypeScript `^6`)                                                  |
| Lighthouse  | `scripts/run-lighthouse-mobile.cjs` | rotas home,servicos,portfolio,404                                            |

## Commands

```bash
pnpm dev             # astro dev :4321
pnpm build           # astro build → .vercel/output/
pnpm preview         # preview build
pnpm check           # astro check (types)
pnpm lint            # biome lint src scripts astro.config.mjs vitest.config.ts
pnpm format          # biome format --write (mesmos paths)
pnpm test            # vitest run
pnpm validate        # check + lint + test + build (gate local = CI)
pnpm perf:lh         # Lighthouse mobile
pnpm perf:baseline   # snapshot baselines → lighthouse-baselines/
pnpm perf:compare:cross
```
