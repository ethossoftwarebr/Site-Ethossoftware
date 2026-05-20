import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";

const testimonials = [
  {
    name: "Leandro Chagas",
    role: "Sócio Diretor",
    company: "Office Chagas",
    content:
      "O sistema desenvolvido pela Ethos mudou a realidade da nossa gestão. O painel de controle e as métricas em tempo real me poupam horas todos os dias. Nossos parceiros elogiam muito a facilidade de uso do dashboard.",
    rating: 5,
  },
  {
    name: "José Marcio Porto",
    role: "Proprietário",
    company: "Espeto Show",
    content:
      "Nós tínhamos um problema sério com o controle de pedidos e mapa de mesas. A Ethos não só resolveu isso como criou um software de gestão que usamos o dia inteiro. Melhorou demais a agilidade do nosso atendimento.",
    rating: 5,
  },
  {
    name: "Dra. Maria Laura",
    role: "Cirurgiã Dentista",
    company: "Odontologia Especializada",
    content:
      "Eu precisava de um site profissional que passasse a credibilidade dos meus tratamentos e facilitasse o agendamento de pacientes. O resultado ficou além das minhas expectativas, com um design muito elegante e focado em estética.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="py-16 md:py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BA66F2]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#A229F2]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-[#A229F2] font-bold tracking-widest uppercase text-xs mb-4 block">
            Feedback de Clientes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">
            O impacto do nosso código em negócios reais
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Veja o que dizem os empreendedores que escolheram a Ethos Software
            como parceira de tecnologia.
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
                <Quote className="absolute top-8 right-8 w-10 h-10 text-[#BA66F2]/25 group-hover:text-[#BA66F2]/50 transition-colors z-50 pointer-events-none" />

                <div className="flex gap-1 mb-6 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Star className="w-5 h-5 fill-[#A229F2] text-[#A229F2]" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-white/70 leading-relaxed mb-8 italic flex-grow text-sm md:text-[15px]">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 pt-6 mt-auto border-t border-white/8">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 rounded-full bg-[#A229F2]/20 border border-[#A229F2]/30 flex items-center justify-center text-[#BA66F2] font-bold text-sm flex-shrink-0"
                  >
                    {testimonial.name.charAt(0)}
                  </motion.div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="font-bold text-white group-hover:text-[#BA66F2] transition-colors truncate text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-white/45 truncate text-xs">
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
