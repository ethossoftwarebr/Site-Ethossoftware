import { profiles, solutionOptions, budgets } from "@/data/wizard";

export interface WizardData {
  profile: string;
  segment: string;
  segmentCustom: string;
  stage: string;
  objective: string;
  solutions: string[];
  budget: string;
  name: string;
}

export function buildMessage(data: WizardData): string {
  const profile =
    profiles.find((p) => p.value === data.profile)?.label || data.profile;
  const solutionLabels = data.solutions
    .map((s) => solutionOptions.find((o) => o.value === s)?.label)
    .filter(Boolean)
    .join(", ");
  const budgetLabel =
    budgets.find((b) => b.value === data.budget)?.label || data.budget;
  const segmentDisplay =
    data.segment === "Outro" && data.segmentCustom
      ? data.segmentCustom
      : data.segment;

  return `Olá! Vim pelo site da Ethos Software e gostaria de um projeto.

*Meu perfil:* ${profile}${segmentDisplay ? `\n*Segmento/Contexto:* ${segmentDisplay}` : ""}${data.stage ? `\n*Estágio atual:* ${data.stage}` : ""}

*Meu principal objetivo:*
${data.objective}

*Soluções que busco:*
${solutionLabels || "Ainda não sei exatamente"}

*Investimento previsto:* ${budgetLabel}

${data.name ? `*Meu nome:* ${data.name}\n\n` : ""}Poderia me ajudar?`;
}
