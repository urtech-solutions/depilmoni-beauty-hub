import type { TypedUser } from "payload";

import { getPayloadInstance } from "./payload";

const ADMIN_ROLES = new Set(["admin", "manager"]);

type AdminUser = TypedUser & {
  role?: string;
  collection?: string;
};

export const resolveAdminUser = async (requestHeaders: Headers) => {
  const payload = await getPayloadInstance();
  const authResult = await payload.auth({
    headers: requestHeaders,
    canSetHeaders: false
  });

  const user = authResult.user as AdminUser | null;

  if (!user || user.collection !== "users") {
    return null;
  }

  if (!user.role || !ADMIN_ROLES.has(user.role)) {
    return null;
  }

  return user;
};
