import type { CollectionConfig } from "payload";

import { isAdmin } from "../access";

export const Addresses: CollectionConfig = {
  slug: "addresses",
  admin: {
    useAsTitle: "label"
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as unknown as { role?: string; id?: string | number; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as unknown as { role?: string; id?: string | number; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    },
    delete: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as unknown as { role?: string; id?: string | number; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    }
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      index: true
    },
    { name: "label", type: "text", defaultValue: "Principal" },
    { name: "recipientName", type: "text", required: true },
    { name: "street", type: "text", required: true },
    { name: "number", type: "text", required: true },
    { name: "complement", type: "text" },
    { name: "neighborhood", type: "text", required: true },
    { name: "city", type: "text", required: true },
    { name: "state", type: "text", required: true },
    { name: "zipCode", type: "text", required: true },
    { name: "isDefault", type: "checkbox", defaultValue: false },
    { name: "latitude", type: "number" },
    { name: "longitude", type: "number" }
  ]
};
