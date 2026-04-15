import { NextResponse } from "next/server";
import { z } from "zod";

import { mapPayloadCustomerToProfile, payloadClient } from "@/lib/payload-client";
import { setAuthCookie } from "@/lib/auth-cookie";

const RegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  phone: z.string().optional(),
  cpf: z.string().optional()
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrada inválida" },
      { status: 400 }
    );
  }

  try {
    await payloadClient.register(parsed.data);
    const auth = await payloadClient.login({
      email: parsed.data.email,
      password: parsed.data.password
    });

    if (!auth.token || !auth.user) {
      return NextResponse.json({ error: "Falha ao iniciar sessão" }, { status: 500 });
    }

    const response = NextResponse.json({
      user: mapPayloadCustomerToProfile(auth.user)
    });
    setAuthCookie(response, auth.token, auth.exp);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar conta";
    const normalizedMessage = message.toLowerCase();
    const status =
      normalizedMessage.includes("already") ||
      normalizedMessage.includes("exist") ||
      normalizedMessage.includes("cadastrado") ||
      normalizedMessage.includes("duplicate")
        ? 409
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
