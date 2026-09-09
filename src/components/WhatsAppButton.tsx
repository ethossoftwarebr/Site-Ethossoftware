import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WA_URL = "https://wa.me/556294667304?text=Olá! Vim pelo site da Ethos Software e gostaria de conversar sobre um projeto.";

export default function WhatsAppButton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.25,
        delay: 1 
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-whatsapp-flutuante"
        className="flex items-center justify-center w-14 h-14 bg-[#3E7658] text-white rounded-full hover:bg-[#315E48] transition-colors group relative"
      >
        <span className="absolute right-full mr-4 bg-card text-[#315E48] text-sm font-semibold px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
          Fale no WhatsApp
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </motion.div>
  );
}
