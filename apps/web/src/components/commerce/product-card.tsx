import Image from "next/image";
import Link from "next/link";

import type { ProductViewModel } from "@depilmoni/core";
import { Badge, Card } from "@depilmoni/ui";

import { formatCurrency } from "@/lib/format";

import { AddToCartButton } from "./add-to-cart-button";

export const ProductCard = ({
  product,
  showAction = true
}: {
  product: ProductViewModel;
  showAction?: boolean;
}) => {
  const defaultVariant = product.variants[0];

  return (
    <Card className="group overflow-hidden p-0">
      <Link href={`/produtos/${product.slug}`} className="block">
        <div className="relative aspect-[4/4.6] overflow-hidden bg-[rgba(201,157,84,0.08)]">
          <Image
            src={product.media[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4">
            <Badge variant={product.isKit ? "accent" : "copper"}>
              {product.isKit ? "kit curated" : product.category}
            </Badge>
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-copper)]">
            Depilmoni Collection
          </p>
          <Link href={`/produtos/${product.slug}`}>
            <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              a partir de
            </p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {formatCurrency(product.lowestPrice)}
            </p>
          </div>

          {showAction ? (
            <AddToCartButton
              item={{
                id: `product:${product.id}:${defaultVariant.id}`,
                type: "product",
                title: product.name,
                slug: product.slug,
                image: product.media[0],
                quantity: 1,
                unitPrice: defaultVariant.basePrice,
                meta: {
                  productId: product.id,
                  variantId: defaultVariant.id,
                  variantName: defaultVariant.name
                }
              }}
              label="Comprar"
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
};
