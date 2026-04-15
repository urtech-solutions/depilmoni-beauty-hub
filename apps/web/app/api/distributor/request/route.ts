import { NextResponse } from "next/server";

import { DistributorRequestInputSchema } from "@/lib/account-schemas";
import { mapDistributorRequest } from "@/lib/account-mappers";
import {
  extractPayloadDoc,
  getServerSession,
  payloadServerFetch,
  type PayloadDoc,
  type PayloadDocResponse,
  type PayloadListResponse
} from "@/lib/payload-server";

export async function POST(request: Request) {
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

  const parsed = DistributorRequestInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrada inválida" },
      { status: 400 }
    );
  }

  try {
    const existing = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
      "/api/distributor-requests?limit=1&sort=-createdAt",
      session.token
    );

    const latest = existing.docs[0];
    if (latest && ["pending_review", "approved"].includes(String(latest.status))) {
      return NextResponse.json(
        { error: "Já existe uma solicitação ativa para este cadastro" },
        { status: 409 }
      );
    }

    const result = await payloadServerFetch<PayloadDocResponse<PayloadDoc>>(
      "/api/distributor-requests",
      session.token,
      {
        method: "POST",
        body: JSON.stringify({
          ...parsed.data,
          customer: session.customer.id,
          status: "pending_review",
          documents: []
        })
      }
    );

    return NextResponse.json(
      {
        request: mapDistributorRequest(extractPayloadDoc(result))
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao criar solicitação" },
      { status: 400 }
    );
  }
}
