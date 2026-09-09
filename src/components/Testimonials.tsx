import { motion } from "framer-motion";
import { GradientCard } from "@/components/ui/gradient-card";

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
      className="py-16 md:py-24 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-[#8E2DBA] font-bold tracking-widest uppercase text-xs mb-4 block">
            Feedback de Clientes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">
            Relatos de clientes
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Experiências compartilhadas por clientes atendidos pela Ethos Software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GradientCard className="p-8 flex flex-col h-full min-h-[340px] group">
                <p className="text-muted-foreground leading-relaxed mb-8 italic flex-grow text-sm md:text-[15px]">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 pt-6 mt-auto border-t border-border">
                  <div
                    className="w-10 h-10 rounded-full bg-[#8E2DBA]/20 border border-[#8E2DBA]/30 flex items-center justify-center text-[#8E2DBA] font-bold text-sm flex-shrink-0"
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-muted-foreground truncate text-xs">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>
              </GradientCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
