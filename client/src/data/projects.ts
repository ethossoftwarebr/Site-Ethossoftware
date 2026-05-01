import projContacnet from "@/assets/screenshots/screenshot-1772062900110.png?w=800;1600&format=avif;webp;png&as=picture";
import projDaniel from "@/assets/screenshots/screenshot-1772070012436.png?w=800;1600&format=avif;webp;png&as=picture";
import projI9Contabilidade from "@/assets/screenshots/screenshot-1772126106981.png?w=800;1600&format=avif;webp;png&as=picture";
import projMariaLaura from "@/assets/screenshots/screenshot-1772123490789.png?w=800;1600&format=avif;webp;png&as=picture";
import projOfficeChagas from "@/assets/screenshots/WhatsApp_Image_2026-03-04_at_23.56.18_1772679540241.jpeg?w=800;1600&format=avif;webp;jpg&as=picture";
import projEspetoShow from "@/assets/screenshots/image_1772679778021.png?w=800;1600&format=avif;webp;png&as=picture";
import projAutomacaoChatbot from "@/assets/images/chatbot-ui.png?w=800;1600&format=avif;webp;png&as=picture";
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
    description: "Plataforma web moderna para escritório de contabilidade com foco em inteligência tributária, apresentando design corporativo e navegação intuitiva para atração de novos clientes empresariais.",
    image: projContacnet,
    tags: ["React", "Tailwind CSS", "SEO Otimizado"]
  },
  {
    title: "Daniel Assunção Advogados",
    category: "Portal Jurídico",
    description: "Site completo para escritório de advocacia especializado em concursos e servidores públicos. Design sóbrio e profissional com área de artigos e captação de leads jurídicos.",
    image: projDaniel,
    tags: ["UI/UX", "Conversão", "WordPress"]
  },
  {
    title: "I9 Contabilidade",
    category: "Site Institucional",
    description: "Plataforma contábil digital inteligente e consultiva. Layout corporativo moderno focado em conversão B2B, com apresentação clara de soluções para abertura de empresas e migração contábil.",
    image: projI9Contabilidade,
    tags: ["Contabilidade Digital", "Foco em B2B", "Alta Conversão"]
  },
  {
    title: "Dra. Maria Laura Odontologia",
    category: "Site Profissional",
    description: "Portal focado em excelência odontológica e estética do sorriso. Design elegante que reflete o cuidado premium, com agendamento direto e apresentação de tratamentos modernos.",
    image: projMariaLaura,
    tags: ["Estética", "Design Premium", "Branding"]
  },
  {
    title: "Office Chagas Dashboard",
    category: "CRM & Automação",
    description: "Painel administrativo de gestão completa com controle de agendamentos, métricas de atendimento em tempo real e administração de múltiplas empresas parceiras. Focado em escalabilidade.",
    image: projOfficeChagas,
    tags: ["Dashboard SaaS", "Métricas", "Gestão B2B"]
  },
  {
    title: "Espeto Show - Gestão de Bares",
    category: "Sistema de Gestão",
    description: "Plataforma completa para gestão de bares e restaurantes. Inclui mapa de mesas em tempo real, controle de pedidos no balcão e integração com PDV, melhorando a agilidade do atendimento.",
    image: projEspetoShow,
    tags: ["Gestão", "PDV", "Tempo Real"]
  },
  {
    title: "Automação com IA & Chatbot",
    category: "Automação com IA",
    description: "Solução de atendimento inteligente com chatbot treinado para o negócio do cliente, integrado ao WhatsApp e outros canais. Reduz tempo de resposta e aumenta conversões 24/7.",
    image: projAutomacaoChatbot,
    tags: ["IA", "Chatbot", "WhatsApp"]
  }
];

export const categories = ["Todos", "Site Institucional", "Site Profissional", "Portal Jurídico", "CRM & Automação", "Sistema de Gestão", "Automação com IA"];
