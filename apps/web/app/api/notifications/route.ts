import { NextResponse } from "next/server";

import { listNotificationsForCurrentUser } from "@/lib/account-server";

export async function GET() {
  try {
    const notifications = await listNotificationsForCurrentUser();
    return NextResponse.json({ notifications });
  } catch {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }
}
