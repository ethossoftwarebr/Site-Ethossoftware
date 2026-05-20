import {
  Building2,
  Users,
  Lightbulb,
  Wrench,
  DollarSign,
  Send,
  User,
  Rocket,
  Laptop,
} from "lucide-react";

export const profiles = [
  {
    label: "Tenho uma empresa",
    value: "empresa",
    icon: Building2,
    desc: "Já possuo um negócio ativo",
  },
  {
    label: "Vou abrir um negócio",
    value: "novo",
    icon: Rocket,
    desc: "Estou planejando minha empresa",
  },
  {
    label: "Tenho uma ideia de app/sistema",
    value: "ideia",
    icon: Laptop,
    desc: "Quero criar algo do zero",
  },
  {
    label: "Sou pessoa física",
    value: "pessoa",
    icon: User,
    desc: "Freelancer, profissional autônomo",
  },
];

export const segments = [
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

export const ideaTypes = [
  { label: "Aplicativo Mobile" },
  { label: "Sistema Web / SaaS" },
  { label: "E-commerce" },
  { label: "Marketplace" },
  { label: "Automação de processos" },
  { label: "Dashboard / Relatórios" },
  { label: "Chatbot / IA" },
  { label: "Outro" },
];

export const companySizes = [
  {
    label: "Só eu (MEI / Autônomo)",
    value: "mei",
    desc: "Trabalho por conta própria",
  },
  { label: "Micro empresa", value: "micro", desc: "Até 9 funcionários" },
  { label: "Pequena empresa", value: "pequena", desc: "10 a 49 funcionários" },
  { label: "Média empresa", value: "media", desc: "50 a 249 funcionários" },
  { label: "Grande empresa", value: "grande", desc: "250+ funcionários" },
];

export const businessStages = [
  { label: "Só tenho a ideia por enquanto", value: "ideia" },
  { label: "Já tenho alguns clientes / pedidos", value: "clientes" },
  { label: "Empresa registrada, mas começando", value: "registrada" },
  { label: "Já fatura, mas precisa escalar", value: "escalando" },
];

export const objectives = {
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
  { label: "R$ 2.000 – R$ 5.000", value: "2k5k" },
  { label: "R$ 5.000 – R$ 15.000", value: "5k15k" },
  { label: "R$ 15.000 – R$ 50.000", value: "15k50k" },
  { label: "Acima de R$ 50.000", value: "50kplus" },
  { label: "Ainda não sei", value: "naosabe" },
];

export const steps = [
  { id: 1, title: "Perfil", icon: User },
  { id: 2, title: "Contexto", icon: Building2 },
  { id: 3, title: "Estágio", icon: Users },
  { id: 4, title: "Objetivo", icon: Lightbulb },
  { id: 5, title: "Solução", icon: Wrench },
  { id: 6, title: "Investimento", icon: DollarSign },
  { id: 7, title: "Enviar", icon: Send },
];
