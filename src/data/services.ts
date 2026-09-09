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
    image: "bg-[#8E2DBA]",
    color: "text-[#8E2DBA]",
  },
  {
    id: "sistemas",
    label: "Sistemas Web",
    icon: Settings,
    tagline: "Sistemas para organizar processos e dados",
    homeDescription:
      "Sistemas de gestão, CRMs, ERPs e plataformas SaaS criados para a sua operação.",
    description:
      "Desenvolvemos sistemas sob medida para centralizar informações, reduzir trabalho manual e apoiar a operação. O escopo, os acessos, as integrações e os relatórios são definidos com o cliente e entregues por etapas.",
    highlights: [
      "Autenticação, controle de acesso e permissões",
      "Dashboards com dados em tempo real",
      "APIs documentadas",
      "Integrações com sistemas legados",
      "Estrutura compatível com a demanda prevista",
      "Relatórios automatizados e exportáveis",
    ],
    useCases: [
      "CRM para equipes de vendas",
      "ERP para operações",
      "Plataformas SaaS B2B",
      "Sistemas de gestão internos",
    ],
    deliveryTime: "4 a 16 semanas",
    image: "bg-[#8E2DBA]",
    color: "text-[#67228A]",
  },
  {
    id: "ia",
    label: "Automações com IA",
    icon: Cpu,
    tagline: "Inteligência artificial aplicada a processos definidos",
    homeDescription:
      "Automações com IA para apoiar atendimento, análise e rotinas repetitivas.",
    description:
      "Implementamos automações com IA após mapear o processo, os dados disponíveis e os pontos que exigem validação humana. A solução pode ser integrada ao fluxo de trabalho existente conforme a viabilidade técnica.",
    highlights: [
      "Chatbots com LLMs (GPT, Claude, Gemini)",
      "Automação de atendimento via WhatsApp",
      "Processamento e análise de documentos",
      "Geração de relatórios com IA",
      "Integração com n8n e Make",
      "RAG e bases de conhecimento personalizadas",
    ],
    useCases: [
      "Apoio ao atendimento",
      "Triagem e qualificação de leads",
      "Análise de dados e previsões",
      "Automação de processos internos",
    ],
    deliveryTime: "2 a 8 semanas",
    image: "bg-[#8E2DBA]",
    color: "text-[#8E2DBA]",
  },
  {
    id: "mobile",
    label: "Aplicativos Mobile",
    icon: Smartphone,
    tagline: "Aplicativos para iOS e Android",
    homeDescription:
      "Aplicativos iOS e Android integrados ao ecossistema digital da sua empresa.",
    description:
      "Desenvolvemos aplicativos nativos e híbridos para iOS e Android com interface consistente e as integrações necessárias ao projeto, como APIs, pagamentos e notificações.",
    highlights: [
      "React Native e Expo para iOS e Android",
      "Interface orientada à facilidade de uso",
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
    image: "bg-[#8E2DBA]",
    color: "text-[#67228A]",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    icon: ShoppingBag,
    tagline: "Operação de vendas pela internet",
    homeDescription:
      "Lojas virtuais com catálogo, pagamentos, estoque e gestão de pedidos.",
    description:
      "Criamos lojas virtuais com catálogo, meios de pagamento e recursos de operação definidos de acordo com o negócio. A entrega pode incluir gestão de estoque, pedidos, cupons e integrações.",
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
    image: "bg-[#8E2DBA]",
    color: "text-[#8E2DBA]",
  },
  {
    id: "apis",
    label: "APIs & Integrações",
    icon: Plug,
    tagline: "Integração entre sistemas e serviços",
    homeDescription:
      "APIs e integrações para reduzir lançamentos manuais e manter dados conectados.",
    description:
      "Desenvolvemos APIs RESTful e GraphQL documentadas, além de integrações com CRMs, ERPs, meios de pagamento, marketplaces e ferramentas de automação, conforme a documentação e a viabilidade de cada serviço.",
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
    image: "bg-[#8E2DBA]",
    color: "text-[#67228A]",
  },
];
