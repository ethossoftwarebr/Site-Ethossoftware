import { motion } from "framer-motion";
import { Clock, Headphones, Building2, Bot, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

const faqs = [
  {
    id: "1",
    icon: Clock,
    question: "Quanto tempo demora para um site ou sistema ficar pronto?",
    sub: "Prazos transparentes desde o início do projeto",
    answer:
      "Um site institucional ou Landing Page de alta conversão costuma ser entregue entre 7 a 10 dias. Para sistemas mais robustos e personalizados, o prazo é ajustado de acordo com a complexidade do projeto. Sempre estabelecemos um cronograma transparente no início.",
  },
  {
    id: "2",
    icon: Headphones,
    question: "Vocês dão suporte e manutenção após a entrega?",
    sub: "Manutenção, hospedagem e suporte técnico inclusos",
    answer:
      "Sim! A Ethos oferece planos mensais de manutenção e hospedagem. Assim, garantimos que seu sistema fique sempre no ar, seguro, atualizado e funcionando perfeitamente, com suporte técnico à sua disposição.",
  },
  {
    id: "3",
    icon: Building2,
    question: "A Ethos atende o meu segmento de negócio?",
    sub: "Soluções para os mais variados nichos e setores",
    answer:
      "Nós criamos soluções para os mais diversos nichos: contabilidades, escritórios de advocacia, clínicas de estética, consultórios odontológicos, oficinas, lojas de roupas, gestão de bares e restaurantes, entre muitos outros. Se há um problema no dia a dia da sua empresa, nós desenvolvemos o software para resolver.",
  },
  {
    id: "4",
    icon: Bot,
    question: "Como funciona o desenvolvimento das Automações com IA?",
    sub: "IA personalizada trabalhando 24/7 para o seu negócio",
    answer:
      "Nós criamos automações totalmente sob medida para a necessidade que você enfrenta. Mapeamos os gargalos do seu atendimento ou processos internos e implementamos uma IA que trabalha 24/7 de forma personalizada para a sua empresa.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-[#A229F2] font-semibold tracking-wider uppercase text-sm">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Tudo o que você precisa saber
          </h2>
          <p className="text-muted-foreground text-lg">
            Reunimos as principais dúvidas de nossos clientes para ajudar você a entender melhor como a Ethos Software trabalha.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible defaultValue="1" className="w-full space-y-1">
            {faqs.map((faq) => {
              const Icon = faq.icon;
              return (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-[#A229F2]/15 rounded-xl bg-card px-1 py-1 data-[state=open]:border-[#A229F2]/40 data-[state=open]:bg-[#A229F2]/5 transition-colors"
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className="flex flex-1 items-center justify-between px-5 py-4 text-left transition-all [&[data-state=open]>svg]:rotate-180 focus:outline-none"
                      data-testid={`faq-trigger-${faq.id}`}
                    >
                      <span className="flex items-center gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#A229F2]/20 bg-[#A229F2]/8 text-[#A229F2]">
                          <Icon size={18} strokeWidth={1.8} />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground text-[15px] leading-snug">
                            {faq.question}
                          </span>
                          <span className="text-sm font-normal text-muted-foreground">
                            {faq.sub}
                          </span>
                        </span>
                      </span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2}
                        className="ml-4 shrink-0 text-[#A229F2]/60 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>

                  <AccordionContent className="ps-20 pe-6 pb-5 pt-0 text-muted-foreground leading-relaxed text-[15px]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
