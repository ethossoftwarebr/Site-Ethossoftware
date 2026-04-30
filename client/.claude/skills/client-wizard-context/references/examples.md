<!-- mustard:generated -->
# Examples — client-wizard-context

> Real snippets pulled from the codebase.

## State + step gate (`client/src/components/WizardSection.tsx:171`)

```tsx
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
```

## Conditional skip-step branching (`client/src/components/WizardSection.tsx:205`)

```tsx
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
```

## WhatsApp message template (`client/src/components/WizardSection.tsx:145`)

```tsx
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
```

## Send action (`client/src/components/WizardSection.tsx:223`)

```tsx
const handleSend = () => {
  const msg = buildMessage(data);
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
};
```

## Multi-select toggle helper (`client/src/components/WizardSection.tsx:229`)

```tsx
const toggleSolution = (val: string) => {
  setData(d => ({
    ...d,
    solutions: d.solutions.includes(val)
      ? d.solutions.filter(s => s !== val)
      : [...d.solutions, val],
  }));
};
```

## Step animation skeleton (`client/src/components/WizardSection.tsx:354`)

```tsx
<AnimatePresence mode="wait">
  {step === 1 && (
    <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="flex flex-col flex-1">
      <h3 className="text-xl font-bold text-foreground mb-1">Como você se descreve?</h3>
      {/* option buttons */}
    </motion.div>
  )}
  {/* more steps */}
</AnimatePresence>
```

## Reserved global context (`client/src/context/WizardContext.tsx:15`)

```tsx
export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <WizardContext.Provider value={{ isOpen, openWizard: () => setIsOpen(true), closeWizard: () => setIsOpen(false) }}>
      {children}
    </WizardContext.Provider>
  );
}
export const useWizard = () => useContext(WizardContext);
```
