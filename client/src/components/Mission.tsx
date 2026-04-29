import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Lightbulb, HeartHandshake, Sparkles, Rocket, Users } from "lucide-react";
import { useRef } from "react";

const pillars = [
  {
    icon: Target,
    title: "Nossa Missão",
    description: "Empoderar empresas através de soluções tecnológicas inteligentes, acessíveis e personalizadas, eliminando gargalos operacionais e escalando resultados financeiros."
  },
  {
    icon: Rocket,
    title: "Nosso Objetivo",
    description: "Ser reconhecida como a principal parceira de tecnologia do Brasil, entregando não apenas código, mas plataformas completas que transformam o modelo de negócio de nossos clientes."
  },
  {
    icon: HeartHandshake,
    title: "Nossos Valores",
    description: "Comprometimento com o sucesso do cliente, transparência em cada linha de código, inovação constante, empatia para entender as dores reais e excelência na entrega."
  }
];

export default function Mission() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative z-10 bg-[#111111] py-20 md:py-32 text-white overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(162,41,242,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div style={{ y: y1, opacity }} className="absolute top-0 right-[10%] w-[600px] h-[600px] bg-[#A229F2]/20 rounded-full blur-[120px] pointer-events-none" />
      <motion.div style={{ y: y2, opacity }} className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-[#531B8C]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16 md:mb-20 max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#A229F2]" />
            <span className="text-white font-bold tracking-widest uppercase text-sm">DNA Ethos</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-[1.1] tracking-tight">
            O que nos move <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A229F2] via-[#BA66F2] to-white">
              todos os dias
            </span>
          </h2>
          <p className="text-[#F2F2F2]/70 text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
            Nossos pilares são a base de todas as linhas de código que escrevemos. Construímos softwares com <strong className="text-white">propósito e alma</strong>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[80rem] mx-auto">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.2,
                type: "spring",
                bounce: 0.4
              }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 hover:border-[#A229F2]/50 transition-all duration-500 group relative overflow-hidden flex flex-col"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#A229F2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#A229F2] to-[#531B8C] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#A229F2]/20 group-hover:shadow-[#A229F2]/40 transition-shadow relative overflow-hidden"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-20 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.5)_360deg)] pointer-events-none" 
                  />
                  <pillar.icon className="w-10 h-10 text-white relative z-10" strokeWidth={1.5} />
                </motion.div>
                
                <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-[#A229F2] transition-colors duration-300">
                  {pillar.title}
                </h3>
                
                <p className="text-[#F2F2F2]/70 leading-relaxed text-lg group-hover:text-white/90 transition-colors duration-300">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
