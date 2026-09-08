export const faqItems = [
  {
    id: "1",
    icon: "clock",
    question: "Quanto tempo demora para um site ou sistema ficar pronto?",
    sub: "Prazos transparentes desde o início do projeto",
    answer:
      "Um site institucional ou Landing Page de alta conversão costuma ser entregue entre 7 a 10 dias. Para sistemas mais robustos e personalizados, o prazo é ajustado de acordo com a complexidade do projeto. Sempre estabelecemos um cronograma transparente no início.",
  },
  {
    id: "2",
    icon: "headphones",
    question: "Vocês dão suporte e manutenção após a entrega?",
    sub: "Manutenção, hospedagem e suporte técnico inclusos",
    answer:
      "Sim! A Ethos oferece planos mensais de manutenção e hospedagem. Assim, garantimos que seu sistema fique sempre no ar, seguro, atualizado e funcionando perfeitamente, com suporte técnico à sua disposição.",
  },
  {
    id: "3",
    icon: "building",
    question: "A Ethos atende o meu segmento de negócio?",
    sub: "Soluções para os mais variados nichos e setores",
    answer:
      "Nós criamos soluções para os mais diversos nichos: contabilidades, escritórios de advocacia, clínicas de estética, consultórios odontológicos, oficinas, lojas de roupas, gestão de bares e restaurantes, entre muitos outros. Se há um problema no dia a dia da sua empresa, nós desenvolvemos o software para resolver.",
  },
  {
    id: "4",
    icon: "bot",
    question: "Como funciona o desenvolvimento das Automações com IA?",
    sub: "IA personalizada trabalhando 24/7 para o seu negócio",
    answer:
      "Nós criamos automações totalmente sob medida para a necessidade que você enfrenta. Mapeamos os gargalos do seu atendimento ou processos internos e implementamos uma IA que trabalha 24/7 de forma personalizada para a sua empresa.",
  },
] as const;

export type FaqIcon = (typeof faqItems)[number]["icon"];
