import { motion } from "framer-motion";

const pillars = [
  {
    title: "Nossa Missão",
    description:
      "Desenvolver software útil, seguro e sustentável, com responsabilidade sobre o escopo acordado e a qualidade da entrega.",
  },
  {
    title: "Nosso Objetivo",
    description:
      "Construir relações de longo prazo por meio de entregas consistentes, comunicação clara e suporte compatível com cada contratação.",
  },
  {
    title: "Nossos Valores",
    description:
      "Responsabilidade, transparência e respeito. Comunicamos riscos, documentamos decisões e cumprimos o que foi combinado.",
  },
];

export default function Mission() {
  return (
    <section className="ethos-section relative z-10 overflow-hidden border-y border-border bg-secondary text-foreground">
      <div className="ethos-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="ethos-eyebrow">Princípios da Ethos</span>
          </motion.div>

          <h2 className="ethos-heading mb-6">O que orienta o nosso trabalho</h2>
          <p className="ethos-copy">
            Trabalhamos com clareza sobre escopo, prazo, riscos e
            responsabilidades para manter relações profissionais e entregas
            consistentes.
          </p>
        </motion.div>

        <div className="border-t border-border">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="grid gap-4 border-b border-border py-8 md:grid-cols-[4rem_0.7fr_1.3fr] md:items-start md:gap-8"
            >
              <span className="pt-1 text-xs font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
