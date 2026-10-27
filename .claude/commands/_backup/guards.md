<!-- mustard:generated -->

# Guards — Site Ethossoftware

> Regras DO/DON'T derivadas do código real. Pipelines mustard devem seguir. Gerado por `/scan --full -enrich`.

## Astro Pages

- **DO** envolver toda página em `@/layouts/Layout.astro` e passar `title` + `description`; passar `ogImage` e `canonical` quando aplicável (Layout renderiza meta condicionalmente).
- **DO** escolher a diretiva de hidratação pelo papel do island: `client:load` (conteúdo principal / first paint), `client:visible` (seção revelada por scroll), `client:idle` (widget trailing).
- **DON'T** duplicar meta/SEO na página — o `Layout.astro` é a fonte única. Use `<slot name="head" />` para injeção pontual (ex.: noindex no 404).

## API Route (`src/pages/api/chat.ts`)

- **DO** manter `export const prerender = false` — é o que torna a rota uma serverless function apesar do `output: 'static'`. Sem essa linha a rota é pré-renderizada estática (retorno vazio/stale).
- **DO** validar entrada com zod: `MessageSchema` (role user/assistant, content 1–1500), `BodySchema` (messages 1–20). Inválido → 400 com `parsed.error.flatten()`.
- **DO** aplicar allowlist de origem (`ORIGIN_ALLOWLIST`) → 403 se origem ausente/não permitida.
- **DO** ler env dual-source: `import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY` (mesmo para `ANTHROPIC_MODEL`, default `claude-haiku-4-5-20251001`).
- **DO** degradar graciosamente: sem API key → 200 `FALLBACK_NO_KEY` (mensagem WhatsApp); catch → 200 `FALLBACK_ERROR` + `console.error`. **Nunca** 500 ao cliente.
- **DON'T** transformar em streaming sem revisar o contrato do cliente EthosIA — a rota é não-streaming (fetch único, lê `data.content[0].text`).
- **DON'T** unir parse e validação: `request.json()` falho → 400 "invalid JSON body"; schema falho → 400 "invalid body". Mantenha distintos.

## React Islands (`src/components/*.tsx`)

- **DO** `export default function Name()` com arquivo nomeado igual ao componente.
- **DO** declarar conteúdo como `const` arrays module-level e `.map()`; `Variants` tipados também module-level.
- **DO** classes condicionais via template literal inline; **DON'T** puxar `cn()` aqui (só Navbar usa — 1/23).
- **DON'T** adicionar `'use client'` nem `import React` — a hidratação é responsabilidade do `client:*` na página `.astro`.
- **DON'T** adicionar interface de Props salvo se o island realmente precisar de config (norma: sem props, lê dados module-level).
- **DO** marcar elementos interativos com `data-testid`.

## UI Primitives (`src/components/ui/*.tsx`)

- **DO** envolver primitivos com ref em `React.forwardRef`; tipar ref como `React.ElementRef<typeof X.Part>` e props como `React.ComponentPropsWithoutRef<...>`.
- **DO** mesclar classes com `cn()`, passando o `className` do caller por ÚLTIMO.
- **DO** exports nomeados; subpartes de um compound em um único `export { ... }`; exportar `xVariants` junto do componente.
- **DO** usar `cva(base, { variants, defaultVariants })` para estilo multi-variante; re-exportar partes Radix sem estilo diretamente.
- **DON'T** default exports, imports relativos de util, ou `className` antes das classes base.
- **DON'T** re-implementar merge de classes / adicionar outro wrapper clsx/twMerge — reutilizar `cn` de `@/lib/utils`.
- **DON'T** forçar `cva`/`forwardRef` em wrappers simples (menu-toggle, gradient-card) — mas ainda mesclar `className` via `cn()`.

## Shared (`lib` / `data` / `context` / `hooks`)

- **DO** só exports nomeados em `lib/`; `data/*.ts` como `const` arrays tipados + `interface`.
- **DO** importar imagens de data modules via `vite-imagetools` (`?as=picture`), tipando com `PictureSource`.
- **DON'T** relative imports para utilitários internos — usar alias `@/`.

## Observações (drift)

- Cores de marca hardcoded (`#A229F2`/`#BA66F2`/`#531B8C`) em 18/23 islands convivem com tokens de tema (`bg-card`, `text-foreground`). Sem fonte única — candidato a token Tailwind futuro.
