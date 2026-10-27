<!-- mustard:generated at:2026-09-22T21:31:20.206Z -->

# React Island Pattern — real examples from this codebase

> Excerpts verbatim do working tree (linhas indicadas). Re-extrair se o arquivo mudar.

## Section island: module-level data + ethos-* anatomy

Source: `src/components/Testimonials.tsx`

Lines 1-73

```tsx
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Leandro Chagas",
    role: "Sócio Diretor",
    company: "Office Chagas",
    content:
      "O sistema desenvolvido pela Ethos mudou a realidade da nossa gestão. O painel de controle e as métricas em tempo real me poupam horas todos os dias. Nossos parceiros elogiam muito a facilidade de uso do dashboard.",
  },
  {
    name: "José Marcio Porto",
    role: "Proprietário",
    company: "Espeto Show",
    content:
      "Nós tínhamos um problema sério com o controle de pedidos e mapa de mesas. A Ethos não só resolveu isso como criou um software de gestão que usamos o dia inteiro. Melhorou demais a agilidade do nosso atendimento.",
  },
  {
    name: "Dra. Maria Laura",
    role: "Cirurgiã Dentista",
    company: "Odontologia Especializada",
    content:
      "Eu precisava de um site profissional que passasse a credibilidade dos meus tratamentos e facilitasse o agendamento de pacientes. O resultado ficou além das minhas expectativas, com um design muito elegante e focado em estética.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="ethos-section relative overflow-hidden bg-background"
    >
      <div className="ethos-container relative z-10">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <span className="ethos-eyebrow mb-4 block">Feedback de Clientes</span>
          <h2 className="ethos-heading mb-4 md:mb-6">Relatos de clientes</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Experiências compartilhadas por clientes atendidos pela Ethos
            Software.
          </p>
        </div>

        <div className="border-t border-border">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="grid gap-5 border-b border-border py-8 md:grid-cols-[0.65fr_1.35fr] md:gap-12 md:py-10"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Cliente {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {testimonial.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
              <blockquote className="text-lg leading-relaxed text-foreground md:text-xl">
                “{testimonial.content}”
              </blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Section island with numbered list

Source: `src/components/Mission.tsx`

Lines 1-76

```tsx
import { motion } from "framer-motion";

const pillars = [
  {
    title: "Nossa Missão",
    description:
      "Desenvolver software útil, seguro e sustentável, com responsabilidade sobre o escopo acordado e a qualidade da entrega.",
  },
  {
    title: "Nosso Objetivo",
    description:
      "Construir relações de longo prazo por meio de entregas consistentes, comunicação clara e suporte compatível com cada contratação.",
  },
  {
    title: "Nossos Valores",
    description:
      "Responsabilidade, transparência e respeito. Comunicamos riscos, documentamos decisões e cumprimos o que foi combinado.",
  },
];

export default function Mission() {
  return (
    <section className="ethos-section relative z-10 overflow-hidden border-y border-border bg-secondary text-foreground">
      <div className="ethos-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="ethos-eyebrow">Princípios da Ethos</span>
          </motion.div>

          <h2 className="ethos-heading mb-6">O que orienta o nosso trabalho</h2>
          <p className="ethos-copy">
            Trabalhamos com clareza sobre escopo, prazo, riscos e
            responsabilidades para manter relações profissionais e entregas
            consistentes.
          </p>
        </motion.div>

        <div className="border-t border-border">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="grid gap-4 border-b border-border py-8 md:grid-cols-[4rem_0.7fr_1.3fr] md:items-start md:gap-8"
            >
              <span className="pt-1 text-xs font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Hero: ui primitives + @/data + product card

Source: `src/components/Hero.tsx`

Lines 1-65

```tsx
import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";
import { projects } from "@/data/projects";

const WHATSAPP_URL =
  "https://wa.me/556294667304?text=Olá! Gostaria de conversar sobre um projeto com a Ethos Software.";

const featuredProject = projects[4];

export default function Hero() {
  const openWhatsApp = () => window.open(WHATSAPP_URL, "_blank");

  return (
    <section className="relative z-10 bg-background">
      <div className="ethos-container grid min-h-[680px] grid-cols-1 items-center gap-16 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <p className="ethos-eyebrow mb-6">
            Tecnologia aplicada ao seu negócio
          </p>

          <h1 className="max-w-3xl text-[46px] font-bold leading-[1.12] text-foreground sm:text-[58px] lg:text-[68px]">
            Soluções digitais construídas para funcionar no dia a dia.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-[1.7] text-muted-foreground sm:text-xl sm:leading-[1.4]">
            A Ethos desenvolve sites, sistemas e automações a partir de um
            escopo claro, com acompanhamento durante o projeto e
            responsabilidade sobre o que foi acordado.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4">
            <ShinyButton
              onClick={openWhatsApp}
              className="w-full justify-center sm:w-auto"
              style={{ padding: "0.65rem 1.5rem" }}
            >
              Apresentar meu projeto
            </ShinyButton>

            <Button
              size="lg"
              className="text-base font-semibold"
              onClick={() => {
                window.location.href = "/portfolio";
              }}
            >
              Conhecer o portfólio
            </Button>
          </div>
        </div>

        <aside
          className="relative lg:col-span-6"
          aria-label="Projeto em destaque"
        >
          <div
            className="ethos-product-blob ethos-product-blob--vivid -right-8 -top-10 h-56 w-72"
            aria-hidden="true"
          />
          <div
            className="ethos-product-blob ethos-product-blob--deep -bottom-10 -left-8 h-52 w-64"
            aria-hidden="true"
          />
          <div className="ethos-product-card relative overflow-hidden border border-border bg-card">
```

## Footer root + data-testid links

Source: `src/components/Footer.tsx`

Lines 1-38

```tsx
import logoEthos from "@/assets/brand/Captura_de_tela_2026-02-26_010155-removebg-preview_1772078653004.png";

const solutions = [
  "Sites & Landing Pages",
  "Automações com IA",
  "Sistemas SaaS",
  "Aplicativos Mobile",
];

const companyLinks = [
  { name: "Sobre nós", link: "/#sobre" },
  { name: "Portfólio", link: "/portfolio" },
  { name: "Depoimentos", link: "/#depoimentos" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-secondary">
      <div className="h-1 bg-primary" aria-hidden="true" />
      <div className="ethos-container py-16 md:py-20">
        <div className="grid gap-12 border-b border-border pb-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:pr-10">
            <a
              href="/"
              className="flex w-fit items-center gap-3"
              aria-label="Ethos Software, página inicial"
            >
              <img
                src={logoEthos.src}
                alt=""
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold tracking-[-0.02em] text-foreground">
                Ethos Software
              </span>
            </a>
```

## Trivial wrapper island

Source: `src/components/NavbarIsland.tsx`

Lines 1-5

```tsx
import Navbar from "@/components/Navbar";

export default function NavbarIsland() {
  return <Navbar />;
}
```
