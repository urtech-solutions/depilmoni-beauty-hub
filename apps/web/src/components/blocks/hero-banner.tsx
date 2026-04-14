import Image from "next/image";
import Link from "next/link";

import type { HeroBannerBlock as HeroBannerBlockProps } from "@depilmoni/core";
import { Badge, Button } from "@depilmoni/ui";

export const HeroBanner = ({ block }: { block: HeroBannerBlockProps }) => (
  <section className="section-spacing pt-10">
    <div className="container">
      <div className="grid gap-8 overflow-hidden rounded-[36px] border border-border/70 bg-[rgba(255,250,245,0.7)] p-6 shadow-[0_34px_90px_-50px_rgba(84,46,28,0.45)] md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative z-10 space-y-6">
          <Badge variant="accent">{block.eyebrow}</Badge>
          <div className="space-y-4">
            <h1 className="max-w-xl font-display text-5xl leading-[0.92] text-foreground md:text-6xl">
              {block.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
              {block.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link href={block.cta.href}>{block.cta.label}</Link>
            </Button>
            {block.secondaryCta ? (
              <Button asChild variant="outline" size="lg">
                <Link href={block.secondaryCta.href}>{block.secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {block.ambienceNotes.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[rgba(167,114,74,0.18)] bg-[rgba(255,250,245,0.72)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[28px]">
          <div className="absolute inset-0 animate-glow bg-[radial-gradient(circle_at_20%_10%,rgba(201,157,84,0.28),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(167,114,74,0.28),transparent_26%)]" />
          <Image
            src={block.image}
            alt={block.title}
            fill
            priority
            className="rounded-[28px] object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(47,29,21,0.65),rgba(47,29,21,0.08)_45%,rgba(47,29,21,0.55))]" />
        </div>
      </div>
    </div>
  </section>
);
