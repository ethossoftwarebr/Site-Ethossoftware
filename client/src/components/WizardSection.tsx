import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Building2,
  Users,
  Lightbulb,
  Wrench,
  DollarSign,
  Send,
  CheckCircle2,
  Sparkles,
  User,
  Rocket,
  Laptop,
} from "lucide-react";

const WA_NUMBER = "556294667304";

interface WizardData {
  profile: string;
  segment: string;
  segmentCustom: string;
  stage: string;
  objective: string;
  solutions: string[];
  budget: string;
  name: string;
}

const profiles = [
  { label: "Tenho uma empresa", value: "empresa", icon: Building2, desc: "Já possuo um negócio ativo" },
  { label: "Vou abrir um negócio", value: "novo", icon: Rocket, desc: "Estou planejando minha empresa" },
  { label: "Tenho uma ideia de app/sistema", value: "ideia", icon: Laptop, desc: "Quero criar algo do zero" },
  { label: "Sou pessoa física", value: "pessoa", icon: User, desc: "Freelancer, profissional autônomo" },
];

const segments = [
  { label: "Contabilidade / Financeiro" },
  { label: "Advocacia / Jurídico" },
  { label: "Saúde / Clínica" },
  { label: "Varejo / E-commerce" },
  { label: "Restaurante / Bar" },
  { label: "Serviços / Consultoria" },
  { label: "Indústria / Manufatura" },
  { label: "Educação / Cursos" },
  { label: "Imóveis / Construção" },
  { label: "Outro" },
];

const ideaTypes = [
  { label: "Aplicativo Mobile" },
  { label: "Sistema Web / SaaS" },
  { label: "E-commerce" },
  { label: "Marketplace" },
  { label: "Automação de processos" },
  { label: "Dashboard / Relatórios" },
  { label: "Chatbot / IA" },
  { label: "Outro" },
];

const companySizes = [
  { label: "Só eu (MEI / Autônomo)", value: "mei", desc: "Trabalho por conta própria" },
  { label: "Micro empresa", value: "micro", desc: "Até 9 funcionários" },
  { label: "Pequena empresa", value: "pequena", desc: "10 a 49 funcionários" },
  { label: "Média empresa", value: "media", desc: "50 a 249 funcionários" },
  { label: "Grande empresa", value: "grande", desc: "250+ funcionários" },
];

const businessStages = [
  { label: "Só tenho a ideia por enquanto", value: "ideia" },
  { label: "Já tenho alguns clientes / pedidos", value: "clientes" },
  { label: "Empresa registrada, mas começando", value: "registrada" },
  { label: "Já fatura, mas precisa escalar", value: "escalando" },
];

const objectives = {
  empresa: [
    { label: "Atrair mais clientes online", icon: "📈" },
    { label: "Automatizar processos manuais", icon: "⚙️" },
    { label: "Organizar a gestão da empresa", icon: "📋" },
    { label: "Modernizar meu site/sistema atual", icon: "🔄" },
    { label: "Vender mais pelo digital", icon: "💰" },
    { label: "Escalar sem contratar mais", icon: "🚀" },
  ],
  novo: [
    { label: "Criar presença digital desde o início", icon: "🌐" },
    { label: "Lançar meu produto/serviço online", icon: "🚀" },
    { label: "Montar um sistema de gestão", icon: "⚙️" },
    { label: "Automatizar o atendimento", icon: "🤖" },
    { label: "Criar uma loja virtual", icon: "🛍️" },
    { label: "Construir minha marca no digital", icon: "✨" },
  ],
  ideia: [
    { label: "Desenvolver meu MVP rapidamente", icon: "⚡" },
    { label: "Validar minha ideia com protótipo", icon: "🧪" },
    { label: "Criar um produto escalável (SaaS)", icon: "📈" },
    { label: "Automatizar um processo que vi", icon: "⚙️" },
    { label: "Resolver um problema do mercado", icon: "💡" },
    { label: "Monetizar minha expertise", icon: "💰" },
  ],
  pessoa: [
    { label: "Ter um site/portfólio profissional", icon: "🌐" },
    { label: "Automatizar meu trabalho repetitivo", icon: "⚙️" },
    { label: "Criar uma ferramenta para meus clientes", icon: "🛠️" },
    { label: "Aumentar minha renda com tecnologia", icon: "💰" },
    { label: "Aprender a escalar meu negócio solo", icon: "🚀" },
    { label: "Organizar meu fluxo de trabalho", icon: "📋" },
  ],
};

