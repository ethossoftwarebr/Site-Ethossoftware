// PAGE_META: title="Serviços - Sites, Sistemas, Apps e Automações com IA | Ethos Software", description="Conheça os serviços da Ethos Software: criação de sites, landing pages, sistemas web (CRM, ERP, SaaS), aplicativos mobile, automações com IA, e-commerce e integrações via API.", canonical="https://ethossoftware.com.br/servicos"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

const WA_URL =
  "https://wa.me/556294667304?text=Olá! Vim pela página de serviços da Ethos Software e quero fazer um orçamento.";

const processSteps = [
  {
    step: "01",
    title: "Entendimento da necessidade",
    desc: "Reunião para compreender o processo, os objetivos, o público e as limitações do projeto.",
  },
  {
    step: "02",
    title: "Planejamento e design",
    desc: "Definimos escopo, prioridades, fluxos e interfaces. Os pontos de validação são combinados antes do desenvolvimento.",
  },
  {
    step: "03",
    title: "Desenvolvimento",
    desc: "Construímos a solução por etapas e apresentamos o progresso nos marcos previstos no cronograma.",
  },
  {
    step: "04",
    title: "Testes e validação",
    desc: "Validamos os fluxos acordados e corrigimos os problemas identificados antes da publicação.",
  },
  {
    step: "05",
    title: "Publicação",
    desc: "Preparamos o ambiente, publicamos a solução e verificamos os fluxos essenciais após a entrada em produção.",
  },
  {
    step: "06",
    title: "Suporte contratado",
    desc: "Manutenção, acompanhamento e novas evoluções seguem as condições definidas na proposta ou no contrato de suporte.",
  },
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const service = services[activeService];
  const Icon = service.icon;

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden selection:bg-[#8E2DBA]/20 selection:text-[#67228A]">
      {/* Hero */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-16 relative overflow-hidden bg-[#F3EFF5] border-b border-[#DDD3E0]">

        <div className="container mx-auto px-4 max-w-5xl relative z-20">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <a
                href="/"
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                Início
              </a>
              <span aria-hidden="true">/</span>
              <span className="text-[#8E2DBA] font-medium">Serviços</span>
            </div>
          </motion.div>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#8E2DBA] font-bold uppercase tracking-widest text-sm mb-3">
              O que fazemos
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.1] mb-6">
              Software sob medida
              <br />
              <span className="text-primary">
                para o seu negócio
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Desenvolvemos sites, sistemas, aplicativos e automações com
              escopo definido, processo acompanhado e decisões técnicas
              compatíveis com a necessidade do projeto.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-4 relative border-t border-[#8E2DBA]/10 bg-background sticky top-[64px] md:top-[80px] z-40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div
            className="flex gap-1 overflow-x-auto scrollbar-hide pb-1"
            role="tablist"
            aria-label="Serviços"
          >
            {services.map((s, i) => {
              const SIcon = s.icon;
              return (
                <button
                  type="button"
                  key={s.id}
                  id={`tab-service-${s.id}`}
                  role="tab"
                  aria-selected={activeService === i}
                  aria-controls="service-panel"
                  onClick={() => setActiveService(i)}
                  data-testid={`tab-service-${s.id}`}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeService === i
                      ? "bg-[#8E2DBA] text-white"
                      : "text-muted-foreground hover:text-[#8E2DBA] hover:bg-[#8E2DBA]/8"
                  }`}
                >
                  <SIcon className="w-4 h-4" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Detail */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              id="service-panel"
              role="tabpanel"
              aria-labelledby={`tab-service-${service.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Left: content */}
              <div>
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-md ${service.image} mb-6`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#8E2DBA] font-semibold text-sm uppercase tracking-wider mb-2">
                  {service.tagline}
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
                  {service.label}
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {service.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 rounded-md bg-[#8E2DBA] flex-shrink-0" aria-hidden="true" />
                      <span className="text-foreground text-sm font-medium">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  {service.useCases.map((u, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-[#8E2DBA]/10 text-[#67228A] border border-[#8E2DBA]/20"
                    >
                      {u}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Button
                    onClick={() => window.open(WA_URL, "_blank")}
                    className="bg-[#8E2DBA] hover:bg-[#67228A] text-white rounded-md px-8 transition-colors"
                    data-testid={`button-orcamento-${service.id}`}
                  >
                    Quero um orçamento
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="font-semibold text-[#8E2DBA]">
                      Estimativa inicial:
                    </span>
                    {service.deliveryTime}
                  </div>
                </div>
              </div>

              {/* Right: visual card */}
              <div className="relative">
                <div
                  className={`rounded-lg ${service.image} p-8 md:p-10 relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <Icon className="w-12 h-12 text-white/80 mb-6" />
                    <h3 className="text-2xl font-black text-white mb-3">
                      {service.label}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-6">
                      {service.tagline}
                    </p>
                    <div className="space-y-2">
                      {service.highlights.slice(0, 4).map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-white/80 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-md bg-white/60 flex-shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Service number indicator */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-card rounded-md flex items-center justify-center border border-[#8E2DBA]/20">
                  <span className="text-[#8E2DBA] font-black text-xl">
                    {String(activeService + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 md:py-28 bg-[#F8F6F9] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-[#DED5E0]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[#8E2DBA] font-bold uppercase tracking-widest text-sm mb-3">
              Nosso processo
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4">
              Como funciona?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Etapas definidas, pontos de validação e comunicação durante todo
              o projeto.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative bg-[#FBFAFC] border border-[#DED5E0] rounded-md p-6 hover:border-[#8E2DBA]/40 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#8E2DBA]/50 font-black text-2xl leading-none">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-foreground font-bold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 md:py-28 bg-[#F3EFF5] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#DDD3E0]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#8E2DBA] font-bold uppercase tracking-widest text-sm mb-3">
                Nossas ferramentas
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-6">
                Tecnologias que
                <br />
                <span className="text-primary">
                  utilizamos
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Trabalhamos com tecnologias modernas, amplamente adotadas e com
                suporte de longo prazo. A escolha considera manutenção,
                compatibilidade e requisitos do projeto.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "React & Next.js", desc: "Frontend moderno" },
                  { name: "Node.js & Python", desc: "Backend escalável" },
                  { name: "TypeScript", desc: "Código confiável" },
                  { name: "React Native", desc: "Apps iOS & Android" },
                  { name: "PostgreSQL", desc: "Banco de dados" },
                  { name: "AWS & Cloud", desc: "Infraestrutura" },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-[#FBFAFC] border border-[#DED5E0] rounded-md p-3 hover:border-[#8E2DBA]/30 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-md bg-[#8E2DBA] flex-shrink-0" />
                    <div>
                      <div className="text-foreground font-semibold text-sm">
                        {tech.name}
                      </div>
                      <div className="text-muted-foreground text-xs">{tech.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-[#67228A]">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Converse sobre o seu projeto
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
              Apresente a necessidade da sua empresa. Nossa equipe avalia o
              contexto e orienta os próximos passos com clareza.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => window.open(WA_URL, "_blank")}
                className="bg-[#FBFAFC] text-[#67228A] hover:bg-[#F8F6F9] font-bold rounded-md px-10 h-14 text-lg transition-colors"
                data-testid="button-cta-servicos"
              >
                Falar com a equipe
              </Button>
              <a href="/portfolio">
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 rounded-md px-10 h-14 text-lg"
                  data-testid="button-ver-portfolio"
                >
                  Ver portfólio
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
