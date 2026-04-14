import type { ProductCarouselBlock as ProductCarouselBlockProps } from "@depilmoni/core";
import { Button } from "@depilmoni/ui";
import Link from "next/link";

import { storefrontData } from "@/lib/storefront";

import { ProductCard } from "../commerce/product-card";

export const ProductCarousel = ({ block }: { block: ProductCarouselBlockProps }) => {
  const products =
    block.collection === "kits"
      ? storefrontData.kits()
      : block.collection === "featured"
        ? storefrontData.featuredProducts()
        : storefrontData.products();

  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
              Curadoria
            </p>
            <h2 className="mt-3 font-display text-4xl text-foreground">{block.title}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              {block.subtitle}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={block.collection === "kits" ? "/kits" : "/produtos"}>Ver catalogo</Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
