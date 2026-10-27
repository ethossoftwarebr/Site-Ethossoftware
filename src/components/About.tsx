import { motion } from "framer-motion";
import { LazyImage } from "@/components/ui/lazy-image";
import { projects } from "@/data/projects";

export default function About() {
  const featuredProject = projects[0];

  return (
    <section id="sobre" className="ethos-section relative z-10 bg-background">
      <div className="ethos-container flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-4 text-center md:space-y-6 md:text-left"
        >
          <span className="ethos-eyebrow">Nossa história</span>
          <h2 className="ethos-heading">
            Tecnologia construída com clareza e responsabilidade
          </h2>

          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              A <strong>Ethos Software</strong> nasceu em Goiânia para
              desenvolver soluções digitais alinhadas às necessidades reais de
              cada empresa.
            </p>
            <p>
              O trabalho começa pelo entendimento do processo, das prioridades e
              das limitações de cada projeto. A partir disso, definimos o
              escopo, a tecnologia e as etapas de entrega em conjunto com o
              cliente.
            </p>
            <p>
              Atendemos empresas de diferentes segmentos com sites, automações e
              sistemas de gestão. Mantemos uma comunicação objetiva durante o
              desenvolvimento e assumimos responsabilidade pelo que foi
              acordado.
            </p>
          </div>

          <div className="grid grid-cols-1 border-t border-border pt-2 sm:grid-cols-2 md:pt-4">
            {[
              "Escopo definido com clareza",
              "Comunicação durante o projeto",
              "Decisões técnicas documentadas",
              "Suporte conforme contratação",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center border-b border-border py-3 sm:odd:pr-4 sm:even:pl-4"
              >
                <span className="text-sm font-medium text-foreground md:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex w-full flex-1 items-center justify-center"
        >
          <div
            className="ethos-product-blob ethos-product-blob--vivid -right-8 -top-8 h-52 w-72"
            aria-hidden="true"
          />
          <div
            className="ethos-product-blob ethos-product-blob--deep -bottom-8 -left-8 h-48 w-64"
            aria-hidden="true"
          />
          <div className="ethos-product-card relative w-full max-w-xl overflow-hidden border border-border bg-card">
            <div className="border-b border-border px-6 py-5">
              <p className="text-xs font-medium text-primary">
                Projeto entregue
              </p>
              <h3 className="mt-2 text-[28px] font-semibold leading-[1.4] text-foreground">
                {featuredProject.title}
              </h3>
            </div>
            <LazyImage
              src={featuredProject.image}
              alt={`Interface do projeto ${featuredProject.title}`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[4/3] w-full bg-white"
              imgClassName="h-full w-full object-cover object-top"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
