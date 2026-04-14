import type { CollectionConfig } from "payload";

import { canManageCommerce, publicRead } from "../access";

export const FidelityTags: CollectionConfig = {
  slug: "fidelity-tags",
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
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "applicableProfiles",
      type: "select",
      hasMany: true,
      options: [
        { label: "Cliente", value: "client" },
        { label: "Parceiro", value: "partner" },
        { label: "Distribuidor", value: "distributor" }
      ]
    },
    {
      name: "allowDistributorStacking",
      type: "checkbox",
      defaultValue: false
    },
    {
      name: "benefits",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "type",
          type: "select",
          options: [
            { label: "Percentual", value: "percentage" },
            { label: "Frete", value: "free-shipping" },
            { label: "Acesso prioritario", value: "priority-access" },
            { label: "Brinde", value: "gift" }
          ]
        },
        { name: "value", type: "number" }
      ]
    }
  ]
};
