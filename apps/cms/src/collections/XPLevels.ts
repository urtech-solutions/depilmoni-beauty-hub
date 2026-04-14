import type { CollectionConfig } from "payload";

import { canManageCommerce, publicRead } from "../access";

export const XPLevels: CollectionConfig = {
  slug: "xp-levels",
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
    { name: "level", type: "number", required: true },
    { name: "name", type: "text", required: true },
    { name: "minXP", type: "number", required: true },
    {
      name: "benefits",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }]
    }
  ]
};
