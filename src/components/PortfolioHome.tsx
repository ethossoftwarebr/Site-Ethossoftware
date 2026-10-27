import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { projects } from "@/data/projects";
import { ShinyButton } from "@/components/ui/shiny-button";
import { LazyImage } from "@/components/ui/lazy-image";

const WA_BASE = "https://wa.me/556294667304?text=Olá! Vi o projeto ";

const displayProjects = projects.slice(0, 6);

export default function PortfolioHome() {
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const scrollLeft = () =>
    carouselRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const scrollRight = () =>
    carouselRef.current?.scrollBy({ left: 400, behavior: "smooth" });

  return (
    <section
      id="portfolio"
      className={`ethos-section relative bg-secondary ${selected ? "z-[99999]" : "z-10"}`}
    >
      {/* Header */}
      <div className="ethos-container mb-10 md:mb-12">
        <div className="mx-auto max-w-3xl text-center">
          <div>
            <span className="ethos-eyebrow">Nosso Trabalho</span>
            <h2 className="ethos-heading mb-4 mt-5">
              Projetos desenvolvidos pela Ethos
            </h2>
            <p className="ethos-copy mx-auto max-w-2xl">
              Uma seleção de soluções entregues para diferentes segmentos e
              rotinas de trabalho.
            </p>
          </div>

          {/* Scroll arrows */}
          <div className="mt-8 flex flex-shrink-0 justify-center gap-3">
            <button
              type="button"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              data-testid="button-carousel-prev"
              className="ethos-button-shadow flex h-11 w-11 items-center justify-center rounded-lg border border-primary bg-primary text-white transition-colors hover:border-accent hover:bg-accent disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              disabled={!canScrollRight}
              data-testid="button-carousel-next"
              className="ethos-button-shadow flex h-11 w-11 items-center justify-center rounded-lg border border-primary bg-primary text-white transition-colors hover:border-accent hover:bg-accent disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="mx-auto flex max-w-[1200px] gap-6 overflow-x-auto px-5 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-10"
        >
          {displayProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => setSelected(project)}
              className="ethos-product-card w-[300px] flex-shrink-0 cursor-pointer overflow-hidden border border-border bg-card transition-colors hover:border-primary md:w-[370px]"
              data-testid={`card-project-${index}`}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3] bg-secondary">
                <LazyImage
                  src={project.image}
                  alt={project.title}
                  sizes="(max-width: 768px) 280px, 320px"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-top"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                  {project.category}
                </span>
                <h3 className="mb-2 mt-4 text-2xl font-semibold leading-[1.4] text-foreground">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
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
          <ShinyButton style={{ padding: "0.65rem 1.5rem" }}>
            Ver todos os projetos
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
              className="fixed inset-0 z-[9998] bg-black/70"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ethos-panel fixed left-1/2 top-1/2 z-[9999] flex max-h-[88vh] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-border bg-card md:flex-row"
            >
              {/* Image panel */}
              <div className="md:w-5/12 flex-shrink-0 overflow-hidden bg-secondary">
                <div className="relative h-52 md:h-full">
                  <LazyImage
                    src={selected.image}
                    alt={selected.title}
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover object-top"
                  />
                  <span className="absolute bottom-4 left-4 rounded-sm bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    {selected.category}
                  </span>
                </div>
              </div>

              {/* Details panel */}
              <div className="flex flex-col p-6 md:p-8 overflow-y-auto flex-1 relative">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  data-testid="button-close-modal"
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-white transition-colors hover:bg-accent"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="mb-4 h-px w-10 bg-primary" />
                <h3 className="mb-3 pr-8 text-2xl font-bold leading-tight text-foreground md:text-3xl">
                  {selected.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-6 flex-1">
                  {selected.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-sm bg-secondary px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `${WA_BASE}${encodeURIComponent(selected.title)} no portfólio da Ethos Software e quero algo similar.`,
                      "_blank",
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
