/**
 * Auth service - thin wrapper around Payload's built-in auth for the
 * `customers` collection. Validates inputs with Zod and normalizes the
 * returned user shape to the domain CustomerProfile.
 */

import { z } from "zod";

import type { CustomerProfile } from "../domain/models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Payload = any;

export const RegisterInputSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  phone: z.string().optional(),
  cpf: z.string().optional()
});

export const LoginInputSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória")
});

export const ForgotPasswordInputSchema = z.object({
  email: z.string().email("Email inválido")
});

export const ResetPasswordInputSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8)
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;

export interface AuthResult {
  user: CustomerProfile;
  token: string;
  exp: number;
}

type PayloadDoc = Record<string, unknown> & { id: string | number };

const mapCustomer = (doc: PayloadDoc): CustomerProfile => ({
  id: String(doc.id),
  name: doc.name as string,
  email: doc.email as string,
  phone: (doc.phone as string) ?? undefined,
  cpf: (doc.cpf as string) ?? undefined,
  avatarUrl: doc.avatar
    ? `/media/${(doc.avatar as PayloadDoc).filename ?? doc.avatar}`
    : undefined,
  role: "authenticated-customer",
  profileType: (doc.profileType as CustomerProfile["profileType"]) ?? "client",
  distributorStatus:
    (doc.distributorStatus as CustomerProfile["distributorStatus"]) ?? "none",
  tags: ((doc.tags as { value: string }[]) ?? []).map((t) => t.value),
  fidelityTagIds: Array.isArray(doc.fidelityTags)
    ? doc.fidelityTags.map((t: PayloadDoc | string) =>
        typeof t === "string" ? t : String(t.id)
      )
    : [],
  xpBalance: (doc.xpBalance as number) ?? 0,
  levelId: doc.level
    ? typeof doc.level === "string"
      ? doc.level
      : String((doc.level as PayloadDoc).id)
    : "",
  benefitsUnlocked: ((doc.benefitsUnlocked as { value: string }[]) ?? []).map(
    (b) => b.value
  ),
  orderIds: [],
  ticketIds: [],
  createdAt: doc.createdAt as string,
  updatedAt: doc.updatedAt as string
});

export class AuthError extends Error {
  constructor(
    public readonly code: "invalid_credentials" | "email_taken" | "invalid_input" | "not_found" | "unauthorized",
    message: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class AuthService {
  constructor(private readonly payload: Payload) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const parsed = RegisterInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new AuthError("invalid_input", parsed.error.issues[0]?.message ?? "Entrada inválida");
    }

    const existing = await this.payload.find({
      collection: "customers",
      where: { email: { equals: parsed.data.email } },
      limit: 1
    });

    if (existing.docs.length > 0) {
      throw new AuthError("email_taken", "Email já cadastrado");
    }

    await this.payload.create({
      collection: "customers",
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        phone: parsed.data.phone,
        cpf: parsed.data.cpf,
        profileType: "client"
      }
    });

    return this.login({ email: parsed.data.email, password: parsed.data.password });
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const parsed = LoginInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new AuthError("invalid_input", parsed.error.issues[0]?.message ?? "Entrada inválida");
    }

    try {
      const result = await this.payload.login({
        collection: "customers",
        data: parsed.data
      });

      return {
        user: mapCustomer(result.user),
        token: result.token,
        exp: result.exp
      };
    } catch {
      throw new AuthError("invalid_credentials", "Email ou senha incorretos");
    }
  }

  async getById(id: string): Promise<CustomerProfile> {
    try {
      const doc = await this.payload.findByID({
        collection: "customers",
        id
      });
      return mapCustomer(doc);
    } catch {
      throw new AuthError("not_found", "Usuário não encontrado");
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const parsed = ForgotPasswordInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new AuthError("invalid_input", parsed.error.issues[0]?.message ?? "Email inválido");
    }

    await this.payload.forgotPassword({
      collection: "customers",
      data: parsed.data
    });
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const parsed = ResetPasswordInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new AuthError("invalid_input", parsed.error.issues[0]?.message ?? "Dados inválidos");
    }

    await this.payload.resetPassword({
      collection: "customers",
      data: parsed.data,
      overrideAccess: true
    });
  }
}

export const createAuthService = (payload: Payload) => new AuthService(payload);
