"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
};