const solutionOptions = [
  { label: "Site Institucional", value: "site" },
  { label: "Landing Page de Vendas", value: "landing" },
  { label: "Sistema de Gestão", value: "sistema" },
  { label: "CRM / Dashboard", value: "crm" },
  { label: "Automação com IA", value: "ia" },
  { label: "App Mobile", value: "app" },
  { label: "E-commerce", value: "ecommerce" },
  { label: "API / Integração", value: "api" },
  { label: "Não sei ainda", value: "indefinido" },
];

const budgets = [
  { label: "Até R$ 2.000", value: "ate2k" },
  { label: "R$ 2.000 – R$ 5.000", value: "2k5k" },
  { label: "R$ 5.000 – R$ 15.000", value: "5k15k" },
  { label: "R$ 15.000 – R$ 50.000", value: "15k50k" },
  { label: "Acima de R$ 50.000", value: "50kplus" },
  { label: "Ainda não sei", value: "naosabe" },
];

const steps = [
  { id: 1, title: "Perfil", icon: User },
  { id: 2, title: "Contexto", icon: Building2 },
  { id: 3, title: "Estágio", icon: Users },
  { id: 4, title: "Objetivo", icon: Lightbulb },
  { id: 5, title: "Solução", icon: Wrench },
  { id: 6, title: "Investimento", icon: DollarSign },
  { id: 7, title: "Enviar", icon: Send },
];

function buildMessage(data: WizardData): string {
  const profile = profiles.find(p => p.value === data.profile)?.label || data.profile;
  const solutionLabels = data.solutions
    .map(s => solutionOptions.find(o => o.value === s)?.label)
    .filter(Boolean)
    .join(", ");
  const budgetLabel = budgets.find(b => b.value === data.budget)?.label || data.budget;
  const segmentDisplay = data.segment === "Outro" && data.segmentCustom
    ? data.segmentCustom
    : data.segment;

  return `Olá! Vim pelo site da Ethos Software e gostaria de um projeto 🚀

*Meu perfil:* ${profile}${segmentDisplay ? `\n*Segmento/Contexto:* ${segmentDisplay}` : ""}${data.stage ? `\n*Estágio atual:* ${data.stage}` : ""}

*Meu principal objetivo:*
${data.objective}

*Soluções que busco:*
${solutionLabels || "Ainda não sei exatamente"}

*Investimento previsto:* ${budgetLabel}

${data.name ? `*Meu nome:* ${data.name}\n\n` : ""}Poderia me ajudar?`;
}

