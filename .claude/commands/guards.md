<!-- mustard:generated -->

# Guards — Site Ethossoftware

> Regras DO/DON'T derivadas do código real (working tree 2026-09-22). Pipelines mustard devem seguir. Exemplos e refs ficam em `patterns.md`.

## Astro Pages

- **DO** envolver toda página em `@/layouts/Layout.astro` passando `title` + `description`; passar `canonical` explícito em rotas indexáveis e `ogImage={ogImageAsset.src}`.
- **DO** usar a prop `structuredData` do Layout para JSON-LD por página (ex.: `FAQPage` em `index.astro`) — o `Organization` já é emitido pelo Layout.
- **DO** escolher a diretiva pelo papel do island: `client:load` (Navbar/Hero, first paint), `client:visible` (seções abaixo da dobra, EthosIA), `client:idle` (Footer, WhatsAppButton).
- **DO** omitir `client:*` quando o componente não tem interatividade (ex.: `NotFoundContent` no 404) — sai como HTML estático sem JS.
- **DON'T** duplicar meta/OG/canonical na página — o Layout é a fonte única (já tem fallback para canonical e og:image). Use `<slot name="head" />` só para injeção pontual (noindex no 404).
- **DON'T** reintroduzir `class="dark"` no `<html>` — o tema atual é light-only em `:root`.

## API Route (`src/pages/api/chat.ts`)

- **DO** manter `export const prerender = false` — com `output: 'static'` é o que transforma a rota em Vercel function.
- **DO** validar com os schemas de `@/lib/chat-schema` (`chatBodySchema`: 1–20 mensagens; `chatMessageSchema`: role `user|assistant`, content 1–1500). Mudou o contrato → atualizar `chat-schema.test.ts`.
- **DO** manter `ORIGIN_ALLOWLIST` → 403 se origin ausente/não permitida; incluir novos domínios ali.
- **DO** ler env dual-source `import.meta.env.X ?? process.env.X` para a API key; default de modelo `claude-haiku-4-5-20251001`. Novas env vars → declarar em `src/env.d.ts` e `.env.example`.
- **DO** degradar graciosamente: sem key → 200 `FALLBACK_NO_KEY`; erro → 200 `FALLBACK_ERROR` + `console.error`. **Nunca** 500 ao cliente.
- **DON'T** unir parse e validação: JSON inválido → 400 "invalid JSON body"; schema inválido → 400 "invalid body".
- **DON'T** trocar para streaming sem revisar o cliente `EthosIA.tsx` (espera `{ reply }` único).

## React Islands (`src/components/*.tsx`)

- **DO** `export default function Name()` com arquivo = nome do componente.
- **DO** estruturar seções com as classes de `global.css`: `ethos-section` + `ethos-container` + `ethos-eyebrow` / `ethos-heading` / `ethos-copy`; painéis com `ethos-panel` / `ethos-product-card`.
- **DO** usar tokens de tema (`text-primary`, `bg-secondary`, `text-muted-foreground`, `border-border`, `bg-card`); **DON'T** hardcodar hex de marca em `className` — adicionar token `--ethos-*` se faltar.
- **DO** conteúdo reutilizável em `@/data/*`; conteúdo local da seção como `const` module-level + `.map()`.
- **DO** classes condicionais via template literal; `cn()` só quando houver merge de `className` externo.
- **DO** marcar elementos interativos com `data-testid`.
- **DON'T** adicionar `'use client'` nem `import React` — hidratação é do `client:*` na página.
- **DON'T** criar island novo sem consumidor; hoje `AuroraBackground`, `Sparkles`, `OrbitingSkills` não são importados por nenhuma página.

## Buttons & Global CSS

- **DO** lembrar que `global.css` força `button { background/border: var(--ethos-purple) !important; color:#fff !important }` — todo `<button>` sai roxo, independentemente de classes ou da `variant` do `Button`.
- **DON'T** esperar que `variant="outline|ghost|secondary"` em `ui/button.tsx` mude o visual — essas variantes estão vazias. Para CTA principal use `ShinyButton` (`.shiny-cta`).
- **DON'T** remover o bloco `prefers-reduced-motion` de `global.css`.

## Motion (framer-motion)

- **DO** scroll-reveal com `initial` + `whileInView` + `viewport={{ once: true }}`, deslocamento curto e `duration` ≤ 0.7.
- **DO** `AnimatePresence mode="wait"` + `key` único por painel para trocas de step/modal.
- **DON'T** usar `animate` para reveal por scroll (reservado a mount/estado).

## UI Primitives (`src/components/ui/*.tsx`)

- **DO** `React.forwardRef` com ref `React.ElementRef<typeof X.Part>` e props `React.ComponentPropsWithoutRef<...>` ao envolver Radix.
- **DO** mesclar classes com `cn()`, `className` do caller por ÚLTIMO; `cva` para multi-variante e exportar `xVariants`.
- **DO** exports nomeados (0/12 default); subpartes do compound num único `export { ... }`.
- **DON'T** re-implementar merge de classes nem importar `cn` por caminho relativo.

## Data / Lib / Tests

- **DO** `src/data/*.ts` só com `export const` nomeados; tipar com `export interface` quando o shape for consumido por mais de um island.
- **DO** imagens de data modules via `vite-imagetools` (`?w=…&format=avif;webp;png&as=picture`) tipadas com `PictureSource`, renderizadas com `LazyImage`.
- **DO** lógica pura em `src/lib/*.ts` com teste co-localizado `*.test.ts` (vitest, env node).
- **DON'T** imports relativos para módulos internos — usar alias `@/` (exceto import do módulo irmão no teste).

## Quality Gates

- **DO** rodar `pnpm validate` (check → lint → test → build) antes de fechar mudança — espelha `.github/workflows/ci.yml`.
- **DO** respeitar Biome: 2 espaços, lineWidth 100, aspas duplas, `;`, trailing commas.
- **DON'T** alterar `pnpm-lock.yaml` sem `package.json` correspondente (CI usa `--frozen-lockfile`).
