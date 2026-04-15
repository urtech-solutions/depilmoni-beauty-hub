import { NextResponse } from "next/server";

import { getServerSession, payloadServerFetch } from "@/lib/payload-server";

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
    await payloadServerFetch(`/api/notifications/${id}`, session.token, {
      method: "PATCH",
      body: JSON.stringify({ read: true })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao atualizar notificação" },
      { status: 400 }
    );
  }
}
