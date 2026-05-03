import type { APIRoute } from 'astro';
import { SYSTEM_PROMPT } from '@/lib/chat-content';

export const prerender = false;

const FALLBACK_NO_KEY =
  'Olá! Sou a Ethos.IA e estou sendo configurada. Em breve poderei te ajudar aqui. Por enquanto, fale diretamente com nossa equipe pelo WhatsApp: +55 62 9466-7304 📱';

const FALLBACK_ERROR =
  'Ops! Tive um problema técnico. Fale com nossa equipe diretamente pelo WhatsApp: +55 62 9466-7304 📱';

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages } = body as Record<string, unknown>;

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey =
    import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ reply: FALLBACK_NO_KEY }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: (messages as Array<{ role: string; content: string }>).map(
          (m) => ({ role: m.role, content: m.content })
        ),
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
      'Desculpe, não consegui processar sua mensagem. Tente novamente.';

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Chat error:', err);
    return new Response(JSON.stringify({ reply: FALLBACK_ERROR }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
