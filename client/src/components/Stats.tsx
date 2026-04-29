import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Clientes Atendidos", suffix: "empresas transformadas" },
  { value: "98%", label: "Taxa de Retenção", suffix: "satisfação garantida" },
  { value: "12+", label: "Especialistas", suffix: "time altamente qualificado" },
  { value: "24/7", label: "Suporte Dedicado", suffix: "sempre à disposição" }
];

export default function Stats() {
  return (
    <section className="relative z-10 bg-[#A229F2]/5 py-16 border-y border-[#A229F2]/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center flex flex-col items-center justify-center p-6 rounded-2xl hover:bg-secondary hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#A229F2]/20"
            >
              <h4 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[#A229F2] to-[#531B8C] mb-2">
                {stat.value}
              </h4>
              <p className="text-foreground font-bold text-lg mb-1">{stat.label}</p>
              <p className="text-muted-foreground text-sm">{stat.suffix}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
