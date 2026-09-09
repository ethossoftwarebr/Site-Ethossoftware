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
  {
    title: "Daniel Assunção Advogados",
    category: "Portal Jurídico",
    description: "Site para escritório de advocacia especializado em concursos e servidores públicos, com apresentação das áreas de atuação, artigos e canais de contato.",
    image: projDaniel,
    tags: ["UI/UX", "Conteúdo jurídico", "WordPress"]
  },
  {
    title: "I9 Contabilidade",
    category: "Site Institucional",
    description: "Site institucional para contabilidade digital, com conteúdo voltado a empresas e apresentação dos serviços de abertura e migração contábil.",
    image: projI9Contabilidade,
    tags: ["Contabilidade Digital", "B2B", "Estrutura comercial"]
  },
  {
    title: "Dra. Maria Laura Odontologia",
    category: "Site Profissional",
    description: "Site profissional para clínica odontológica, com apresentação de tratamentos, informações da especialista e acesso direto ao agendamento.",
    image: projMariaLaura,
    tags: ["Odontologia", "Identidade visual", "Agendamento"]
  },
  {
    title: "Office Chagas Dashboard",
    category: "CRM & Automação",
    description: "Painel administrativo para controle de agendamentos, acompanhamento de atendimentos e gestão de empresas parceiras em uma única interface.",
    image: projOfficeChagas,
    tags: ["Dashboard SaaS", "Métricas", "Gestão B2B"]
  },
  {
    title: "Espeto Show - Gestão de Bares",
    category: "Sistema de Gestão",
    description: "Sistema para bares e restaurantes com mapa de mesas, controle de pedidos no balcão e integração com o ponto de venda.",
    image: projEspetoShow,
    tags: ["Gestão", "PDV", "Tempo Real"]
  },
  {
    title: "Automação com IA & Chatbot",
    category: "Automação com IA",
    description: "Automação de atendimento com base de conhecimento do cliente e integração com WhatsApp e outros canais definidos no projeto.",
    image: projAutomacaoChatbot,
    tags: ["IA", "Chatbot", "WhatsApp"]
  }
];

export const categories = ["Todos", "Site Institucional", "Site Profissional", "Portal Jurídico", "CRM & Automação", "Sistema de Gestão", "Automação com IA"];
