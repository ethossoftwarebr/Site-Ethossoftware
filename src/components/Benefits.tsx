import { motion } from "framer-motion";
import { GradientCard } from "@/components/ui/gradient-card";
import { 
  Rocket, 
  BarChart3, 
  Clock, 
  ShieldCheck,
  Cpu,
  Network
} from "lucide-react";

const benefits = [
  {
    icon: Rocket,
    title: "Alta Performance",
    description: "Sistemas otimizados que garantem carregamento instantâneo, não importa o volume de usuários simultâneos."
  },
  {
    icon: Clock,
    title: "Entrega Ágil",
    description: "Metodologias maduras que permitem entregas rápidas sem perder a excelência e a precisão do código."
  },
  {
    icon: ShieldCheck,
    title: "Segurança de Dados",
    description: "Infraestrutura construída com as melhores práticas de cibersegurança para blindar suas informações."
  },
  {
    icon: BarChart3,
    title: "Foco em Conversão",
    description: "Design intencional, pautado em neurociência e dados, para converter visitantes em clientes fiéis."
  }
];

export default function Benefits() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#111111] relative overflow-hidden z-0">
      {/* Animated Motherboard / Circuit Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10,10 h20 v20 h-20 z" fill="none" stroke="#A229F2" strokeWidth="1" />
              <circle cx="20" cy="20" r="3" fill="#A229F2" />
              <path d="M30,20 h40 v40 h30" fill="none" stroke="#BA66F2" strokeWidth="1" />
              <circle cx="100" cy="60" r="2" fill="#BA66F2" />
              <path d="M10,50 v30 h20 v20" fill="none" stroke="#531B8C" strokeWidth="1" />
              <circle cx="30" cy="100" r="2" fill="#531B8C" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>

        {/* Moving data pulses on circuits */}
        <motion.div 
          animate={{ x: [0, 500], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20px] left-[30px] w-10 h-0.5 bg-gradient-to-r from-transparent to-[#A229F2]"
        />
        <motion.div 
          animate={{ y: [0, 500], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute top-[50px] left-[10px] w-0.5 h-10 bg-gradient-to-b from-transparent to-[#BA66F2]"
        />
        <motion.div 
          animate={{ x: [0, -500], opacity: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-[160px] right-[30px] w-10 h-0.5 bg-gradient-to-l from-transparent to-[#531B8C]"
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#531B8C]/20 rounded-full blur-[150px] -z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="max-w-xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <Cpu className="w-4 h-4 text-[#A229F2]" />
              <span className="text-[#A229F2] font-bold tracking-widest uppercase text-xs">Vantagem Competitiva</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-2 mb-6 leading-[1.1]">
              Por que escolher a <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A229F2] to-[#BA66F2]">Ethos Software?</span>
            </h2>
            <p className="text-[#F2F2F2]/80 text-lg md:text-xl leading-relaxed">
              Não somos apenas programadores. Somos estrategistas de negócios focados em construir a ponte tecnológica que leva sua empresa até os objetivos que você sempre almejou.
            </p>

            {/* 3D animated decorative element */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-md inline-flex items-center gap-4 hidden md:flex"
            >
              <div className="w-16 h-16 rounded-xl bg-[#531B8C] flex items-center justify-center relative overflow-hidden">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-50 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.5)_360deg)]" 
                />
                <Network className="w-8 h-8 text-white relative z-10" />
              </div>
              <div>
                <h4 className="text-white font-bold">Tecnologia de Elite</h4>
                <p className="text-white/60 text-sm">Arquitetura escalável para o futuro</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {/* Center glowing connection line */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(162,41,242,0.15)_0%,transparent_70%)] pointer-events-none" />

            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <GradientCard className="p-8 group h-full">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center mb-6 group-hover:border-[#A229F2]/50 transition-colors duration-300"
                  >
                    <benefit.icon className="w-7 h-7 text-[#BA66F2]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A229F2] transition-colors">{benefit.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </GradientCard>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
