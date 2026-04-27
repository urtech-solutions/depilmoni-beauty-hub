import type { CollectionConfig } from "payload";

import { isAdmin } from "../access";

const geocodeCache = new Map<string, { lat: number; lon: number }>();

const geocodeAddress = async (doc: Record<string, unknown>): Promise<{ lat: number; lon: number } | null> => {
  const cep = String(doc.zipCode ?? "").replace(/\D/g, "");
  if (!cep || cep.length < 8) return null;

  const cached = geocodeCache.get(cep);
  if (cached) return cached;

  try {
    const query = encodeURIComponent(`${doc.street}, ${doc.number}, ${doc.city}, ${doc.state}, Brazil`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      { headers: { "User-Agent": "Depilmoni/1.0" } }
    );

    if (!res.ok) return null;

    const results = (await res.json()) as { lat: string; lon: string }[];
    if (results.length === 0) return null;

    const coords = { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
    geocodeCache.set(cep, coords);
    return coords;
  } catch {
    return null;
  }
};

export const Addresses: CollectionConfig = {
  slug: "addresses",
  admin: {
    useAsTitle: "label"
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (doc.latitude && doc.longitude) return doc;

        const coords = await geocodeAddress(doc);
        if (!coords) return doc;

        try {
          await req.payload.update({
            collection: "addresses",
            id: doc.id as string | number,
            data: { latitude: coords.lat, longitude: coords.lon },
            context: { skipGeocode: true }
          });
        } catch {
          // best-effort
        }

        return doc;
      }
    ]
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
