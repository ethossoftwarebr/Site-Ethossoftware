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
    tagline: "Presença digital que converte",
    homeDescription:
      "Sites institucionais e landing pages modernos, rápidos e orientados a conversão.",
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
    useCases: [
      "Landing pages para campanhas",
      "Sites institucionais",
      "Blogs e portais de conteúdo",
      "Sites de agências e profissionais liberais",
    ],
    deliveryTime: "1 a 4 semanas",
    image: "bg-gradient-to-br from-[#531B8C] to-[#A229F2]",
    color: "text-[#A229F2]",
  },
  {
    id: "sistemas",
    label: "Sistemas Web",
    icon: Settings,
    tagline: "CRM, ERP, SaaS e Dashboards sob medida",
    homeDescription:
      "Sistemas de gestão, CRMs, ERPs e plataformas SaaS criados para a sua operação.",
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
    useCases: [
      "CRM para equipes de vendas",
      "ERP para operações",
      "Plataformas SaaS B2B",
      "Sistemas de gestão internos",
    ],
    deliveryTime: "4 a 16 semanas",
    image: "bg-gradient-to-br from-[#1a0a2e] to-[#531B8C]",
    color: "text-[#531B8C]",
  },
  {
    id: "ia",
    label: "Automações com IA",
    icon: Cpu,
    tagline: "Inteligência Artificial aplicada ao seu negócio",
    homeDescription:
      "Atendimento e processos automatizados com IA trabalhando pelo seu negócio 24 horas.",
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
    useCases: [
      "Atendimento automatizado 24h",
      "Triagem e qualificação de leads",
      "Análise de dados e previsões",
      "Automação de processos internos",
    ],
    deliveryTime: "2 a 8 semanas",
    image: "bg-gradient-to-br from-[#A229F2] to-[#BA66F2]",
    color: "text-[#A229F2]",
  },
  {
    id: "mobile",
    label: "Aplicativos Mobile",
    icon: Smartphone,
    tagline: "iOS e Android com experiência nativa",
    homeDescription:
      "Aplicativos iOS e Android integrados ao ecossistema digital da sua empresa.",
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
    useCases: [
      "Apps de marketplace e e-commerce",
      "Apps de gestão e operações",
      "Apps de delivery e logística",
      "Apps de fidelidade e clube de vantagens",
    ],
    deliveryTime: "6 a 20 semanas",
    image: "bg-gradient-to-br from-[#531B8C] to-[#BA66F2]",
    color: "text-[#531B8C]",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    icon: ShoppingBag,
    tagline: "Lojas virtuais de alta conversão",
    homeDescription:
      "Lojas virtuais completas com pagamentos, estoque e recursos para vender mais.",
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
    useCases: [
      "Lojas de moda e varejo",
      "Produtos digitais e cursos",
      "Atacado e distribuidoras",
      "Marcas direto ao consumidor",
    ],
    deliveryTime: "4 a 12 semanas",
    image: "bg-gradient-to-br from-[#BA66F2] to-[#531B8C]",
    color: "text-[#A229F2]",
  },
  {
    id: "apis",
    label: "APIs & Integrações",
    icon: Plug,
    tagline: "Conecte todos os seus sistemas",
    homeDescription:
      "APIs e integrações personalizadas para eliminar tarefas manuais e conectar sistemas.",
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
    useCases: [
      "Integração ERP ↔ E-commerce",
      "Conexão com APIs de terceiros",
      "Microserviços e arquitetura distribuída",
      "Middleware para sistemas legados",
    ],
    deliveryTime: "2 a 10 semanas",
    image: "bg-gradient-to-br from-[#1a0a2e] to-[#A229F2]",
    color: "text-[#531B8C]",
  },
];
