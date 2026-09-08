import { motion, AnimatePresence } from "framer-motion";
import { GradientCard } from "@/components/ui/gradient-card";
import {
  X,
  Server,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { services } from "@/data/services";

// Decorative animated component for the modal
const ModalIllustration = ({ Icon }: { Icon: LucideIcon }) => (
  <div className="relative w-full h-full min-h-[250px] flex items-center justify-center bg-gradient-to-br from-[#A229F2] to-[#531B8C] overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:20px_20px]" />
    </div>

    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -right-20 -top-20 w-64 h-64 border border-white/20 rounded-full"
    />
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        rotate: [360, 270, 180, 90, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute -left-20 -bottom-20 w-80 h-80 border border-white/10 rounded-full"
    />

    {/* Center 3D-like Icon composition */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="relative z-10 flex items-center justify-center"
    >
      <div className="absolute w-32 h-32 bg-white/10 rounded-3xl backdrop-blur-md transform rotate-12" />
      <div className="absolute w-32 h-32 bg-white/20 rounded-3xl backdrop-blur-md transform -rotate-6" />
      <div className="relative w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
        <Icon className="w-16 h-16 text-[#531B8C]" strokeWidth={1.5} />
      </div>

      {/* Floating small elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center"
      >
        <Server className="w-6 h-6 text-[#A229F2]" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#111111] rounded-xl shadow-lg flex items-center justify-center"
      >
        <Layers className="w-6 h-6 text-white" />
      </motion.div>
    </motion.div>
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
        <span className="text-[#A229F2] font-semibold tracking-wider uppercase text-sm">
          Nossas Soluções
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4 md:mb-6">
          Tudo o que seu negócio precisa
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Explore nossa gama completa de soluções tecnológicas desenvolvidas
          especificamente para acelerar o crescimento da sua empresa.
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
              type: "spring",
              stiffness: 80,
              damping: 15,
            }}
          >
            <GradientCard
              onClick={() => setSelectedService(service)}
              className="p-6 flex flex-col h-full text-left group"
            >
              <div className="flex-1">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center mb-5 group-hover:border-[#A229F2]/40 transition-all duration-400"
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <service.icon
                    className="w-7 h-7 text-[#BA66F2]"
                    strokeWidth={1.5}
                  />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#BA66F2] transition-colors duration-300">
                  {service.label}
                </h3>

                <p className="text-white/55 leading-snug text-sm">
                  {service.homeDescription}
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-semibold text-[#A229F2] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
                Saiba mais
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
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
              className="fixed inset-0 bg-[#111111]/80 z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-4xl bg-card rounded-[2rem] shadow-2xl z-[9999] overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:h-[600px]"
            >
              <div className="md:w-5/12 bg-[#F2F2F2] relative overflow-hidden flex items-center justify-center h-[120px] sm:h-[180px] md:h-full shrink-0">
                <ModalIllustration Icon={selectedService.icon} />
              </div>
              <div className="p-5 sm:p-6 md:p-10 md:w-7/12 flex flex-col relative flex-1 overflow-y-auto bg-card">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-[#A229F2]/10 hover:text-[#A229F2] transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 mt-1 sm:mt-0">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-white to-[#F2F2F2] shadow-sm border border-[#F2F2F2] flex items-center justify-center`}
                  >
                    <selectedService.icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedService.color}`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="px-2 py-1 sm:px-3 sm:py-1 bg-[#A229F2]/10 text-[#A229F2] font-semibold text-[10px] sm:text-xs rounded-full uppercase tracking-wider">
                    Solução Ethos
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-2 sm:mb-4 pr-8">
                  {selectedService.label}
                </h3>

                <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-[#A229F2] to-[#531B8C] mb-4 sm:mb-6 rounded-full" />

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
                  <span>Falar com Consultor</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
