import type { CollectionConfig } from "payload";

import { canManageContent, publicRead } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent
  },
  upload: true,
  fields: [
    {
      name: "alt",
      type: "text"
    }
  ]
};
