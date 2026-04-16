import type { CollectionConfig } from "payload";

import { canManageCommerce } from "../access";

export const InventoryMovements: CollectionConfig = {
  slug: "inventory-movements",
  admin: {
    useAsTitle: "sku",
    defaultColumns: ["sku", "type", "quantity", "previousStock", "newStock", "createdAt"],
    listSearchableFields: ["sku", "type", "changedBy", "note"]
  },
  access: {
    read: canManageCommerce,
    create: canManageCommerce,
    update: canManageCommerce,
    delete: canManageCommerce
  },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products"
    },
    { name: "sku", type: "text", required: true },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Venda", value: "sale" },
        { label: "Devolucao", value: "return" },
        { label: "Ajuste", value: "adjustment" },
        { label: "Reposicao", value: "restock" },
        { label: "Reserva", value: "reservation" },
        { label: "Cancelamento de reserva", value: "reservation-cancel" }
      ]
    },
    { name: "quantity", type: "number", required: true },
    { name: "previousStock", type: "number" },
    { name: "newStock", type: "number" },
    {
      name: "order",
      type: "relationship",
      relationTo: "orders"
    },
    { name: "changedBy", type: "text" },
    { name: "note", type: "text" }
  ]
};
