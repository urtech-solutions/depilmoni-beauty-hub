import { NextResponse } from "next/server";
import { z } from "zod";

import { payloadClient } from "@/lib/payload-client";

const ForgotSchema = z.object({
  email: z.string().email("Email inválido")
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = ForgotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Email inválido" },
      { status: 400 }
    );
  }

  await payloadClient.forgotPassword(parsed.data.email);
  return NextResponse.json({ ok: true });
}
