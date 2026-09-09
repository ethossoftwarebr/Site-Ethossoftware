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
    <main className="min-h-screen relative bg-background selection:bg-[#8E2DBA]/20 selection:text-[#67228A]">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a href="/" data-testid="link-voltar-home">
              <span className="inline-flex items-center gap-2 text-[#8E2DBA] font-semibold mb-8 hover:text-[#67228A] transition-colors cursor-pointer text-sm">
                Voltar para o início
              </span>
            </a>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#8E2DBA]/10 border border-[#8E2DBA]/20 mb-6"
          >
            <span className="text-[#8E2DBA] font-bold tracking-widest uppercase text-xs">
              Portfólio Completo
            </span>
          </motion.div>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 leading-tight"
          >
            Projetos e soluções <span className="text-primary">entregues</span>
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Uma seleção de sites, sistemas e automações desenvolvidos para
            operações e necessidades diferentes.
          </motion.p>

        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 md:top-20 z-40 bg-background border-b border-[#8E2DBA]/10 py-4">
        <div className="container mx-auto px-4">
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
                  className={`px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? "bg-[#8E2DBA] text-white"
                      : "bg-card text-muted-foreground border border-[#8E2DBA]/20 hover:border-[#8E2DBA]/50 hover:text-[#8E2DBA]"
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
      <section className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <motion.p
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-sm mb-8"
        >
          Exibindo{" "}
          <span className="font-bold text-[#8E2DBA]">{filtered.length}</span>{" "}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-[90rem] mx-auto"
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
                className="group flex flex-col bg-card rounded-lg border border-[#8E2DBA]/10 hover:border-[#8E2DBA]/40 transition-colors overflow-hidden cursor-pointer relative"
                data-testid={`card-project-full-${index}`}
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-[#8E2DBA]/5">
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
                    <span className="text-[#8E2DBA] font-bold text-xs tracking-wider uppercase bg-[#8E2DBA]/10 px-3 py-1 rounded-sm">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-[#8E2DBA] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-sm flex-1 mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-sm"
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
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center bg-[#67228A] rounded-lg p-12 relative overflow-hidden"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              Converse sobre o seu projeto
            </h2>
            <p className="text-white/80 text-lg mb-8 relative z-10">
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
              className="inline-flex items-center gap-3 bg-[#FBFAFC] text-[#67228A] font-bold px-8 py-4 rounded-md text-lg hover:bg-secondary transition-colors relative z-10"
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
