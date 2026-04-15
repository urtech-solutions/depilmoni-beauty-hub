import { NextResponse } from "next/server";

import { getXPSummaryForCurrentUser } from "@/lib/account-server";

export async function GET() {
  try {
    const summary = await getXPSummaryForCurrentUser();
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }
}
