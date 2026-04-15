import { NextResponse } from "next/server";

import { mapOrder } from "@/lib/account-mappers";
import { getServerSession, payloadServerFetch, type PayloadDoc, type PayloadListResponse } from "@/lib/payload-server";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  try {
    const result = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
      "/api/orders?limit=100&sort=-createdAt",
      session.token
    );

    return NextResponse.json({ orders: result.docs.map(mapOrder) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao carregar pedidos" },
      { status: 400 }
    );
  }
}
