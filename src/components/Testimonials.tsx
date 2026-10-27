import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Leandro Chagas",
    role: "Sócio Diretor",
    company: "Office Chagas",
    content:
      "O sistema desenvolvido pela Ethos mudou a realidade da nossa gestão. O painel de controle e as métricas em tempo real me poupam horas todos os dias. Nossos parceiros elogiam muito a facilidade de uso do dashboard.",
  },
  {
    name: "José Marcio Porto",
    role: "Proprietário",
    company: "Espeto Show",
    content:
      "Nós tínhamos um problema sério com o controle de pedidos e mapa de mesas. A Ethos não só resolveu isso como criou um software de gestão que usamos o dia inteiro. Melhorou demais a agilidade do nosso atendimento.",
  },
  {
    name: "Dra. Maria Laura",
    role: "Cirurgiã Dentista",
    company: "Odontologia Especializada",
    content:
      "Eu precisava de um site profissional que passasse a credibilidade dos meus tratamentos e facilitasse o agendamento de pacientes. O resultado ficou além das minhas expectativas, com um design muito elegante e focado em estética.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="ethos-section relative overflow-hidden bg-background"
    >
      <div className="ethos-container relative z-10">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <span className="ethos-eyebrow mb-4 block">Feedback de Clientes</span>
          <h2 className="ethos-heading mb-4 md:mb-6">Relatos de clientes</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Experiências compartilhadas por clientes atendidos pela Ethos
            Software.
          </p>
        </div>

        <div className="border-t border-border">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="grid gap-5 border-b border-border py-8 md:grid-cols-[0.65fr_1.35fr] md:gap-12 md:py-10"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Cliente {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {testimonial.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
              <blockquote className="text-lg leading-relaxed text-foreground md:text-xl">
                “{testimonial.content}”
              </blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
