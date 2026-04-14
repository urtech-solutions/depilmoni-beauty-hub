"use client";

import { useMemo, useState } from "react";

import type { ProductViewModel } from "@depilmoni/core";
import { Badge, Button, Card } from "@depilmoni/ui";

import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

export const ProductPurchaseCard = ({ product }: { product: ProductViewModel }) => {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);
  const addItem = useCartStore((state) => state.addItem);
  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0],
    [product.variants, selectedVariantId]
  );

  if (!selectedVariant) {
    return null;
  }

  return (
    <Card className="sticky top-24 space-y-5">
      <div>
        <Badge variant="accent">Compra segura</Badge>
        <h2 className="mt-3 font-display text-3xl">{product.name}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Variantes</p>
        <div className="grid gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariantId(variant.id)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                variant.id === selectedVariant.id
                  ? "border-[var(--color-accent-copper)] bg-[rgba(167,114,74,0.08)]"
                  : "border-border/70 bg-background/70"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{variant.name}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    SKU {variant.sku}
                  </p>
                </div>
                <p className="font-semibold text-foreground">{formatCurrency(variant.basePrice)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[rgba(201,157,84,0.1)] p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Preco base</p>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          {formatCurrency(selectedVariant.basePrice)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Regras de perfil, fidelidade, promocao e cupom sao recalculadas no checkout mockado.
        </p>
      </div>

      <Button
        variant="hero"
        size="lg"
        className="w-full"
        onClick={() => {
          addItem({
            id: `product:${product.id}:${selectedVariant.id}`,
            type: "product",
            title: `${product.name} • ${selectedVariant.name}`,
            slug: product.slug,
            image: product.media[0],
            quantity: 1,
            unitPrice: selectedVariant.basePrice,
            meta: {
              productId: product.id,
              variantId: selectedVariant.id,
              variantName: selectedVariant.name
            }
          });
          toast.success("Produto adicionado ao carrinho");
        }}
      >
        Adicionar ao carrinho
      </Button>
    </Card>
  );
};
