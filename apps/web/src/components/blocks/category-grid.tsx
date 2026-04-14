import Image from "next/image";
import Link from "next/link";

import type { CategoryGridBlock as CategoryGridBlockProps } from "@depilmoni/core";
import { Card } from "@depilmoni/ui";

export const CategoryGrid = ({ block }: { block: CategoryGridBlockProps }) => (
  <section className="section-spacing pt-4">
    <div className="container space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
          Vitrines
        </p>
        <h2 className="mt-3 font-display text-4xl">{block.title}</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          {block.subtitle}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {block.items.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="group relative overflow-hidden p-0">
              <div className="relative min-h-[280px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(47,29,21,0.15),rgba(47,29,21,0.75))]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.28em] text-[rgba(255,241,220,0.84)]">
                    Categoria
                  </p>
                  <h3 className="mt-3 font-display text-4xl leading-none">{item.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[rgba(255,250,245,0.84)]">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
