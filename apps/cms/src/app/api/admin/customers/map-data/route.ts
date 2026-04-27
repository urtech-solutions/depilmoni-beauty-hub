import { NextResponse } from "next/server";

import { resolveAdminUser } from "../../../../../lib/admin-auth";
import { getPayloadInstance } from "../../../../../lib/payload";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await resolveAdminUser(request.headers);

  if (!user) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 403 });
  }

  const url = new URL(request.url);
  const profileType = url.searchParams.get("profileType");
  const city = url.searchParams.get("city");
  const state = url.searchParams.get("state");

  const payload = await getPayloadInstance();

  const where: Record<string, unknown> = {
    latitude: { exists: true },
    longitude: { exists: true }
  };

  const addressResult = await payload.find({
    collection: "addresses",
    where,
    limit: 500,
    depth: 1
  });

  type AddressDoc = {
    id: string | number;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    label: string;
    customer:
      | { id: string | number; name?: string; profileType?: string; email?: string }
      | string
      | number;
  };

  const points = (addressResult.docs as unknown as AddressDoc[])
    .filter((doc) => {
      if (city && doc.city.toLowerCase() !== city.toLowerCase()) return false;
      if (state && doc.state.toLowerCase() !== state.toLowerCase()) return false;
      if (profileType && typeof doc.customer === "object") {
        if (doc.customer.profileType !== profileType) return false;
      }
      return true;
    })
    .map((doc) => {
      const customer =
        typeof doc.customer === "object"
          ? { id: String(doc.customer.id), name: doc.customer.name, profileType: doc.customer.profileType }
          : { id: String(doc.customer) };

      return {
        id: String(doc.id),
        lat: doc.latitude,
        lng: doc.longitude,
        city: doc.city,
        state: doc.state,
        label: doc.label,
        customer
      };
    });

  return NextResponse.json({ points, total: points.length });
}
