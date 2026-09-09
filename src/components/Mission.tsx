import { motion } from "framer-motion";

const pillars = [
  {
    title: "Nossa Missão",
    description: "Desenvolver software útil, seguro e sustentável, com responsabilidade sobre o escopo acordado e a qualidade da entrega."
  },
  {
    title: "Nosso Objetivo",
    description: "Construir relações de longo prazo por meio de entregas consistentes, comunicação clara e suporte compatível com cada contratação."
  },
  {
    title: "Nossos Valores",
    description: "Responsabilidade, transparência e respeito. Comunicamos riscos, documentamos decisões e cumprimos o que foi combinado."
  }
];

export default function Mission() {
  return (
    <section className="relative z-10 bg-[#F8F6F9] py-20 md:py-32 text-foreground overflow-hidden">
      <div className="absolute inset-0 border-y border-[#DED5E0]/70 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16 md:mb-20 max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#FBFAFC] border border-[#DED5E0] mb-8"
          >
            <span className="text-foreground font-bold tracking-widest uppercase text-sm">Princípios da Ethos</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-[1.1] tracking-tight">
            O que nos move <br className="hidden sm:block"/>
            <span className="text-primary">
              todos os dias
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
            Trabalhamos com clareza sobre escopo, prazo, riscos e responsabilidades para manter relações profissionais e entregas consistentes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[80rem] mx-auto">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              className="bg-[#FBFAFC] border border-[#DED5E0] p-10 rounded-lg hover:border-[#8E2DBA]/50 transition-colors group relative overflow-hidden flex flex-col"
            >
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                  {pillar.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-lg transition-colors duration-300">
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
