import type { Role } from "./models";

export const accessPolicies = {
  admin: ["admin"],
  manager: ["admin", "manager"],
  content: ["admin", "manager", "content-editor"],
  authenticated: ["admin", "manager", "content-editor", "authenticated-customer"]
} as const satisfies Record<string, Role[]>;

export const canAccess = (required: keyof typeof accessPolicies, role: Role) =>
  (accessPolicies[required] as readonly Role[]).includes(role);
