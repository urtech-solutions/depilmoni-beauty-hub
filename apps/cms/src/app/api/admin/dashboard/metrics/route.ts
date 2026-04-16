import { NextResponse } from "next/server";

import { getAdminDashboardMetrics } from "../../../../../lib/admin-dashboard";
import { resolveAdminUser } from "../../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await resolveAdminUser(request.headers);

  if (!user) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 403 });
  }

  const metrics = await getAdminDashboardMetrics();
  return NextResponse.json({ metrics });
}
