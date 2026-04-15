import { NextResponse } from "next/server";

import { listXPTransactionsForCurrentUser } from "@/lib/account-server";

export async function GET() {
  try {
    const transactions = await listXPTransactionsForCurrentUser();
    return NextResponse.json({ transactions });
  } catch {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }
}
