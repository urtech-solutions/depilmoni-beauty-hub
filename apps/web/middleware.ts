import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/minha-conta", "/checkout", "/cadastro/distribuidor"];
const GUEST_ONLY = ["/login", "/cadastro", "/esqueci-senha"];

const AUTH_COOKIE = "depilmoni_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (GUEST_ONLY.includes(pathname) && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/minha-conta";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/minha-conta/:path*",
    "/checkout/:path*",
    "/cadastro/distribuidor",
    "/login",
    "/cadastro",
    "/esqueci-senha"
  ]
};
