import type { CollectionConfig } from "payload";

import { canManageCommerce } from "../access";

export const XPTransactions: CollectionConfig = {
  slug: "xp-transactions",
  admin: {
    useAsTitle: "source"
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as unknown as { role?: string; id?: string | number; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    },
    create: canManageCommerce,
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
    { name: "amount", type: "number", required: true },
    {
      name: "source",
      type: "select",
      required: true,
      options: [
        { label: "Pedido pago", value: "order-paid" },
        { label: "Ticket de evento", value: "event-ticket" },
        { label: "Ajuste manual", value: "manual-adjustment" }
      ]
    },
    { name: "referenceId", type: "text" },
    { name: "description", type: "text" }
  ]
};
