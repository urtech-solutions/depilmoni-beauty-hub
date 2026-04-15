import { NextResponse } from "next/server";

import { getUnreadNotificationCount } from "@/lib/account-server";

export async function GET() {
  try {
    const count = await getUnreadNotificationCount();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }
}
