import { NextResponse } from "next/server";

import {
  getServerSession,
  payloadServerFetch,
  type PayloadDoc,
  type PayloadListResponse
} from "@/lib/payload-server";

export async function POST() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  try {
    const result = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
      "/api/notifications?limit=100",
      session.token
    );

    await Promise.all(
      result.docs
        .filter((doc) => !doc.read)
        .map((doc) =>
          payloadServerFetch(`/api/notifications/${doc.id}`, session.token, {
            method: "PATCH",
            body: JSON.stringify({ read: true })
          })
        )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao marcar notificações como lidas" },
      { status: 400 }
    );
  }
}
