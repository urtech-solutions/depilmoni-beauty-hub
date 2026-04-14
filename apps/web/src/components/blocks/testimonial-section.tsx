import type { TestimonialSectionBlock as TestimonialSectionBlockProps } from "@depilmoni/core";
import { Card } from "@depilmoni/ui";

export const TestimonialSection = ({
  block
}: {
  block: TestimonialSectionBlockProps;
}) => (
  <section className="section-spacing">
    <div className="container space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
          Prova social
        </p>
        <h2 className="mt-3 font-display text-4xl">{block.title}</h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{block.subtitle}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {block.testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="glass-surface p-8">
            <p className="font-display text-3xl leading-snug text-foreground">
              “{testimonial.quote}”
            </p>
            <div className="mt-6">
              <p className="font-medium text-foreground">{testimonial.name}</p>
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                {testimonial.role}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
