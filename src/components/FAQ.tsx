import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { faqItems } from "@/data/faq";

export default function FAQ() {
  return (
    <section className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-[#8E2DBA] font-semibold tracking-wider uppercase text-sm">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Como a Ethos trabalha
          </h2>
          <p className="text-muted-foreground text-lg">
            Respostas objetivas sobre prazos, suporte, segmentos atendidos e automações com IA.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible defaultValue="1" className="w-full space-y-1">
            {faqItems.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-[#8E2DBA]/15 rounded-md bg-card px-1 py-1 data-[state=open]:border-[#8E2DBA]/40 data-[state=open]:bg-[#8E2DBA]/5 transition-colors"
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className="flex flex-1 items-center justify-between px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                      data-testid={`faq-trigger-${faq.id}`}
                    >
                      <span className="flex items-center">
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
                        className="ml-4 shrink-0 text-[#8E2DBA]/60"
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>

                  <AccordionContent className="px-5 pb-5 pt-0 text-muted-foreground leading-relaxed text-[15px]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
