import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Building2,
  Users,
  Lightbulb,
  Wrench,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const WHATSAPP_NUMBER = "5562994826949";

interface WizardData {
  businessType: string;
  companySize: string;
  mainPain: string;
  solutions: string[];
  name: string;
}

const businessTypes = [
  { label: "Contabilidade / Financeiro", icon: "📊" },
  { label: "Advocacia / Jurídico", icon: "⚖️" },
  { label: "Saúde / Clínica", icon: "🏥" },
  { label: "Varejo / E-commerce", icon: "🛍️" },
  { label: "Restaurante / Bar", icon: "🍽️" },
  { label: "Serviços / Consultoria", icon: "💼" },
  { label: "Indústria / Manufatura", icon: "🏭" },
  { label: "Outro", icon: "✨" },
];

const companySizes = [
  { label: "Só eu (MEI / Autônomo)", value: "MEI", desc: "Trabalho por conta própria" },
  { label: "Micro empresa", value: "micro", desc: "Até 9 funcionários" },
  { label: "Pequena empresa", value: "pequena", desc: "10 a 49 funcionários" },
  { label: "Média empresa", value: "media", desc: "50 a 249 funcionários" },
  { label: "Grande empresa", value: "grande", desc: "250+ funcionários" },
];

const mainPains = [
  { label: "Perco clientes por falta de presença digital", icon: "📉" },
  { label: "Meus processos são manuais e tomam muito tempo", icon: "⏰" },
  { label: "Meu site antigo não converte nem gera contatos", icon: "🌐" },
  { label: "Preciso organizar e centralizar minha gestão", icon: "📋" },
  { label: "Meu atendimento não escala sem contratar mais", icon: "🤖" },
  { label: "Não consigo medir os resultados do meu negócio", icon: "📊" },
];

const solutionOptions = [
  { label: "Site Institucional", value: "site", icon: "🌐" },
  { label: "Landing Page de Vendas", value: "landing", icon: "🚀" },
  { label: "Sistema de Gestão", value: "sistema", icon: "⚙️" },
  { label: "CRM / Dashboard", value: "crm", icon: "📊" },
  { label: "Automação com IA", value: "ia", icon: "🤖" },
  { label: "App Mobile", value: "app", icon: "📱" },
  { label: "E-commerce", value: "ecommerce", icon: "🛍️" },
  { label: "Não sei ainda", value: "indefinido", icon: "💡" },
];

const steps = [
  { id: 1, title: "Seu negócio", icon: Building2 },
  { id: 2, title: "Tamanho", icon: Users },
  { id: 3, title: "Principal dor", icon: Lightbulb },
  { id: 4, title: "Solução", icon: Wrench },
  { id: 5, title: "Resumo", icon: Send },
];

function buildMessage(data: WizardData): string {
  const solutionLabels = data.solutions
    .map(s => solutionOptions.find(o => o.value === s)?.label)
    .filter(Boolean)
    .join(", ");

  const size = companySizes.find(c => c.value === data.companySize)?.label || data.companySize;

  return `Olá! Vim pelo site da Ethos Software e gostaria de conversar sobre um projeto 🚀

*Sobre minha empresa:*
• Segmento: ${data.businessType}
• Porte: ${size}

*Minha principal dor:*
${data.mainPain}

*O que estou buscando:*
${solutionLabels || "Ainda não sei exatamente"}

${data.name ? `*Meu nome:* ${data.name}\n\n` : ""}Poderia me ajudar?`;
}

interface WhatsAppWizardProps {
  onClose: () => void;
}

