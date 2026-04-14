import type { Access } from "payload";

const isRole = (roles: string[]): Access =>
  ({ req }) => {
    const user = req.user as { role?: string } | null | undefined;
    return Boolean(user?.role && roles.includes(user.role));
  };

export const isAdmin: Access = isRole(["admin"]);
export const isManager: Access = isRole(["admin", "manager"]);
export const canManageContent: Access = isRole(["admin", "manager", "content-editor"]);
export const canManageCommerce: Access = isRole(["admin", "manager"]);
export const isAuthenticated: Access = ({ req }) => Boolean(req.user);
export const publicRead: Access = () => true;
