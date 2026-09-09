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
  content: "Olá! Sou a **Ethos.IA**.\n\nPosso ajudar a organizar as informações iniciais sobre a sua necessidade e apresentar os serviços da Ethos Software.\n\nO que você precisa resolver ou construir?",
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
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
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
          messages: newMessages.filter(m => m !== INITIAL_MESSAGE).concat(
            newMessages[0] === INITIAL_MESSAGE ? [] : []
          ).map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Ops! Tive um problema. Fale com nossa equipe no WhatsApp: +55 62 9466-7304."
      }]);
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
    window.open(`https://wa.me/${WA_NUMBER}?text=Olá! Estava conversando com a Ethos.IA e gostaria de falar com um especialista.`, "_blank");
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 1 }}
        onClick={() => setOpen(o => !o)}
        data-testid="button-ethos-ia-toggle"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#67228A] text-white rounded-full flex items-center justify-center group"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute right-full mr-3 bg-card text-[#67228A] text-xs font-bold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#8E2DBA]/10">
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
            className="fixed bottom-44 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] bg-card rounded-lg overflow-hidden border border-[#8E2DBA]/10 flex flex-col"
            style={{ maxHeight: "500px" }}
          >
            {/* Header */}
            <div className="bg-[#67228A] px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm">Ethos.IA</div>
                <div className="text-white/70 text-xs">Assistente virtual · Online</div>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F3EFF5]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`max-w-[75%] px-3 py-2.5 rounded-md text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#8E2DBA] text-white rounded-tr-sm"
                      : "bg-card text-[#2A332F] rounded-tl-sm border border-border"
                  }`}>
                    {formatText(msg.content)}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="bg-card rounded-md rounded-tl-sm px-4 py-3 border border-border flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 bg-[#8E2DBA] rounded-md"
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
                  className="flex-1 resize-none px-3 py-2.5 text-xs rounded-md border border-gray-200 focus:border-[#8E2DBA] focus:outline-none leading-relaxed max-h-20 overflow-y-auto"
                  style={{ minHeight: "38px" }}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  data-testid="button-ethos-ia-send"
                  className="w-9 h-9 bg-[#8E2DBA] hover:bg-[#67228A] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[#777E79] text-[9px] mt-2">
                A Ethos.IA pode cometer erros. <button type="button" onClick={openWhatsApp} className="underline hover:text-[#8E2DBA] transition-colors">Falar com a equipe</button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
