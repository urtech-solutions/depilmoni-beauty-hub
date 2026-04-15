import type { CollectionConfig } from "payload";

import { isAdmin, isManager, publicRead } from "../access";

export const Customers: CollectionConfig = {
  slug: "customers",
  auth: true,
  admin: {
    useAsTitle: "name"
  },
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const customerId = String(id);
        const payload = req.payload;
        const relatedCollections = [
          "notifications",
          "xp-transactions",
          "distributor-requests",
          "orders",
          "addresses"
        ] as const;

        for (const collection of relatedCollections) {
          const result = await payload.find({
            collection,
            where: {
              customer: {
                equals: customerId
              }
            },
            limit: 200,
            overrideAccess: true
          });

          for (const doc of result.docs) {
            await payload.delete({
              collection,
              id: doc.id,
              overrideAccess: true
            });
          }
        }
      }
    ]
  },
  access: {
    read: publicRead,
    create: () => true,
    update: ({ req }) => {
      if (!req.user) return false;
      const user = req.user as unknown as { role?: string; id?: string | number; collection?: string };
      if (user.role && ["admin", "manager"].includes(user.role)) return true;
      if (user.collection === "customers") return { id: { equals: user.id } };
      return false;
    },
    delete: isAdmin
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "phone", type: "text" },
    { name: "cpf", type: "text" },
    { name: "avatar", type: "upload", relationTo: "media" },
    {
      name: "profileType",
      type: "select",
      required: true,
      defaultValue: "client",
      options: [
        { label: "Cliente", value: "client" },
        { label: "Parceiro", value: "partner" },
        { label: "Distribuidor", value: "distributor" }
      ]
    },
    {
      name: "distributorStatus",
      type: "select",
      defaultValue: "none",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Pendente de analise", value: "pending_review" },
        { label: "Aprovado", value: "approved" },
        { label: "Rejeitado", value: "rejected" }
      ]
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }]
    },
    {
      name: "fidelityTags",
      type: "relationship",
      relationTo: "fidelity-tags",
      hasMany: true
    },
    { name: "xpBalance", type: "number", defaultValue: 0 },
    {
      name: "level",
      type: "relationship",
      relationTo: "xp-levels"
    },
    {
      name: "benefitsUnlocked",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }]
    }
  ]
};
