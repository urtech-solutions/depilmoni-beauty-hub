import type { CollectionConfig } from "payload";

import { canManageContent, publicRead } from "../access";

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
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
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "excerpt", type: "textarea", required: true },
    {
      name: "content",
      type: "array",
      fields: [{ name: "paragraph", type: "textarea", required: true }]
    },
    { name: "coverImage", type: "upload", relationTo: "media" },
    { name: "publishedAt", type: "date", required: true }
  ]
};
