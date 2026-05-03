import { useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram as InstagramIcon } from "lucide-react";

export default function Instagram() {
  useEffect(() => {
    const existing = document.querySelector('script[src="https://w.behold.so/widget.js"]');
    if (existing) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://w.behold.so/widget.js";
    script.dataset.beholdInjected = "true";
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A229F2]/10 border border-[#A229F2]/20 mb-6">
            <InstagramIcon className="w-4 h-4 text-[#A229F2]" />
            <span className="text-[#A229F2] font-bold tracking-widest uppercase text-xs">Instagram</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Siga-nos no Instagram
          </h2>
          <p className="text-muted-foreground text-lg mb-2">
            Acompanhe nossos projetos, bastidores e novidades
          </p>
          <a
            href="https://www.instagram.com/ethossoftware"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#A229F2] font-semibold hover:text-[#531B8C] transition-colors text-base"
            data-testid="link-instagram-profile"
          >
            <InstagramIcon className="w-4 h-4" />
            @ethossoftware
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          data-testid="instagram-feed-widget"
        >
          <div data-behold-id="Mxh7shiOxqSRqBCbiiya"></div>
        </motion.div>
      </div>
    </section>
  );
}
