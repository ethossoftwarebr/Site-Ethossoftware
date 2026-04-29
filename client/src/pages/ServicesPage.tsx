import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Globe, Settings, Cpu, Smartphone, ShoppingBag, Plug,
  CheckCircle2, ChevronRight, ArrowRight, MessageCircle,
  Lightbulb, Pencil, Code2, FlaskConical, Rocket, HeartHandshake,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EthosIA from "@/components/EthosIA";
import OrbitingSkills from "@/components/OrbitingSkills";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Button } from "@/components/ui/button";

const WA_URL = "https://wa.me/556294667304?text=Olá! Vim pela página de serviços da Ethos Software e quero fazer um orçamento.";

const services = [
  {
    id: "sites",
    label: "Sites & Landing Pages",
    icon: Globe,
    tagline: "Presença digital que converte",
    description:
      "Criamos sites institucionais e landing pages de alta conversão com design moderno, responsivo e otimizado para SEO. Nosso foco é transformar visitantes em clientes reais, combinando UX estratégico com performance técnica.",
    highlights: [
      "Design responsivo para todos os dispositivos",
      "Otimização SEO desde a estrutura",
      "Velocidade de carregamento máxima",
      "Integração com Google Analytics e Tag Manager",
      "Formulários e chatbots de captura de leads",
      "A/B Testing e otimização contínua",
    ],
    useCases: ["Landing pages para campanhas", "Sites institucionais", "Blogs e portais de conteúdo", "Sites de agências e profissionais liberais"],
    deliveryTime: "1 a 4 semanas",
    image: "bg-gradient-to-br from-[#531B8C] to-[#A229F2]",
  },
  {
    id: "sistemas",
    label: "Sistemas Web",
    icon: Settings,
    tagline: "CRM, ERP, SaaS e Dashboards sob medida",
    description:
      "Desenvolvemos sistemas de gestão personalizados para automatizar processos, centralizar dados e escalar operações. De CRMs e ERPs a plataformas SaaS completas com dashboards interativos em tempo real.",
    highlights: [
      "Autenticação, controle de acesso e permissões",
      "Dashboards com dados em tempo real",
      "APIs robustas e documentadas",
      "Integrações com sistemas legados",
      "Escalabilidade para crescimento",
      "Relatórios automatizados e exportáveis",
    ],
    useCases: ["CRM para equipes de vendas", "ERP para operações", "Plataformas SaaS B2B", "Sistemas de gestão internos"],
    deliveryTime: "4 a 16 semanas",
    image: "bg-gradient-to-br from-[#1a0a2e] to-[#531B8C]",
  },
  {
    id: "ia",
    label: "Automações com IA",
    icon: Cpu,
    tagline: "Inteligência Artificial aplicada ao seu negócio",
    description:
      "Implementamos automações inteligentes com IA para eliminar tarefas repetitivas, otimizar atendimento, gerar insights estratégicos e tomar decisões baseadas em dados — tudo integrado ao seu fluxo de trabalho atual.",
    highlights: [
      "Chatbots com LLMs (GPT, Claude, Gemini)",
      "Automação de atendimento via WhatsApp",
      "Processamento e análise de documentos",
      "Geração de relatórios com IA",
      "Integração com n8n e Make",
      "RAG e bases de conhecimento personalizadas",
    ],
    useCases: ["Atendimento automatizado 24h", "Triagem e qualificação de leads", "Análise de dados e previsões", "Automação de processos internos"],
    deliveryTime: "2 a 8 semanas",
    image: "bg-gradient-to-br from-[#A229F2] to-[#BA66F2]",
  },
  {
    id: "mobile",
    label: "Aplicativos Mobile",
    icon: Smartphone,
    tagline: "iOS e Android com experiência nativa",
    description:
      "Desenvolvemos aplicativos nativos e híbridos para iOS e Android com design intuitivo e performance excepcional. Integrados ao ecossistema digital do cliente — APIs, gateways de pagamento, notificações push e muito mais.",
    highlights: [
      "React Native e Expo para iOS e Android",
      "Design UI/UX focado em conversão",
      "Publicação nas stores (App Store e Play Store)",
      "Notificações push e offline-first",
      "Integração com câmera, GPS e sensores",
      "Analytics e crash reporting",
    ],
    useCases: ["Apps de marketplace e e-commerce", "Apps de gestão e operações", "Apps de delivery e logística", "Apps de fidelidade e clube de vantagens"],
    deliveryTime: "6 a 20 semanas",
    image: "bg-gradient-to-br from-[#531B8C] to-[#BA66F2]",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    icon: ShoppingBag,
    tagline: "Lojas virtuais de alta conversão",
    description:
      "Criamos lojas virtuais completas, otimizadas para conversão e integradas com os principais meios de pagamento do mercado. Painel administrativo robusto, gestão de estoque, cupons e muito mais.",
    highlights: [
      "Integração com Mercado Pago, Stripe e PagSeguro",
      "Gestão de produtos, estoque e pedidos",
      "Recuperação de carrinho abandonado",
      "Cupons, promoções e programa de fidelidade",
      "Integração com marketplaces (ML, Shopee)",
      "Relatórios de vendas e performance",
    ],
    useCases: ["Lojas de moda e varejo", "Produtos digitais e cursos", "Atacado e distribuidoras", "Marcas direto ao consumidor"],
    deliveryTime: "4 a 12 semanas",
    image: "bg-gradient-to-br from-[#BA66F2] to-[#531B8C]",
  },
  {
    id: "apis",
    label: "APIs & Integrações",
    icon: Plug,
    tagline: "Conecte todos os seus sistemas",
    description:
      "Desenvolvemos APIs RESTful e GraphQL robustas, além de integrações entre sistemas — CRMs, ERPs, gateways de pagamento, marketplaces, ferramentas de automação e qualquer plataforma do mercado.",
    highlights: [
      "APIs RESTful e GraphQL documentadas",
      "Webhooks e integrações em tempo real",
      "Integrações com Zapier, Make e n8n",
      "Autenticação OAuth2 e JWT",
      "Rate limiting e monitoramento",
      "SDKs e bibliotecas para clientes",
    ],
    useCases: ["Integração ERP ↔ E-commerce", "Conexão com APIs de terceiros", "Microserviços e arquitetura distribuída", "Middleware para sistemas legados"],
    deliveryTime: "2 a 10 semanas",
    image: "bg-gradient-to-br from-[#1a0a2e] to-[#A229F2]",
  },
];

