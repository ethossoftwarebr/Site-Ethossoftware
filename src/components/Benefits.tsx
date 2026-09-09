import { motion } from "framer-motion";
import { GradientCard } from "@/components/ui/gradient-card";

const benefits = [
  {
    title: "Desempenho consistente",
    description: "Aplicamos boas práticas de desempenho e avaliamos os pontos críticos de cada solução."
  },
  {
    title: "Planejamento e acompanhamento",
    description: "Definimos escopo, etapas e responsáveis para acompanhar o desenvolvimento com transparência."
  },
  {
    title: "Segurança desde o projeto",
    description: "Controle de acesso, validações e cuidados com dados fazem parte das decisões técnicas."
  },
  {
    title: "Foco no objetivo do negócio",
    description: "As decisões de produto consideram o processo, o público e o resultado esperado pelo cliente."
  }
];

export default function Benefits() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#F3EFF5] relative overflow-hidden z-0">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-3 py-2 rounded-sm bg-[#F7F5F8] border border-[#DED5E0] mb-6"
            >
              <span className="text-[#8E2DBA] font-bold tracking-widest uppercase text-xs">Compromissos de projeto</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mt-2 mb-6 leading-[1.1]">
              Desenvolvimento com <br/>
              <span className="text-primary">responsabilidade</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Trabalhamos com clareza sobre escopo, prazos, riscos e responsabilidades. Cada solução é construída para atender uma necessidade definida e continuar sustentável após a entrega.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
              >
                <GradientCard className="p-8 group h-full">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
