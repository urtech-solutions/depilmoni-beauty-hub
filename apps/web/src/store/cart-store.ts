"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProductCartItem = {
  id: string;
  type: "product";
  title: string;
  slug: string;
  image: string;
  quantity: number;
  unitPrice: number;
  meta: {
    productId: string;
    variantId: string;
    variantName: string;
  };
};

type EventTicketCartItem = {
  id: string;
  type: "event-ticket";
  title: string;
  slug: string;
  image: string;
  quantity: number;
  unitPrice: number;
  meta: {
    eventId: string;
    batchId: string;
    batchName: string;
  };
};

export type CartItem = ProductCartItem | EventTicketCartItem;

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((candidate) => candidate.id === item.id);

          if (!existing) {
            return {
              items: [...state.items, item]
            };
          }

          return {
            items: state.items.map((candidate) =>
              candidate.id === item.id
                ? { ...candidate, quantity: candidate.quantity + item.quantity }
                : candidate
            )
          };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        })),
      clear: () => set({ items: [] })
    }),
    {
      name: "depilmoni-cart"
    }
  )
);

export const cartSubtotal = (items: CartItem[]) =>
  Number(items.reduce((total, item) => total + item.unitPrice * item.quantity, 0).toFixed(2));
