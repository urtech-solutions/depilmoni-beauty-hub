import type { RichContentSectionBlock as RichContentSectionBlockProps } from "@depilmoni/core";
import { Card } from "@depilmoni/ui";

export const RichContentSection = ({
  block
}: {
  block: RichContentSectionBlockProps;
}) => (
  <section className="section-spacing">
    <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <Card className="space-y-5 p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
          Conteudo montavel
        </p>
        <h2 className="font-display text-4xl">{block.title}</h2>
        {block.content.map((paragraph) => (
          <p key={paragraph} className="text-base leading-8 text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </Card>

      <div className="grid gap-5">
        {block.metrics.map((metric) => (
          <Card key={metric.label} className="p-7">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-3 font-display text-5xl text-gradient-metallic">{metric.value}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
