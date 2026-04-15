import type { NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const AUTH_COOKIE_NAME = "depilmoni_token";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export const buildAuthCookieOptions = (
  maxAgeSeconds: number = SEVEN_DAYS
): Partial<ResponseCookie> => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: maxAgeSeconds
});

export const setAuthCookie = (
  response: NextResponse,
  token: string,
  expSeconds?: number
) => {
  const maxAge = expSeconds
    ? Math.max(60, expSeconds - Math.floor(Date.now() / 1000))
    : SEVEN_DAYS;
  response.cookies.set(AUTH_COOKIE_NAME, token, buildAuthCookieOptions(maxAge));
};

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...buildAuthCookieOptions(0),
    expires: new Date(0)
  });
};
