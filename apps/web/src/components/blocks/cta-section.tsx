import Link from "next/link";

import type { CTASectionBlock as CTASectionBlockProps } from "@depilmoni/core";
import { Button, Card } from "@depilmoni/ui";

export const CTASection = ({ block }: { block: CTASectionBlockProps }) => (
  <section className="section-spacing pt-8">
    <div className="container">
      <Card className="overflow-hidden bg-[linear-gradient(145deg,rgba(47,29,21,0.96),rgba(90,54,37,0.94))] p-10 text-white">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[rgba(201,157,84,0.82)]">
              Proximo passo
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-5xl leading-[0.94]">
              {block.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[rgba(255,250,245,0.78)]">
              {block.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link href={block.cta.href}>{block.cta.label}</Link>
            </Button>
            {block.secondaryCta ? (
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link href={block.secondaryCta.href}>{block.secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  </section>
);
