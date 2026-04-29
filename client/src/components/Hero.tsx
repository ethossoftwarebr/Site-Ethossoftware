import { motion, useScroll, useTransform } from "framer-motion";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Code2, Database, Smartphone, Globe, Cpu, LayoutTemplate, Sparkles, Zap } from "lucide-react";
import { useRef } from "react";

const floatingIcons = [
  { Icon: Code2, top: "15%", left: "10%", delay: 0, size: 32, color: "text-[#A229F2]" },
  { Icon: Database, top: "20%", right: "15%", delay: 0.5, size: 40, color: "text-[#531B8C]" },
  { Icon: Smartphone, top: "60%", left: "15%", delay: 1, size: 36, color: "text-[#A229F2]" },
  { Icon: Globe, top: "65%", right: "10%", delay: 1.5, size: 48, color: "text-[#531B8C]" },
  { Icon: Cpu, top: "40%", left: "5%", delay: 2, size: 28, color: "text-[#BA66F2]" },
  { Icon: LayoutTemplate, top: "35%", right: "8%", delay: 2.5, size: 34, color: "text-[#A229F2]" },
  { Icon: Sparkles, top: "80%", left: "25%", delay: 3, size: 24, color: "text-[#BA66F2]" },
  { Icon: Zap, top: "10%", right: "25%", delay: 3.5, size: 28, color: "text-[#531B8C]" },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const whatsappUrl = "https://wa.me/556294667304?text=Olá! Gostaria de saber mais sobre as soluções da Ethos Software.";

  return (
    <section ref={containerRef} className="pt-24 pb-24 flex flex-col items-center justify-center text-center relative z-10 min-h-[90vh] overflow-hidden bg-gradient-to-b from-background via-card to-background">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(162,41,242,0.03)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />
      {/* Floating Animated Icons with Parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.color}/40 hidden md:flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl`}
            style={{ 
              top: item.top, 
              left: item.left, 
              right: item.right,
              width: item.size * 2,
              height: item.size * 2,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <item.Icon size={item.size} />
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-4 relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-card text-[#531B8C] dark:text-primary text-sm font-bold mb-10 border border-[#A229F2]/20 shadow-[0_8px_30px_rgba(159,36,232,0.12)] hover:shadow-[0_8px_30px_rgba(159,36,232,0.2)] transition-shadow cursor-default"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A229F2] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#A229F2]"></span>
          </span>
          Software House em Goiânia · 40+ projetos entregues
        </motion.div>
        
        <h1 className="text-5xl sm:text-[70px] md:text-8xl lg:text-9xl font-black text-foreground mb-8 tracking-tighter leading-[1.1] md:leading-none">
          Sistemas Inteligentes <br className="hidden sm:block"/>
          <span className="relative inline-block mt-2">
            <span className="absolute -inset-2 bg-gradient-to-r from-[#A229F2]/20 to-[#531B8C]/20 blur-2xl rounded-full"></span>
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-[#A229F2] via-[#BA66F2] to-[#531B8C] text-[48px] sm:text-[70px] md:text-8xl lg:text-9xl">
              para escalar seu negócio
            </span>
          </span>
        </h1>
        
        <p className="text-muted-foreground mb-10 md:mb-14 max-w-3xl mx-auto font-medium text-[16px] sm:text-[20px] md:text-[24px]">
          Mais do que código, entregamos <strong className="text-[#531B8C] dark:text-primary">resultados</strong>. 
          Sites, automações com IA e sistemas que transformam empresas comuns em líderes de mercado.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <ShinyButton
            onClick={() => window.open(whatsappUrl, "_blank")}
            className="w-full sm:w-auto text-xl"
            style={{ padding: "1rem 2.5rem" }}
          >
            Começar Meu Projeto
            <ArrowRight className="w-6 h-6" />
          </ShinyButton>
          
          <Button 
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-xl h-16 px-10 rounded-full border-2 border-[#A229F2]/30 hover:border-[#A229F2] bg-card hover:bg-[#A229F2]/5 text-foreground shadow-lg transition-all duration-300 hover:-translate-y-1"
            onClick={() => window.open(whatsappUrl, "_blank")}
          >
            Falar com Especialista
            <MessageCircle className="ml-3 w-6 h-6 text-[#A229F2]" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
