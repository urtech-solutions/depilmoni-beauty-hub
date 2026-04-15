import { buildPayloadUrl, parsePayloadJson } from "./payload-server";

type AdminToken = { token: string; expiresAt: number };

let cached: AdminToken | null = null;

const SAFETY_MARGIN_MS = 60_000;

const fetchAdminToken = async (): Promise<AdminToken> => {
  const email = process.env.PAYLOAD_ADMIN_EMAIL;
  const password = process.env.PAYLOAD_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "PAYLOAD_ADMIN_EMAIL/PASSWORD ausentes — não é possível executar operações privilegiadas"
    );
  }

  const res = await fetch(buildPayloadUrl("/api/users/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });

  const json = (await parsePayloadJson(res)) as {
    token?: string;
    exp?: number;
    message?: string;
  };

  if (!res.ok || !json.token) {
    throw new Error(json.message ?? "Falha ao autenticar admin para operação de serviço");
  }

  const expiresAt = json.exp ? json.exp * 1000 : Date.now() + 60 * 60 * 1000;
  return { token: json.token, expiresAt };
};

export const getAdminToken = async (): Promise<string> => {
  if (cached && cached.expiresAt - SAFETY_MARGIN_MS > Date.now()) {
    return cached.token;
  }

  cached = await fetchAdminToken();
  return cached.token;
};

export const payloadAdminFetch = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const token = await getAdminToken();
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
        "Falha na chamada admin ao Payload"
    );
  }

  return json as T;
};
