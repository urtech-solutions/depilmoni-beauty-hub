/**
 * HTTP client for Payload CMS REST API.
 * The web app calls Payload (running on a separate port) instead of
 * importing it directly, keeping the apps decoupled.
 */

const PAYLOAD_URL =
  process.env.PAYLOAD_INTERNAL_URL ??
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  "http://localhost:3001";

export interface PayloadCustomer {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  profileType?: "client" | "partner" | "distributor";
  distributorStatus?: "none" | "pending_review" | "approved" | "rejected";
  xpBalance?: number;
  level?: { id: string | number } | string;
  avatar?: { filename?: string } | string;
  tags?: { value: string }[];
  fidelityTags?: ({ id: string | number } | string)[];
  benefitsUnlocked?: { value: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PayloadAuthResponse {
  message?: string;
  user?: PayloadCustomer;
  token?: string;
  exp?: number;
  errors?: { message: string }[];
}

type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
};

const buildUrl = (path: string) => `${PAYLOAD_URL}${path}`;

const parseJson = async (res: Response) => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const payloadClient = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    cpf?: string;
  }): Promise<PayloadCustomer> {
    const existing = await fetch(
      buildUrl(`/api/customers?where[email][equals]=${encodeURIComponent(data.email)}&limit=1`),
      {
        cache: "no-store"
      }
    );

    if (existing.ok) {
      const json = (await parseJson(existing)) as PayloadListResponse<PayloadCustomer>;
      if (json.totalDocs > 0) {
        throw new Error("Email já cadastrado");
      }
    }

    const res = await fetch(buildUrl("/api/customers"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, profileType: "client" })
    });
    const json = await parseJson(res);
    if (!res.ok) {
      const message =
        json?.errors?.[0]?.message ?? json?.message ?? "Erro ao criar conta";
      throw new Error(message);
    }
    return (json.doc ?? json) as PayloadCustomer;
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<PayloadAuthResponse> {
    const res = await fetch(buildUrl("/api/customers/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = (await parseJson(res)) as PayloadAuthResponse;
    if (!res.ok) {
      throw new Error(json?.errors?.[0]?.message ?? json?.message ?? "Email ou senha incorretos");
    }
    return json;
  },

  async me(token: string): Promise<PayloadCustomer | null> {
    const res = await fetch(buildUrl("/api/customers/me"), {
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });
    if (!res.ok) return null;
    const json = await parseJson(res);
    return (json.user ?? null) as PayloadCustomer | null;
  },

  async forgotPassword(email: string): Promise<void> {
    await fetch(buildUrl("/api/customers/forgot-password"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    const res = await fetch(buildUrl("/api/customers/reset-password"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    if (!res.ok) {
      const json = await parseJson(res);
      throw new Error(json?.errors?.[0]?.message ?? "Erro ao redefinir senha");
    }
  }
};

export const mapPayloadCustomerToProfile = (doc: PayloadCustomer) => ({
  id: String(doc.id),
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  cpf: doc.cpf,
  profileType: doc.profileType ?? "client",
  distributorStatus: doc.distributorStatus ?? "none",
  xpBalance: doc.xpBalance ?? 0,
  levelId:
    doc.level && typeof doc.level === "object" && "id" in doc.level
      ? String(doc.level.id)
      : typeof doc.level === "string"
        ? doc.level
        : "",
  tags: (doc.tags ?? []).map((tag) => tag.value),
  fidelityTagIds: (doc.fidelityTags ?? []).map((tag) =>
    typeof tag === "string" ? tag : String(tag.id)
  ),
  benefitsUnlocked: (doc.benefitsUnlocked ?? []).map((benefit) => benefit.value),
  avatarUrl:
    doc.avatar && typeof doc.avatar === "object" && doc.avatar.filename
      ? `/media/${doc.avatar.filename}`
      : undefined,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

export type StorefrontUser = ReturnType<typeof mapPayloadCustomerToProfile>;
