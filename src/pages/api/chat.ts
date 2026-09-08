import type { APIRoute } from "astro";
import { SYSTEM_PROMPT } from "@/lib/chat-content";
import { chatBodySchema } from "@/lib/chat-schema";

export const prerender = false;

const FALLBACK_NO_KEY =
  "Olá! Sou a Ethos.IA e estou sendo configurada. Em breve poderei te ajudar aqui. Por enquanto, fale diretamente com nossa equipe pelo WhatsApp: +55 62 9466-7304 📱";

const FALLBACK_ERROR =
  "Ops! Tive um problema técnico. Fale com nossa equipe diretamente pelo WhatsApp: +55 62 9466-7304 📱";

const ORIGIN_ALLOWLIST = new Set([
  "https://ethossoftware.com.br",
  "https://www.ethossoftware.com.br",
  "http://localhost:4321",
]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get("origin");
  if (!origin || !ORIGIN_ALLOWLIST.has(origin)) {
    return json({ error: "origin not allowed" }, 403);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const parsed = chatBodySchema.safeParse(raw);
  if (!parsed.success) {
    return json(
      { error: "invalid body", details: parsed.error.flatten() },
      400,
    );
  }

  const apiKey =
    import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return json({ reply: FALLBACK_NO_KEY });
  }

  const model = import.meta.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: parsed.data.messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      content?: Array<{ text?: string }>;
    };
    const reply =
      data.content?.[0]?.text ??
      "Desculpe, não consegui processar sua mensagem. Tente novamente.";

    return json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return json({ reply: FALLBACK_ERROR });
  }
};
