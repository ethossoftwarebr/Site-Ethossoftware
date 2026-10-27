import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, ExternalLink } from "lucide-react";

const WA_NUMBER = "556294667304";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Olá! Sou a **Ethos.IA**.\n\nPosso ajudar a organizar as informações iniciais sobre a sua necessidade e apresentar os serviços da Ethos Software.\n\nO que você precisa resolver ou construir?",
};

function formatText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function EthosIA() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m !== INITIAL_MESSAGE)
            .concat(newMessages[0] === INITIAL_MESSAGE ? [] : [])
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Ops! Tive um problema. Fale com nossa equipe no WhatsApp: +55 62 9466-7304.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${WA_NUMBER}?text=Olá! Estava conversando com a Ethos.IA e gostaria de falar com um especialista.`,
      "_blank",
    );
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 1 }}
        onClick={() => setOpen((o) => !o)}
        data-testid="button-ethos-ia-toggle"
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-accent group"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg border border-primary bg-card px-3 py-1.5 text-xs font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Ethos.IA
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-44 right-6 z-50 flex w-[340px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_50px_rgba(24,20,27,0.14)]"
            style={{ maxHeight: "500px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-primary px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm">Ethos.IA</div>
                <div className="text-white/70 text-xs">
                  Assistente virtual · Online
                </div>
              </div>
              <button
                type="button"
                onClick={openWhatsApp}
                data-testid="button-ethos-ia-humano"
                className="text-white/70 hover:text-white text-[10px] font-medium flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Humano
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-secondary p-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2.5 rounded-lg text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-card text-foreground rounded-tl-sm border border-border"
                    }`}
                  >
                    {formatText(msg.content)}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="bg-card rounded-lg rounded-tl-sm px-4 py-3 border border-border flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="h-1.5 w-1.5 rounded-lg bg-primary"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-card border-t border-border">
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  data-testid="input-ethos-ia"
                  className="max-h-20 flex-1 resize-none overflow-y-auto rounded-lg border border-border px-3 py-2.5 text-xs leading-relaxed focus:border-primary focus:outline-none"
                  style={{ minHeight: "38px" }}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  data-testid="button-ethos-ia-send"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-accent disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[9px] text-muted-foreground">
                A Ethos.IA pode cometer erros.{" "}
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="rounded-md px-2 py-1 font-semibold text-white transition-colors hover:bg-accent"
                >
                  Falar com a equipe
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
