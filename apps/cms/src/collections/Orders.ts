import type { CollectionConfig } from "payload";

import { canManageCommerce } from "../access";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "code"
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as unknown as { role?: string; id?: string | number; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    },
    create: ({ req }) => Boolean(req.user),
    update: canManageCommerce,
    delete: canManageCommerce
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      index: true
    },
    { name: "code", type: "text", required: true, unique: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pendente", value: "pending" },
        { label: "Aguardando pagamento", value: "awaiting-payment" },
        { label: "Pago", value: "paid" },
        { label: "Processando", value: "processing" },
        { label: "Enviado", value: "shipped" },
        { label: "Entregue", value: "delivered" },
        { label: "Cancelado", value: "cancelled" },
        { label: "Reembolsado", value: "refunded" }
      ]
    },
    { name: "items", type: "json", required: true },
    { name: "subtotal", type: "number", required: true },
    { name: "profileDiscount", type: "number", defaultValue: 0 },
    { name: "fidelityDiscount", type: "number", defaultValue: 0 },
    { name: "promotionDiscount", type: "number", defaultValue: 0 },
    { name: "couponDiscount", type: "number", defaultValue: 0 },
    { name: "couponCode", type: "text" },
    { name: "shippingAmount", type: "number", defaultValue: 0 },
    {
      name: "shippingAddress",
      type: "relationship",
      relationTo: "addresses"
    },
    { name: "total", type: "number", required: true },
    {
      name: "paymentMethod",
      type: "select",
      options: [
        { label: "Cartao de credito", value: "credit-card" },
        { label: "PIX", value: "pix" }
      ]
    },
    { name: "paymentExternalId", type: "text" },
    { name: "xpEarned", type: "number", defaultValue: 0 },
    { name: "trackingCode", type: "text" },
    { name: "trackingUrl", type: "text" },
    { name: "shippedAt", type: "date" },
    { name: "deliveredAt", type: "date" }
  ]
};
