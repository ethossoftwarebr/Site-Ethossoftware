import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Bot, User, ExternalLink, Sparkles } from "lucide-react";

const WA_NUMBER = "556294667304";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Olá! Sou a **Ethos.IA** 👋\n\nEstou aqui para te ajudar a entender qual solução da Ethos Software é ideal para o seu negócio ou ideia.\n\nMe conta: o que você está tentando resolver ou construir?",
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
        content: "Ops! Tive um problema. Fale com nossa equipe no WhatsApp: +55 62 9466-7304 📱"
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
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.5 }}
        onClick={() => setOpen(o => !o)}
        data-testid="button-ethos-ia-toggle"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#531B8C] to-[#A229F2] text-white rounded-full shadow-[0_8px_30px_rgba(162,41,242,0.5)] flex items-center justify-center group"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute right-full mr-3 bg-white text-[#531B8C] text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#A229F2]/10">
            Ethos.IA
          </span>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#25D366] rounded-full border-2 border-white" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-44 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#A229F2]/10 flex flex-col"
            style={{ maxHeight: "500px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#531B8C] to-[#A229F2] px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm">Ethos.IA</div>
                <div className="text-white/70 text-xs">Assistente virtual · Online</div>
              </div>
              <button
                onClick={openWhatsApp}
                data-testid="button-ethos-ia-humano"
                className="text-white/70 hover:text-white text-[10px] font-medium flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Humano
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F7F7]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-[#A229F2]" : "bg-gradient-to-br from-[#531B8C] to-[#A229F2]"}`}>
                    {msg.role === "user" ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className={`max-w-[75%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#A229F2] text-white rounded-tr-sm"
                      : "bg-white text-[#222222] rounded-tl-sm shadow-sm border border-gray-100"
                  }`}>
                    {formatText(msg.content)}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#531B8C] to-[#A229F2] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 bg-[#A229F2] rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  data-testid="input-ethos-ia"
                  className="flex-1 resize-none px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#A229F2] focus:outline-none leading-relaxed max-h-20 overflow-y-auto"
                  style={{ minHeight: "38px" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  data-testid="button-ethos-ia-send"
                  className="w-9 h-9 bg-[#A229F2] hover:bg-[#531B8C] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[#AAAAAA] text-[9px] mt-2">
                Ethos.IA · Pode cometer erros · <button onClick={openWhatsApp} className="underline hover:text-[#A229F2] transition-colors">Falar com humano</button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
