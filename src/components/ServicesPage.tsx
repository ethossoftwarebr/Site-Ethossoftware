// PAGE_META: title="Serviços - Sites, Sistemas, Apps e Automações com IA | Ethos Software", description="Conheça os serviços da Ethos Software: criação de sites, landing pages, sistemas web (CRM, ERP, SaaS), aplicativos mobile, automações com IA, e-commerce e integrações via API.", canonical="https://ethossoftware.com.br/servicos"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

const WA_URL =
  "https://wa.me/556294667304?text=Olá! Vim pela página de serviços da Ethos Software e quero fazer um orçamento.";

const projectByService = [0, 4, 6, 3, 5, 4];

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
  const featuredProject = projects[projectByService[activeService]];

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="ethos-container relative z-20">
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
              <span className="font-medium text-primary">Serviços</span>
            </div>
          </motion.div>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="ethos-eyebrow mb-4">O que fazemos</p>
            <h1 className="max-w-4xl text-[46px] font-bold leading-[1.2] text-foreground md:text-[68px]">
              Software sob medida para o seu negócio
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Desenvolvemos sites, sistemas, aplicativos e automações com escopo
              definido, processo acompanhado e decisões técnicas compatíveis com
              a necessidade do projeto.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="sticky top-16 z-40 border-b border-border bg-white py-3">
        <div className="ethos-container">
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
                  className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    activeService === i
                      ? "border-accent bg-accent text-white"
                      : "border-primary bg-primary text-white hover:border-accent hover:bg-accent"
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
      <section className="ethos-section relative z-10">
        <div className="ethos-container">
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
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
            >
              {/* Left: content */}
              <div>
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg ${service.image}`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                  {service.tagline}
                </p>
                <h2 className="mb-4 text-[38px] font-bold leading-[1.21] text-foreground">
                  {service.label}
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {service.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span
                        className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-md bg-primary"
                        aria-hidden="true"
                      />
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
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-primary"
                    >
                      {u}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Button
                    onClick={() => window.open(WA_URL, "_blank")}
                    className="rounded-lg bg-primary px-8 text-white transition-colors hover:bg-accent"
                    data-testid={`button-orcamento-${service.id}`}
                  >
                    Quero um orçamento
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="font-semibold text-primary">
                      Estimativa inicial:
                    </span>
                    {service.deliveryTime}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div
                  className="ethos-product-blob ethos-product-blob--vivid -right-7 -top-8 h-56 w-72"
                  aria-hidden="true"
                />
                <div
                  className="ethos-product-blob ethos-product-blob--deep -bottom-8 -left-8 h-48 w-64"
                  aria-hidden="true"
                />
                <div className="ethos-product-card relative overflow-hidden border border-border bg-card">
                  <div className="border-b border-border px-6 py-5">
                    <p className="text-xs font-medium text-primary">
                      Projeto relacionado
                    </p>
                    <h3 className="mt-2 text-[28px] font-semibold leading-[1.4] text-foreground">
                      {featuredProject.title}
                    </h3>
                  </div>
                  <div className="aspect-[4/3] bg-secondary p-4">
                    <LazyImage
                      src={featuredProject.image}
                      alt={`Interface do projeto ${featuredProject.title}`}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="h-full w-full overflow-hidden rounded-xl border border-border bg-white"
                      imgClassName="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="ethos-section relative overflow-hidden border-y border-border bg-secondary">
        <div className="ethos-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <p className="ethos-eyebrow mb-4">Nosso processo</p>
            <h2 className="ethos-heading mb-4">Como funciona</h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Etapas definidas, pontos de validação e comunicação durante todo o
              projeto.
            </p>
          </motion.div>

          <div className="grid border-t border-border md:grid-cols-2">
            {processSteps.map((step, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative border-b border-border py-7 md:px-7 md:odd:border-r"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xl font-bold leading-none text-primary">
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
      <section className="ethos-section relative overflow-hidden bg-background">
        <div className="ethos-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="ethos-eyebrow mb-4">Nossas ferramentas</p>
              <h2 className="ethos-heading mb-6">Tecnologias que utilizamos</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Trabalhamos com tecnologias modernas, amplamente adotadas e com
                suporte de longo prazo. A escolha considera manutenção,
                compatibilidade e requisitos do projeto.
              </p>
              <div className="grid border-t border-border sm:grid-cols-2">
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
                    className="flex items-center gap-3 border-b border-border py-4 sm:odd:pr-5 sm:even:pl-5"
                  >
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <div>
                      <div className="text-foreground font-semibold text-sm">
                        {tech.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {tech.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ethos-section relative overflow-hidden bg-primary">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Converse sobre o seu projeto
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
              Apresente a necessidade da sua empresa. Nossa equipe avalia o
              contexto e orienta os próximos passos com clareza.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => window.open(WA_URL, "_blank")}
                className="h-14 rounded-lg bg-primary px-10 text-lg font-semibold text-white transition-colors hover:bg-accent"
                data-testid="button-cta-servicos"
              >
                Falar com a equipe
              </Button>
              <a href="/portfolio">
                <Button
                  variant="outline"
                  className="h-14 rounded-lg border-primary bg-primary px-10 text-lg text-white hover:border-accent hover:bg-accent"
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
