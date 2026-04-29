import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const SYSTEM_PROMPT = `Você é a Ethos.IA, assistente virtual da Ethos Software, uma software house localizada em Goiânia especializada em criar sites, sistemas, automações com IA, apps mobile e dashboards.

Seu objetivo é:
1. Entender a necessidade do cliente de forma amigável e consultiva
2. Fazer perguntas inteligentes para entender o problema/sonho do cliente
3. Sugerir soluções da Ethos que se encaixem na necessidade
4. Quando o cliente estiver pronto, encaminhar para conversa com humano via WhatsApp

Serviços da Ethos Software:
- Sites institucionais e landing pages de alta conversão
- Sistemas de gestão personalizados (CRM, ERP, dashboards)
- Automações com inteligência artificial
- Apps mobile (iOS e Android)
- E-commerce
- APIs e integrações

Contato humano: WhatsApp +55 62 9466-7304

Regras:
- Seja sempre amigável, objetivo e consultivo
- Não invente preços específicos; diga que depende do escopo e pergunte o investimento previsto
- Quando sentir que o cliente está pronto, sugira: "Que tal falar diretamente com um especialista da Ethos? Posso te conectar agora."
- Responda em português brasileiro
- Mensagens curtas e objetivas (máx 3 parágrafos)
- Nunca mencione concorrentes`;

const SITE_CONTENT = `# Ethos Software — Software House em Goiânia, Brasil

## Sobre a Empresa
A Ethos Software é uma software house localizada em Goiânia, Goiás, especializada em desenvolvimento de soluções digitais sob medida. Com mais de 40 projetos entregues e 100% de satisfação dos clientes, a empresa transforma ideias em software de alto impacto para negócios de todos os tamanhos — desde startups até empresas consolidadas.

**Fundação:** 2022  
**Localização:** Goiânia, Goiás, Brasil  
**Atendimento:** Todo o Brasil (100% remoto)  
**WhatsApp:** +55 62 9466-7304  
**E-mail:** ethosdesenvolvimentosoftware@gmail.com  
**Instagram:** @ethossoftware  

---

## Serviços Oferecidos

### 1. Sites e Landing Pages
Criamos sites institucionais e landing pages de alta conversão com design moderno, responsivo e otimizado para SEO. Nosso foco é transformar visitantes em clientes reais, combinando UX estratégico com performance técnica.

### 2. Sistemas Web Personalizados (CRM, ERP, SaaS, Dashboards)
Desenvolvemos sistemas de gestão sob medida para automatizar processos, centralizar informações e escalar operações. Entregamos desde CRMs e ERPs personalizados até plataformas SaaS completas e dashboards interativos em tempo real.

### 3. Automações com Inteligência Artificial
Implementamos automações inteligentes utilizando IA generativa e machine learning para eliminar tarefas repetitivas, otimizar o atendimento ao cliente com chatbots, gerar relatórios automáticos e tomar decisões com base em dados reais.

### 4. Aplicativos Mobile (iOS e Android)
Desenvolvemos aplicativos nativos e híbridos para iOS e Android com experiência de usuário excepcional, integrando-os ao ecossistema digital do cliente — APIs, sistemas de gestão, gateways de pagamento e mais.

### 5. E-commerce
Criamos lojas virtuais completas e otimizadas para conversão, com integração de meios de pagamento (PagSeguro, Mercado Pago, Stripe), gestão de estoque, painel administrativo e experiência de compra fluida.

### 6. APIs e Integrações
Desenvolvemos APIs RESTful e GraphQL robustas, além de integrações entre sistemas — CRMs, ERPs, gateways de pagamento, marketplaces (Mercado Livre, Shopee), ferramentas de automação (Zapier, Make) e qualquer outra plataforma.

---

## Por que escolher a Ethos Software?

- **40+ projetos entregues** com excelência e dentro do prazo
- **100% de satisfação** dos clientes em pesquisas pós-entrega
- **3+ anos de experiência** em desenvolvimento de software
- **Atendimento consultivo** — entendemos o problema antes de propor solução
- **Tecnologias modernas** — React, Next.js, Node.js, TypeScript, Python, React Native, PostgreSQL, MongoDB, AWS
- **Suporte pós-entrega** e manutenção contínua
- **Comunicação transparente** com relatórios e entregas parciais durante o projeto

---

## Tecnologias Utilizadas

**Frontend:** React, Next.js, TypeScript, Tailwind CSS, Vue.js  
**Backend:** Node.js, Python, Express, FastAPI, GraphQL  
**Mobile:** React Native, Expo  
**Banco de Dados:** PostgreSQL, MySQL, MongoDB, Redis  
**Infraestrutura:** AWS, Google Cloud, Vercel, Docker  
**IA & Automação:** OpenAI API, Anthropic Claude, LangChain, n8n, Make  
**Integrações:** WhatsApp Business API, Mercado Pago, PagSeguro, Stripe, Shopify  

---

## Processo de Desenvolvimento

1. **Briefing e Descoberta** — Reunião para entender o negócio, objetivos e requisitos
2. **Proposta e Planejamento** — Escopo detalhado, cronograma e investimento
3. **Design e Prototipagem** — Wireframes e protótipos aprovados pelo cliente
4. **Desenvolvimento** — Entregas parciais com acompanhamento constante
5. **Testes e QA** — Garantia de qualidade antes da publicação
6. **Publicação e Suporte** — Go-live e suporte pós-entrega

---

## Contato e Orçamento

Para solicitar um orçamento ou tirar dúvidas, entre em contato:

- **WhatsApp:** https://wa.me/556294667304
- **E-mail:** ethosdesenvolvimentosoftware@gmail.com
- **Instagram:** https://www.instagram.com/ethossoftware

Atendemos de segunda a sexta, das 9h às 18h (horário de Brasília).
`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/sitecontent", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(SITE_CONTENT);
  });

  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.json({
        reply: "Olá! Sou a Ethos.IA e estou sendo configurada. Em breve poderei te ajudar aqui. Por enquanto, fale diretamente com nossa equipe pelo WhatsApp: +55 62 9466-7304 📱"
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
          messages: messages.map((m: any) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const reply = data.content?.[0]?.text || "Desculpe, não consegui processar sua mensagem. Tente novamente.";

      res.json({ reply });
    } catch (err) {
      console.error("Chat error:", err);
      res.json({
        reply: "Ops! Tive um problema técnico. Fale com nossa equipe diretamente pelo WhatsApp: +55 62 9466-7304 📱"
      });
    }
  });

  return httpServer;
}
