import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "./auth-cookie";
import {
  mapPayloadCustomerToProfile,
  payloadClient,
  type PayloadCustomer,
  type StorefrontUser
} from "./payload-client";

const PAYLOAD_URL =
  process.env.PAYLOAD_INTERNAL_URL ??
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  "http://localhost:3001";

export type PayloadDoc = Record<string, unknown> & { id: string | number };

export type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
};

export type PayloadDocResponse<T> = T | { doc: T };

export const buildPayloadUrl = (path: string) => `${PAYLOAD_URL}${path}`;

export const parsePayloadJson = async (res: Response) => {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const toPayloadId = (value: string | number | PayloadDoc | null | undefined) => {
  if (!value) return "";
  if (typeof value === "object" && "id" in value) return String(value.id);
  return String(value);
};

export const payloadServerFetch = async <T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> => {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `JWT ${token}`);

  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(buildPayloadUrl(path), {
    ...init,
    headers,
    cache: "no-store"
  });

  const json = await parsePayloadJson(res);

  if (!res.ok) {
    throw new Error(
      (json as { errors?: { message: string }[]; message?: string })?.errors?.[0]?.message ??
        (json as { message?: string })?.message ??
        "Falha ao consultar Payload"
    );
  }

  return json as T;
};

export const extractPayloadDoc = <T>(value: PayloadDocResponse<T>) => {
  if (value && typeof value === "object" && "doc" in value) {
    return value.doc as T;
  }

  return value as T;
};

export type ServerSession = {
  token: string;
  customer: PayloadCustomer;
  user: StorefrontUser;
};

export const getServerSession = async (): Promise<ServerSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const customer = await payloadClient.me(token);

  if (!customer) {
    return null;
  }

  return {
    token,
    customer,
    user: mapPayloadCustomerToProfile(customer)
  };
};
