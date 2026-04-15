import { NextResponse } from "next/server";

import { AddressInputSchema } from "@/lib/account-schemas";
import { mapAddress } from "@/lib/account-mappers";
import {
  extractPayloadDoc,
  getServerSession,
  payloadServerFetch,
  type PayloadDoc,
  type PayloadDocResponse,
  type PayloadListResponse
} from "@/lib/payload-server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const parsed = AddressInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrada inválida" },
      { status: 400 }
    );
  }

  const { id } = await params;

  try {
    if (parsed.data.isDefault) {
      const existing = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
        "/api/addresses?limit=100",
        session.token
      );

      await Promise.all(
        existing.docs
          .filter((doc) => Boolean(doc.isDefault) && String(doc.id) !== id)
          .map((doc) =>
            payloadServerFetch(`/api/addresses/${doc.id}`, session.token, {
              method: "PATCH",
              body: JSON.stringify({ isDefault: false })
            })
          )
      );
    }

    const result = await payloadServerFetch<PayloadDocResponse<PayloadDoc>>(
      `/api/addresses/${id}`,
      session.token,
      {
        method: "PATCH",
        body: JSON.stringify(parsed.data)
      }
    );

    return NextResponse.json({
      address: mapAddress(extractPayloadDoc(result))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao atualizar endereço" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const currentAddress = await payloadServerFetch<PayloadDoc>(`/api/addresses/${id}`, session.token);

    await payloadServerFetch(`/api/addresses/${id}`, session.token, {
      method: "DELETE"
    });

    if (currentAddress.isDefault) {
      const remaining = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
        "/api/addresses?limit=1&sort=-createdAt",
        session.token
      );

      const fallback = remaining.docs[0];
      if (fallback) {
        await payloadServerFetch(`/api/addresses/${fallback.id}`, session.token, {
          method: "PATCH",
          body: JSON.stringify({ isDefault: true })
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao remover endereço" },
      { status: 400 }
    );
  }
}
