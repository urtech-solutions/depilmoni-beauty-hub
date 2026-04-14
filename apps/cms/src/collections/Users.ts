import type { CollectionConfig } from "payload";

import { isAdmin, isAuthenticated } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email"
  },
  access: {
    read: isAuthenticated,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin
  },
  fields: [
    {
      name: "name",
      type: "text"
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "content-editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Gerente", value: "manager" },
        { label: "Editor de Conteudo", value: "content-editor" },
        { label: "Cliente autenticado", value: "authenticated-customer" }
      ]
    }
  ]
};
