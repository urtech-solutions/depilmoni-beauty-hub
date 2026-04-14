import type { CollectionConfig } from "payload";

import { canManageContent, publicRead } from "../access";

export const Banners: CollectionConfig = {
  slug: "banners",
  admin: {
    useAsTitle: "title"
  },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent
  },
  fields: [
    { name: "eyebrow", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea", required: true },
    {
      name: "cta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true }
      ]
    },
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "active", type: "checkbox", defaultValue: true }
  ]
};
