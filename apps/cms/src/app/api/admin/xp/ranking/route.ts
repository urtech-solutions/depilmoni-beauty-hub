import { NextResponse } from "next/server";

import { getAdminXPRanking } from "../../../../../lib/admin-dashboard";
import { resolveAdminUser } from "../../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await resolveAdminUser(request.headers);

  if (!user) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const ranking = await getAdminXPRanking({
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate")
  });

  return NextResponse.json({ ranking });
}
