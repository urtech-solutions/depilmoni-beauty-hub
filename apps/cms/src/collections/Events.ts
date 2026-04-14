import type { CollectionConfig } from "payload";

import { canManageCommerce, publicRead } from "../access";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title"
  },
  access: {
    read: publicRead,
    create: canManageCommerce,
    update: canManageCommerce,
    delete: canManageCommerce
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "summary", type: "textarea", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "startsAt", type: "date", required: true },
    { name: "endsAt", type: "date", required: true },
    { name: "location", type: "text", required: true },
    { name: "instructor", type: "text", required: true },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "batches",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "price", type: "number", required: true },
        { name: "quantity", type: "number", required: true },
        { name: "sold", type: "number", defaultValue: 0 },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Agendado", value: "scheduled" },
            { label: "Ativo", value: "active" },
            { label: "Esgotado", value: "sold-out" }
          ],
          defaultValue: "scheduled"
        }
      ]
    }
  ]
};
