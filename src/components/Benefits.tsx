import { motion } from "framer-motion";
import { LazyImage } from "@/components/ui/lazy-image";
import { projects } from "@/data/projects";

const benefits = [
  {
    title: "Desempenho consistente",
    description:
      "Aplicamos boas práticas de desempenho e avaliamos os pontos críticos de cada solução.",
  },
  {
    title: "Planejamento e acompanhamento",
    description:
      "Definimos escopo, etapas e responsáveis para acompanhar o desenvolvimento com transparência.",
  },
  {
    title: "Segurança desde o projeto",
    description:
      "Controle de acesso, validações e cuidados com dados fazem parte das decisões técnicas.",
  },
  {
    title: "Foco no objetivo do negócio",
    description:
      "As decisões de produto consideram o processo, o público e o resultado esperado pelo cliente.",
  },
];

export default function Benefits() {
  const featuredProject = projects[5];

  return (
    <section
      id="features"
      className="ethos-section relative z-0 overflow-hidden bg-secondary"
    >
      <div className="ethos-container">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <span className="ethos-eyebrow">Compromissos de projeto</span>
          <h2 className="ethos-heading mt-5">
            Desenvolvimento com responsabilidade
          </h2>
          <p className="ethos-copy mx-auto mt-6 max-w-2xl">
            Trabalhamos com clareza sobre escopo, prazos, riscos e
            responsabilidades. Cada solução é construída para atender uma
            necessidade definida e continuar sustentável após a entrega.
          </p>
        </header>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <div
              className="ethos-product-blob ethos-product-blob--deep -left-8 -top-8 h-56 w-72"
              aria-hidden="true"
            />
            <div
              className="ethos-product-blob ethos-product-blob--vivid -bottom-8 -right-5 h-48 w-64"
              aria-hidden="true"
            />
            <div className="ethos-product-card relative overflow-hidden border border-border bg-card">
              <div className="border-b border-border px-6 py-5">
                <p className="text-xs font-medium text-primary">
                  Sistema em operação
                </p>
                <h3 className="mt-2 text-[28px] font-semibold leading-[1.4] text-foreground">
                  {featuredProject.title}
                </h3>
              </div>
              <div className="aspect-[4/3] bg-white">
                <LazyImage
                  src={featuredProject.image}
                  alt={`Interface do projeto ${featuredProject.title}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          <div className="order-1 border-t border-border lg:order-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_1fr]"
              >
                <span className="pt-1 text-xs font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold leading-[1.4] text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.6] text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
