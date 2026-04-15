"use client";

import { create } from "zustand";

import type { StorefrontUser } from "@/lib/payload-client";

type AuthState = {
  user: StorefrontUser | null;
  status: "idle" | "loading" | "ready";
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    cpf?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const fetchMe = async (): Promise<StorefrontUser | null> => {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return null;
  const json = (await res.json()) as { user: StorefrontUser | null };
  return json.user;
};

const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error ?? "Erro inesperado");
  }
  return json as T;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  async hydrate() {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    const user = await fetchMe();
    set({ user, status: "ready" });
  },
  async login(email, password) {
    const { user } = await postJson<{ user: StorefrontUser }>("/api/auth/login", {
      email,
      password
    });
    set({ user, status: "ready" });
  },
  async register(input) {
    const { user } = await postJson<{ user: StorefrontUser }>("/api/auth/register", input);
    set({ user, status: "ready" });
  },
  async logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, status: "ready" });
  },
  async refresh() {
    const user = await fetchMe();
    set({ user, status: "ready" });
  }
}));
