// PAGE_META: title="Portfólio de Software | Ethos Software", description="Conheça projetos da Ethos Software: sites institucionais, sistemas de gestão, dashboards, automações com IA e aplicativos.", canonical="https://ethossoftware.com.br/portfolio"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, categories } from "@/data/projects";
import { LazyImage } from "@/components/ui/lazy-image";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const filtered =
    activeCategory === "Todos"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen relative bg-background selection:bg-primary selection:text-white">
      {/* Hero */}
      <section className="relative z-10 border-b border-border bg-secondary pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="ethos-container">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a href="/" data-testid="link-voltar-home">
              <span className="mb-8 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent">
                Voltar para o início
              </span>
            </a>
          </motion.div>

          <motion.p
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ethos-eyebrow mb-5"
          >
            Portfólio completo
          </motion.p>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl text-[46px] font-bold leading-[1.2] text-foreground md:text-[68px]"
          >
            Projetos e soluções <span className="text-primary">entregues</span>
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Uma seleção de sites, sistemas e automações desenvolvidos para
            operações e necessidades diferentes.
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 z-40 border-b border-border bg-white py-3">
        <div className="ethos-container">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <div
              className="flex gap-2 flex-nowrap"
              role="radiogroup"
              aria-label="Filtrar projetos por categoria"
            >
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  role="radio"
                  aria-checked={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`button-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                    activeCategory === cat
                      ? "border-accent bg-accent text-white"
                      : "border-primary bg-primary text-white hover:border-accent hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="ethos-container relative z-10 py-12 md:py-16">
        <motion.p
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-sm mb-8"
        >
          Exibindo{" "}
          <span className="font-bold text-primary">{filtered.length}</span>{" "}
          projeto{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "Todos" && ` em "${activeCategory}"`}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mx-auto grid max-w-6xl grid-cols-1 gap-7 md:grid-cols-2"
          >
            {filtered.map((project, index) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="ethos-product-card group relative flex cursor-pointer flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary"
                data-testid={`card-project-full-${index}`}
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-secondary">
                  <div className="w-full h-full">
                    <LazyImage
                      src={project.image}
                      alt={`Screenshot do projeto ${project.title}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="w-full h-full"
                      imgClassName="object-cover object-top w-full h-full"
                    />
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 relative z-10 bg-card">
                  <div className="mb-4">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3 transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-sm flex-1 mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA */}
      <section className="ethos-section relative z-10">
        <div className="ethos-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="ethos-panel relative mx-auto max-w-4xl overflow-hidden border border-border bg-secondary p-8 text-center md:p-12"
          >
            <h2 className="relative z-10 mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Converse sobre o seu projeto
            </h2>
            <p className="relative z-10 mb-8 text-lg text-muted-foreground">
              Apresente a necessidade da sua empresa para avaliarmos escopo,
              viabilidade e próximos passos.
            </p>
            <button
              type="button"
              onClick={() =>
                window.open(
                  "https://wa.me/556294667304?text=Olá! Vi o portfólio da Ethos Software e quero conversar sobre um projeto.",
                  "_blank",
                )
              }
              className="relative z-10 inline-flex items-center gap-3 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-accent"
              data-testid="button-cta-portfolio"
            >
              Falar com a equipe
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
