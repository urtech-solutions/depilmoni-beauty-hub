import type { FAQSectionBlock as FAQSectionBlockProps } from "@depilmoni/core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card
} from "@depilmoni/ui";

export const FAQSection = ({ block }: { block: FAQSectionBlockProps }) => (
  <section className="section-spacing">
    <div className="container">
      <Card className="p-8 md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-4xl">{block.title}</h2>
        </div>

        <Accordion type="single" collapsible className="mt-8">
          {block.items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  </section>
);
