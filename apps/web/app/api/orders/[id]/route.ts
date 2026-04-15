import { NextResponse } from "next/server";

import { mapOrder } from "@/lib/account-mappers";
import { getServerSession, payloadServerFetch, type PayloadDoc } from "@/lib/payload-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await payloadServerFetch<PayloadDoc>(`/api/orders/${id}`, session.token);
    return NextResponse.json({ order: mapOrder(result) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pedido não encontrado" },
      { status: 404 }
    );
  }
}
