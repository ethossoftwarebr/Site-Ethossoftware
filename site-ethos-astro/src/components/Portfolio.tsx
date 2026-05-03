import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X, ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";
import { ShinyButton } from "@/components/ui/shiny-button";
import { LazyImage } from "@/components/ui/lazy-image";

const WA_BASE = "https://wa.me/556294667304?text=Olá! Vi o projeto ";

const displayProjects = projects.slice(0, 6);

export default function Portfolio() {
  const [selected, setSelected] = useState<(typeof projects)[0] | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const scrollLeft = () =>
    carouselRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  const scrollRight = () =>
    carouselRef.current?.scrollBy({ left: 360, behavior: "smooth" });

  return (
    <section
      id="portfolio"
      className={`py-16 md:py-20 relative ${selected ? "z-[99999]" : "z-10"}`}
    >
      {/* Header */}
      <div className="container mx-auto px-4 max-w-[90rem] mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-[#A229F2] font-semibold tracking-wider uppercase text-sm">
              Nosso Trabalho
            </span>
            <h2 className="text-[32px] sm:text-4xl md:text-5xl font-bold text-foreground mt-3 mb-3 leading-tight">
              Projetos que Entregamos
            </h2>
            <p className="text-muted-foreground max-w-xl text-base md:text-lg">
              Do planejamento ao lançamento, criamos plataformas que geram resultados reais.
            </p>
          </div>

          {/* Scroll arrows */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              data-testid="button-carousel-prev"
              className="w-11 h-11 rounded-full border border-[#A229F2]/30 bg-card flex items-center justify-center text-[#A229F2] disabled:opacity-30 hover:bg-[#A229F2] hover:text-white hover:border-[#A229F2] transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              data-testid="button-carousel-next"
              className="w-11 h-11 rounded-full border border-[#A229F2]/30 bg-card flex items-center justify-center text-[#A229F2] disabled:opacity-30 hover:bg-[#A229F2] hover:text-white hover:border-[#A229F2] transition-all duration-200"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-5 py-6 px-4 md:px-10"
        >
          {displayProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{
                rotate: index % 2 === 0 ? 1.5 : -1.5,
                scale: 1.03,
                y: -10,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              onClick={() => setSelected(project)}
              className="flex-shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden bg-card border border-[#A229F2]/10 shadow-md hover:shadow-[0_20px_50px_-10px_rgba(162,41,242,0.25)] cursor-pointer"
              data-testid={`card-project-${index}`}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3] bg-[#A229F2]/5">
                <LazyImage
                  src={project.image}
                  alt={project.title}
                  sizes="(max-width: 768px) 280px, 320px"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#531B8C]/80 via-[#531B8C]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <span className="flex items-center gap-2 text-white text-sm font-semibold">
                    <ExternalLink className="w-4 h-4" />
                    Ver detalhes
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-[#A229F2] font-bold text-xs tracking-wider uppercase bg-[#A229F2]/10 px-3 py-1 rounded-full">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-3 mb-2 leading-tight">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Peek spacer */}
          <div className="flex-shrink-0 w-4 md:w-6" />
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mt-10 md:mt-14"
      >
        <a href="/portfolio" data-testid="link-ver-todos-projetos">
          <ShinyButton className="text-lg" style={{ padding: "1rem 2.5rem" }}>
            Ver todos os projetos
            <ArrowRight className="w-5 h-5" />
          </ShinyButton>
        </a>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9998]"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-3xl bg-card rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col md:flex-row max-h-[88vh]"
            >
              {/* Image panel */}
              <div className="md:w-5/12 flex-shrink-0 overflow-hidden bg-[#A229F2]/5">
                <div className="relative h-52 md:h-full">
                  <LazyImage
                    src={selected.image}
                    alt={selected.title}
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#531B8C]/70 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-bold text-xs tracking-wider uppercase bg-[#A229F2] px-3 py-1.5 rounded-full">
                    {selected.category}
                  </span>
                </div>
              </div>

              {/* Details panel */}
              <div className="flex flex-col p-6 md:p-8 overflow-y-auto flex-1 relative">
                <button
                  onClick={() => setSelected(null)}
                  data-testid="button-close-modal"
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-[#A229F2]/10 hover:text-[#A229F2] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-10 h-1 bg-gradient-to-r from-[#A229F2] to-[#531B8C] rounded-full mb-4" />
                <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 pr-8 leading-tight">
                  {selected.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-6 flex-1">
                  {selected.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold text-[#A229F2] bg-[#A229F2]/10 px-3 py-1.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() =>
                    window.open(
                      `${WA_BASE}${encodeURIComponent(selected.title)} no portfólio da Ethos Software e quero algo similar.`,
                      "_blank"
                    )
                  }
                  data-testid="button-quero-similar"
                  className="mt-auto w-full sm:w-auto shiny-cta"
                  style={{ padding: "0.85rem 2rem" }}
                >
                  <span>Quero algo similar</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
