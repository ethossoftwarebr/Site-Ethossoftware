# Enhancement: api-chat-hardening

### Status: completed | Phase: CLOSE | Scope: light

### Checkpoint: 2026-05-04T15:25:00Z

## Summary

Endurecer `/api/chat` contra abuso financeiro: Origin allowlist (filtra drive-by bots), Zod schema (limita payload bombing), modelo via env var (default `claude-haiku-4-5-20251001`, hoje hardcoded `claude-3-5-haiku-20241022`). Bonus: deletar `Stats.tsx` (dead code). Rate limit persistente fica para spec futura quando Vercel deploy real apontar abuse pattern (precisa Vercel KV/Upstash).

## ANALYZE findings

- **Frontend consumer único**: `src/components/EthosIA.tsx:59-67` envia `{ messages: [{role, content}, ...] }` via fetch POST same-origin
- **API routes em scope**: apenas `src/pages/api/chat.ts` (`/api/sitecontent` é content público, fora do escopo)
- **`zod ^3.25.76`** já nas deps — sem novas deps
- **`env.d.ts`** atualmente só declara vite-imagetools — adicionar `ImportMetaEnv` explícito para os vars Anthropic

## Boundaries

- `src/pages/api/chat.ts` — modify (adicionar Origin check + Zod + env model)
- `src/env.d.ts` — modify (adicionar interface `ImportMetaEnv`)
- `src/components/Stats.tsx` — DELETE (dead code, zero imports validado)

## Não-escopo

- Rate limit persistente (precisa external store — spec dedicada futura)
- `/api/sitecontent.ts` (content público sem secret atrás)
- Captcha/Turnstile (UX impact, fora de escopo)
- Refactor do EthosIA frontend (não muda shape do payload)
- Renovação de `ANTHROPIC_API_KEY` (responsabilidade do usuário)

## Estratégia técnica

### Origin allowlist

```ts
const ORIGIN_ALLOWLIST = new Set([
  "https://ethossoftware.com.br",
  "https://www.ethossoftware.com.br",
  "http://localhost:4321", // dev
]);

const origin = request.headers.get("origin");
if (!origin || !ORIGIN_ALLOWLIST.has(origin)) {
  return new Response(JSON.stringify({ error: "origin not allowed" }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}
```

**Limitação documentada**: Origin pode ser spoofed via curl `-H "Origin: ..."` — não é boundary real de auth. Filtra drive-by bots automatizados. Defense-in-depth via Zod + max_tokens.

### Zod schema

```ts
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1500),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
});
```

Worst-case body: 20 × 1500 = 30KB texto. Vs Anthropic billing: ~7.5K tokens × $1/MTok input = $0.0075 + 1024 output × $5/MTok = $0.005 = **~$0.013/req worst-case** com haiku-4-5.

### Model env var

```ts
const model = import.meta.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";
```

Adicionar em `src/env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly ANTHROPIC_API_KEY?: string;
  readonly ANTHROPIC_MODEL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Checklist

### Backend Agent (single wave)

- [x] `src/pages/api/chat.ts`: importar `z` de `zod`
- [x] `src/pages/api/chat.ts`: definir `ORIGIN_ALLOWLIST` + checagem de `Origin` header → 403 se não-permitido
- [x] `src/pages/api/chat.ts`: substituir cast manual `as Record<string, unknown>` por `BodySchema.safeParse()` → 400 com mensagem se inválido
- [x] `src/pages/api/chat.ts`: substituir model hardcoded `claude-3-5-haiku-20241022` por `import.meta.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001'`
- [x] `src/env.d.ts`: adicionar interface `ImportMetaEnv` com `ANTHROPIC_API_KEY` + `ANTHROPIC_MODEL`
- [x] Deletar `src/components/Stats.tsx`
- [x] `pnpm build` exit 0 (Server built in ~24s)
- [x] Validar AC1-AC8 via curl scripts

## Results

- **AC1 ✓** `pnpm build` exit 0 — Server built clean
- **AC2 ✓** sem Origin → 403 `{"error":"origin not allowed"}`
- **AC3 ✓** Origin: https://evil.com → 403
- **AC4 ✓** Origin: http://localhost:4321 + body válido → 200 com fallback (key não set no dev env)
- **AC5 ✓** messages=[] → 400 `{"error":"invalid body","details":{...}}` com `"Array must contain at least 1 element(s)"`
- **AC5 extra ✓** content 1600 chars → 400 com `"String must contain at most 1500 character(s)"`
- **AC6 ✓** `claude-3-5-haiku-20241022` removido (grep retorna 0)
- **AC7 ✓** `ANTHROPIC_MODEL` em chat.ts:62 + env.d.ts:5
- **AC8 ✓** `Stats.tsx` deletado (git status `D`)

**Astro 6 CSRF default-on** detectado durante testes — bonus defense-in-depth para form POSTs sem Origin. Não conflita com nossa allowlist (Astro CSRF passa, depois nossa lista checa explicitamente).

Bonus warning detectado (fora-escopo): Unused `Fingerprint` import em src/components/Services.tsx (dead code; carregar quando tocar perto). Chunk >500KB (alvo de futura Spec quando deploy real apontar gargalo).

## Files (~3)

- `src/pages/api/chat.ts` (modify, ~+30 linhas)
- `src/env.d.ts` (modify, ~+8 linhas)
- `src/components/Stats.tsx` (DELETE)

## Acceptance Criteria

- **AC1**: `pnpm build` exit 0 — sem erro de tipos no Zod schema ou ImportMetaEnv
- **AC2**: `curl -X POST http://localhost:4321/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"oi"}]}'` (sem Origin) → HTTP 403, body `{"error":"origin not allowed"}`
- **AC3**: `curl ... -H "Origin: https://evil.com"` → HTTP 403
- **AC4**: `curl ... -H "Origin: http://localhost:4321"` + body válido → HTTP 200 com `reply` (se key set) ou fallback WhatsApp (se key ausente)
- **AC5**: Body inválido (sem messages, content > 1500 chars, array > 20, role inválido) → HTTP 400 com mensagem de erro derivada do Zod
- **AC6**: `grep -E "claude-3-5-haiku-20241022" src/` retorna 0 ocorrências
- **AC7**: `grep -E "ANTHROPIC_MODEL" src/` retorna ≥2 ocorrências (env.d.ts + chat.ts)
- **AC8**: `git status` confirma `src/components/Stats.tsx` deletado

## Validação manual pelo usuário (pós-EXECUTE)

- Em `pnpm dev`, abrir o chat Ethos.IA na home e enviar uma mensagem — deve funcionar normalmente (Origin localhost:4321 allowlisted)
- Sem `ANTHROPIC_API_KEY` no env → recebe fallback WhatsApp message (status 200)
- Com `ANTHROPIC_API_KEY` set → recebe resposta gerada pela Anthropic
- (Opcional) curl externo confirma 403 sem Origin

## Concerns

- Origin spoof via curl `-H "Origin: ..."` continua possível — Origin check é mitigation contra drive-by bots, não auth real. Documentado.
- Sem rate limit persistente, abuse sustentado custaria ~$0.013/req em haiku-4-5. 1000 req/dia = $13/dia = $390/mês worst-case. Aceitável como ponto de partida; alarmar via Anthropic dashboard usage alerts.
- `claude-haiku-4-5-20251001` é o modelo recomendado (cutoff 2026-01, mais inteligente que 3.5 com custo similar). Se Anthropic deprecar/renomear, alterar default no código.