export default function WizardSection() {
  const [step, setStep] = useState(1);
  const [started, setStarted] = useState(false);
  const [data, setData] = useState<WizardData>({
    profile: "",
    segment: "",
    segmentCustom: "",
    stage: "",
    objective: "",
    solutions: [],
    budget: "",
    name: "",
  });

  const TOTAL_STEPS = 7;
  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const currentObjectives = objectives[data.profile as keyof typeof objectives] || objectives.empresa;
  const currentSegments = data.profile === "ideia" ? ideaTypes : segments;
  const showStageStep = data.profile === "novo" || data.profile === "ideia";

  const canAdvance = () => {
    if (step === 1) return !!data.profile;
    if (step === 2) {
      if (data.segment === "Outro") return data.segmentCustom.trim().length > 0;
      return !!data.segment;
    }
    if (step === 3) return !!data.stage;
    if (step === 4) return !!data.objective;
    if (step === 5) return data.solutions.length > 0;
    if (step === 6) return !!data.budget;
    return true;
  };

  const handleNext = () => {
    if (step === 2 && !showStageStep) {
      setStep(4);
    } else if (step === 3 && !showStageStep) {
      setStep(4);
    } else {
      setStep(s => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    if (step === 4 && !showStageStep) {
      setStep(2);
    } else {
      setStep(s => Math.max(s - 1, 1));
    }
  };

  const handleSend = () => {
    const msg = buildMessage(data);
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const toggleSolution = (val: string) => {
    setData(d => ({
      ...d,
      solutions: d.solutions.includes(val)
        ? d.solutions.filter(s => s !== val)
        : [...d.solutions, val],
    }));
  };

  const effectiveStep = step <= 3 && !showStageStep && step === 3 ? 2 : step;
  const displayedSteps = showStageStep ? steps : steps.filter(s => s.id !== 3);

  if (!started) {
    return (
      <section id="proposta" className="py-20 md:py-28 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A229F2]/10 border border-[#A229F2]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#A229F2]" />
              <span className="text-[#A229F2] font-bold tracking-widest uppercase text-xs">Proposta Personalizada</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Descubra a solução{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A229F2] to-[#531B8C]">
                ideal para você
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Responda algumas perguntas rápidas e receba uma mensagem personalizada para nossa equipe. Em menos de 2 minutos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: "🎯", label: "Personalizado", desc: "Para o seu perfil específico" },
                { icon: "⚡", label: "2 minutos", desc: "Rápido e sem burocracia" },
                { icon: "💬", label: "Sem compromisso", desc: "Só uma conversa inicial" },
              ].map((item, i) => (
                <div key={i} className="bg-card rounded-2xl p-5 border border-[#A229F2]/10 text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-bold text-foreground text-sm">{item.label}</div>
                  <div className="text-muted-foreground text-xs mt-1">{item.desc}</div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStarted(true)}
              data-testid="button-iniciar-wizard"
              className="inline-flex items-center gap-3 bg-[#A229F2] hover:bg-[#531B8C] text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg shadow-[#A229F2]/30 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Montar minha proposta gratuita
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="proposta" className="py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#531B8C] to-[#A229F2] rounded-t-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Monte sua proposta personalizada</h3>
                <p className="text-white/70 text-xs">Ethos Software — gratuito e sem compromisso</p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="relative z-10">
              <div className="flex justify-between mb-2 gap-1">
                {displayedSteps.map((s, idx) => {
                  const displayId = idx + 1;
                  const isDone = step > (showStageStep ? s.id : (s.id > 2 ? s.id - 1 : s.id));
                  const isCurrent = step === (showStageStep ? s.id : (s.id > 2 ? s.id - 1 : s.id));
                  return (
                    <div key={s.id} className={`flex flex-col items-center gap-1 flex-1 ${(isDone || isCurrent) ? "opacity-100" : "opacity-30"} transition-opacity`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isDone ? "bg-white text-[#531B8C]"
                        : isCurrent ? "bg-white/30 text-white border border-white"
                        : "bg-white/10 text-white/50"
                      }`}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : displayId}
                      </div>
                      <span className="text-white/60 text-[9px] font-medium hidden sm:block text-center">{s.title}</span>
                    </div>
                  );
                })}
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-card border border-[#A229F2]/10 p-6 md:p-8 min-h-[360px] flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1: Profile */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Como você se descreve?</h3>
                  <p className="text-muted-foreground text-sm mb-5">Isso nos ajuda a personalizar as próximas perguntas.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profiles.map((p) => {
                      const Icon = p.icon;
                      const sel = data.profile === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => setData(d => ({ ...d, profile: p.value }))}
                          data-testid={`button-profile-${p.value}`}
                          className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all ${sel ? "border-[#A229F2] bg-[#A229F2]/10" : "border-border hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"}`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${sel ? "bg-[#A229F2] text-white" : "bg-secondary text-muted-foreground"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className={`font-semibold text-sm ${sel ? "text-[#531B8C]" : "text-foreground"}`}>{p.label}</div>
                            <div className="text-muted-foreground text-xs mt-0.5">{p.desc}</div>
                          </div>
                          {sel && <CheckCircle2 className="w-4 h-4 text-[#A229F2] ml-auto flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Segment/Context */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {data.profile === "ideia" ? "Que tipo de solução você imagina?" : "Qual é o seu segmento?"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">Selecione a opção que melhor descreve seu contexto.</p>
                  <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-64">
                    {currentSegments.map((s) => {
                      const sel = data.segment === s.label;
                      return (
                        <button
                          key={s.label}
                          onClick={() => setData(d => ({ ...d, segment: s.label, segmentCustom: s.label !== "Outro" ? "" : d.segmentCustom }))}
                          data-testid={`button-segment-${s.label}`}
                          className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${sel ? "border-[#A229F2] bg-[#A229F2]/10 text-[#531B8C]" : "border-border text-muted-foreground hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"}`}
                        >
                          <span className="leading-tight flex-1">{s.label}</span>
                          {sel && <CheckCircle2 className="w-4 h-4 text-[#A229F2] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {data.segment === "Outro" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                      <input
                        type="text"
                        placeholder="Descreva seu segmento ou ideia..."
                        value={data.segmentCustom}
                        onChange={(e) => setData(d => ({ ...d, segmentCustom: e.target.value }))}
                        data-testid="input-segment-custom"
                        autoFocus
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#A229F2] focus:outline-none text-sm"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Stage (only for novo/ideia) */}
              {step === 3 && showStageStep && (
                <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {data.profile === "empresa" ? "Qual é o porte da sua empresa?" : "Em que estágio você está?"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">Isso nos ajuda a entender a escala da solução ideal.</p>
                  <div className="flex flex-col gap-2">
                    {(data.profile === "empresa" ? companySizes.map(c => ({ label: c.label, value: c.value })) : businessStages).map((s) => {
                      const val = s.value;
                      const sel = data.stage === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setData(d => ({ ...d, stage: val }))}
                          data-testid={`button-stage-${val}`}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-left transition-all ${sel ? "border-[#A229F2] bg-[#A229F2]/10" : "border-border hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"}`}
                        >
                          <span className={`font-semibold text-sm ${sel ? "text-[#531B8C]" : "text-foreground"}`}>{s.label}</span>
                          {sel && <CheckCircle2 className="w-5 h-5 text-[#A229F2] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Objective */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Qual é o seu principal objetivo?</h3>
                  <p className="text-muted-foreground text-sm mb-5">O que você mais quer conquistar agora?</p>
                  <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
                    {currentObjectives.map((obj) => {
                      const sel = data.objective === obj.label;
                      return (
                        <button
                          key={obj.label}
                          onClick={() => setData(d => ({ ...d, objective: obj.label }))}
                          data-testid={`button-obj-${currentObjectives.indexOf(obj)}`}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${sel ? "border-[#A229F2] bg-[#A229F2]/10" : "border-border hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"}`}
                        >
                          <span className="text-xl flex-shrink-0">{obj.icon}</span>
                          <span className={`text-sm font-medium leading-snug ${sel ? "text-[#531B8C]" : "text-foreground"}`}>{obj.label}</span>
                          {sel && <CheckCircle2 className="w-4 h-4 text-[#A229F2] ml-auto flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Solutions */}
              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Que tipo de solução você busca?</h3>
                  <p className="text-muted-foreground text-sm mb-5">Pode selecionar mais de uma opção.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {solutionOptions.map((so) => {
                      const sel = data.solutions.includes(so.value);
                      return (
                        <button
                          key={so.value}
                          onClick={() => toggleSolution(so.value)}
                          data-testid={`button-sol-${so.value}`}
                          className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${sel ? "border-[#A229F2] bg-[#A229F2]/10 text-[#531B8C]" : "border-border text-muted-foreground hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"}`}
                        >
                          <span className="leading-tight flex-1">{so.label}</span>
                          {sel && <CheckCircle2 className="w-3.5 h-3.5 text-[#A229F2] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 6: Budget */}
              {step === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Qual é o seu investimento previsto?</h3>
                  <p className="text-muted-foreground text-sm mb-5">Isso nos ajuda a montar uma proposta que caiba no seu bolso. Sem compromisso.</p>
                  <div className="flex flex-col gap-2">
                    {budgets.map((b) => {
                      const sel = data.budget === b.value;
                      return (
                        <button
                          key={b.value}
                          onClick={() => setData(d => ({ ...d, budget: b.value }))}
                          data-testid={`button-budget-${b.value}`}
                          className={`flex items-center justify-between px-5 py-3.5 rounded-xl border-2 text-left transition-all ${sel ? "border-[#A229F2] bg-[#A229F2]/10" : "border-border hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"}`}
                        >
                          <span className={`font-semibold text-sm ${sel ? "text-[#531B8C]" : "text-foreground"}`}>{b.label}</span>
                          {sel && <CheckCircle2 className="w-5 h-5 text-[#A229F2] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 7: Summary + Preview */}
              {step === 7 && (
                <motion.div key="s7" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#A229F2]" />
                    <h3 className="text-xl font-bold text-foreground">Sua mensagem está pronta!</h3>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-semibold text-foreground block mb-2">Seu nome (opcional)</label>
                    <input
                      type="text"
                      placeholder="Como posso te chamar?"
                      value={data.name}
                      onChange={(e) => setData(d => ({ ...d, name: e.target.value }))}
                      data-testid="input-name"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-border focus:border-[#A229F2] focus:outline-none text-sm transition-colors"
                    />
                  </div>

                  <div className="bg-[#E5DDD5] rounded-2xl p-4 flex-1 relative overflow-hidden">
                    <div className="relative z-10 flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs shadow-sm">
                        <pre className="text-foreground text-xs leading-relaxed font-sans whitespace-pre-wrap break-words">
                          {buildMessage(data)}
                        </pre>
                        <div className="flex justify-end mt-1">
                          <span className="text-muted-foreground text-[10px]">agora ✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="bg-card border border-t-0 border-[#A229F2]/10 rounded-b-3xl px-6 md:px-8 py-4 flex items-center justify-between gap-3">
            <button
              onClick={step === 1 ? () => setStarted(false) : handleBack}
              data-testid="button-wizard-voltar"
              className="flex items-center gap-2 text-muted-foreground hover:text-[#531B8C] font-semibold text-sm transition-colors px-4 py-2.5 rounded-xl hover:bg-[#A229F2]/5"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? "Cancelar" : "Voltar"}
            </button>

            {step < 7 ? (
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                data-testid="button-wizard-proximo"
                className="flex items-center gap-2 bg-[#A229F2] hover:bg-[#531B8C] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                data-testid="button-wizard-enviar"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-green-500/30"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar no WhatsApp
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
