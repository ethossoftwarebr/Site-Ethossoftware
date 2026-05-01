import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowLeft, Filter } from "lucide-react";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/use-page-meta";
import { projects, categories } from "@/data/projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EthosIA from "@/components/EthosIA";
import { LazyImage } from "@/components/ui/lazy-image";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  usePageMeta({
    title: "Portfólio - Cases de Sucesso em Software | Ethos Software",
    description:
      "Conheça os projetos da Ethos Software: sites institucionais, sistemas de gestão, dashboards SaaS, automações com IA e apps mobile entregues para clientes em todo o Brasil.",
    canonical: "https://ethossoftware.com.br/portfolio",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const filtered = activeCategory === "Todos"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen relative bg-background selection:bg-[#A229F2]/20 selection:text-[#531B8C]">
      <div className="absolute top-0 left-[10%] w-[800px] h-[800px] bg-[#A229F2]/15 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-[#531B8C]/10 rounded-full blur-[100px] -z-10" />

      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" data-testid="link-voltar-home">
              <span className="inline-flex items-center gap-2 text-[#A229F2] font-semibold mb-8 hover:text-[#531B8C] transition-colors cursor-pointer text-sm">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o início
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A229F2]/10 border border-[#A229F2]/20 mb-6"
          >
            <span className="text-[#A229F2] font-bold tracking-widest uppercase text-xs">Portfólio Completo</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 leading-tight"
          >
            Cada projeto,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A229F2] to-[#531B8C]">
              uma história
            </span>{" "}
            de sucesso
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Do planejamento ao lançamento, transformamos desafios reais em soluções digitais que geram resultados mensuráveis.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mb-6"
          >
            {[
              { number: "40+", label: "Projetos Entregues" },
              { number: "100%", label: "Satisfação dos Clientes" },
              { number: "3+", label: "Anos de Experiência" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#A229F2]">{stat.number}</div>
                <div className="text-muted-foreground text-sm font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 md:top-20 z-40 bg-background/90 backdrop-blur-md border-b border-[#A229F2]/10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-[#A229F2] flex-shrink-0" />
            <div className="flex gap-2 flex-nowrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`button-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-[#A229F2] text-white shadow-lg shadow-[#A229F2]/30"
                      : "bg-card text-muted-foreground border border-[#A229F2]/20 hover:border-[#A229F2]/50 hover:text-[#A229F2]"
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
          Exibindo <span className="font-bold text-[#A229F2]">{filtered.length}</span> projeto{filtered.length !== 1 ? "s" : ""}
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
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.08, type: "spring", bounce: 0.3 }}
                whileHover={{ y: -12 }}
                className="group flex flex-col bg-card rounded-3xl border border-[#A229F2]/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(159,36,232,0.25)] hover:border-[#A229F2]/40 transition-all duration-500 overflow-hidden cursor-pointer relative"
                data-testid={`card-project-full-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#A229F2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative overflow-hidden aspect-[4/3] bg-[#A229F2]/5">
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full transform origin-top"
                  >
                    <LazyImage
                      src={project.image}
                      alt={`Screenshot do projeto ${project.title}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="w-full h-full"
                      imgClassName="object-cover object-top w-full h-full"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#531B8C]/90 via-[#531B8C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-flex items-center gap-2 text-white font-medium bg-[#A229F2] px-5 py-2.5 rounded-full text-sm shadow-lg">
                        Ver detalhes <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 relative z-10 bg-card">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#A229F2]/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                  <div className="mb-4">
                    <span className="text-[#A229F2] font-bold text-xs tracking-wider uppercase bg-[#A229F2]/10 px-3 py-1 rounded-full group-hover:bg-[#A229F2] group-hover:text-white transition-colors duration-300">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-[#A229F2] transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-sm flex-1 mb-6 group-hover:text-foreground transition-colors duration-300">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100 group-hover:border-[#A229F2]/20 transition-colors duration-300">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md group-hover:bg-[#A229F2]/5 group-hover:text-[#A229F2] transition-colors duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#BA66F2]"></span>
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
            className="max-w-3xl mx-auto text-center bg-gradient-to-br from-[#531B8C] to-[#A229F2] rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              Quer seu projeto aqui?
            </h2>
            <p className="text-white/80 text-lg mb-8 relative z-10">
              Entre em contato e vamos transformar a sua ideia em realidade.
            </p>
            <button
              onClick={() => window.open("https://wa.me/556294667304?text=Olá! Vi o portfólio da Ethos Software e quero conversar sobre um projeto.", "_blank")}
              className="inline-flex items-center gap-3 bg-white text-[#531B8C] font-bold px-8 py-4 rounded-full text-lg hover:bg-secondary transition-colors shadow-xl relative z-10"
              data-testid="button-cta-portfolio"
            >
              Começar meu projeto
              <ExternalLink className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <EthosIA />
    </main>
  );
}