export default function WhatsAppWizard({ onClose }: WhatsAppWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    businessType: "",
    companySize: "",
    mainPain: "",
    solutions: [],
    name: "",
  });

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  const canAdvance = () => {
    if (step === 1) return !!data.businessType;
    if (step === 2) return !!data.companySize;
    if (step === 3) return !!data.mainPain;
    if (step === 4) return data.solutions.length > 0;
    return true;
  };

  const handleSend = () => {
    const msg = buildMessage(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    onClose();
  };

  const toggleSolution = (val: string) => {
    setData(d => ({
      ...d,
      solutions: d.solutions.includes(val)
        ? d.solutions.filter(s => s !== val)
        : [...d.solutions, val],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#531B8C] to-[#A229F2] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Falar com a Ethos</h2>
                <p className="text-white/70 text-xs">Vamos montar sua mensagem juntos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              data-testid="button-fechar-wizard"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Steps indicator */}
          <div className="relative z-10">
            <div className="flex justify-between mb-2">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`flex flex-col items-center gap-1 ${step >= s.id ? "opacity-100" : "opacity-40"} transition-opacity`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.id
                      ? "bg-white text-[#531B8C]"
                      : step === s.id
                      ? "bg-white/30 text-white border-2 border-white"
                      : "bg-white/10 text-white/50"
                  }`}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  <span className="text-white/70 text-[10px] font-medium hidden sm:block">{s.title}</span>
                </div>
              ))}
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
        <div className="p-6 min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1"
              >
                <h3 className="text-xl font-bold text-[#111111] mb-1">Qual é o seu segmento?</h3>
                <p className="text-[#555555] text-sm mb-5">Selecione a área que melhor descreve seu negócio.</p>
                <div className="grid grid-cols-2 gap-2">
                  {businessTypes.map((bt) => (
                    <button
                      key={bt.label}
                      onClick={() => setData(d => ({ ...d, businessType: bt.label }))}
                      data-testid={`button-business-${bt.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                        data.businessType === bt.label
                          ? "border-[#A229F2] bg-[#A229F2]/10 text-[#531B8C]"
                          : "border-gray-200 text-[#555555] hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"
                      }`}
                    >
                      <span className="text-lg">{bt.icon}</span>
                      <span className="leading-tight">{bt.label}</span>
                      {data.businessType === bt.label && <CheckCircle2 className="w-4 h-4 text-[#A229F2] ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1"
              >
                <h3 className="text-xl font-bold text-[#111111] mb-1">Qual é o porte da empresa?</h3>
                <p className="text-[#555555] text-sm mb-5">Isso nos ajuda a entender a escala da solução ideal.</p>
                <div className="flex flex-col gap-2">
                  {companySizes.map((cs) => (
                    <button
                      key={cs.value}
                      onClick={() => setData(d => ({ ...d, companySize: cs.value }))}
                      data-testid={`button-size-${cs.value}`}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                        data.companySize === cs.value
                          ? "border-[#A229F2] bg-[#A229F2]/10"
                          : "border-gray-200 hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"
                      }`}
                    >
                      <div>
                        <div className={`font-semibold text-sm ${data.companySize === cs.value ? "text-[#531B8C]" : "text-[#111111]"}`}>
                          {cs.label}
                        </div>
                        <div className="text-[#888888] text-xs mt-0.5">{cs.desc}</div>
                      </div>
                      {data.companySize === cs.value && <CheckCircle2 className="w-5 h-5 text-[#A229F2] flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1"
              >
                <h3 className="text-xl font-bold text-[#111111] mb-1">Qual é a sua principal dor?</h3>
                <p className="text-[#555555] text-sm mb-5">Selecione o que mais impacta seu negócio hoje.</p>
                <div className="flex flex-col gap-2">
                  {mainPains.map((mp) => (
                    <button
                      key={mp.label}
                      onClick={() => setData(d => ({ ...d, mainPain: mp.label }))}
                      data-testid={`button-pain-${mainPains.indexOf(mp)}`}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                        data.mainPain === mp.label
                          ? "border-[#A229F2] bg-[#A229F2]/10"
                          : "border-gray-200 hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{mp.icon}</span>
                      <span className={`text-sm font-medium leading-snug ${data.mainPain === mp.label ? "text-[#531B8C]" : "text-[#333333]"}`}>
                        {mp.label}
                      </span>
                      {data.mainPain === mp.label && <CheckCircle2 className="w-4 h-4 text-[#A229F2] ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1"
              >
                <h3 className="text-xl font-bold text-[#111111] mb-1">Que solução você busca?</h3>
                <p className="text-[#555555] text-sm mb-5">Pode selecionar mais de uma opção.</p>
                <div className="grid grid-cols-2 gap-2">
                  {solutionOptions.map((so) => {
                    const selected = data.solutions.includes(so.value);
                    return (
                      <button
                        key={so.value}
                        onClick={() => toggleSolution(so.value)}
                        data-testid={`button-solution-${so.value}`}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                          selected
                            ? "border-[#A229F2] bg-[#A229F2]/10 text-[#531B8C]"
                            : "border-gray-200 text-[#555555] hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5"
                        }`}
                      >
                        <span className="text-lg">{so.icon}</span>
                        <span className="leading-tight flex-1">{so.label}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-[#A229F2] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-semibold text-[#333333] block mb-2">Seu nome (opcional)</label>
                  <input
                    type="text"
                    placeholder="Como posso te chamar?"
                    value={data.name}
                    onChange={(e) => setData(d => ({ ...d, name: e.target.value }))}
                    data-testid="input-name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#A229F2] focus:outline-none text-sm transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#A229F2]" />
                  <h3 className="text-xl font-bold text-[#111111]">Sua mensagem está pronta!</h3>
                </div>
                <p className="text-[#555555] text-sm mb-4">Veja o preview abaixo. Ao clicar em enviar, o WhatsApp abrirá com a mensagem preenchida.</p>

                {/* WhatsApp message preview */}
                <div className="bg-[#E5DDD5] rounded-2xl p-4 flex-1 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }} />
                  <div className="relative z-10 flex justify-end">
                    <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs shadow-sm">
                      <pre className="text-[#111111] text-xs leading-relaxed font-sans whitespace-pre-wrap break-words">
                        {buildMessage(data)}
                      </pre>
                      <div className="flex justify-end mt-1">
                        <span className="text-[#888888] text-[10px]">agora ✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              data-testid="button-wizard-voltar"
              className="flex items-center gap-2 text-[#555555] hover:text-[#531B8C] font-semibold text-sm transition-colors px-4 py-2.5 rounded-xl hover:bg-[#A229F2]/5"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(s => s + 1)}
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
    </motion.div>
  );
}
