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

const unsetOtherDefaults = async (token: string, currentAddressId: string) => {
  const existing = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
    "/api/addresses?limit=100",
    token
  );

  await Promise.all(
    existing.docs
      .filter((doc) => Boolean(doc.isDefault) && String(doc.id) !== currentAddressId)
      .map((doc) =>
        payloadServerFetch(`/api/addresses/${doc.id}`, token, {
          method: "PATCH",
          body: JSON.stringify({ isDefault: false })
        })
      )
  );
};

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  try {
    const result = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
      "/api/addresses?limit=100&sort=-isDefault",
      session.token
    );

    return NextResponse.json({
      addresses: result.docs.map(mapAddress)
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao carregar endereços" },
      { status: 400 }
    );
  }
}

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

  const parsed = AddressInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrada inválida" },
      { status: 400 }
    );
  }

  try {
    const existing = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
      "/api/addresses?limit=100",
      session.token
    );

    const result = await payloadServerFetch<PayloadDocResponse<PayloadDoc>>(
      "/api/addresses",
      session.token,
      {
        method: "POST",
        body: JSON.stringify({
          ...parsed.data,
          customer: session.customer.id,
          isDefault: parsed.data.isDefault || existing.docs.length === 0
        })
      }
    );

    const address = extractPayloadDoc(result);

    if (address.isDefault) {
      await unsetOtherDefaults(session.token, String(address.id));
    }

    return NextResponse.json({ address: mapAddress(address) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao criar endereço" },
      { status: 400 }
    );
  }
}
