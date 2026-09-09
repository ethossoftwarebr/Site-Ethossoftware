import { motion, AnimatePresence } from "framer-motion";
import { GradientCard } from "@/components/ui/gradient-card";
import {
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { services } from "@/data/services";

const ModalIllustration = ({ Icon }: { Icon: LucideIcon }) => (
  <div className="relative w-full h-full min-h-[250px] flex items-center justify-center bg-[#67228A] overflow-hidden">
    <div className="relative w-32 h-32 bg-[#FBFAFC] rounded-md border border-white/30 flex items-center justify-center">
        <Icon className="w-16 h-16 text-[#67228A]" strokeWidth={1.5} />
    </div>
  </div>
);

export default function ServicesHome() {
  const [selectedService, setSelectedService] = useState<
    (typeof services)[0] | null
  >(null);

  return (
    <section
      id="services"
      className={`py-16 md:py-20 relative ${selectedService ? "z-[99999]" : "z-10"}`}
    >
      <div className="text-center mb-12 md:mb-16 px-4">
        <span className="text-[#8E2DBA] font-semibold tracking-wider uppercase text-sm">
          Nossas Soluções
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4 md:mb-6">
          Soluções para necessidades reais
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Planejamos e desenvolvemos cada solução a partir do processo, das
          prioridades e dos resultados definidos com o cliente.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[80rem] mx-auto px-4">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.7,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            <GradientCard
              onClick={() => setSelectedService(service)}
              className="p-6 flex flex-col h-full text-left group"
            >
              <div className="flex-1">
                <div
                  className="w-14 h-14 rounded-md bg-[#EEE8F0] border border-[#D9CFDC] flex items-center justify-center mb-5 group-hover:border-[#8E2DBA]/40 transition-colors"
                >
                  <service.icon
                    className="w-7 h-7 text-[#8E2DBA]"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                  {service.label}
                </h3>

                <p className="text-muted-foreground leading-snug text-sm">
                  {service.homeDescription}
                </p>
              </div>

              <div className="mt-6 text-sm font-semibold text-[#8E2DBA]">
                Saiba mais
              </div>
            </GradientCard>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-[#33213A]/80 z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-4xl bg-card rounded-lg border border-border z-[9999] overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:h-[600px]"
            >
              <div className="md:w-5/12 bg-[#F7F5F8] relative overflow-hidden flex items-center justify-center h-[120px] sm:h-[180px] md:h-full shrink-0">
                <ModalIllustration Icon={selectedService.icon} />
              </div>
              <div className="p-5 sm:p-6 md:p-10 md:w-7/12 flex flex-col relative flex-1 overflow-y-auto bg-card">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center rounded-sm bg-secondary hover:bg-[#8E2DBA]/10 hover:text-[#8E2DBA] transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 mt-1 sm:mt-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-[#FBFAFC] border border-[#E0D7E2] flex items-center justify-center"
                  >
                    <selectedService.icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedService.color}`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="px-2 py-1 sm:px-3 sm:py-1 bg-[#8E2DBA]/10 text-[#8E2DBA] font-semibold text-[10px] sm:text-xs rounded-sm uppercase tracking-wider">
                    Solução Ethos
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-2 sm:mb-4 pr-8">
                  {selectedService.label}
                </h3>

                <div className="w-10 sm:w-12 h-px bg-[#8E2DBA] mb-4 sm:mb-6" />

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg mb-6 sm:mb-8 flex-1">
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
                  className="w-full sm:w-auto mt-auto self-start shiny-cta text-sm sm:text-lg"
                  style={{ padding: "0.85rem 2rem" }}
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
