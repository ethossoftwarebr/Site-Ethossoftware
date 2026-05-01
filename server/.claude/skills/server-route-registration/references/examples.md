# Real route examples from server/routes.ts

## GET /api/sitecontent (text/plain response)

```ts
app.get("/api/sitecontent", (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(SITE_CONTENT);
});
```
File: `server/routes.ts:118-122`

## POST /api/chat (JSON in/out + external API + graceful degradation)

```ts
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.json({
      reply: "Olá! Sou a Ethos.IA e estou sendo configurada..."
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content }))
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const reply = data.content?.[0]?.text || "Desculpe, não consegui processar sua mensagem.";

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.json({
      reply: "Ops! Tive um problema técnico. Fale com nossa equipe pelo WhatsApp..."
    });
  }
});
```
File: `server/routes.ts:124-172`

## Caller (do not duplicate)

```ts
// server/index.ts:12
await registerRoutes(httpServer, app);
```
