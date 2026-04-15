import type { CollectionConfig } from "payload";

import { isAdmin } from "../access";

export const Notifications: CollectionConfig = {
  slug: "notifications",
  admin: {
    useAsTitle: "title"
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as { role?: string; id?: string; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    },
    create: isAdmin,
    update: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as { role?: string; id?: string; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    },
    delete: isAdmin
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      index: true
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Status do pedido", value: "order-status" },
        { label: "Promocao", value: "promotion" },
        { label: "Cupom", value: "coupon" },
        { label: "XP ganho", value: "xp-earned" },
        { label: "Subiu de nivel", value: "level-up" },
        { label: "Distribuidor aprovado", value: "distributor-approved" },
        { label: "Distribuidor rejeitado", value: "distributor-rejected" },
        { label: "Lembrete de evento", value: "event-reminder" },
        { label: "Sistema", value: "system" }
      ]
    },
    { name: "title", type: "text", required: true },
    { name: "message", type: "text", required: true },
    { name: "href", type: "text" },
    { name: "read", type: "checkbox", defaultValue: false }
  ]
};
