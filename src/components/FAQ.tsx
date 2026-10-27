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
    <section className="ethos-section relative z-10 bg-background">
      <div className="ethos-container grid gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <span className="ethos-eyebrow">Dúvidas Frequentes</span>
          <h2 className="ethos-heading mb-6 mt-4">Como a Ethos trabalha</h2>
          <p className="ethos-copy">
            Respostas objetivas sobre prazos, suporte, segmentos atendidos e
            automações com IA.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8"
        >
          <Accordion
            type="single"
            collapsible
            defaultValue="1"
            className="w-full border-t border-border"
          >
            {faqItems.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border-b border-border bg-transparent px-1 py-2 transition-colors data-[state=open]:bg-secondary"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className="flex flex-1 items-center justify-between rounded-lg border border-primary bg-primary px-5 py-4 text-left text-white transition-colors hover:border-accent hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    data-testid={`faq-trigger-${faq.id}`}
                  >
                    <span className="flex items-center">
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-semibold leading-snug text-white">
                          {faq.question}
                        </span>
                        <span className="text-sm font-normal text-white">
                          {faq.sub}
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      size={18}
                      strokeWidth={2}
                      className="ml-4 shrink-0 text-white"
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
