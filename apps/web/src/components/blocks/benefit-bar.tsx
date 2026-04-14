import type { BenefitBarBlock as BenefitBarBlockProps } from "@depilmoni/core";
import { Card } from "@depilmoni/ui";

export const BenefitBar = ({ block }: { block: BenefitBarBlockProps }) => (
  <section className="pb-6">
    <div className="container">
      <div className="grid gap-4 md:grid-cols-3">
        {block.items.map((item) => (
          <Card key={item.title} className="glass-surface p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-copper)]">
              Depilmoni Stack
            </p>
            <h2 className="mt-3 font-display text-2xl text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
