import type { CollectionConfig } from "payload";

import { canManageCommerce, publicRead } from "../access";

export const Coupons: CollectionConfig = {
  slug: "coupons",
  admin: {
    useAsTitle: "code"
  },
  access: {
    read: publicRead,
    create: canManageCommerce,
    update: canManageCommerce,
    delete: canManageCommerce
  },
  fields: [
    { name: "code", type: "text", required: true, unique: true },
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
    { name: "minPurchase", type: "number" },
    { name: "startsAt", type: "date", required: true },
    { name: "endsAt", type: "date", required: true },
    { name: "active", type: "checkbox", defaultValue: true },
    { name: "maxUses", type: "number" },
    { name: "currentUses", type: "number", defaultValue: 0 },
    {
      name: "eligibleProfiles",
      type: "select",
      hasMany: true,
      options: [
        { label: "Cliente", value: "client" },
        { label: "Parceiro", value: "partner" },
        { label: "Distribuidor", value: "distributor" }
      ]
    },
    {
      name: "eligibleTags",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }]
    }
  ]
};
