"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button, Card } from "@depilmoni/ui";

import { cartSubtotal, useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";

export const CartExperience = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = cartSubtotal(items);

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
          Carrinho vazio
        </p>
        <h2 className="mt-3 font-display text-4xl">Sua selecao ainda esta em branco.</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Explore produtos, kits e eventos para iniciar o fluxo de compra.
        </p>
        <Button asChild variant="hero" size="lg" className="mt-6">
          <Link href="/produtos">Explorar catalogo</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col gap-5 p-5 md:flex-row">
            <div className="relative h-28 overflow-hidden rounded-[22px] md:w-36">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-copper)]">
                {item.type === "product" ? "produto" : "ticket de evento"}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.type === "product" ? item.meta.variantName : item.meta.batchName}
              </p>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 md:items-end">
              <p className="text-xl font-semibold text-foreground">{formatCurrency(item.unitPrice)}</p>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-border/70 p-2"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  className="rounded-full border border-border/70 p-2"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
                <button
                  className="ml-2 rounded-full border border-border/70 p-2 text-[var(--color-accent-copper)]"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="h-fit space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-copper)]">
            Resumo
          </p>
          <h2 className="mt-3 font-display text-3xl">Seu pedido</h2>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Subtotal parcial</span>
            <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Frete</span>
            <span>A calcular no checkout</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Parcelamento</span>
            <span>Simulacao via Mercado Pago</span>
          </div>
        </div>

        <Button asChild variant="hero" size="lg" className="w-full">
          <Link href="/checkout">Ir para checkout</Link>
        </Button>
      </Card>
    </div>
  );
};
