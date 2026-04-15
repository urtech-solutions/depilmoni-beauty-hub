import { NextResponse } from "next/server";
import { z } from "zod";

import { mapPayloadCustomerToProfile, payloadClient } from "@/lib/payload-client";
import { setAuthCookie } from "@/lib/auth-cookie";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória")
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrada inválida" },
      { status: 400 }
    );
  }

  try {
    const auth = await payloadClient.login(parsed.data);

    if (!auth.token || !auth.user) {
      return NextResponse.json({ error: "Falha ao autenticar" }, { status: 401 });
    }

    const response = NextResponse.json({
      user: mapPayloadCustomerToProfile(auth.user)
    });
    setAuthCookie(response, auth.token, auth.exp);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email ou senha incorretos";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
