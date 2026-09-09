import { motion } from "framer-motion";
import { LazyImage } from "@/components/ui/lazy-image";
import softwareHouseImg from "@/assets/brand/image_1772683408265.png?w=600;1200&quality=70&format=avif;webp;png&as=picture";

export default function About() {
  return (
    <section id="sobre" className="relative z-10 container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-4 md:space-y-6 text-center md:text-left"
        >
          <span className="text-[#8E2DBA] font-semibold tracking-wider uppercase text-sm">Nossa História</span>
          <h2 className="font-bold text-foreground text-[28px] sm:text-[32px] md:text-[40px] lg:text-5xl leading-tight">
            Tecnologia construída com <br className="hidden md:block"/><span className="gradient-text">clareza e responsabilidade</span>
          </h2>
          
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              A <strong>Ethos Software</strong> nasceu em Goiânia para desenvolver soluções digitais alinhadas às necessidades reais de cada empresa.
            </p>
            <p>
              O trabalho começa pelo entendimento do processo, das prioridades e das limitações de cada projeto. A partir disso, definimos o escopo, a tecnologia e as etapas de entrega em conjunto com o cliente.
            </p>
            <p>
              Atendemos empresas de diferentes segmentos com sites, automações e sistemas de gestão. Mantemos uma comunicação objetiva durante o desenvolvimento e assumimos responsabilidade pelo que foi acordado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6">
            {[
              "Escopo definido com clareza",
              "Comunicação durante o projeto",
              "Decisões técnicas documentadas",
              "Suporte conforme contratação"
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center md:justify-start">
                <span className="text-foreground font-medium text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 relative w-full flex justify-center items-center"
        >
          <div className="relative w-full max-w-md aspect-square border border-border rounded-lg bg-card p-6">
            <LazyImage
              src={softwareHouseImg}
              alt="Ilustração 3D de Software House"
              sizes="(max-width: 1024px) 100vw, 600px"
              className="relative z-10 w-full h-full"
              imgClassName="w-full h-full object-contain"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
