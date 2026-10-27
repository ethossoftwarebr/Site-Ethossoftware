import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Instagram() {
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://w.behold.so/widget.js"]',
    );
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
    <section className="ethos-section relative z-10 bg-background">
      <div className="ethos-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="ethos-eyebrow mb-6 block">Instagram</span>

          <h2 className="ethos-heading mb-4 mt-2">
            Acompanhe a Ethos no Instagram
          </h2>
          <p className="text-muted-foreground text-lg mb-2">
            Projetos, rotina de desenvolvimento e atualizações da empresa.
          </p>
          <a
            href="https://www.instagram.com/ethossoftware"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors text-base"
            data-testid="link-instagram-profile"
          >
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
