import type { CollectionConfig } from "payload";

import { canManageCommerce } from "../access";

export const DistributorRequests: CollectionConfig = {
  slug: "distributor-requests",
  admin: {
    useAsTitle: "companyName"
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as { role?: string; id?: string; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { customer: { equals: user.id } };
      return false;
    },
    create: ({ req }) => Boolean(req.user),
    update: canManageCommerce,
    delete: canManageCommerce
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      index: true
    },
    { name: "responsibleName", type: "text", required: true },
    { name: "companyName", type: "text", required: true },
    { name: "tradeName", type: "text", required: true },
    { name: "cnpj", type: "text", required: true },
    { name: "stateRegistration", type: "text" },
    { name: "phone", type: "text", required: true },
    {
      name: "commercialAddress",
      type: "group",
      fields: [
        { name: "street", type: "text", required: true },
        { name: "number", type: "text" },
        { name: "neighborhood", type: "text" },
        { name: "city", type: "text", required: true },
        { name: "state", type: "text", required: true },
        { name: "zipCode", type: "text", required: true }
      ]
    },
    { name: "website", type: "text" },
    { name: "socialMedia", type: "text" },
    { name: "observations", type: "textarea" },
    {
      name: "documents",
      type: "array",
      fields: [
        { name: "file", type: "upload", relationTo: "media", required: true }
      ]
    },
    { name: "termsAccepted", type: "checkbox", required: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending_review",
      options: [
        { label: "Pendente de analise", value: "pending_review" },
        { label: "Aprovado", value: "approved" },
        { label: "Rejeitado", value: "rejected" }
      ]
    },
    {
      name: "reviewedBy",
      type: "relationship",
      relationTo: "users"
    },
    { name: "reviewedAt", type: "date" },
    { name: "reviewNotes", type: "textarea" }
  ]
};
