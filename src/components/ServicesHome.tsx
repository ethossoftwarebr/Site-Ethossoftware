import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { LazyImage } from "@/components/ui/lazy-image";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

const projectByService = [0, 4, 6, 3, 5, 4];

export default function ServicesHome() {
  const [activeService, setActiveService] = useState(0);
  const [selectedService, setSelectedService] = useState<
    (typeof services)[0] | null
  >(null);
  const service = services[activeService];
  const featuredProject = projects[projectByService[activeService]];

  return (
    <section
      id="services"
      className={`ethos-section relative ${selectedService ? "z-[99999]" : "z-10"}`}
    >
      <div className="ethos-container">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <span className="ethos-eyebrow">Nossas soluções</span>
          <h2 className="ethos-heading mt-5">
            Soluções para necessidades reais
          </h2>
          <p className="ethos-copy mx-auto mt-6 max-w-2xl">
            Planejamos e desenvolvemos cada solução a partir do processo, das
            prioridades e dos resultados definidos com o cliente.
          </p>
        </header>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            className="border-t border-border"
            role="tablist"
            aria-label="Soluções Ethos"
          >
            {services.map((item, index) => {
              const active = activeService === index;
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  key={item.id}
                  onClick={() => setActiveService(index)}
                  className="mb-2 grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-3 rounded-lg border border-primary bg-primary px-4 py-5 text-left text-white transition-colors hover:border-accent hover:bg-accent"
                >
                  <Icon
                    className={
                      active
                        ? "mt-0.5 h-5 w-5 text-white"
                        : "mt-0.5 h-5 w-5 text-white"
                    }
                    strokeWidth={1.7}
                  />
                  <span>
                    <span
                      className={
                        active
                          ? "block text-lg font-semibold text-white"
                          : "block text-base font-normal text-white"
                      }
                    >
                      {item.label}
                    </span>
                    {active && (
                      <span className="mt-2 block text-sm leading-[1.6] text-white">
                        {item.homeDescription}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      active
                        ? "pt-0.5 text-xl text-white"
                        : "pt-0.5 text-xl text-white"
                    }
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setSelectedService(service)}
              className="mt-6 rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-accent"
            >
              Conhecer esta solução
            </button>
          </div>

          <div className="relative min-h-[420px]">
            <div
              className="ethos-product-blob ethos-product-blob--vivid -right-5 -top-8 h-52 w-72"
              aria-hidden="true"
            />
            <div
              className="ethos-product-blob ethos-product-blob--deep -bottom-8 -left-6 h-48 w-64"
              aria-hidden="true"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="ethos-product-card relative overflow-hidden border border-border bg-card"
              >
                <div className="border-b border-border px-6 py-5">
                  <p className="text-xs font-medium text-primary">
                    {service.tagline}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-foreground">
                    {featuredProject.title}
                  </h3>
                </div>
                <div className="aspect-[4/3] bg-secondary p-4">
                  <LazyImage
                    src={featuredProject.image}
                    alt={`Projeto ${featuredProject.title} relacionado a ${service.label}`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-full w-full overflow-hidden rounded-xl border border-border bg-white"
                    imgClassName="h-full w-full object-cover object-top"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 z-[9998] bg-black/70"
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="ethos-panel fixed left-1/2 top-1/2 z-[9999] flex max-h-[85vh] w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-border bg-card md:flex-row"
            >
              <div className="flex h-36 shrink-0 items-center justify-center bg-primary md:h-auto md:w-4/12">
                <selectedService.icon
                  className="h-16 w-16 text-white"
                  strokeWidth={1.5}
                />
              </div>
              <div className="relative flex flex-1 flex-col overflow-y-auto p-6 md:w-8/12 md:p-10">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-accent"
                  aria-label="Fechar detalhes"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="text-xs font-medium text-primary">
                  Solução Ethos
                </span>
                <h3 className="mt-4 pr-10 text-[28px] font-semibold leading-[1.4] text-foreground">
                  {selectedService.label}
                </h3>
                <p className="mt-6 flex-1 text-base leading-[1.7] text-muted-foreground">
                  {selectedService.description}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(null);
                    window.open(
                      "https://wa.me/556294667304?text=Olá! Gostaria de saber mais sobre as soluções de " +
                        selectedService.label +
                        " da Ethos Software.",
                      "_blank",
                    );
                  }}
                  className="shiny-cta mt-8 w-full justify-center sm:w-auto sm:self-start"
                  style={{ padding: "0.65rem 1.5rem" }}
                >
                  <span>Falar com a equipe</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
