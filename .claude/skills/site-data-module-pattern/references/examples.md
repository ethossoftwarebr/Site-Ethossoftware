<!-- mustard:generated at:2026-09-22T21:31:20.206Z -->

# Data Module Pattern — real examples from this codebase

> Excerpts verbatim do working tree (linhas indicadas). Re-extrair se o arquivo mudar.

## as const array (consumed by FAQ island + index.astro JSON-LD)

Source: `src/data/faq.ts`

Lines 1-30

```typescript
export const faqItems = [
  {
    id: "1",
    question: "Quanto tempo demora para um site ou sistema ficar pronto?",
    sub: "Prazos transparentes desde o início do projeto",
    answer:
      "Após o entendimento do escopo, apresentamos um cronograma com as etapas do projeto. Sites institucionais costumam exigir de 1 a 4 semanas. Sistemas e integrações têm prazo definido conforme a complexidade, as dependências e as validações necessárias.",
  },
  {
    id: "2",
    question: "Vocês dão suporte e manutenção após a entrega?",
    sub: "Condições definidas de acordo com a necessidade",
    answer:
      "A Ethos oferece manutenção, hospedagem e suporte técnico conforme as condições previstas na proposta. O período de atendimento, os canais e o nível de serviço são definidos antes da contratação.",
  },
  {
    id: "3",
    question: "A Ethos atende o meu segmento de negócio?",
    sub: "Soluções para os mais variados nichos e setores",
    answer:
      "Já atendemos contabilidades, escritórios de advocacia, clínicas, consultórios, varejo, bares e restaurantes. Antes de propor uma solução, avaliamos o processo, a viabilidade técnica e se a experiência da equipe é compatível com a necessidade.",
  },
  {
    id: "4",
    question: "Como funciona o desenvolvimento das Automações com IA?",
    sub: "Automação planejada, integrada e acompanhada",
    answer:
      "Mapeamos o processo, as fontes de dados, as regras e os pontos que exigem revisão humana. Depois, implementamos e testamos a automação, documentamos as integrações e definimos como o resultado será acompanhado.",
  },
] as const;
```

## imagetools imports + exported interface + typed array

Source: `src/data/projects.ts`

Lines 1-25

```typescript
import projContacnet from "@/assets/screenshots/screenshot-1772062900110.png?w=800;1600&quality=55&format=avif;webp;png&as=picture";
import projDaniel from "@/assets/screenshots/screenshot-1772070012436.png?w=800;1600&quality=55&format=avif;webp;png&as=picture";
import projI9Contabilidade from "@/assets/screenshots/screenshot-1772126106981.png?w=800;1600&quality=55&format=avif;webp;png&as=picture";
import projMariaLaura from "@/assets/screenshots/screenshot-1772123490789.png?w=800;1600&quality=55&format=avif;webp;png&as=picture";
import projOfficeChagas from "@/assets/screenshots/WhatsApp_Image_2026-03-04_at_23.56.18_1772679540241.jpeg?w=800;1600&quality=55&format=avif;webp;jpg&as=picture";
import projEspetoShow from "@/assets/screenshots/image_1772679778021.png?w=800;1600&quality=55&format=avif;webp;png&as=picture";
import projAutomacaoChatbot from "@/assets/images/chatbot-ui.png?w=800;1600&quality=70&format=avif;webp;png&as=picture";
import type { PictureSource } from "@/components/ui/lazy-image";

export interface Project {
  title: string;
  category: string;
  description: string;
  image: PictureSource;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: "Contacnet Contabilidade",
    category: "Site Institucional",
    description: "Site institucional para escritório de contabilidade, com apresentação dos serviços, conteúdo organizado e canais de contato para empresas interessadas.",
    image: projContacnet,
    tags: ["React", "Tailwind CSS", "SEO técnico"]
  },
```

## Typed array with lucide icons

Source: `src/data/services.ts`

Lines 1-52

```typescript
import {
  Cpu,
  Globe,
  Plug,
  Settings,
  ShoppingBag,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  id: string;
  label: string;
  icon: LucideIcon;
  tagline: string;
  homeDescription: string;
  description: string;
  highlights: string[];
  useCases: string[];
  deliveryTime: string;
  image: string;
  color: string;
}

export const services: Service[] = [
  {
    id: "sites",
    label: "Sites & Landing Pages",
    icon: Globe,
    tagline: "Presença digital clara e eficiente",
    homeDescription:
      "Sites institucionais e landing pages responsivos, rápidos e alinhados aos objetivos comerciais.",
    description:
      "Planejamos e desenvolvemos sites institucionais e landing pages com conteúdo claro, navegação responsiva, SEO técnico e integrações de mensuração. Cada entrega considera o público, a manutenção e os objetivos definidos no projeto.",
    highlights: [
      "Design responsivo para todos os dispositivos",
      "Estrutura preparada para SEO",
      "Boas práticas de desempenho",
      "Integração com Google Analytics e Tag Manager",
      "Formulários e canais de contato",
      "Métricas para acompanhamento",
    ],
    useCases: [
      "Landing pages para campanhas",
      "Sites institucionais",
      "Blogs e portais de conteúdo",
      "Sites de agências e profissionais liberais",
    ],
    deliveryTime: "1 a 4 semanas",
    image: "bg-[#A026E9]",
    color: "text-[#A026E9]",
  },
```

## Option arrays {label, value}

Source: `src/data/wizard.ts`

Lines 102-131

```typescript
export const solutionOptions = [
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

export const budgets = [
  { label: "Até R$ 2.000", value: "ate2k" },
  { label: "R$ 2.000 a R$ 5.000", value: "2k5k" },
  { label: "R$ 5.000 a R$ 15.000", value: "5k15k" },
  { label: "R$ 15.000 a R$ 50.000", value: "15k50k" },
  { label: "Acima de R$ 50.000", value: "50kplus" },
  { label: "Ainda não sei", value: "naosabe" },
];

export const steps = [
  { id: 1, title: "Perfil" },
  { id: 2, title: "Contexto" },
  { id: 3, title: "Estágio" },
  { id: 4, title: "Objetivo" },
  { id: 5, title: "Solução" },
  { id: 6, title: "Investimento" },
  { id: 7, title: "Enviar" },
];
```

## Consumer: pure function resolving labels from data

Source: `src/lib/wizard-message.ts`

Lines 1-26

```typescript
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
```
