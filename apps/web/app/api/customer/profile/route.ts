import { NextResponse } from "next/server";

import { ProfileUpdateSchema } from "@/lib/account-schemas";
import { getServerSession, payloadServerFetch, type PayloadDocResponse, extractPayloadDoc } from "@/lib/payload-server";
import { mapPayloadCustomerToProfile } from "@/lib/payload-client";

export async function PATCH(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = ProfileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrada inválida" },
      { status: 400 }
    );
  }

  try {
    const result = await payloadServerFetch<PayloadDocResponse<typeof session.customer>>(
      `/api/customers/${session.user.id}`,
      session.token,
      {
        method: "PATCH",
        body: JSON.stringify(parsed.data)
      }
    );

    return NextResponse.json({
      user: mapPayloadCustomerToProfile(extractPayloadDoc(result))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao atualizar perfil" },
      { status: 400 }
    );
  }
}