const processSteps = [
  { step: "01", icon: Lightbulb, title: "Briefing & Descoberta", desc: "Reunião aprofundada para entender seu negócio, objetivos, público-alvo e desafios específicos do projeto." },
  { step: "02", icon: Pencil, title: "Planejamento & Design", desc: "Criamos wireframes, protótipos e o escopo detalhado. Você aprova cada etapa antes de avançar." },
  { step: "03", icon: Code2, title: "Desenvolvimento", desc: "Desenvolvimento ágil com entregas parciais frequentes. Você acompanha o progresso em tempo real." },
  { step: "04", icon: FlaskConical, title: "Testes & QA", desc: "Testes rigorosos de funcionalidade, performance, segurança e experiência do usuário em todos os dispositivos." },
  { step: "05", icon: Rocket, title: "Publicação", desc: "Go-live cuidadoso com monitoramento ativo. Garantimos que tudo funciona perfeitamente desde o primeiro dia." },
  { step: "06", icon: HeartHandshake, title: "Suporte Contínuo", desc: "Acompanhamento pós-entrega, manutenção preventiva e evolução contínua do produto conforme seu negócio cresce." },
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const service = services[activeService];
  const Icon = service.icon;

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden selection:bg-[#A229F2]/20 selection:text-[#531B8C]">
      <div className="absolute top-0 left-[10%] w-[600px] h-[600px] bg-[#A229F2]/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-[#531B8C]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-16 relative overflow-hidden bg-[#07050f]">
        {/* Aurora WebGL background */}
        <AuroraBackground />

        {/* Subtle radial darkening in center for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(7,5,15,0.45) 0%, transparent 100%)",
          }}
        />

        <div className="container mx-auto px-4 max-w-5xl relative z-20">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
              <Link href="/" className="hover:text-white/80 transition-colors cursor-pointer">Início</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#BA66F2] font-medium">Serviços</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[#BA66F2] font-bold uppercase tracking-widest text-sm mb-3">O que fazemos</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Software sob medida<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BA66F2] to-[#A229F2]">
                para o seu negócio
              </span>
            </h1>
            <p className="text-white/65 text-lg md:text-xl max-w-2xl leading-relaxed">
              Da landing page ao sistema mais complexo — desenvolvemos com tecnologias modernas, 
              processo transparente e foco total em resultados que impactam seu faturamento.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-4 relative z-10 border-t border-[#A229F2]/10 bg-background/80 dark:bg-background/90 backdrop-blur-sm sticky top-[64px] md:top-[80px] z-40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
            {services.map((s, i) => {
              const SIcon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveService(i)}
                  data-testid={`tab-service-${s.id}`}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    activeService === i
                      ? "bg-[#A229F2] text-white shadow-lg shadow-[#A229F2]/25"
                      : "text-muted-foreground hover:text-[#A229F2] hover:bg-[#A229F2]/8"
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Left: content */}
              <div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.image} mb-6 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#A229F2] font-semibold text-sm uppercase tracking-wider mb-2">{service.tagline}</p>
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">{service.label}</h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">{service.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {service.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#A229F2] mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm font-medium">{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  {service.useCases.map((u, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#A229F2]/10 text-[#531B8C] border border-[#A229F2]/20">
                      {u}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Button
                    onClick={() => window.open(WA_URL, "_blank")}
                    className="bg-[#A229F2] hover:bg-[#531B8C] text-white rounded-full px-8 shadow-lg shadow-[#A229F2]/25 transition-all"
                    data-testid={`button-orcamento-${service.id}`}
                  >
                    Quero um orçamento
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="font-semibold text-[#A229F2]">Prazo médio:</span>
                    {service.deliveryTime}
                  </div>
                </div>
              </div>

              {/* Right: visual card */}
              <div className="relative">
                <div className={`rounded-3xl ${service.image} p-8 md:p-10 shadow-2xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none opacity-60" />
                  <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <Icon className="w-12 h-12 text-white/80 mb-6" />
                    <h3 className="text-2xl font-black text-white mb-3">{service.label}</h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-6">{service.tagline}</p>
                    <div className="space-y-2">
                      {service.highlights.slice(0, 4).map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Service number indicator */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-card rounded-2xl shadow-xl flex items-center justify-center border border-[#A229F2]/20">
                  <span className="text-[#A229F2] font-black text-xl">{String(activeService + 1).padStart(2, "0")}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 md:py-28 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A229F2]/50 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#A229F2]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#531B8C]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[#A229F2] font-bold uppercase tracking-widest text-sm mb-3">Nosso processo</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              Como funciona?
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Processo transparente do início ao fim, com você no controle de cada decisão.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#A229F2]/40 hover:bg-white/8 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#A229F2]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#A229F2]/30 transition-colors">
                      <StepIcon className="w-5 h-5 text-[#A229F2]" />
                    </div>
                    <span className="text-[#A229F2]/50 font-black text-2xl leading-none">{step.step}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 md:py-28 bg-[#0D0D0D] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#531B8C]/40 to-transparent" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#A229F2] font-bold uppercase tracking-widest text-sm mb-3">Nossas ferramentas</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                Tecnologias que<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A229F2] to-[#BA66F2]">utilizamos</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Trabalhamos com tecnologias modernas, amplamente adotadas e com suporte de longo prazo — garantindo que seu produto seja robusto, escalável e fácil de manter.
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
                  <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:border-[#A229F2]/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[#A229F2] flex-shrink-0" />
                    <div>
                      <div className="text-white font-semibold text-sm">{tech.name}</div>
                      <div className="text-white/45 text-xs">{tech.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <OrbitingSkills />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-[#531B8C] via-[#A229F2] to-[#BA66F2]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Pronto para começar?
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
              Fale com a nossa equipe e transforme sua ideia em software de alto impacto.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => window.open(WA_URL, "_blank")}
                className="bg-white text-[#531B8C] hover:bg-white/90 font-bold rounded-full px-10 h-14 text-lg shadow-2xl transition-all hover:-translate-y-1"
                data-testid="button-cta-servicos"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Falar com um especialista
              </Button>
              <Link href="/portfolio">
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 rounded-full px-10 h-14 text-lg"
                  data-testid="button-ver-portfolio"
                >
                  Ver portfólio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <EthosIA />
    </main>
  );
}
