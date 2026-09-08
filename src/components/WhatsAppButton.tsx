import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WA_URL = "https://wa.me/556294667304?text=Olá! Vim pelo site da Ethos Software e gostaria de conversar sobre um projeto.";

export default function WhatsAppButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1 
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-whatsapp-flutuante"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:bg-[#128C7E] transition-all hover:scale-110 group relative"
      >
        <span className="absolute right-full mr-4 bg-white text-[#128C7E] text-sm font-semibold px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-green-100">
          Fale no WhatsApp
        </span>
        <MessageCircle className="w-7 h-7" />
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] motion-safe:animate-ping opacity-75"></span>
      </a>
    </motion.div>
  );
}
