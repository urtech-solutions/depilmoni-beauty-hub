import type { CollectionConfig } from "payload";

import { canManageCommerce, publicRead } from "../access";

export const Promotions: CollectionConfig = {
  slug: "promotions",
  admin: {
    useAsTitle: "name"
  },
  access: {
    read: publicRead,
    create: canManageCommerce,
    update: canManageCommerce,
    delete: canManageCommerce
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "scope",
      type: "select",
      required: true,
      options: [
        { label: "Produto", value: "product" },
        { label: "Categoria", value: "category" },
        { label: "Pedido", value: "order" },
        { label: "Evento", value: "event" }
      ]
    },
    {
      name: "discountType",
      type: "select",
      required: true,
      options: [
        { label: "Percentual", value: "percentage" },
        { label: "Valor fixo", value: "fixed" }
      ]
    },
    { name: "value", type: "number", required: true },
    { name: "startsAt", type: "date", required: true },
    { name: "endsAt", type: "date", required: true },
    { name: "active", type: "checkbox", defaultValue: true }
  ]
};
