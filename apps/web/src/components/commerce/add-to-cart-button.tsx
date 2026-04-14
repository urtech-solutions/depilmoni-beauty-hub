"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@depilmoni/ui";

import { useCartStore, type CartItem } from "@/store/cart-store";

export const AddToCartButton = ({
  item,
  label = "Adicionar ao carrinho",
  className
}: {
  item: CartItem;
  label?: string;
  className?: string;
}) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      className={className}
      onClick={() => {
        addItem(item);
        toast.success(`${item.title} adicionado ao carrinho`);
      }}
    >
      <ShoppingBag size={16} />
      {label}
    </Button>
  );
};
