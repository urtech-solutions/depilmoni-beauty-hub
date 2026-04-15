"use client";

import type { ProductCarouselBlock as ProductCarouselBlockProps } from "@depilmoni/core";
import { Button } from "@depilmoni/ui";
import Link from "next/link";

import { Animated, StaggerContainer, StaggerItem } from "@/components/animations/animated";
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
    <section className="py-16">
      <div className="container">
        <Animated className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">{block.title}</h2>
            <p className="mt-1 text-muted-foreground">{block.subtitle}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={block.collection === "kits" ? "/kits" : "/produtos"}>Ver todos</Link>
          </Button>
        </Animated>

        <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {products.slice(0, 4).map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
