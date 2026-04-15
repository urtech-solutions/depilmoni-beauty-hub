import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, clearAuthCookie } from "@/lib/auth-cookie";
import { mapPayloadCustomerToProfile, payloadClient } from "@/lib/payload-client";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await payloadClient.me(token);
  if (!user) {
    const response = NextResponse.json({ user: null }, { status: 200 });
    clearAuthCookie(response);
    return response;
  }

  return NextResponse.json({ user: mapPayloadCustomerToProfile(user) });
}
