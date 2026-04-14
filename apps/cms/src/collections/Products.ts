import type { CollectionConfig } from "payload";

import { canManageCommerce, publicRead } from "../access";

export const Products: CollectionConfig = {
  slug: "products",
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
    { name: "description", type: "textarea", required: true },
    { name: "shortDescription", type: "textarea", required: true },
    { name: "category", type: "text", required: true },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "isKit", type: "checkbox", defaultValue: false },
    {
      name: "variants",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "sku", type: "text", required: true },
        { name: "basePrice", type: "number", required: true },
        { name: "partnerPrice", type: "number" },
        { name: "distributorPrice", type: "number" },
        { name: "stock", type: "number", required: true }
      ]
    }
  ]
};
