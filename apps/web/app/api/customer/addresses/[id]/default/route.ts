import { NextResponse } from "next/server";

import {
  getServerSession,
  payloadServerFetch,
  type PayloadDoc,
  type PayloadListResponse
} from "@/lib/payload-server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
      "/api/addresses?limit=100",
      session.token
    );

    await Promise.all(
      existing.docs.map((doc) =>
        payloadServerFetch(`/api/addresses/${doc.id}`, session.token, {
          method: "PATCH",
          body: JSON.stringify({ isDefault: String(doc.id) === id })
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao definir endereço padrão" },
      { status: 400 }
    );
  }
}
