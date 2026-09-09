import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import {
  profiles,
  segments,
  ideaTypes,
  companySizes,
  businessStages,
  objectives,
  solutionOptions,
  budgets,
  steps,
} from "@/data/wizard";
import { buildMessage, type WizardData } from "@/lib/wizard-message";

const WA_NUMBER = "556294667304";

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

  const currentObjectives =
    objectives[data.profile as keyof typeof objectives] || objectives.empresa;
  const currentSegments = data.profile === "ideia" ? ideaTypes : segments;
  const showStageStep = data.profile === "novo" || data.profile === "ideia";
  const displayedSteps = showStageStep
    ? steps
    : steps.filter((item) => item.id !== 3);
  const displayedStepIndex = displayedSteps.findIndex((item) => item.id === step);
  const progress =
    displayedStepIndex < 0
      ? 0
      : (displayedStepIndex / (displayedSteps.length - 1)) * 100;

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
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    if (step === 4 && !showStageStep) {
      setStep(2);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const handleSend = () => {
    const msg = buildMessage(data);
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const toggleSolution = (val: string) => {
    setData((d) => ({
      ...d,
      solutions: d.solutions.includes(val)
        ? d.solutions.filter((s) => s !== val)
        : [...d.solutions, val],
    }));
  };

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#8E2DBA]/10 border border-[#8E2DBA]/20 mb-6">
              <span className="text-[#8E2DBA] font-bold tracking-widest uppercase text-xs">
                Levantamento inicial
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Organize as informações{" "}
              <span className="text-primary">
                do seu projeto
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Responda algumas perguntas para enviar à nossa equipe o contexto
              inicial da sua necessidade.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                {
                  label: "Contexto",
                  desc: "Informações sobre a necessidade",
                },
                {
                  label: "2 minutos",
                  desc: "Preenchimento objetivo",
                },
                {
                  label: "Sem compromisso",
                  desc: "Análise antes da proposta",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-card rounded-md p-5 border border-[#8E2DBA]/10 text-center"
                >
                  <div className="font-bold text-foreground text-sm">
                    {item.label}
                  </div>
                  <div className="text-muted-foreground text-xs mt-1">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStarted(true)}
              data-testid="button-iniciar-wizard"
              className="inline-flex items-center gap-3 bg-[#8E2DBA] hover:bg-[#67228A] text-white font-bold px-10 py-4 rounded-md text-lg transition-colors"
            >
              Enviar informações para análise
            </button>
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
          <div className="bg-[#67228A] rounded-t-lg p-6 relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3 mb-5">
              <div>
                <h3 className="text-white font-bold text-lg">
                  Informações iniciais do projeto
                </h3>
                <p className="text-white/70 text-xs">
                  Ethos Software, análise inicial sem compromisso
                </p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="relative z-10">
              <div className="flex justify-between mb-2 gap-1">
                {displayedSteps.map((s, idx) => {
                  const displayId = idx + 1;
                  const isDone = step > s.id;
                  const isCurrent = step === s.id;
                  return (
                    <div
                      key={s.id}
                      aria-current={isCurrent ? "step" : undefined}
                      className={`flex flex-col items-center gap-1 flex-1 ${isDone || isCurrent ? "opacity-100" : "opacity-30"} transition-opacity`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isDone
                            ? "bg-white text-[#67228A]"
                            : isCurrent
                              ? "bg-white/30 text-white border border-white"
                              : "bg-white/10 text-white/50"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          displayId
                        )}
                      </div>
                      <span className="text-white/70 text-[8px] sm:text-[9px] font-medium text-center leading-tight">
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div
                className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden"
                role="progressbar"
                aria-label="Progresso da proposta"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <motion.div
                  className="h-full bg-white rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-card border border-[#8E2DBA]/10 p-6 md:p-8 min-h-[360px] flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1: Profile */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  <h3 id="wizard-profile-title" className="text-xl font-bold text-foreground mb-1">
                    Como você se descreve?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    Isso nos ajuda a personalizar as próximas perguntas.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-labelledby="wizard-profile-title">
                    {profiles.map((p) => {
                      const sel = data.profile === p.value;
                      return (
                        <button
                          type="button"
                          key={p.value}
                          role="radio"
                          aria-checked={sel}
                          onClick={() =>
                            setData((d) => ({ ...d, profile: p.value }))
                          }
                          data-testid={`button-profile-${p.value}`}
                          className={`flex items-center gap-3 px-4 py-4 rounded-md border-2 text-left transition-all ${sel ? "border-[#8E2DBA] bg-[#8E2DBA]/10" : "border-border hover:border-[#8E2DBA]/40 hover:bg-[#8E2DBA]/5"}`}
                        >
                          <div>
                            <div
                              className={`font-semibold text-sm ${sel ? "text-[#67228A]" : "text-foreground"}`}
                            >
                              {p.label}
                            </div>
                            <div className="text-muted-foreground text-xs mt-0.5">
                              {p.desc}
                            </div>
                          </div>
                          {sel && (
                            <CheckCircle2 className="w-4 h-4 text-[#8E2DBA] ml-auto flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Segment/Context */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  <h3 id="wizard-segment-title" className="text-xl font-bold text-foreground mb-1">
                    {data.profile === "ideia"
                      ? "Que tipo de solução você imagina?"
                      : "Qual é o seu segmento?"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    Selecione a opção que melhor descreve seu contexto.
                  </p>
                  <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-64" role="radiogroup" aria-labelledby="wizard-segment-title">
                    {currentSegments.map((s) => {
                      const sel = data.segment === s.label;
                      return (
                        <button
                          type="button"
                          key={s.label}
                          role="radio"
                          aria-checked={sel}
                          onClick={() =>
                            setData((d) => ({
                              ...d,
                              segment: s.label,
                              segmentCustom:
                                s.label !== "Outro" ? "" : d.segmentCustom,
                            }))
                          }
                          data-testid={`button-segment-${s.label}`}
                          className={`flex items-center gap-2 px-3 py-3 rounded-md border-2 text-left text-sm font-medium transition-all ${sel ? "border-[#8E2DBA] bg-[#8E2DBA]/10 text-[#67228A]" : "border-border text-muted-foreground hover:border-[#8E2DBA]/40 hover:bg-[#8E2DBA]/5"}`}
                        >
                          <span className="leading-tight flex-1">
                            {s.label}
                          </span>
                          {sel && (
                            <CheckCircle2 className="w-4 h-4 text-[#8E2DBA] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {data.segment === "Outro" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                    >
                      <input
                        type="text"
                        aria-label="Descreva seu segmento ou ideia"
                        placeholder="Descreva seu segmento ou ideia..."
                        value={data.segmentCustom}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            segmentCustom: e.target.value,
                          }))
                        }
                        data-testid="input-segment-custom"
                        className="w-full px-4 py-3 rounded-md border-2 border-[#8E2DBA] focus:outline-none text-sm"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Stage (only for novo/ideia) */}
              {step === 3 && showStageStep && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  <h3 id="wizard-stage-title" className="text-xl font-bold text-foreground mb-1">
                    {data.profile === "empresa"
                      ? "Qual é o porte da sua empresa?"
                      : "Em que estágio você está?"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    Isso nos ajuda a entender a escala da solução ideal.
                  </p>
                  <div className="flex flex-col gap-2" role="radiogroup" aria-labelledby="wizard-stage-title">
                    {(data.profile === "empresa"
                      ? companySizes.map((c) => ({
                          label: c.label,
                          value: c.value,
                        }))
                      : businessStages
                    ).map((s) => {
                      const val = s.value;
                      const sel = data.stage === val;
                      return (
                        <button
                          type="button"
                          key={val}
                          role="radio"
                          aria-checked={sel}
                          onClick={() => setData((d) => ({ ...d, stage: val }))}
                          data-testid={`button-stage-${val}`}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-md border-2 text-left transition-all ${sel ? "border-[#8E2DBA] bg-[#8E2DBA]/10" : "border-border hover:border-[#8E2DBA]/40 hover:bg-[#8E2DBA]/5"}`}
                        >
                          <span
                            className={`font-semibold text-sm ${sel ? "text-[#67228A]" : "text-foreground"}`}
                          >
                            {s.label}
                          </span>
                          {sel && (
                            <CheckCircle2 className="w-5 h-5 text-[#8E2DBA] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Objective */}
              {step === 4 && (
                <motion.div
                  key="s4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  <h3 id="wizard-objective-title" className="text-xl font-bold text-foreground mb-1">
                    Qual é o seu principal objetivo?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    O que você mais quer conquistar agora?
                  </p>
                  <div className="flex flex-col gap-2 overflow-y-auto max-h-64" role="radiogroup" aria-labelledby="wizard-objective-title">
                    {currentObjectives.map((obj) => {
                      const sel = data.objective === obj.label;
                      return (
                        <button
                          type="button"
                          key={obj.label}
                          role="radio"
                          aria-checked={sel}
                          onClick={() =>
                            setData((d) => ({ ...d, objective: obj.label }))
                          }
                          data-testid={`button-obj-${currentObjectives.indexOf(obj)}`}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-md border-2 text-left transition-all ${sel ? "border-[#8E2DBA] bg-[#8E2DBA]/10" : "border-border hover:border-[#8E2DBA]/40 hover:bg-[#8E2DBA]/5"}`}
                        >
                          <span
                            className={`text-sm font-medium leading-snug ${sel ? "text-[#67228A]" : "text-foreground"}`}
                          >
                            {obj.label}
                          </span>
                          {sel && (
                            <CheckCircle2 className="w-4 h-4 text-[#8E2DBA] ml-auto flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Solutions */}
              {step === 5 && (
                <motion.div
                  key="s5"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  <h3 id="wizard-solution-title" className="text-xl font-bold text-foreground mb-1">
                    Que tipo de solução você busca?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    Pode selecionar mais de uma opção.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-labelledby="wizard-solution-title">
                    {solutionOptions.map((so) => {
                      const sel = data.solutions.includes(so.value);
                      return (
                        <button
                          type="button"
                          key={so.value}
                          role="checkbox"
                          aria-checked={sel}
                          onClick={() => toggleSolution(so.value)}
                          data-testid={`button-sol-${so.value}`}
                          className={`flex items-center gap-2 px-3 py-3 rounded-md border-2 text-left text-sm font-medium transition-all ${sel ? "border-[#8E2DBA] bg-[#8E2DBA]/10 text-[#67228A]" : "border-border text-muted-foreground hover:border-[#8E2DBA]/40 hover:bg-[#8E2DBA]/5"}`}
                        >
                          <span className="leading-tight flex-1">
                            {so.label}
                          </span>
                          {sel && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#8E2DBA] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 6: Budget */}
              {step === 6 && (
                <motion.div
                  key="s6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  <h3 id="wizard-budget-title" className="text-xl font-bold text-foreground mb-1">
                    Qual é o seu investimento previsto?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    Isso nos ajuda a montar uma proposta que caiba no seu bolso.
                    Sem compromisso.
                  </p>
                  <div className="flex flex-col gap-2" role="radiogroup" aria-labelledby="wizard-budget-title">
                    {budgets.map((b) => {
                      const sel = data.budget === b.value;
                      return (
                        <button
                          type="button"
                          key={b.value}
                          role="radio"
                          aria-checked={sel}
                          onClick={() =>
                            setData((d) => ({ ...d, budget: b.value }))
                          }
                          data-testid={`button-budget-${b.value}`}
                          className={`flex items-center justify-between px-5 py-3.5 rounded-md border-2 text-left transition-all ${sel ? "border-[#8E2DBA] bg-[#8E2DBA]/10" : "border-border hover:border-[#8E2DBA]/40 hover:bg-[#8E2DBA]/5"}`}
                        >
                          <span
                            className={`font-semibold text-sm ${sel ? "text-[#67228A]" : "text-foreground"}`}
                          >
                            {b.label}
                          </span>
                          {sel && (
                            <CheckCircle2 className="w-5 h-5 text-[#8E2DBA] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 7: Summary + Preview */}
              {step === 7 && (
                <motion.div
                  key="s7"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-foreground">
                      Sua mensagem está pronta!
                    </h3>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="wizard-name" className="text-sm font-semibold text-foreground block mb-2">
                      Seu nome (opcional)
                    </label>
                    <input
                      type="text"
                      id="wizard-name"
                      placeholder="Como posso te chamar?"
                      value={data.name}
                      onChange={(e) =>
                        setData((d) => ({ ...d, name: e.target.value }))
                      }
                      data-testid="input-name"
                      className="w-full px-4 py-2.5 rounded-md border-2 border-border focus:border-[#8E2DBA] focus:outline-none text-sm transition-colors"
                    />
                  </div>

                  <div className="bg-[#E7E0D5] rounded-md p-4 flex-1 relative overflow-hidden">
                    <div className="relative z-10 flex justify-end">
                      <div className="bg-[#DCE5D8] rounded-md rounded-tr-sm px-4 py-3 max-w-xs">
                        <pre className="text-foreground text-xs leading-relaxed font-sans whitespace-pre-wrap break-words">
                          {buildMessage(data)}
                        </pre>
                        <div className="flex justify-end mt-1">
                          <span className="text-muted-foreground text-[10px]">
                            agora
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="bg-card border border-t-0 border-[#8E2DBA]/10 rounded-b-lg px-6 md:px-8 py-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={step === 1 ? () => setStarted(false) : handleBack}
              data-testid="button-wizard-voltar"
              className="flex items-center gap-2 text-muted-foreground hover:text-[#67228A] font-semibold text-sm transition-colors px-4 py-2.5 rounded-md hover:bg-[#8E2DBA]/5"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? "Cancelar" : "Voltar"}
            </button>

            {step < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance()}
                data-testid="button-wizard-proximo"
                className="flex items-center gap-2 bg-[#8E2DBA] hover:bg-[#67228A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-md transition-colors text-sm"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                data-testid="button-wizard-enviar"
                className="flex items-center gap-2 bg-[#3E7658] hover:bg-[#315E48] text-white font-bold px-6 py-2.5 rounded-md transition-colors text-sm"
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
