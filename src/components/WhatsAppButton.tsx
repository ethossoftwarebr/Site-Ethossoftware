import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WA_URL =
  "https://wa.me/556294667304?text=Olá! Vim pelo site da Ethos Software e gostaria de conversar sobre um projeto.";

export default function WhatsAppButton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.25,
        delay: 1,
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-whatsapp-flutuante"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-accent"
      >
        <span className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-lg border border-primary bg-card px-4 py-2 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Fale no WhatsApp
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </motion.div>
  );
}
